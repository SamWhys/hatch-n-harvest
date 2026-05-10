import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { RisingHeading } from "@/components/case-study/RisingHeading";

type ObserverInstance = {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  trigger: (entries: Array<{ target: Element; isIntersecting: boolean }>) => void;
};

let lastInstance: ObserverInstance | null = null;
let originalIO: typeof IntersectionObserver | undefined;

beforeEach(() => {
  originalIO = (globalThis as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver;
  class MockObserver {
    callback: IntersectionObserverCallback;
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    constructor(cb: IntersectionObserverCallback) {
      this.callback = cb;
      lastInstance = {
        observe: this.observe,
        disconnect: this.disconnect,
        trigger: (entries) => {
          this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
        },
      };
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, configurable: true, value: MockObserver });
  Object.defineProperty(window, "IntersectionObserver", { writable: true, configurable: true, value: MockObserver });
});

afterEach(() => {
  cleanup();
  if (originalIO) {
    Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, configurable: true, value: originalIO });
    Object.defineProperty(window, "IntersectionObserver", { writable: true, configurable: true, value: originalIO });
  }
  lastInstance = null;
});

describe("RisingHeading scaffold", () => {
  it("renders an h2 by default with the rising-heading class", () => {
    const { container } = render(<RisingHeading>Hello</RisingHeading>);
    const h = container.querySelector("h2.rising-heading");
    expect(h).not.toBeNull();
  });

  it("renders the requested heading level via `as`", () => {
    const { container } = render(<RisingHeading as="h3">Hello</RisingHeading>);
    expect(container.querySelector("h3.rising-heading")).not.toBeNull();
  });

  it("merges caller className alongside rising-heading", () => {
    const { container } = render(
      <RisingHeading className="custom-x">Hello</RisingHeading>
    );
    const h = container.querySelector("h2") as HTMLHeadingElement;
    expect(h.classList.contains("rising-heading")).toBe(true);
    expect(h.classList.contains("custom-x")).toBe(true);
  });

  it("preserves the heading text content", () => {
    const { container } = render(<RisingHeading>Hello world</RisingHeading>);
    expect(container.querySelector("h2")?.textContent).toBe("Hello world");
  });

  it("adds is-revealed when the observer fires intersecting", () => {
    const { container } = render(<RisingHeading>Hello</RisingHeading>);
    const h = container.querySelector("h2") as HTMLElement;
    expect(h.classList.contains("is-revealed")).toBe(false);
    lastInstance!.trigger([{ target: h, isIntersecting: true }]);
    expect(h.classList.contains("is-revealed")).toBe(true);
  });
});
