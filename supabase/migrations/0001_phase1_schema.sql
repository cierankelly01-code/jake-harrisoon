-- Phase 1 schema: leads, boiler_quotes, tender_enquiries, capability_downloads,
-- care_plan_members. Remaining §13 tables (contracts, compliance_documents,
-- landlord_*, jobs, review_requests, reviews_cache, partners, guides) land in
-- Phase 2/3 migrations. Every table: RLS on, deny-by-default. All writes go
-- through server actions using the service_role key — no anon insert/update
-- policies are defined anywhere in this file, by design.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- leads: shared intake target for every enquiry type
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  division text not null check (division in ('commercial', 'domestic')),
  type text not null check (
    type in ('tender', 'commercial_enquiry', 'boiler_quote', 'care_plan', 'general', 'emergency')
  ),
  name text not null,
  organisation text,
  role text,
  phone text,
  email text,
  postcode text,
  area_slug text,
  message text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'quoted', 'won', 'lost')
  ),
  assigned_to text,
  priority text not null default 'normal' check (priority in ('normal', 'high', 'emergency')),
  lost_reason text,
  notes text,
  idempotency_key text unique
);

create index if not exists leads_status_idx on leads (status);
create index if not exists leads_division_idx on leads (division);

alter table leads enable row level security;
revoke all on leads from anon, authenticated;

-- ---------------------------------------------------------------------------
-- boiler_quotes: instant quote engine, partial-save on every step
-- ---------------------------------------------------------------------------
create table if not exists boiler_quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads (id) on delete set null,
  property_type text,
  bedrooms integer,
  bathrooms integer,
  shower_type text,
  current_system text check (
    current_system in ('combi', 'system', 'regular', 'back_boiler', 'electric', 'none', null)
  ),
  boiler_location text,
  target_location text,
  fuel_type text,
  urgency text,
  photo_urls text[] not null default '{}',
  quoted_low integer,
  quoted_high integer,
  tier_shown text,
  completed_step text not null default 'property',
  completed_at timestamptz,
  pdf_url text,
  postcode text,
  phone text
);

alter table boiler_quotes enable row level security;
revoke all on boiler_quotes from anon, authenticated;

-- ---------------------------------------------------------------------------
-- tender_enquiries: the tender/PQQ front door
-- ---------------------------------------------------------------------------
create table if not exists tender_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid references leads (id) on delete set null,
  organisation text not null,
  contact_name text not null,
  contact_role text,
  sector text,
  contract_type text check (
    contract_type in ('ppm', 'reactive', 'installation', 'framework', 'one_off', null)
  ),
  site_count integer,
  value_band text,
  term_months integer,
  deadline date,
  pqq_required boolean not null default false,
  framework_name text,
  document_urls text[] not null default '{}',
  current_provider text,
  status text not null default 'received' check (
    status in ('received', 'in_progress', 'submitted', 'won', 'lost')
  ),
  submitted_at timestamptz not null default now(),
  outcome text,
  outcome_reason text
);

create index if not exists tender_enquiries_deadline_idx on tender_enquiries (deadline);

alter table tender_enquiries enable row level security;
revoke all on tender_enquiries from anon, authenticated;

-- ---------------------------------------------------------------------------
-- capability_downloads: every capability-statement PDF request is a lead
-- ---------------------------------------------------------------------------
create table if not exists capability_downloads (
  id uuid primary key default gen_random_uuid(),
  downloaded_at timestamptz not null default now(),
  name text not null,
  organisation text,
  email text not null,
  role text,
  sector text
);

alter table capability_downloads enable row level security;
revoke all on capability_downloads from anon, authenticated;

-- ---------------------------------------------------------------------------
-- care_plan_members: recurring revenue, Stripe-backed
-- ---------------------------------------------------------------------------
create table if not exists care_plan_members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  address text,
  postcode text,
  tier text not null check (tier in ('service', 'cover', 'complete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'pending' check (
    status in ('pending', 'active', 'past_due', 'cancelled')
  ),
  started_at timestamptz,
  next_service_due date,
  last_service_at date
);

alter table care_plan_members enable row level security;
revoke all on care_plan_members from anon, authenticated;
