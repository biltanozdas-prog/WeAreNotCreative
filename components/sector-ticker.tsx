const sectors = [
  "Fashion",
  "Architecture",
  "Music",
  "Publishing",
  "Hospitality",
  "Art",
  "Retail",
  "Technology",
  "Culture",
  "Food & Beverage",
]

export function SectorTicker() {
  const repeated = [...sectors, ...sectors]

  return (
    <div className="bg-background border-t border-foreground border-b border-foreground overflow-hidden py-3.5">
      <div className="flex whitespace-nowrap">
        <div className="flex flex-shrink-0 animate-[ticker_28s_linear_infinite]">
          {repeated.map((sector, i) => (
            <span key={i} className="flex items-center flex-shrink-0">
              <span className="text-[11px] font-bold tracking-[.1em] uppercase text-foreground/20 px-6">
                {sector}
              </span>
              <span className="text-foreground/10 text-[11px]">×</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
