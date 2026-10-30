export function EyeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" className={className} aria-hidden="true">
      <path
        d="M8 34c16-18 34-26 52-26s36 8 52 26c-16 18-34 26-52 26S24 52 8 34z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path d="M18 28c22-16 70-16 96 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="34" r="13" className="fill-aqua" />
      <circle cx="60" cy="34" r="6" className="fill-navy" />
      <circle cx="63" cy="31" r="2" fill="white" />
    </svg>
  );
}
