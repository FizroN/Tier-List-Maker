// src/useAutoScrollWhileDragging.js
import { useEffect } from "react";

export function useAutoScrollWhileDragging(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let animationFrame;
    const threshold = 100; // px from top/bottom edge
    const scrollSpeed = 15; // px per frame

    const handleMouseMove = (e) => {
      const { clientY } = e;
      const windowHeight = window.innerHeight;

      if (clientY < threshold) {
        animationFrame = requestAnimationFrame(() => {
          window.scrollBy(0, -scrollSpeed);
        });
      } else if (clientY > windowHeight - threshold) {
        animationFrame = requestAnimationFrame(() => {
          window.scrollBy(0, scrollSpeed);
        });
      } else {
        cancelAnimationFrame(animationFrame);
      }
    };

    window.addEventListener("dragover", handleMouseMove);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("dragover", handleMouseMove);
    };
  }, [enabled]);
}
