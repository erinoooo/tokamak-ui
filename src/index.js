/**
 * tokamak-ui · index.js
 *
 * Main entry point. Importing this file registers all custom elements
 * and injects the JetBrains Mono font link into <head>.
 *
 * Usage (CDN):
 *   <script src="https://cdn.tokamak-ui.ereneksi.com/tokamak.min.js"></script>
 *
 * Usage (npm):
 *   import 'tokamak-ui';
 *
 * Usage (tree-shaking — import only what you need):
 *   import 'tokamak-ui/src/components/tok-button.js';
 *   import 'tokamak-ui/src/components/tok-card.js';
 *
 * Dark mode:
 *   <html data-theme="dark">  ← all components adapt automatically
 */

// ── Core ──────────────────────────────────────────────────
export { TokamakElement }  from './utils.js';
export { BASE_TOKENS, THEME_TOKENS, injectFont } from './tokens.js';

// ── Components ────────────────────────────────────────────
export { TokButton }                               from './components/tok-button.js';
export { TokBadge }                                from './components/tok-badge.js';
export { TokInput }                                from './components/tok-input.js';
export { TokSelect }                               from './components/tok-select.js';
export { TokField }                                from './components/tok-field.js';
export { TokToggle }                               from './components/tok-toggle.js';
export { TokCheckbox, TokRadio, TokRadioGroup }    from './components/tok-checkbox.js';
export { TokCard }                                 from './components/tok-card.js';
export { TokTabs }                                 from './components/tok-tabs.js';
export { TokProgress }                             from './components/tok-progress.js';
export { TokPanel }                                from './components/tok-panel.js';

/**
 * Component registry — map of tag names to classes.
 * Useful for checking what's registered or for manual registration.
 */
export const COMPONENTS = {
  'tok-button':      () => import('./components/tok-button.js'),
  'tok-badge':       () => import('./components/tok-badge.js'),
  'tok-input':       () => import('./components/tok-input.js'),
  'tok-select':      () => import('./components/tok-select.js'),
  'tok-field':       () => import('./components/tok-field.js'),
  'tok-toggle':      () => import('./components/tok-toggle.js'),
  'tok-checkbox':    () => import('./components/tok-checkbox.js'),
  'tok-radio':       () => import('./components/tok-checkbox.js'),
  'tok-radio-group': () => import('./components/tok-checkbox.js'),
  'tok-card':        () => import('./components/tok-card.js'),
  'tok-tabs':        () => import('./components/tok-tabs.js'),
  'tok-progress':    () => import('./components/tok-progress.js'),
  'tok-panel':       () => import('./components/tok-panel.js'),
};

/**
 * VERSION — single source of truth.
 * Matches package.json.
 */
export const VERSION = '0.1.0';
