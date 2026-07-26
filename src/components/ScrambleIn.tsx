"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

interface ScrambleInProps {
  text: string;
  delay?: number;      // ms before scramble starts after trigger
  className?: string;
  triggered?: boolean; // external trigger; if omitted, uses viewport intersection
  amount?: number;     // viewport intersection threshold (0–1)
  speed?: number;      // cursor increment per 25ms tick (0.5 = ~50ms/char, 1.0 = ~25ms/char)
}

export function ScrambleIn({
  text,
  delay = 0,
  className,
  triggered,
  amount = 0.3,
  speed = 0.5,
}: ScrambleInProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const viewportIn = useInView(ref, { once: true, amount });
  const isActive = triggered !== undefined ? triggered : viewportIn;

  // Three phases:
  //   hidden     — opacity 0, real text in DOM for layout stability (no shift)
  //   scrambling — opacity 1, scramble chars displayed
  //   done       — opacity 1, final text
  type Phase = "hidden" | "scrambling" | "done";
  const [phase, setPhase] = useState<Phase>("hidden");
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isActive) {
      setPhase("hidden");
      setDisplay(text);
      return;
    }

    let delayTimer: ReturnType<typeof setTimeout>;
    let scrambleInterval: ReturnType<typeof setInterval>;

    delayTimer = setTimeout(() => {
      // Pre-set initial scramble so the moment opacity flips to 1, chars are ready
      const initial = Array.from(text)
        .map((ch) => (ch === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");
      setDisplay(initial);
      setPhase("scrambling");

      let cursor = 0;
      scrambleInterval = setInterval(() => {
        cursor += speed;
        const revealed = Math.floor(cursor);

        if (revealed >= text.length) {
          setDisplay(text);
          setPhase("done");
          clearInterval(scrambleInterval);
          return;
        }

        const chars = Array.from(text).map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealed) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        });
        setDisplay(chars.join(""));
      }, 25);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(scrambleInterval);
    };
  }, [isActive, text, delay, speed]);

  return (
    <>
      {/* Screen reader always gets the real text, unaffected by animation */}
      <span className="sr-only">{text}</span>

      {/* Visual element — aria-hidden so AT uses the sr-only span above */}
      <span
        ref={ref}
        aria-hidden="true"
        className={className}
        style={{ opacity: phase === "hidden" ? 0 : 1 }}
      >
        {display}
      </span>
    </>
  );
}
