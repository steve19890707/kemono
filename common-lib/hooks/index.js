import { useEffect } from "react";

export const Keydown = (handler = () => {}) => {
  useEffect(() => {
    // Bind the event listener
    document.addEventListener("keydown", handler);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("keydown", handler);
    };
  });
};

export const Mousedown = (handler = () => {}) => {
  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handler);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handler);
    };
  });
};
