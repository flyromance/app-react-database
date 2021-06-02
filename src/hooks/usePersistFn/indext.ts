import { useCallback, useRef } from 'react';

const usePersistFn = (fn: (...args: any[]) => any) => {
    const ref = useRef(fn);
    ref.current = fn;

    const persistFn = useCallback((...args) => {
        ref.current.apply(null, args);
    }, []);

    return persistFn;
};

export default usePersistFn;
