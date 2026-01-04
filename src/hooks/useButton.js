export function useButton(props) {
  const { onPress, disabled = false } = props;

  const handleClick = (e) => {
    if (disabled) return;
    onPress?.(e);
  };
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter") {
      e.preventDefault();
      onPress?.(e);
    }

    if (e.key === " ") {
      e.preventDefault(); // prevent scroll
    }
  };
  const handleKeyUp = (e) => {
    if (disabled) return;

    if (e.key === " ") {
      e.preventDefault();
      onPress?.(e);
    }
  };

  const buttonProps = {
    role: "button",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  };

  return { buttonProps };
}
