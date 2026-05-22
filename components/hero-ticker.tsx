const tickerItems = [
  { text: "Brand Strategy", highlight: true },
  { text: "Visual Systems", highlight: false },
  { text: "Creative Direction", highlight: true },
  { text: "Brand Architecture", highlight: false },
  { text: "Digital Experiences", highlight: true },
  { text: "Objects & Products", highlight: false },
  { text: "Content & Campaign Systems", highlight: true },
  { text: "Istanbul / Global", highlight: false },
  { text: "Est. 2021", highlight: false },
]

export function HeroTicker() {
  const repeated = [...tickerItems, ...tickerItems]

  return (
    <div className="relative z-10 bg-[#0a0a0a] border-b border-white/[0.08] overflow-hidden py-2.5">
      <div className="flex whitespace-nowrap">
        <div className="flex flex-shrink-0 animate-[ticker_22s_linear_infinite]">
          {repeated.map((item, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`text-[9px] tracking-[.2em] uppercase px-5 flex-shrink-0 ${
                  item.highlight ? "text-white/75 font-bold" : "text-white/30"
                }`}
              >
                {item.text}
              </span>
              <span className="text-white/15 text-[9px]">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
