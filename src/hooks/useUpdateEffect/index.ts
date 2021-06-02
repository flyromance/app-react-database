import { useEffect, useRef } from 'react';

const useUpdateEffect = (cb: () => any, deps: any[]) => {
  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    return cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
};

export default useUpdateEffect;
