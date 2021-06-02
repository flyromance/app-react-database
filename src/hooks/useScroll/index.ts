import { useEffect, useRef, useState, MutableRefObject } from 'react';

interface Position {
  left: number;
  top: number;
}

type Target = HTMLElement | Document;

type Arg = Target | (() => Target) | null;

function useScroll<T extends Target = HTMLElement>(): [
  Position,
  MutableRefObject<T>
];
function useScroll<T extends Target = HTMLElement>(arg: Arg): [Position];
function useScroll<T extends Target = HTMLElement>(...args: [Arg] | []) {
  const elRef = useRef<T>();
  const [position, setPosition] = useState<Position>({
    left: NaN,
    top: NaN,
  });

  const arg = args[0];
  const hasPassedInElement = args.length === 1;

  useEffect(() => {
    const passedInElement = typeof arg === 'function' ? arg() : arg;
    const element = hasPassedInElement ? passedInElement : elRef.current;
    if (!element) return;

    function updatePosition(target: Target) {
      let newPosition;
      if (target === document) {
        if (!document.scrollingElement) return;
        newPosition = {
          left: document.scrollingElement.scrollLeft,
          top: document.scrollingElement.scrollTop,
        };
      } else {
        newPosition = {
          left: (target as HTMLElement).scrollLeft,
          top: (target as HTMLElement).scrollTop,
        };
      }
      setPosition(newPosition);
    }
    updatePosition(element);
    function listener(event: Event) {
      if (!event.target) return;
      updatePosition(event.target as Target);
    }
    element.addEventListener('scroll', listener);
    return () => {
      element.removeEventListener('scroll', listener);
    };
  }, [elRef.current, typeof arg === 'function' ? undefined : arg]);

  return [position, elRef];
}

export default useScroll;
