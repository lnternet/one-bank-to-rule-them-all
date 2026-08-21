import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

export function usePageNavigate() {
  const navigate = useNavigate();

  return (to, options) => {
    if (typeof document === "undefined" || !document.startViewTransition) {
      navigate(to, options);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        navigate(to, options);
      });
    });
  };
}
