import { useButton } from "./hooks/useButton";

export function Button(props) {
  const { buttonProps } = useButton({
    onPress: () => alert("Pressed"),
  });
  return (
    <div
      {...buttonProps}
      style={{
        display: "inline-block",
        padding: "12px 16px",
        border: "1px solid black",
        cursor: "pointer",
      }}
    >
      Test Button
    </div>
  );
}
