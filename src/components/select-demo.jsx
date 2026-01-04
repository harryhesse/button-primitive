import React from "react";
import { useSelectState } from "../hooks/useSelectState";
import { useSelectBehavior } from "../hooks/useSelectBehavior";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

export default function SelectDemo() {
  const state = useSelectState({ defaultValue: "apple" });
  const { triggerProps, listBoxProps, getOptionProps } = useSelectBehavior(
    state,
    options
  );

  console.log(state);

  return (
    <div>
      <div
        {...triggerProps}
        style={{ padding: "8px", border: "1px solid gray" }}
      >
        {state.value ?? "Select an option"}
      </div>
      {state.isOpen && (
        <ul
          {...listBoxProps}
          style={{ border: "1px solid gray", marginTop: 4, padding: 0 }}
        >
          {options.map((item, index) => (
            <li
              key={item.value}
              {...getOptionProps({ index, item })}
              style={{
                padding: "8px",
                background: state.highlightedIndex === index ? "#eee" : "white",
                cursor: "pointer",
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
