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
