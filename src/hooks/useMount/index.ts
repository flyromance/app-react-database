import { useEffect } from 'react';

const useMount = (cb: () => any) => {
  useEffect(() => {
    return cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useMount;
