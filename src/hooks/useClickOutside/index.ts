import { useCallback, useEffect, useRef } from 'react';

interface Props {
  dom?: HTMLElement | (() => HTMLElement);
  onClickOutside?: (event: MouseEvent) => void;
}

export const useClickOutside = (props: Props) => {
  const { onClickOutside, dom } = props;
  const eleRef = useRef();

  const eventHandler = useCallback(
    (event) => {
      const target = event.target;
      const el = typeof dom === 'function' ? dom() : null;
      const targetInWrapper =
        !el ||
        el.contains(target) ||
        (event.composedPath && event.composedPath().includes(el));
      if (!targetInWrapper) {
        onClickOutside && onClickOutside(event);
      }
    },
    [eleRef.current, onClickOutside, dom]
  );

  useEffect(() => {
    document.addEventListener('click', eventHandler);

    return () => {
      document.addEventListener('click', eventHandler);
    };
  }, []);

  return eleRef;
};

export default useClickOutside;
