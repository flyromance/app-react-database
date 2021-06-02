import { useCallback, useState } from 'react';

const useToggle = (v: boolean = false): [boolean, () => void] => {
  const [state, setState] = useState(v);
  const cb = useCallback(() => {
    setState((v) => !v);
  }, []);
  return [state, cb];
};

export default useToggle;
