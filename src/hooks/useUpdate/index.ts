import { useCallback, useState } from 'react';

const useUpdate = () => {
  let [, setState] = useState(0);
  return useCallback(() => {
    setState((v) => v++);
  }, []);
};

export default useUpdate;
