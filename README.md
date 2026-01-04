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

# Week 3 — Headless Select Primitive (Part 1)

This week, we build a fully **headless Select component** in React — separating **state**, **behavior**, and later styling. The focus is on **keyboard navigation, controlled vs uncontrolled state, and interaction plumbing**, without worrying about UI.

---

## 🎯 Goals

- Build `useSelectState` to manage Select state
- Build `useSelectBehavior` to handle interactions (keyboard, click, focus)
- Support controlled vs uncontrolled Select
- Implement headless props: `triggerProps`, `listBoxProps`, `getOptionProps`
- Prepare for Week 4 accessibility enhancements

> No styling yet — only logic.

---

## 1️⃣ `useSelectState` — core state

Manages:

- `value` → currently selected value
- `isOpen` → dropdown open/close state
- `highlightedIndex` → keyboard navigation focus inside list
- Controlled vs uncontrolled mode

```js
const {
  value,
  isOpen,
  highlightedIndex,
  setHighlightedIndex,
  select,
  open,
  close,
} = useSelectState({ defaultValue: "apple", value: controlledValue, onChange });
```

**Key responsibilities:**

- Handle controlled vs uncontrolled state
- Track highlighted option for keyboard navigation
- Open / close management
- Selecting an option updates state and triggers `onChange`

---

## 2️⃣ `useSelectBehavior` — interaction logic

Adds headless props on top of state:

```js
const { triggerProps, listBoxProps, getOptionProps } = useSelectBehavior(
  selectState,
  options
);
```

**Responsibilities:**

- Open/close menu on trigger click
- Close menu on Escape
- Keyboard navigation:

  - ArrowUp / ArrowDown → highlight option
  - Enter → select highlighted option

- Close menu when clicking outside
- Focus management for trigger & listbox

**Headless props:**

- `triggerProps` → attach to trigger element (div/button)
- `listBoxProps` → attach to menu container
- `getOptionProps({ item, index })` → attach to each option

> All logic, no styling assumptions.

---

## 3️⃣ Usage Example

```jsx
const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const state = useSelectState({ defaultValue: "apple" });
const { triggerProps, listBoxProps, getOptionProps } = useSelectBehavior(
  state,
  options
);

<div>
  <div {...triggerProps}>{state.value ?? "Select an option"}</div>
  {state.isOpen && (
    <ul {...listBoxProps}>
      {options.map((item, index) => (
        <li {...getOptionProps({ index, item })}>{item.label}</li>
      ))}
    </ul>
  )}
</div>;
```

---

## 4️⃣ Key Principles

- **Headless first** — no styling baked in
- **State vs behavior separation**:

  - `useSelectState` → state
  - `useSelectBehavior` → interaction logic

- **Controlled vs uncontrolled** supported
- **Composable** — same hooks can be used for custom triggers or advanced select variants

---

## 5️⃣ Edge Cases / Notes

- `highlightedIndex` wraps around when pressing ArrowUp / ArrowDown
- Menu closes on outside clicks via `mousedown` listener
- Selecting an option always closes the menu
- Focus is tracked separately from styling — Week 4 will add ARIA & accessibility

---

## 6️⃣ Deliverables

By the end of Week 3:

- `useSelectState` ✅
- `useSelectBehavior` ✅
- Fully headless select logic ✅
- Keyboard navigation & click outside handled ✅
- Ready for Week 4 accessibility enhancements ✅

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

# Week 4 — Accessibility & ARIA Meditations

This week, the focus is on **making the headless Select fully accessible** without touching the UI layer. The goal is to ensure that keyboard users, screen readers, and assistive technologies can interact correctly with our primitive components.

---

## 🌟 Key Goals

- Apply proper ARIA roles and attributes
- Ensure keyboard navigation works as expected
- Keep state & behavior separate
- Maintain headless, reusable hooks

---

## ✅ Achievements

### 1. ARIA Roles & Attributes

- Trigger element:
  - `role="combobox"`
  - `aria-expanded={state.isOpen}`
  - `aria-controls="listbox"`
  - `aria-activedescendant={state.highlightedIndex >= 0 ? "option-${index}" : undefined}`
- List element:
  - `role="listbox"`
- Options:
  - `role="option"`
  - `aria-selected={state.value === option.value}`

These ensure **screen readers announce the correct element states** and selected options.

---

### 2. Keyboard Navigation

- `ArrowUp` / `ArrowDown` → move highlighted index
- `Enter` / `Space` → select option
- `Escape` → close menu
- Highlight wraps around start/end

