import { useEffect, useRef } from 'react';

const usePrevious = <T>(v: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = v;
  });
  return ref.current;
};

export default usePrevious;
