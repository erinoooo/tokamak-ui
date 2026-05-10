/**
 * tokamak-ui · tok-toggle
 *
 * Spring-animated parallelogram toggle switch.
 * Form-associated.
 *
 * Attributes:
 *   label    — optional label rendered beside the toggle
 *   checked  — boolean; presence = on
 *   disabled — boolean
 *   name     — form field name (submits "on" if checked, omitted otherwise)
 *   value    — form value when checked (default: "on")
 *
 * Properties:
 *   .checked — get/set on/off state. Does NOT emit tok-change (matches native).
 *
 * Events:
 *   tok-change — { checked } on user interaction. Bubbles, composed.
 */

import { TokamakElement, esc } from '../utils.js';

export class TokToggle extends TokamakElement {
  static formAssociated = true;
  static observedAttributes = ['label', 'checked', 'disabled', 'name', 'value'];

  constructor() {
    super();
    try { this._internals = this.attachInternals(); } catch { this._internals = null; }
  }

  get checked() { return this.bool('checked'); }
  set checked(v) { this.setBool('checked', !!v); }

  _setFormValue() {
    if (!this._internals) return;
    try {
      this._internals.setFormValue(this.checked ? this.attr('value', 'on') : null);
    } catch {}
  }

  styles() {
    return `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        transition: opacity var(--tok-dur-base) var(--tok-ease-out);
        outline: none;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.4; }
      :host(:focus-visible) .track { box-shadow: 0 0 0 3px var(--tok-bg-3); }

      .track {
        width: 46px;
        height: 24px;
        flex-shrink: 0;
        position: relative;
        transform: skewX(var(--tok-skew));
        background: var(--tok-bg-3);
        border: 1.5px solid var(--tok-border);
        transition:
          background   var(--tok-dur-base) var(--tok-ease-out),
          border-color var(--tok-dur-base) var(--tok-ease-out),
          box-shadow   var(--tok-dur-base) var(--tok-ease-out);
      }

      :host([checked]) .track {
        background: var(--tok-fg);
        border-color: var(--tok-fg);
      }

      .thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        background: var(--tok-fg-2);
        transform: translateX(0);
        transition:
          transform  var(--tok-dur-base) var(--tok-ease-spring),
          background var(--tok-dur-base) var(--tok-ease-out);
      }

      :host([checked]) .thumb {
        transform: translateX(22px);
        background: var(--tok-bg);
      }

      .label {
        font-size: 12px;
        color: var(--tok-fg);
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }
      .label:empty { display: none; }
    `;
  }

  template() {
    return `
      <div class="track" part="track">
        <div class="thumb" part="thumb"></div>
      </div>
      <span class="label" part="label">${esc(this.attr('label'))}</span>
    `;
  }

  hydrate() {
    this.setAttribute('role', 'switch');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', String(this.checked));

    this._onClick = (e) => {
      if (this.bool('disabled')) return;
      // Avoid double-firing on internal element clicks
      this.checked = !this.checked;
      this.emit('change', { checked: this.checked });
    };

    this._onKey = (e) => {
      if (this.bool('disabled')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.checked = !this.checked;
        this.emit('change', { checked: this.checked });
      }
    };

    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKey);
  }

  beforeDisconnect() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKey);
  }

  update(name) {
    if (name === 'checked' || name === 'value') {
      this.setAttribute('aria-checked', String(this.checked));
      this._setFormValue();
      return;
    }
    if (name === 'disabled') {
      this.setAttribute('aria-disabled', String(this.bool('disabled')));
      return;
    }
    if (name === 'label') {
      const el = this.$('.label');
      if (el) el.textContent = this.attr('label');
    }
  }

  afterConnect() {
    this._setFormValue();
  }

  formResetCallback() {
    // Reset to initial defaultChecked-style state — use presence at parse time
    // Without ElementInternals.defaultValue, we re-read the original attribute.
    // Users wanting different reset behavior should manage it explicitly.
  }

  formDisabledCallback(disabled) {
    this.setBool('disabled', disabled);
  }
}

customElements.define('tok-toggle', TokToggle);
