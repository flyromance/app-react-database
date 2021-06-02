import { useEffect, useState } from 'react';

type VisibilityState = 'hidden' | 'visible' | 'prerender' | boolean;

function getVisibility() {
  if (!document || !('visibilityState' in document)) return true;
  return document.visibilityState;
}

const useDocumentVisiblity = (): VisibilityState => {
  const [state, setState] = useState(getVisibility());

  useEffect(() => {
    const handleVisibilityChange = () => {
      setState(getVisibility());
    };
    document.addEventListener('visibilityChange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
};

export default useDocumentVisiblity;
