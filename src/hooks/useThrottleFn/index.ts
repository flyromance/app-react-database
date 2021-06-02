import { DependencyList, useCallback, useEffect, useRef } from 'react';
import useUpdateEffect from '../useUpdateEffect';

type noop = (...args: any[]) => any;

export interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}

export interface IUseThrottleFnOption {
  immediately?: boolean;
}

function useThrottleFn<T extends any[]>(
  fn: (...args: T) => any,
  wait: number = 1000,
  deps: DependencyList = [],
  options: IUseThrottleFnOption = {}
): ReturnValue<T> {
  const { immediately = false } = options;
  const _deps = deps;
  const _wait = wait;
  const timer = useRef<number>();
  const haveRun = useRef<boolean>(false);
  const fnRef = useRef<noop>(fn);
  fnRef.current = fn;

  const currentArgs = useRef<any[]>([]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = undefined;
  }, []);

  const run = useCallback(
    (...args: any[]) => {
      currentArgs.current = args;
      if (!timer.current) {
        if (immediately && !haveRun.current) {
          fnRef.current(...currentArgs.current);
          haveRun.current = true;
        }
        timer.current = window.setTimeout(() => {
          fnRef.current(...currentArgs.current);
          timer.current = undefined;
        }, _wait);
      }
    },
    [_wait, cancel]
  );

  useUpdateEffect(() => {
    run();
  }, [..._deps, run]);

  useEffect(() => cancel, []);

  return {
    run,
    cancel,
  };
}

export default useThrottleFn;
