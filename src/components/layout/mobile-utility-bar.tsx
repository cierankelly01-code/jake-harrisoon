/** Mobile collapse of the sticky utility bar: [Call] [WhatsApp] [Enquire]. */
export function MobileUtilityBar() {
  return (
    <div
      className="grid grid-cols-3 border-b md:hidden"
      style={{ borderColor: "var(--border-hairline-dark)" }}
    >
      <a
        href="tel:"
        className="border-r py-3 text-center font-mono-label"
        style={{ borderColor: "var(--border-hairline-dark)", color: "var(--paper)", background: "var(--ink)" }}
      >
        Call
      </a>
      <a
        href="https://wa.me/"
        className="border-r py-3 text-center font-mono-label"
        style={{ borderColor: "var(--border-hairline-dark)", color: "var(--paper)", background: "var(--ink)" }}
      >
        WhatsApp
      </a>
      <a
        href="#enquire"
        className="py-3 text-center font-mono-label"
        style={{ color: "var(--paper)", background: "var(--flame)" }}
      >
        Enquire
      </a>
    </div>
  );
}
