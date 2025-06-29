import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation(); // #junta, #otra-seccion, …

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // desplazamiento suave
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // si navegas a / sin hash, vuelve al top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return null; // este componente no pinta nada
};

export default ScrollToHash;
