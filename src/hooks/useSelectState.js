import { useState } from "react";

export function useSelectState({
  value: controlledValue,
  defaultValue,
  onChange,
} = {}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const value = controlledValue ?? internalValue;

  const select = (optionValue) => {
    if (controlledValue == null) setInternalValue(optionValue);
    onChange?.(optionValue);
    setHighlightedIndex(-1); // reset highlight on selection
    setIsOpen(false); // close menu automatically
  };

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return {
    value,
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
    select,
    open,
    close,
  };
}
