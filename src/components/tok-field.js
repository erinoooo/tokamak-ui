/**
 * tokamak-ui · tok-field
 *
 * Form group wrapper — label, slot for control, hint or error below.
 *
 * Attributes:
 *   label — uppercase label above the control
 *   hint  — small descriptive text below
 *   error — error message; displaces the hint when present
 *
 * Slots:
 *   (default) — the input/select/control
 */

import { TokamakElement, esc } from '../utils.js';

export class TokField extends TokamakElement {
  static observedAttributes = ['label', 'hint', 'error'];

  styles() {
    return `
      :host { display: block; margin-bottom: 18px; }

      .label {
        display: block;
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--tok-fg-2);
        margin-bottom: 7px;
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }
      .label:empty { display: none; }

      :host([error]) .label { color: var(--tok-fg); }

      .hint, .error {
        margin-top: 6px;
        font-size: 10px;
        line-height: 1.6;
        letter-spacing: 0.04em;
        transition: color var(--tok-dur-base) var(--tok-ease-out);
        animation: fadeIn var(--tok-dur-base) var(--tok-ease-spring);
      }
      .hint  { color: var(--tok-fg-3); }
      .error { color: var(--tok-fg); font-weight: 500; }
      .hint:empty, .error:empty { display: none; }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-3px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
  }

  template() {
    const label = this.attr('label');
    const hint  = this.attr('hint');
    const error = this.attr('error');
    const showError = error !== '';
    return `
      <span class="label" part="label">${esc(label)}</span>
      <slot></slot>
      <div class="error" part="error">${showError ? esc(error) : ''}</div>
      <div class="hint"  part="hint">${!showError ? esc(hint) : ''}</div>
    `;
  }

  update(name) {
    if (name === 'label') {
      const el = this.$('.label');
      if (el) el.textContent = this.attr('label');
      return;
    }
    if (name === 'error') {
      const errEl  = this.$('.error');
      const hintEl = this.$('.hint');
      const err    = this.attr('error');
      const hint   = this.attr('hint');
      if (errEl) errEl.textContent = err;
      if (hintEl) hintEl.textContent = err ? '' : hint;
      return;
    }
    if (name === 'hint') {
      const hintEl = this.$('.hint');
      const err    = this.attr('error');
      if (hintEl) hintEl.textContent = err ? '' : this.attr('hint');
    }
  }
}

customElements.define('tok-field', TokField);
