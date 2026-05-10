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

  it("splits a plain-string child into word spans with sequential --i", () => {
    const { container } = render(<RisingHeading>Hello cruel world</RisingHeading>);
    const words = container.querySelectorAll(".rising-heading .word");
    expect(words.length).toBe(3);
    expect(words[0].textContent).toBe("Hello");
    expect((words[0] as HTMLElement).style.getPropertyValue("--i")).toBe("0");
    expect(words[1].textContent).toBe("cruel");
    expect((words[1] as HTMLElement).style.getPropertyValue("--i")).toBe("1");
    expect(words[2].textContent).toBe("world");
    expect((words[2] as HTMLElement).style.getPropertyValue("--i")).toBe("2");
  });

  it("preserves <em> wrappers and continues --i across them", () => {
    const { container } = render(
      <RisingHeading>
        People buy <em>connection, belonging.</em>
      </RisingHeading>
    );
    const h = container.querySelector("h2") as HTMLElement;
    const allWords = h.querySelectorAll(".word");
    expect(allWords.length).toBe(4);
    // First two ("People", "buy") are direct children of .line.
    expect(allWords[0].textContent).toBe("People");
    expect((allWords[0] as HTMLElement).style.getPropertyValue("--i")).toBe("0");
    expect(allWords[1].textContent).toBe("buy");
    expect((allWords[1] as HTMLElement).style.getPropertyValue("--i")).toBe("1");
    // Next two ("connection,", "belonging.") are inside an <em>.
    const em = h.querySelector("em") as HTMLElement;
    const emWords = em.querySelectorAll(".word");
    expect(emWords.length).toBe(2);
    expect(emWords[0].textContent).toBe("connection,");
    expect((emWords[0] as HTMLElement).style.getPropertyValue("--i")).toBe("2");
    expect(emWords[1].textContent).toBe("belonging.");
    expect((emWords[1] as HTMLElement).style.getPropertyValue("--i")).toBe("3");
  });

  it("preserves visible whitespace between words", () => {
    const { container } = render(<RisingHeading>Hello world</RisingHeading>);
    const h = container.querySelector("h2") as HTMLElement;
    expect(h.textContent).toBe("Hello world");
  });

  it("handles trailing/leading whitespace in string children gracefully", () => {
    const { container } = render(
      <RisingHeading>
        People buy{" "}
        <em>connection.</em>
      </RisingHeading>
    );
    const h = container.querySelector("h2") as HTMLElement;
    // textContent collapses whitespace from JSX literals; just verify content.
    expect(h.textContent?.trim()).toBe("People buy connection.");
    const allWords = h.querySelectorAll(".word");
    expect(allWords.length).toBe(3);
  });
});
