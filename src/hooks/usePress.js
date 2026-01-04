export function usePress({ onPress, disabled = false }) {
  const handleClick = (e) => {
    if (disabled) return;
    onPress?.(e);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter") onPress?.(e);
    if (e.key === " ") e.preventDefault(); // space scroll
  };

  const handleKeyUp = (e) => {
    if (disabled) return;
    if (e.key === " ") onPress?.(e);
  };

  const pressProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  };

  return { pressProps };
}
