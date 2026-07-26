"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  className?: string;
}

export const ScrambleText = ({ text, isHovered, className }: ScrambleTextProps) => {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!isHovered) {
      setDisplay(text);
      return;
    }

    let cursor = 0;
    intervalRef.current = setInterval(() => {
      cursor += 0.25; // 4 frames per character
      const revealed = Math.floor(cursor);

      if (revealed >= text.length) {
        setDisplay(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const chars = Array.from(text).map((char, i) => {
        if (char === " ") return " ";
        if (i < revealed) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplay(chars.join(""));
    }, 25);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, text]);

  return (
    <span className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
};
