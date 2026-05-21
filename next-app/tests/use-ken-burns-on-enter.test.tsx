import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { useKenBurnsOnEnter } from "@/components/useKenBurnsOnEnter";

/** Controllable IntersectionObserver mock. Stores the most recent callback so
 *  tests can drive intersection events synchronously. */
let lastIOCallback: IntersectionObserverCallback | null = null;
let lastIOInstance: { observe: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> } | null = null;

class TestIO {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
  constructor(cb: IntersectionObserverCallback) {
    lastIOCallback = cb;
    lastIOInstance = this;
  }
}

const originalIO = globalThis.IntersectionObserver;

beforeEach(() => {
  lastIOCallback = null;
  lastIOInstance = null;
  // @ts-expect-error — installing test double
  globalThis.IntersectionObserver = TestIO;
  // @ts-expect-error
  window.IntersectionObserver = TestIO;
});

afterEach(() => {
  globalThis.IntersectionObserver = originalIO;
  window.IntersectionObserver = originalIO;
});

function fire(target: Element, isIntersecting: boolean) {
  lastIOCallback?.(
    [
      {
        target,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        time: 0,
      } as IntersectionObserverEntry,
    ],
    lastIOInstance as unknown as IntersectionObserver
  );
}

function Harness() {
  const ref = useRef<HTMLDivElement | null>(null);
  useKenBurnsOnEnter(ref);
  return (
    <div ref={ref}>
      <a className="case-vertical" data-testid="case-1">card 1</a>
      <a className="case-vertical" data-testid="case-2">card 2</a>
    </div>
  );
}

describe("useKenBurnsOnEnter", () => {
  it("observes every .case-vertical descendant of the root", () => {
    const { getByTestId } = render(<Harness />);
    expect(lastIOInstance?.observe).toHaveBeenCalledTimes(2);
    const observed = (lastIOInstance!.observe.mock.calls as [Element][]).map(
      ([el]) => el
    );
    expect(observed).toContain(getByTestId("case-1"));
    expect(observed).toContain(getByTestId("case-2"));
  });

  it("adds the is-ken-burns class when a section enters the viewport", () => {
    const { getByTestId } = render(<Harness />);
    const card = getByTestId("case-1");
    expect(card.classList.contains("is-ken-burns")).toBe(false);

    fire(card, true);

    expect(card.classList.contains("is-ken-burns")).toBe(true);
  });

  it("re-arms Ken Burns by removing then re-adding the class on re-entry", () => {
    const { getByTestId } = render(<Harness />);
    const card = getByTestId("case-1");

    fire(card, true);
    expect(card.classList.contains("is-ken-burns")).toBe(true);

    const removeSpy = vi.spyOn(card.classList, "remove");
    const addSpy = vi.spyOn(card.classList, "add");

    fire(card, true);

    expect(removeSpy).toHaveBeenCalledWith("is-ken-burns");
    expect(addSpy).toHaveBeenCalledWith("is-ken-burns");
    expect(card.classList.contains("is-ken-burns")).toBe(true);
  });

  it("does nothing on exit (class stays so the next entry can toggle it)", () => {
    const { getByTestId } = render(<Harness />);
    const card = getByTestId("case-1");

    fire(card, true);
    const removeSpy = vi.spyOn(card.classList, "remove");
    fire(card, false);

    expect(removeSpy).not.toHaveBeenCalled();
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<Harness />);
    const instance = lastIOInstance;
    unmount();
    expect(instance?.disconnect).toHaveBeenCalledTimes(1);
  });
});
