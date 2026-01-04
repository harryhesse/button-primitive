# Button Primitive — Week 1

This folder contains a **headless `useButton` hook** built from scratch using raw React events and vanilla JavaScript. The goal of this implementation is **not** to be feature-complete, but to understand the foundational problems that real component libraries solve.

---

## Goals

- Normalize different input methods (mouse, keyboard) into a single semantic action: **press**
- Support keyboard accessibility without relying on native `<button>`
- Keep logic headless and reusable
- Understand event handling tradeoffs early

---

## Why not just `onClick`?

`onClick` alone is insufficient for an accessible button abstraction because:

- Keyboard users trigger buttons via **Enter** and **Space**, not clicks
- Space behaves differently than Enter (fires on `keyup`, not `keydown`)
- Non-button elements (`div`, `span`) do not receive keyboard behavior automatically
- Disabled behavior must be handled manually for non-native elements

This hook normalizes all input types into a single `onPress` callback.

---

## What is a “Press”?

A **press** is a semantic user action that can originate from:

- Mouse click
- Keyboard interaction (Enter / Space)

Internally, these are handled by different DOM events, but consumers of the hook only care about the intent: _the user activated the control_.

This abstraction mirrors how real-world libraries (e.g. React Aria) reason about interactions.

---

## Keyboard Behavior Decisions

- **Enter** triggers `onPress` on `keydown`
  - Matches native `<button>` behavior
- **Space** triggers `onPress` on `keyup`
  - Prevents repeated activation while holding the key
  - Matches browser default behavior
- Default scrolling behavior for Space is prevented

These details are subtle but critical for correctness.

---

## Why return props instead of JSX?

Returning props allows:

- Full control over the rendered element (`div`, `span`, `button`, etc.)
- Easy composition with other hooks
- Clear separation of logic and presentation

This pattern scales well as complexity grows.

---

## Disabled vs `aria-disabled`

Since the hook does not assume a native `<button>` element:

- Disabled state is enforced manually
- `aria-disabled` is applied for assistive technologies
- The element is removed from the tab order when disabled

Native `disabled` attributes are intentionally not handled yet.

---

## What this implementation does NOT handle (by design)

- Focus-visible styling
- Pointer vs touch distinction
- Press state tracking (pressed / released)
- Long-press or repeat behavior
- Styling or variants
- Ref management

These concerns will be addressed in later weeks as separate, focused abstractions.

---

## Key Takeaways

- Accessibility starts at the primitive level
- Input normalization is more complex than it appears
- Clear constraints lead to better abstractions
- Understanding _why_ behavior exists matters more than features

---

## Status

This is a **learning implementation**, not a production-ready button.  
The emphasis is on correctness, clarity, and understanding tradeoffs.

# Week 2 — Focus & Press Plumbing

This week, we expand on the Week 1 `useButton` primitive by building **reusable low-level hooks** for focus management, keyboard vs pointer detection, and semantic press handling.

These hooks are independent, headless, and composable, forming the plumbing for interactive components like buttons, selects, or any custom triggers.

---

## Goals

- Track focus state (`useFocus`)
- Distinguish keyboard vs pointer focus (`useFocusVisible`)
- Normalize press events across mouse, keyboard, and touch (`usePress`)
- Keep logic **headless** (no styling, no UI assumptions)
- Prepare for later integration into headless primitives like buttons and selects

---

## Hooks Built

### 1. `useFocus`

Tracks whether an element is focused.

```js
const { isFocused, focusProps } = useFocus();
```

- `isFocused` → boolean indicating focus state
- `focusProps` → `{ onFocus, onBlur }` to attach to any element

> Note: This hook does not handle focus-visible or keyboard vs mouse detection. It only tracks focus state.

---

### 2. `useFocusVisible`

Tracks whether focus should be **visibly indicated** (mimics `:focus-visible` behavior).

```js
const { isFocusVisible, focusVisibleProps } = useFocusVisible();
```

- `isFocusVisible` → true if the element is focused via keyboard
- `focusVisibleProps` → `{ onFocus, onBlur }` to attach to element

#### How it works

- Listens globally for `keydown` and `mousedown` events
- `keydown` → last interaction was keyboard → next focus may be visible
- `mousedown` → last interaction was pointer → next focus not visible
- On `onFocus`, `isFocusVisible` is updated based on last input type

> Important: `tabIndex` is still required on non-focusable elements like `div` or `span`.

---

### 3. `usePress`

Normalizes press events across mouse, keyboard, and touch.

```js
const { pressProps } = usePress({
  onPress: () => console.log("pressed"),
  disabled: false,
});
```

- `pressProps` → spread onto any element
- Handles:

  - Mouse click
  - Keyboard: Enter and Space (Space fires on keyup)
  - Disabled state (prevents press)

- Returns **headless props only**, making it reusable across components

---

## How to Combine Hooks in a Component

```jsx
import { usePress } from "../hooks/usePress";
import { useFocusVisible } from "../hooks/useFocusVisible";

export default function ButtonDemo() {
  const { pressProps } = usePress({ onPress: () => alert("Pressed!") });
  const { isFocusVisible, focusVisibleProps } = useFocusVisible();

  return (
    <div
      {...pressProps}
      {...focusVisibleProps}
      tabIndex={0} // makes div focusable
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
```

✅ Element is focusable via keyboard (tab), shows outline only when appropriate, and fires `onPress` for both keyboard and mouse.

---

## Key Takeaways

- Focus management (`useFocus`) and semantic press (`usePress`) are **separate concerns**
- Keyboard vs pointer focus is handled by `useFocusVisible`, not `useButton`
- These hooks are **independent and reusable**, and will later be composed into fully-featured headless primitives
- `tabIndex` is necessary for non-native interactive elements (`div`, `span`) to receive focus

---

## Status

- Focus state tracked (`useFocus`) ✅
- Keyboard vs pointer focus tracked (`useFocusVisible`) ✅
- Press events normalized (`usePress`) ✅
- Hooks are **headless, composable, and ready for Week 3 integration** ✅
