
import { useCallback, useRef } from "react";

import { copyToClipboard } from "./util";
import useToggle from "../useToggle";

interface ClipboardAPI {
  readonly isCopied: boolean;
  readonly copy: (text?: string | any) => Promise<any>;
  readonly isSupported: () => boolean;
  readonly ref: React.RefObject<any>;
}

export function useClipboard(): ClipboardAPI {
  const [isCopied, toggleCopied] = useToggle(false);

  const targetRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  function clipboardCopy(text: string) {
    return copyToClipboard(text).then(() => {
      if (!isCopied) toggleCopied();
    });
  }

  function isSupported() {
    return !!(
      navigator.clipboard ||
      (!!document.execCommand &&
        document.queryCommandSupported &&
        document.queryCommandSupported("copy"))
    );
  }

  const copyHandler = useCallback((text?: any) => {
    if (typeof text === "string") {
      return clipboardCopy(text);
    }

    if (targetRef.current) {
      return clipboardCopy(
        (targetRef.current as HTMLTextAreaElement | HTMLInputElement).value
      );
    }

    return Promise.resolve();
  }, []);

  return {
    isCopied,
    copy: copyHandler,
    isSupported,
    ref: targetRef,
  };
}

export default useClipboard;