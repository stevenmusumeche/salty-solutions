import { useEffect } from "react";

export const useRemoveLoader = () => {
  useEffect(() => {
    const $el = document.getElementById("pre-app-loader");
    if ($el) {
      $el.remove();
    }
  }, []);
};
