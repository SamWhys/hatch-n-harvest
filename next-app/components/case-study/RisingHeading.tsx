"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { useScrollReveal } from "./useScrollReveal";

type HeadingTag = "h1" | "h2" | "h3";

const WORD_SPLIT = /(\s+)/; // capture whitespace runs so we can re-emit them

function makeWord(text: string, i: number): ReactNode {
  const style = { "--i": i } as CSSProperties;
  return (
    <span className="word" style={style} key={`w-${i}`}>
      {text}
    </span>
  );
}

function splitString(text: string, startIndex: number): { nodes: ReactNode[]; nextIndex: number } {
  const nodes: ReactNode[] = [];
  let i = startIndex;
  for (const part of text.split(WORD_SPLIT)) {
    if (part === "") continue;
    if (/^\s+$/.test(part)) {
      // preserve whitespace between word spans
      nodes.push(part);
    } else {
      nodes.push(makeWord(part, i));
      i += 1;
    }
  }
  return { nodes, nextIndex: i };
}

function splitNodes(children: ReactNode, startIndex: number): { nodes: ReactNode[]; nextIndex: number } {
  const out: ReactNode[] = [];
  let i = startIndex;
  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      const r = splitString(child, i);
      out.push(...r.nodes);
      i = r.nextIndex;
    } else if (typeof child === "number") {
      const r = splitString(String(child), i);
      out.push(...r.nodes);
      i = r.nextIndex;
    } else if (isValidElement(child) && child.type === "em") {
      const inner = splitNodes(
        (child as ReactElement<{ children: ReactNode }>).props.children,
        i
      );
      // Recompute i based on how many words were produced inside the em.
      i = inner.nextIndex;
      out.push(cloneElement(child as ReactElement, { key: `em-${i}` }, inner.nodes));
    } else {
      // Unsupported node type — render as-is, no animation.
      out.push(child);
    }
  });
  return { nodes: out, nextIndex: i };
}

export function RisingHeading({
  as = "h2",
  className,
  children,
}: {
  as?: HeadingTag;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  useScrollReveal(ref);
  const Tag = as;
  const cls = ["rising-heading", className].filter(Boolean).join(" ");
  const { nodes } = splitNodes(children, 0);
  return (
    <Tag ref={ref} className={cls}>
      <span className="line">{nodes}</span>
    </Tag>
  );
}
