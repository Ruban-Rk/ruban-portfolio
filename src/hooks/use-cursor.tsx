import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CursorVariant = "default" | "hover" | "image" | "hidden";

interface CursorContextValue {
  variant: CursorVariant;
  text: string;
  setCursorVariant: (variant: CursorVariant) => void;
  setCursorText: (text: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [text, setText] = useState("");

  const setCursorVariant = useCallback((v: CursorVariant) => {
    setVariant(v);
  }, []);

  const setCursorText = useCallback((t: string) => {
    setText(t);
  }, []);

  const resetCursor = useCallback(() => {
    setVariant("default");
    setText("");
  }, []);

  return (
    <CursorContext.Provider
      value={{ variant, text, setCursorVariant, setCursorText, resetCursor }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error("useCursor must be used within a <CursorProvider>");
  }
  return ctx;
}

export default useCursor;
