/**
 * tokamak-ui · tok-checkbox + tok-radio + tok-radio-group
 *
 * tok-checkbox / tok-radio:
 *   Attributes: label, checked, disabled, name, value
 *   Events:     tok-change { checked, value }
 *   Form-associated.
 *
 * tok-radio-group:
 *   Manages mutual exclusivity among child tok-radio elements.
 *   Forwards name to children and re-emits tok-change with the
 *   selected value.
 *   Attributes: name, value
 *   Events:     tok-change { value, name }
 */

import { TokamakElement, esc } from '../utils.js';

/* ─────────────────────────────────────────────────────────
   tok-checkbox
───────────────────────────────────────────────────────── */
export class TokCheckbox extends TokamakElement {
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
        gap: 10px;
        cursor: pointer;
        user-select: none;
        margin-bottom: 8px;
        transition: opacity var(--tok-dur-base) var(--tok-ease-out);
        outline: none;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.4; }
      :host(:focus-visible) .box { box-shadow: 0 0 0 3px var(--tok-bg-3); }

      .box {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: skewX(var(--tok-skew));
        background: var(--tok-bg-2);
        border: 1.5px solid var(--tok-border);
        transition:
          background   var(--tok-dur-fast) var(--tok-ease-out),
          border-color var(--tok-dur-fast) var(--tok-ease-out),
          box-shadow   var(--tok-dur-fast) var(--tok-ease-out);
      }

      :host([checked]) .box {
        background: var(--tok-fg);
        border-color: var(--tok-fg);
      }

      .tick {
        display: inline-block;
        color: var(--tok-bg);
        font-size: 10px;
        font-weight: 700;
        opacity: 0;
        transform: skewX(calc(var(--tok-skew) * -1)) scale(0.4);
        transition:
          opacity   var(--tok-dur-fast) var(--tok-ease-out),
          transform var(--tok-dur-fast) var(--tok-ease-spring);
        line-height: 1;
      }

      :host([checked]) .tick {
        opacity: 1;
        transform: skewX(calc(var(--tok-skew) * -1)) scale(1);
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
      <div class="box" part="box">
        <span class="tick" part="tick">✓</span>
      </div>
      <span class="label" part="label">${esc(this.attr('label'))}</span>
    `;
  }

  hydrate() {
    this.setAttribute('role', 'checkbox');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', String(this.checked));

    this._onClick = () => {
      if (this.bool('disabled')) return;
      this.checked = !this.checked;
      this.emit('change', { checked: this.checked, value: this.attr('value') });
    };

    this._onKey = (e) => {
      if (this.bool('disabled')) return;
      if (e.key === ' ') {
        e.preventDefault();
        this.checked = !this.checked;
        this.emit('change', { checked: this.checked, value: this.attr('value') });
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

  afterConnect() { this._setFormValue(); }

  formDisabledCallback(disabled) { this.setBool('disabled', disabled); }
}

customElements.define('tok-checkbox', TokCheckbox);


/* ─────────────────────────────────────────────────────────
   tok-radio
───────────────────────────────────────────────────────── */
export class TokRadio extends TokamakElement {
  static observedAttributes = ['label', 'checked', 'disabled', 'name', 'value'];

  get checked() { return this.bool('checked'); }
  set checked(v) { this.setBool('checked', !!v); }

  styles() {
    return `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
        margin-bottom: 8px;
        transition: opacity var(--tok-dur-base) var(--tok-ease-out);
        outline: none;
      }
      :host([disabled]) { cursor: not-allowed; opacity: 0.4; }
      :host(:focus-visible) .circle { box-shadow: 0 0 0 3px var(--tok-bg-3); }

      .circle {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--tok-bg-2);
        border: 1.5px solid var(--tok-border);
        transition:
          border-color var(--tok-dur-fast) var(--tok-ease-out),
          box-shadow   var(--tok-dur-fast) var(--tok-ease-out);
      }

      :host([checked]) .circle { border-color: var(--tok-fg); }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--tok-fg);
        opacity: 0;
        transform: scale(0.3);
        transition:
          opacity   var(--tok-dur-fast) var(--tok-ease-out),
          transform var(--tok-dur-fast) var(--tok-ease-spring);
      }

      :host([checked]) .dot {
        opacity: 1;
        transform: scale(1);
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
      <div class="circle" part="circle">
        <div class="dot" part="dot"></div>
      </div>
      <span class="label" part="label">${esc(this.attr('label')) || ''}</span>
      <slot></slot>
    `;
  }

  hydrate() {
    this.setAttribute('role', 'radio');
    this.setAttribute('tabindex', this.checked ? '0' : '-1');
    this.setAttribute('aria-checked', String(this.checked));

    this._onClick = () => {
      if (this.bool('disabled') || this.checked) return;
      this.emit('change', { value: this.attr('value'), name: this.attr('name') });
    };

    this._onKey = (e) => {
      if (this.bool('disabled') || this.checked) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.emit('change', { value: this.attr('value'), name: this.attr('name') });
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
    if (name === 'checked') {
      this.setAttribute('aria-checked', String(this.checked));
      this.setAttribute('tabindex', this.checked ? '0' : '-1');
      return;
    }
    if (name === 'label') {
      const el = this.$('.label');
      if (el) el.textContent = this.attr('label');
    }
  }
}

customElements.define('tok-radio', TokRadio);


/* ─────────────────────────────────────────────────────────
   tok-radio-group
   Plain HTMLElement — no shadow root, manages mutual exclusion.
───────────────────────────────────────────────────────── */
export class TokRadioGroup extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ['name', 'value'];

  constructor() {
    super();
    try { this._internals = this.attachInternals(); } catch { this._internals = null; }
    this._onTokChange = this._onTokChange.bind(this);
  }

  get name()  { return this.getAttribute('name'); }
  get value() {
    const checked = this.querySelector('tok-radio[checked]');
    return checked?.getAttribute('value') ?? null;
  }

  set value(v) {
    this.querySelectorAll('tok-radio').forEach(r => {
      r.checked = r.getAttribute('value') === v;
    });
    this._setFormValue();
  }

  connectedCallback() {
    this.setAttribute('role', 'radiogroup');
    this.addEventListener('tok-change', this._onTokChange);
    this._propagateName();
    this._applyInitialValue();
    this._setFormValue();
  }

  disconnectedCallback() {
    this.removeEventListener('tok-change', this._onTokChange);
  }

  attributeChangedCallback(name) {
    if (name === 'name')  this._propagateName();
    if (name === 'value') {
      const v = this.getAttribute('value');
      this.querySelectorAll('tok-radio').forEach(r => {
        r.checked = r.getAttribute('value') === v;
      });
      this._setFormValue();
    }
  }

  _propagateName() {
    const n = this.getAttribute('name');
    if (!n) return;
    this.querySelectorAll('tok-radio').forEach(r => r.setAttribute('name', n));
  }

  _applyInitialValue() {
    const v = this.getAttribute('value');
    if (v == null) return;
    this.querySelectorAll('tok-radio').forEach(r => {
      r.checked = r.getAttribute('value') === v;
    });
  }

  _setFormValue() {
    if (!this._internals) return;
    try { this._internals.setFormValue(this.value); } catch {}
  }

  _onTokChange(e) {
    // Only handle events from direct tok-radio children
    if (!(e.target instanceof TokRadio)) return;
    e.stopPropagation();

    this.querySelectorAll('tok-radio').forEach(r => {
      r.checked = r === e.target;
    });

    const value = e.target.getAttribute('value');
    this.setAttribute('value', value ?? '');
    this._setFormValue();

    this.dispatchEvent(new CustomEvent('tok-change', {
      detail:   { value, name: this.getAttribute('name') },
      bubbles:  true,
      composed: true,
    }));
  }

  formResetCallback() {
    // Restore initial state — re-read default checked attrs from light DOM
    this.querySelectorAll('tok-radio').forEach(r => {
      // No persistent default; users should manage explicitly via setting `value` on the group
    });
    this._setFormValue();
  }
}

customElements.define('tok-radio-group', TokRadioGroup);
