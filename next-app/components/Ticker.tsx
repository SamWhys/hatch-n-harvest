const items = [
  "Strategy",
  "Identity",
  "Packaging",
  "Naming",
  "Campaigns",
  "Art Direction",
  "Digital",
  "Wayfinding",
];

function TickerRow() {
  return (
    <span>
      {items.map((label, i) => (
        <span key={i}>
          {label} <span className="dot"></span>{" "}
        </span>
      ))}
    </span>
  );
}

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <TickerRow />
        <TickerRow />
      </div>
    </div>
  );
}
