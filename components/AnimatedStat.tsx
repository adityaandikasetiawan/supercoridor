import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to target when visible in viewport.
 * Handles strings like "1,200+", "12", "40 Tbps", "99.99%", "Q2 2025"
 */
export function AnimatedStat({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Parse the numeric part from the value
    const match = value.match(/^([^\d]*?)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) {
      // No number found (like "Q2 2025"), just show as is
      setDisplay(value);
      return;
    }

    const prefix = match[1]; // e.g. ""
    const numStr = match[2].replace(/,/g, ''); // e.g. "1200"
    const suffix = match[3]; // e.g. "+ KM"
    const target = parseFloat(numStr);

    if (isNaN(target) || target === 0) {
      setDisplay(value);
      return;
    }

    // Start at "0" display
    setDisplay(`${prefix}0${suffix}`);

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      const hasDecimals = numStr.includes('.');
      const decimalPlaces = hasDecimals ? (numStr.split('.')[1]?.length ?? 0) : 0;

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;

        let formatted: string;
        if (hasDecimals) {
          formatted = current.toFixed(decimalPlaces);
        } else {
          formatted = Math.round(current).toLocaleString('en-US');
        }

        setDisplay(`${prefix}${formatted}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Ensure final value matches original formatting
          setDisplay(value);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={`font-bold text-center ${className ?? ''}`}>
      {display}
    </div>
  );
}
