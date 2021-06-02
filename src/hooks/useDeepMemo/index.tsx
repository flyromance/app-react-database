import { useRef } from 'react';
import defaultIsEqual from 'lodash/isEqual';

const useDeepMemo = (props, isEqual: (prev, curr) => boolean = defaultIsEqual) => {
  const ref = useRef(props);

  if (!defaultIsEqual(props, ref.current)) {
    ref.current = props;
  }

  return ref.current;
};

export default useDeepMemo;
