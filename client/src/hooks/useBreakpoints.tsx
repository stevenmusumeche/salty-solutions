import { useState, useEffect, useCallback, useMemo } from "react";

interface Breakpoints {
  [name: string]: number;
}

interface BreakpointMatches {
  [name: string]: MediaQueryList;
}

const defaultBreakpoints: Breakpoints = {
  sm: 0,
  md: 768,
  lg: 1024,
  xl: 1280
};

export default function useBreakpoints(
  breakpoints: Breakpoints = defaultBreakpoints
) {
  const sizes = useMemo(() => Object.keys(breakpoints), [breakpoints]);

  const calcMatches = useCallback(
    (breakpoints: Breakpoints): BreakpointMatches => {
      return sizes.reduce(
        (acc, size) => {
          const query = `(min-width: ${breakpoints[size]}px)`;
          acc[size] = window.matchMedia(query);
          return acc;
        },
        {} as BreakpointMatches
      );
    },
    [sizes]
  );
  const [matches, setMatches] = useState(() => calcMatches(breakpoints));

  const callback = useCallback(() => setMatches(calcMatches(breakpoints)), [
    setMatches,
    breakpoints,
    calcMatches
  ]);

  useEffect(() => {
    // setup event listeners
    sizes.forEach(size => matches[size].addEventListener("change", callback));

    // unsubscribe from even listeners
    return () =>
      sizes.forEach(size =>
        matches[size].removeEventListener("change", callback)
      );
  }, [callback, sizes, matches]);

  const helpers = useMemo(() => {
    return {
      isSmall: matches.sm.matches && !matches.md.matches,
      isAtLeastSmall: matches.sm.matches,
      isMedium: matches.md.matches && !matches.lg.matches,
      isAtLeastMedium: matches.md.matches,
      isLarge: matches.lg.matches && !matches.xl.matches,
      isAtLeastLarge: matches.lg.matches,
      isXL: matches.xl.matches,
      isAtLeastXL: matches.xl.matches
    };
  }, [matches]);

  return { matches, ...helpers };
}
