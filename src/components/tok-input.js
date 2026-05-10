/**
 * tokamak-ui · tok-input
 *
 * Text input wrapped in a parallelogram shell.
 * Form-associated — works inside <form> with the `name` attribute.
 *
 * Attributes:
 *   placeholder — forwarded to inner <input>
 *   value       — initial value; reflected as property
 *   type        — "text" | "email" | "password" | "url" | "tel" | "search" | "number" (default: "text")
 *   disabled    — boolean
 *   readonly    — boolean
 *   required    — boolean
 *   name        — form field name
 *   min, max, step, pattern, maxlength, minlength — forwarded to inner <input>
 *
 * Properties:
 *   .value — get/set current value (does not re-render)
 *
 * Events:
 *   tok-input  — { value } on every keystroke. Bubbles, composed.
 *   tok-change — { value } on commit (blur or Enter). Bubbles, composed.
 *
 * @example
 *   <tok-input name="email" type="email" placeholder="you@example.com"></tok-input>
 */

import { TokamakElement, esc } from '../utils.js';

const FORWARDED_ATTRS = ['placeholder', 'name', 'min', 'max', 'step', 'pattern', 'maxlength', 'minlength', 'autocomplete'];

export class TokInput extends TokamakElement {
  static formAssociated = true;
  static observedAttributes = [
    'value', 'placeholder', 'type', 'disabled', 'readonly', 'required', 'name',
    'min', 'max', 'step', 'pattern', 'maxlength', 'minlength', 'autocomplete',
  ];

  constructor() {
    super();
    try { this._internals = this.attachInternals(); } catch { this._internals = null; }
  }

  get value() {
    return this.$('input')?.value ?? this.attr('value');
  }

  set value(v) {
    const newVal = v == null ? '' : String(v);
    const input = this.$('input');
    if (input) input.value = newVal;
    this._setFormValue(newVal);
  }

  get form()             { return this._internals?.form ?? null; }
  get validity()         { return this._internals?.validity; }
  get validationMessage(){ return this._internals?.validationMessage; }
  checkValidity()        { return this._internals?.checkValidity?.() ?? true; }
  reportValidity()       { return this._internals?.reportValidity?.() ?? true; }

  _setFormValue(v) {
    if (this._internals) {
      try { this._internals.setFormValue(v); } catch {}
    }
  }

  styles() {
    return `
      :host { display: block; }

      .shell {
        position: relative;
        display: block;
      }

      .shell::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--tok-bg-2);
        border: 1.5px solid var(--tok-border);
        transform: skewX(var(--tok-skew));
        transition:
          border-color var(--tok-dur-fast) var(--tok-ease-out),
          background   var(--tok-dur-fast) var(--tok-ease-out);
        z-index: 0;
        pointer-events: none;
      }

      .shell:focus-within::before {
        border-color: var(--tok-border-hi);
        background: var(--tok-bg);
      }

      :host([disabled]) .shell::before { opacity: 0.4; }
      :host([disabled]) input { cursor: not-allowed; opacity: 0.5; }

      input {
        position: relative;
        z-index: 1;
        display: block;
        width: 100%;
        padding: 10px 18px;
        background: transparent;
        border: none;
        outline: none;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: var(--tok-fg);
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }

      input::placeholder {
        color: var(--tok-fg-3);
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }

      /* Number input: hide spinners for cleaner look */
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] { -moz-appearance: textfield; }
    `;
  }

  template() {
    const type = this.attr('type', 'text');
    const safeType = ['text','email','password','url','tel','search','number'].includes(type) ? type : 'text';
    const dis  = this.bool('disabled');
    const ro   = this.bool('readonly');
    const req  = this.bool('required');

    const forwards = FORWARDED_ATTRS
      .filter(a => this.hasAttribute(a))
      .map(a => `${a}="${esc(this.getAttribute(a))}"`)
      .join(' ');

    return `
      <div class="shell" part="shell">
        <input
          part="input"
          type="${safeType}"
          value="${esc(this.attr('value'))}"
          ${forwards}
          ${dis ? 'disabled' : ''}
          ${ro  ? 'readonly' : ''}
          ${req ? 'required' : ''}
        />
      </div>
    `;
  }

  hydrate() {
    const input = this.$('input');
    input.addEventListener('input', () => {
      this._setFormValue(input.value);
      this.emit('input', { value: input.value });
    });
    input.addEventListener('change', () => {
      this._setFormValue(input.value);
      this.emit('change', { value: input.value });
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Bubble a tok-submit for forms / consumers
        this.dispatchEvent(new CustomEvent('tok-submit', {
          detail: { value: input.value }, bubbles: true, composed: true,
        }));
      }
    });
    // Initial form value
    this._setFormValue(input.value);
  }

  update(name, _old, newVal) {
    const input = this.$('input');
    if (!input) return;

    if (name === 'value') {
      if (input.value !== newVal) input.value = newVal ?? '';
      this._setFormValue(input.value);
      return;
    }
    if (name === 'disabled') { input.disabled = this.bool('disabled'); return; }
    if (name === 'readonly') { input.readOnly = this.bool('readonly'); return; }
    if (name === 'required') { input.required = this.bool('required'); return; }
    if (name === 'type') {
      const t = this.attr('type', 'text');
      input.type = ['text','email','password','url','tel','search','number'].includes(t) ? t : 'text';
      return;
    }
    if (FORWARDED_ATTRS.includes(name)) {
      if (newVal == null) input.removeAttribute(name);
      else                input.setAttribute(name, newVal);
    }
  }

  formResetCallback() {
    const input = this.$('input');
    if (input) {
      input.value = this.attr('value');
      this._setFormValue(input.value);
    }
  }

  formDisabledCallback(disabled) {
    const input = this.$('input');
    if (input) input.disabled = disabled;
  }
}

customElements.define('tok-input', TokInput);
