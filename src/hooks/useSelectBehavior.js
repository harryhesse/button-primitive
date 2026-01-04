import { useRef, useEffect } from "react";

let selectIdCounter = 0;

export function useSelectBehavior(state, options = []) {
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const listIdRef = useRef(`listbox-${++selectIdCounter}`);

  // Trigger props
  const triggerProps = {
    ref: triggerRef,
    tabIndex: 0,
    role: "combobox",
    "aria-expanded": state.isOpen,
    "aria-controls": listIdRef.current,
    "aria-activedescendant":
      state.highlightedIndex >= 0
        ? `option-${state.highlightedIndex}`
        : undefined,
    onClick: () => {
      state.isOpen ? state.close() : state.open();
      if (!state.isOpen) state.setHighlightedIndex(0);
    },
    onKeyDown: (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          state.open();
          state.setHighlightedIndex(
            (state.highlightedIndex + 1 + options.length) % options.length
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          state.open();
          state.setHighlightedIndex(
            (state.highlightedIndex - 1 + options.length) % options.length
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!state.isOpen) {
            state.open();
            state.setHighlightedIndex(0);
          } else if (state.highlightedIndex >= 0) {
            state.select(options[state.highlightedIndex].value);
          }
          break;
        case "Escape":
          state.close();
          break;
      }
    },
  };

  // List props
  const listBoxProps = {
    ref: listRef,
    id: listIdRef.current,
    role: "listbox",
  };

  // Option props
  const getOptionProps = ({ index, item }) => ({
    id: `option-${index}`,
    role: "option",
    "aria-selected": state.value === item.value,
    onMouseEnter: () => state.setHighlightedIndex(index),
    onClick: () => state.select(item.value),
  });

  // Close menu on outside click
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
