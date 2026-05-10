/**
 * tokamak-ui · tok-select
 *
 * A <select> wrapped in a parallelogram shell.
 * Form-associated. Pass <option> children — they're cloned into the inner select.
 *
 * Attributes:
 *   name     — form field name
 *   value    — selected value
 *   disabled — boolean
 *   required — boolean
 *
 * Properties:
 *   .value — get/set selected value
 *
 * Events:
 *   tok-change — { value } on selection change. Bubbles, composed.
 *
 * @example
 *   <tok-select name="env" value="prod">
 *     <option value="prod">Production</option>
 *     <option value="dev">Development</option>
 *   </tok-select>
 */

import { TokamakElement, esc } from '../utils.js';

export class TokSelect extends TokamakElement {
  static formAssociated = true;
  static observedAttributes = ['name', 'value', 'disabled', 'required'];

  constructor() {
    super();
    try { this._internals = this.attachInternals(); } catch { this._internals = null; }
    this._lightObserver = null;
  }

  get value() {
    return this.$('select')?.value ?? this.attr('value');
  }

  set value(v) {
    const sel = this.$('select');
    if (sel) sel.value = v == null ? '' : String(v);
    this._setFormValue(sel?.value ?? '');
  }

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
      :host([disabled]) select { cursor: not-allowed; opacity: 0.5; }

      select {
        position: relative;
        z-index: 1;
        display: block;
        width: 100%;
        padding: 10px 36px 10px 18px;
        background: transparent;
        border: none;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: var(--tok-fg);
        transition: color var(--tok-dur-base) var(--tok-ease-out);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23888'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 14px center;
      }

      /* Options render in the OS popup — light styling won't be honored in most browsers */
      option {
        background: var(--tok-bg);
        color: var(--tok-fg);
        font-family: 'JetBrains Mono', monospace;
      }
    `;
  }

  template() {
    const dis = this.bool('disabled');
    const req = this.bool('required');
    const name = this.attr('name');
    return `
      <div class="shell" part="shell">
        <select
          part="select"
          ${name ? `name="${esc(name)}"` : ''}
          ${dis ? 'disabled' : ''}
          ${req ? 'required' : ''}
        >
        </select>
      </div>
    `;
  }

  _syncOptions() {
    const sel = this.$('select');
    if (!sel) return;
    const desired = this.attr('value');
    sel.innerHTML = '';
    this.querySelectorAll('option').forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value !== '' ? o.value : o.textContent.trim();
      opt.textContent = o.textContent;
      if (o.disabled) opt.disabled = true;
      sel.appendChild(opt);
    });
    if (desired !== '') {
      sel.value = desired;
    } else {
      const sel0 = this.querySelector('option[selected]');
      if (sel0) sel.value = sel0.value || sel0.textContent.trim();
    }
    this._setFormValue(sel.value);
  }

  hydrate() {
    const sel = this.$('select');
    sel.addEventListener('change', () => {
      this._setFormValue(sel.value);
      this.emit('change', { value: sel.value });
    });
  }

  afterConnect() {
    this._syncOptions();
    // Watch light DOM <option> children for changes
    this._lightObserver = new MutationObserver(() => this._syncOptions());
    this._lightObserver.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
  }

  beforeDisconnect() {
    if (this._lightObserver) { this._lightObserver.disconnect(); this._lightObserver = null; }
  }

  update(name, _old, newVal) {
    const sel = this.$('select');
    if (!sel) return;
    if (name === 'value') {
      if (sel.value !== newVal) sel.value = newVal ?? '';
      this._setFormValue(sel.value);
      return;
    }
    if (name === 'disabled') { sel.disabled = this.bool('disabled'); return; }
    if (name === 'required') { sel.required = this.bool('required'); return; }
    if (name === 'name') {
      if (newVal == null) sel.removeAttribute('name');
      else                sel.setAttribute('name', newVal);
    }
  }

  formResetCallback() {
    this._syncOptions();
  }

  formDisabledCallback(disabled) {
    const sel = this.$('select');
    if (sel) sel.disabled = disabled;
  }
}

customElements.define('tok-select', TokSelect);
