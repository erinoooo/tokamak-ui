# tokamak-ui

> Every corner is a parallelogram.

Web component library built on two structural rules. No framework required. Drop one script tag and use custom elements anywhere.

**→ [tokamak-ui.ereneksi.com](https://tokamak-ui.ereneksi.com)**

---

## Two rules

**1. All 4-cornered surfaces are parallelograms.**  
Buttons, inputs, cards, badges, tabs — everything. `skewX(-14deg)` on the shell. Content counter-skewed to stay upright.

**2. Large containers have one circular leading edge.**  
Panels and drawers. A circle of radius `80vh` forms the left boundary, clipped at viewport edges. The hard cut is the design.

---

## Installation

**CDN** — one script tag, zero configuration:
```html
<script src="https://cdn.tokamak-ui.ereneksi.com/tokamak.min.js"></script>
```

**npm:**
```bash
npm install tokamak-ui
```
```js
import 'tokamak-ui';
```

**Tree-shake — import only what you need:**
```js
import 'tokamak-ui/src/components/tok-button.js';
import 'tokamak-ui/src/components/tok-card.js';
```

---

## Dark mode

Add `data-theme="dark"` to your root element. All components adapt automatically.

```html
<html data-theme="dark">
```

Toggle via JavaScript:
```js
document.documentElement.dataset.theme =
  document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
```

---

## Components

| Element | Description |
|---|---|
| `<tok-button>` | Parallelogram button. 4 variants, 3 sizes. |
| `<tok-badge>` | Inline status badge. Solid, outline, muted. |
| `<tok-input>` | Text input with skewed focus shell. |
| `<tok-select>` | Dropdown select in a parallelogram shell. |
| `<tok-field>` | Label + input wrapper for form groups. |
| `<tok-toggle>` | Spring-animated toggle switch. |
| `<tok-checkbox>` | Parallelogram checkbox. |
| `<tok-radio>` + `<tok-radio-group>` | Radio buttons with group management. |
| `<tok-card>` | Surface card with hover border highlight. |
| `<tok-tabs>` | Tab strip with active indicator. |
| `<tok-progress>` | Progress bar with spring-animated fill. |
| `<tok-panel>` | Circular-edge drawer panel. |

---

## Usage

```html
<!-- Buttons -->
<tok-button>Primary</tok-button>
<tok-button variant="ghost" size="sm">Cancel</tok-button>
<tok-button variant="danger" disabled>Delete</tok-button>

<!-- Form -->
<tok-field label="API Endpoint" hint="Include the protocol">
  <tok-input placeholder="https://api.example.com"></tok-input>
</tok-field>

<tok-field label="Environment">
  <tok-select name="env">
    <option value="prod">Production</option>
    <option value="dev">Development</option>
  </tok-select>
</tok-field>

<!-- Controls -->
<tok-toggle label="Enable telemetry" checked></tok-toggle>
<tok-checkbox label="Auto-deploy on push"></tok-checkbox>

<tok-radio-group name="tier">
  <tok-radio value="free" checked>Free</tok-radio>
  <tok-radio value="pro">Pro</tok-radio>
</tok-radio-group>

<!-- Cards -->
<tok-card title="Uptime" body="99.98%" badge="stable"></tok-card>

<!-- Tabs -->
<tok-tabs tabs="Overview,Tokens,Components" active="Overview"></tok-tabs>

<!-- Progress -->
<tok-progress value="72" label="Build progress"></tok-progress>

<!-- Panel (circular-edge drawer) -->
<tok-panel id="settings">
  <span slot="title">Settings</span>
  <span slot="subtitle">Adjust your configuration.</span>
  <tok-field label="Endpoint">
    <tok-input placeholder="https://..."></tok-input>
  </tok-field>
  <div slot="actions">
    <tok-button>Save</tok-button>
    <tok-button variant="ghost">Cancel</tok-button>
  </div>
</tok-panel>

<tok-button onclick="document.querySelector('#settings').show()">
  Open settings
</tok-button>
```

---

## Events

All components emit namespaced custom events that bubble and cross shadow boundaries.

```js
// Button click
document.querySelector('tok-button')
  .addEventListener('tok-click', () => console.log('clicked'));

// Input
document.querySelector('tok-input')
  .addEventListener('tok-input', e => console.log(e.detail.value));

// Toggle
document.querySelector('tok-toggle')
  .addEventListener('tok-change', e => console.log(e.detail.checked));

// Radio group
document.querySelector('tok-radio-group')
  .addEventListener('tok-change', e => console.log(e.detail.value));

// Tabs
document.querySelector('tok-tabs')
  .addEventListener('tok-change', e => console.log(e.detail.tab, e.detail.index));

// Panel
document.querySelector('tok-panel')
  .addEventListener('tok-open',  () => console.log('opened'));
document.querySelector('tok-panel')
  .addEventListener('tok-close', () => console.log('closed'));
```

---

## Theming

Override any CSS custom property on `:root`:

```css
:root {
  --skew:  -10deg;   /* shallower parallelograms */
  --fg:    #1a1a2e;  /* navy instead of black */
  --bg:    #f8f4ef;  /* warm white */
}
```

---

## Browser support

All modern browsers. Custom Elements v1 + Shadow DOM v1.  
No IE11, no polyfills included.

---

## Build

```bash
npm install
npm run build   # → tokamak.min.js
npm run dev     # → watch mode
```

---

## License

MIT © [Eren Eksi](https://ereneksi.com)
