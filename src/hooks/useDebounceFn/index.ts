import { DependencyList, useCallback, useEffect, useRef } from 'react';
import useUpdateEffect from '../useUpdateEffect';

type noop = (...args: any[]) => any;

export interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}
export interface IUseDebounceFnOptions {
  immediately?: boolean;
}

function useDebounceFn<T extends any[]>(
  fn: (...args: T) => any,
  wait: number = 1000,
  deps: DependencyList = [],
  options: IUseDebounceFnOptions = {}
): ReturnValue<T> {
  const { immediately = false } = options;
  const _deps = deps;
  const _wait = wait;
  const timer = useRef<number>();
  const haveRun = useRef(false);
  const fnRef = useRef<noop>(fn);
  fnRef.current = fn;

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  const run = useCallback(
    (...args: any[]) => {
      if (immediately && !haveRun.current) {
        fnRef.current(...args);
        haveRun.current = true;
      }
      cancel();
      timer.current = window.setTimeout(() => {
        fnRef.current(...args);
      }, _wait);
    },
    [_wait, cancel]
  );

  useUpdateEffect(() => {
    run();
    return cancel;
  }, [..._deps, run]);

  useEffect(() => cancel, []);

  return {
    run,
    cancel,
  };
}

export default useDebounceFn;
