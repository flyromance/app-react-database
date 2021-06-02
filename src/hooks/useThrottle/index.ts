import { useCallback, useRef } from 'react';
import useUpdateEffect from '../useUpdateEffect';
/**
 * 
 * @param fn 
 * @param wait 
 * 
 * useThrottle((v) => setValue(xxx), v, 400)
 */

const useThrottle = (fn, value, wait) => {
    const timer = useRef<any>();
    const initial = useRef(new Date().getTime());
    const handler = useRef(fn);
    handler.current = fn;

    const cb = useCallback((v) => {
        const current = new Date().getTime();
        if (current > initial.current + wait) {
            initial.current = current;
            handler.current(v);
            return;
        }
        timer.current && clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            initial.current = new Date().getTime();
            handler.current(v);
        }, wait);
    }, [wait]);

    useUpdateEffect(() => {
        cb(value);
    }, [value]);
};

export default useThrottle;