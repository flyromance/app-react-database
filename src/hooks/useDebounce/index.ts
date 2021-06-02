import { useState } from 'react';

import useDebounceFn from '../useDebounceFn';

const useDebounce = <T>(v: T, wait: number) => {
  const [state, setState] = useState<T>(v);

  useDebounceFn(
    () => {
      setState(state);
    },
    wait,
    [v]
  );

  return state;
};

export default useDebounce;
