export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand shadow-sm">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" aria-hidden>
          <path
            d="M12 3.5 5 6.2v4.3c0 4.4 2.9 8.4 7 9.5 4.1-1.1 7-5.1 7-9.5V6.2L12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M8 12h8M12 9.2v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8.4 12.1c.4 1.7 1.7 3.1 3.6 3.6 1.9-.5 3.2-1.9 3.6-3.6" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-brand-dark">LegalAI PK</p>
        {!compact ? (
          <p className="mt-1 text-xs text-muted">Your Rights. Our Priority.</p>
        ) : null}
      </div>
    </div>
  );
}
