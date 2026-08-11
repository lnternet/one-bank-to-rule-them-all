export default function Logo({ className = "", headingId }) {
  const Element = headingId ? "h1" : "div";

  return (
    <Element
      aria-label="One Bank to Rule Them All"
      className={`bank-logo ${className}`.trim()}
      id={headingId}
    >
      <span className="ring-letter" aria-hidden="true" />
      <span className="visually-hidden">O</span>
      <span>ne Bank to Rule Them All</span>
    </Element>
  );
}
