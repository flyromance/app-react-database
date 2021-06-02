import { useEffect } from 'react';
import useDeepMemo from '../useDeepMemo';

/**
 * 
 */
const useDeepEffect = (handler: (...args: any[]) => any, deps: any[], isEqual) => {
    const memoProps = useDeepMemo(deps, isEqual);
    useEffect(() => {
        return handler();
    }, [memoProps]);
};

export default useDeepEffect;