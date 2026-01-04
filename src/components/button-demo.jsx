import { useFocusVisible } from "../hooks/useFocusVisible";
import { usePress } from "../hooks/usePress";

export default function ButtonDemo() {
  const { isFocusVisible, focusVisibleProps } = useFocusVisible();
  const { pressProps } = usePress({
    onPress: () => alert("Pressed!"),
  });

  return (
    <div
      tabIndex={0}
      {...pressProps}
      {...focusVisibleProps}
      style={{
        padding: "12px 16px",
        border: "1px solid black",
        outline: isFocusVisible ? "2px solid blue" : "none",
        cursor: "pointer",
      }}
    >
      Press Me
    </div>
  );
}
