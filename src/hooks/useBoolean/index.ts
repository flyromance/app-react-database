import { useMemo, useState } from 'react';

const useBoolean = (v: boolean = false) => {
  const [state, setState] = useState<boolean>(v);
  const actions = useMemo(() => {
    return {
      setTrue() {
        setState(true);
      },
      setFalse() {
        setState(false);
      },
      toggle() {
        setState((v) => !v);
      },
    };
  }, []);
  return { state, ...actions };
};

export default useBoolean;
