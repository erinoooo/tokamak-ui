/**
 * tokamak-ui · index.js
 *
 * Main entry. Importing this file registers all custom elements
 * and injects the JetBrains Mono font into <head>.
 */

// ── Core ─────────────────────────────────────────────
export { TokamakElement, esc, lockBodyScroll, unlockBodyScroll } from './utils.js';
export { SHARED_CSS, injectFont, FONT_URL } from './tokens.js';

// ── Components (each file registers its custom element on import) ──
export { TokButton }   from './components/tok-button.js';
export { TokBadge }    from './components/tok-badge.js';
export { TokInput }    from './components/tok-input.js';
export { TokSelect }   from './components/tok-select.js';
export { TokField }    from './components/tok-field.js';
export { TokToggle }   from './components/tok-toggle.js';
export { TokCheckbox, TokRadio, TokRadioGroup } from './components/tok-checkbox.js';
export { TokCard }     from './components/tok-card.js';
export { TokTabs }     from './components/tok-tabs.js';
export { TokProgress } from './components/tok-progress.js';
export { TokPanel }    from './components/tok-panel.js';

export const VERSION = '0.1.1';
