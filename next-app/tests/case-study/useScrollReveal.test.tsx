import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useRef } from "react";
import { useScrollReveal } from "@/components/case-study/useScrollReveal";

type ObserverInstance = {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  takeRecords: ReturnType<typeof vi.fn>;
  trigger: (entries: Array<{ target: Element; isIntersecting: boolean }>) => void;
};

let lastInstance: ObserverInstance | null = null;
let originalIO: typeof IntersectionObserver | undefined;

beforeEach(() => {
  originalIO = globalThis.IntersectionObserver as unknown as typeof IntersectionObserver;
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
        unobserve: this.unobserve,
        disconnect: this.disconnect,
        takeRecords: this.takeRecords,
        trigger: (entries) => {
          this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
        },
      };
    }
  }
  vi.stubGlobal("IntersectionObserver", MockObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  lastInstance = null;
});

function Probe() {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollReveal(ref);
  return <div ref={ref} data-testid="probe" />;
}

describe("useScrollReveal", () => {
  it("does not add is-revealed before any intersection", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    expect(el.classList.contains("is-revealed")).toBe(false);
    expect(lastInstance?.observe).toHaveBeenCalledOnce();
  });

  it("adds is-revealed when the target intersects", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    lastInstance!.trigger([{ target: el, isIntersecting: true }]);
    expect(el.classList.contains("is-revealed")).toBe(true);
  });

  it("disconnects the observer after the first intersection", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    lastInstance!.trigger([{ target: el, isIntersecting: true }]);
    expect(lastInstance!.disconnect).toHaveBeenCalledOnce();
  });

  it("does not add is-revealed when intersection entry is false", () => {
    const { getByTestId } = render(<Probe />);
    const el = getByTestId("probe");
    lastInstance!.trigger([{ target: el, isIntersecting: false }]);
    expect(el.classList.contains("is-revealed")).toBe(false);
    expect(lastInstance!.disconnect).not.toHaveBeenCalled();
  });

  it("disconnects on unmount even if it never intersected", () => {
    const { unmount } = render(<Probe />);
    const disconnect = lastInstance!.disconnect;
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
