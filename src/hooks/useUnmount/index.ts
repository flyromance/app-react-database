import { useEffect } from 'react';

export const useUnmount = (cb: () => any) => {
  useEffect(() => {
    return () => {
        cb();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useUnmount;