> Keyboard users can now interact with the Select **without a mouse**.

---

### 3. Focus Management

- `useFocus` tracks focus state ✅
- `useFocusVisible` tracks keyboard vs pointer focus ✅
- Trigger element is focusable with `tabIndex={0}` ✅

> Users see focus outlines **only when using keyboard**, matching `:focus-visible` behavior.

---

### 4. Click Outside Handling

- Clicking outside the trigger or list closes the menu ✅
- Highlight updates on hover ✅
- Clicking an option selects it and closes menu ✅

> Pointer interactions now match native select behavior.

---

### 5. Headless Separation

- `useSelectState` → state only
- `useSelectBehavior` → interaction logic only
- Styling is **fully separate**
- Controlled vs uncontrolled mode supported ✅

> This separation allows **flexible composition** in future components.

---

## 🔑 Takeaways

- Accessibility is **non-negotiable** even for headless components.
- ARIA roles and attributes bridge **state & behavior with assistive tech**.
- Focus management and keyboard navigation are separate but essential primitives.
- Headless design makes it easier to **add styling later** without breaking accessibility.

# Week 5 — Styling Layer Meditations

This week focuses on adding a **visual styling layer** on top of fully headless, accessible primitives built in previous weeks.
The goal is not to design a UI kit, but to **prove that logic and presentation are truly separated**.

By this point, all behavior, state, keyboard handling, and accessibility concerns are already solved. Styling is now a **pure consumer concern**.

---

## 🎯 Goals

- Add visual styling without modifying headless logic
- Use CSS variables (design tokens) for theming
- Implement hover, focus-visible, and selected states
- Preserve accessibility and keyboard behavior
- Keep components composable and framework-agnostic

---

## 🧠 Core Principle

> **Headless components should never know how they look.**

All hooks (`usePress`, `useFocusVisible`, `useSelectState`, `useSelectBehavior`) remain unchanged.
Styling is applied **only at the usage layer**.

This mirrors how real-world libraries (Radix, React Aria, Headless UI) scale.

---

## 🎨 Design Tokens (CSS Variables)

A small set of CSS variables defines the visual language:

```css
:root {
  --color-bg: white;
  --color-border: #ccc;
  --color-primary: #0077ff;
  --color-hover: #f0f0f0;
  --color-selected: #eee;

  --focus-outline: 2px solid var(--color-primary);
  --radius: 4px;
  --spacing: 8px;
}
```

### Why CSS Variables?

- Themeable without touching JS
- Centralized design decisions
- Easy to override per app or component
- Keeps logic 100% UI-agnostic

---

## 🔘 Button Styling

The Button is styled by **wrapping** the headless hooks:

- `usePress` → handles semantic press
- `useFocusVisible` → controls focus outline visibility

Visual concerns added:

- Padding, border, background
- Hover feedback
- Focus-visible outline
- Pointer cursor

The button remains:

- Keyboard accessible
- Screen-reader friendly
- Fully reusable across elements (`div`, `span`, `button`)

---

## 🔽 Select Styling

The Select component applies styling to:

- Trigger
- Listbox
- Options

Visual states include:

- Highlighted option
- Selected option
- Hover state
- Open/closed trigger outline

### Important:

- Highlighting is driven by `highlightedIndex`
- Selection is driven by `value`
- Styling does not affect logic

The Select remains:

- Fully headless
- Fully accessible
- Keyboard and pointer friendly

---

## ♿ Accessibility Preserved

Styling does **not interfere** with accessibility:

- Focus-visible outline appears only for keyboard users
- ARIA roles and attributes remain intact
- Keyboard navigation works identically
- Screen readers announce correct states

This proves accessibility was baked in **before styling**, not added later.

---

## 🧩 Separation of Concerns (Final Proof)

| Layer         | Responsibility                  |
| ------------- | ------------------------------- |
| Hooks         | State, events, accessibility    |
| Behavior      | Keyboard & pointer interactions |
| Styling       | Visual appearance only          |
| CSS Variables | Theming & design system         |

Each layer can evolve independently.

---

## 🔑 Key Takeaways

- Styling is the **last concern**, not the first
- Headless components scale better long-term
- CSS variables are powerful design primitives
- Accessibility survives styling when done correctly
- This architecture mirrors real production libraries

---

## 🚦 Status

- Button styled without logic changes ✅
- Select styled without logic changes ✅
- Focus-visible and hover states implemented ✅
- Design tokens introduced ✅
- Ready for Week 6 polish & documentation ✅
