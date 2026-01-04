import { useEffect, useRef } from "react";

export function useSelectBehavior(state, options = []) {
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  // Trigger props
  const triggerProps = {
    ref: triggerRef,
    tabIndex: 0,
    role: "combobox",
    "aria-expanded": state.isOpen,
    "aria-controls": "listbox",
    onClick: () => (state.isOpen ? state.close() : state.open()),
    onKeyDown: (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        state.setHighlightedIndex(
          (state.highlightedIndex + 1) % options.length
        );
        state.open();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        state.setHighlightedIndex(
          (state.highlightedIndex - 1 + options.length) % options.length
        );
        state.open();
      } else if (e.key === "Enter" && state.highlightedIndex >= 0) {
        e.preventDefault();
        const optionValue = options[state.highlightedIndex].value;
        state.select(state.highlightedIndex, optionValue);
        state.close();
      } else if (e.key === "Escape") {
        state.close();
      }
    },
  };

  // List props
  const listBoxProps = {
    ref: listRef,
    id: "listbox",
    role: "listbox",
  };

  // Option props
  const getOptionProps = ({ index, item }) => ({
    key: item.value,
    role: "option",
    "aria-selected": state.value === item.value,
    onMouseEnter: () => state.setHighlightedIndex(index),
    onClick: () => {
      state.select(index, item.value);
      state.close();
    },
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        state.close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state]);

  return { triggerProps, listBoxProps, getOptionProps };
}
