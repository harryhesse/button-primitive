import { useState, useEffect } from "react";

export function useSelectState({
  value: controlledValue,
  defaultValue,
  onChange,
} = {}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const value = controlledValue ?? internalValue;

  const select = (index, optionValue) => {
    if (controlledValue == null) setInternalValue(optionValue);
    onChange?.(optionValue);
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
