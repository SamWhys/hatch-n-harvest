import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useParallaxScroll } from "@/components/useParallaxScroll";

describe("useParallaxScroll", () => {
  it("mounts and unmounts cleanly with a null ref", () => {
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement | null>(null);
      useParallaxScroll(ref, { intensity: 0.15 });
    });
    expect(() => unmount()).not.toThrow();
  });
});
