import { useRef } from 'react';

const useCreation = <T>(factory: () => T, deps: any[]) => {
  const ref = useRef({
    initialized: false,
    value: undefined as undefined | T,
    deps,
  });

  if (!ref.current.initialized || depsChange(ref.current.deps, deps)) {
    ref.current.deps = deps;
    ref.current.value = factory();
  }

  return ref.current.value;
};

function depsChange(oldDeps: any[], newDeps: any[]) {
  if (oldDeps === newDeps) {
    return false;
  }
  if (oldDeps.length !== newDeps.length) return true;
  return oldDeps.some((dep, index) => dep !== newDeps[index]);
}

export default useCreation;
