"use client";

import { useEffect } from "react";

export function DisableRightClick() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac) - Inspect
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || 
          (e.metaKey && e.altKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac) - Console
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') || 
          (e.metaKey && e.altKey && e.key.toLowerCase() === 'j')) {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+C (Windows/Linux) or Cmd+Option+C (Mac) - Inspect Element
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') || 
          (e.metaKey && e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
