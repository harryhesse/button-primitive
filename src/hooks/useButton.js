import { usePress } from "./usePress";
import { useFocusVisible } from "./useFocusVisible";

export function useButton({ onPress, disabled = false } = {}) {
  const { pressProps } = usePress({ onPress, disabled });
  const { isFocusVisible, focusVisibleProps } = useFocusVisible();

  const buttonProps = {
    ...pressProps,
    ...focusVisibleProps,
    role: "button",
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
  };

  return { buttonProps, isFocusVisible };
}
