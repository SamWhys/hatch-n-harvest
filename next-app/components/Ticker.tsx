import { Fragment } from "react";

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
        <Fragment key={i}>
          {label} <span className="dot"></span>{" "}
        </Fragment>
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
