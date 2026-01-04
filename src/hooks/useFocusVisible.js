import { useState, useEffect } from "react";

export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [hadKeyboardEvent, setHadKeyboardEvent] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => setHadKeyboardEvent(true);
    const handleMouseDown = () => setHadKeyboardEvent(false);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const focusVisibleProps = {
    onFocus: () => setIsFocusVisible(hadKeyboardEvent),
    onBlur: () => setIsFocusVisible(false),
  };

  return { isFocusVisible, focusVisibleProps };
}
