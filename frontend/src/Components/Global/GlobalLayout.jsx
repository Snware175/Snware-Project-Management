// src/components/GlobalLayout.js
import React, { useEffect } from "react";
import $ from "jquery";

const GlobalLayout = ({ children }) => {
  useEffect(() => {
    function setZoom() {
      const el = document.getElementById("content");
      if (!el) return;

      // Adjust the zoom factor as needed (e.g., 0.9 for a slight zoom-out)
      const zoom = 0.9;
      const transformOrigin = "0px 0px";
      const s = `scale(${zoom})`;

      // Apply the transform directly without calculating based on window size
      el.style.transform = s;
      el.style.transformOrigin = transformOrigin;
    }

    setZoom();
    window.addEventListener("resize", setZoom);

    return () => {
      window.removeEventListener("resize", setZoom);
    };
  }, []);

  return (
    <div
      id="content"
      style={{
        background: "#eef0f4",
        padding: "0",
        width: "1421px",
        height: "950px",
      }}
    >
      {children}
    </div>
  );
};

export default GlobalLayout;
