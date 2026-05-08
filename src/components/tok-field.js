/**
 * tokamak-ui · tok-field
 *
 * Label + input/select wrapper for consistent form groups.
 * Slots any tok-input, tok-select, or plain input as its content.
 *
 * Attributes:
 *   label   — field label text (uppercase, small-caps styled)
 *   hint    — optional hint text shown below the input
 *   error   — error message; shown in place of hint with emphasis
 *
 * @example
 *   <tok-field label="API Endpoint" hint="Include the protocol">
 *     <tok-input placeholder="https://..."></tok-input>
 *   </tok-field>
 */

import { TokamakElement } from '../utils.js';

export class TokField extends TokamakElement {
  static observedAttributes = ['label', 'hint', 'error'];

  styles() {
    return `
      :host {
        display: block;
        margin-bottom: 18px;
      }

      label {
        display: block;
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--fg-2);
        margin-bottom: 7px;
        transition: color var(--dur-base) var(--ease-out);
      }

      :host([error]) label {
        color: var(--fg);
      }

      .hint {
        margin-top: 6px;
        font-size: 10px;
        color: var(--fg-3);
        letter-spacing: 0.04em;
        line-height: 1.6;
        transition: color var(--dur-base) var(--ease-out);
      }

      .error {
        margin-top: 6px;
        font-size: 10px;
        color: var(--fg);
        font-weight: 500;
        letter-spacing: 0.04em;
        line-height: 1.6;
      }

      /* Animated entrance for error */
      .error {
        animation: slideIn var(--dur-base) var(--ease-spring);
      }

      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
  }

  template() {
    const label = this.attr('label');
    const hint  = this.attr('hint');
    const error = this.attr('error');

    return `
      ${label ? `<label part="label">${label}</label>` : ''}
      <slot></slot>
      ${error ? `<div class="error" part="error">${error}</div>` : ''}
      ${!error && hint ? `<div class="hint" part="hint">${hint}</div>` : ''}
    `;
  }
}

customElements.define('tok-field', TokField);
