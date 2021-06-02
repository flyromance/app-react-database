import { useState } from 'react';

interface ReturnObj<T> {
  state: T;
  set: (v: T) => void;
  go: (v: number) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const useHistoryTravel = <T>(initialValue: T): ReturnObj<T> => {
  const [stack, setStack] = useState<T[]>([initialValue]);
  const [pos, setPos] = useState<number>(0);

  const set = (value) => {
    setStack((v) => [...v.slice(0, pos + 1), value]);
    setPos((v) => v++);
  };

  const undo = () => {
    setPos((v) => v--);
  };

  const redo = () => {
    setPos((v) => v++);
  };

  const go = (index) => {
    let idx: number = index < 0 ? stack.length + index : index;
    idx = Math.min(stack.length - 1, idx);
    idx = Math.max(0, idx);
    setPos(idx);
  };

  const clear = () => {
    setStack([initialValue]);
    setPos(0);
  };

  return {
    state: stack[pos],
    set,
    undo,
    redo,
    go,
    clear,
    canUndo: pos > 0,
    canRedo: pos < stack.length - 1,
  };
};

export default useHistoryTravel;
