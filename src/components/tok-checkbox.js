/**
 * tokamak-ui · tok-checkbox + tok-radio
 *
 * tok-checkbox
 *   Attributes: label, checked, disabled
 *   Events:     tok-change { checked }
 *
 * tok-radio
 *   Attributes: label, checked, disabled, name, value
 *   Events:     tok-change { value, name }
 *   Note: wrap multiple tok-radio in a tok-radio-group for mutual exclusivity
 *
 * tok-radio-group
 *   Attributes: name
 *   Events:     tok-change { value, name }
 *   Note: automatically manages checked state across child tok-radio elements
 *
 * @example
 *   <tok-checkbox label="Auto-deploy" checked></tok-checkbox>
 *
 *   <tok-radio-group name="env">
 *     <tok-radio value="prod" checked>Production</tok-radio>
 *     <tok-radio value="dev">Development</tok-radio>
 *   </tok-radio-group>
 */

import { TokamakElement } from '../utils.js';

/* ── tok-checkbox ──────────────────────────────────────── */

export class TokCheckbox extends TokamakElement {
  static observedAttributes = ['label', 'checked', 'disabled'];

  get checked() { return this.bool('checked'); }
  set checked(v) {
    v ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }

  styles() {
    const on       = this.bool('checked');
    const disabled = this.bool('disabled');

    return `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        opacity: ${disabled ? '0.4' : '1'};
        user-select: none;
        margin-bottom: 8px;
        transition: opacity var(--dur-base) var(--ease-out);
      }

      .box {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: skewX(var(--skew));
        background: ${on ? 'var(--fg)' : 'var(--bg-2)'};
        border: 1.5px solid ${on ? 'var(--fg)' : 'var(--border)'};
        transition:
          background var(--dur-fast) var(--ease-out),
          border-color var(--dur-fast) var(--ease-out);
      }

      .tick {
        display: inline-block;
        transform: skewX(calc(var(--skew) * -1));
        color: var(--bg);
        font-size: 10px;
        font-weight: 700;
        opacity: ${on ? '1' : '0'};
        transform: skewX(calc(var(--skew) * -1)) scale(${on ? '1' : '0.5'});
        transition:
          opacity var(--dur-fast) var(--ease-out),
          transform var(--dur-fast) var(--ease-spring);
      }

      .label {
        font-size: 12px;
        color: var(--fg);
        transition: color var(--dur-base) var(--ease-out);
      }
    `;
  }

  template() {
    const label = this.attr('label');
    return `
      <div class="box" part="box">
        <span class="tick" part="tick">✓</span>
      </div>
      ${label ? `<span class="label" part="label">${label}</span>` : ''}
    `;
  }

  hydrate() {
    this.setAttribute('role', 'checkbox');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', String(this.checked));

    this.addEventListener('click', () => {
      if (this.bool('disabled')) return;
      this.checked = !this.checked;
      this.emit('change', { checked: this.checked });
    });

    this.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!this.bool('disabled')) {
          this.checked = !this.checked;
          this.emit('change', { checked: this.checked });
        }
      }
    });
  }

  update() {
    this._render();
    this.hydrate();
    this.setAttribute('aria-checked', String(this.bool('checked')));
  }
}

customElements.define('tok-checkbox', TokCheckbox);


/* ── tok-radio ─────────────────────────────────────────── */

export class TokRadio extends TokamakElement {
  static observedAttributes = ['label', 'checked', 'disabled', 'value', 'name'];

  get checked() { return this.bool('checked'); }
  set checked(v) {
    v ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }

  styles() {
    const on       = this.bool('checked');
    const disabled = this.bool('disabled');

    return `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        opacity: ${disabled ? '0.4' : '1'};
        user-select: none;
        margin-bottom: 8px;
        transition: opacity var(--dur-base) var(--ease-out);
      }

      .circle {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid ${on ? 'var(--fg)' : 'var(--border)'};
        background: var(--bg-2);
        transition: border-color var(--dur-fast) var(--ease-out);
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--fg);
        opacity: ${on ? '1' : '0'};
        transform: scale(${on ? '1' : '0.3'});
        transition:
          opacity var(--dur-fast) var(--ease-out),
          transform var(--dur-fast) var(--ease-spring);
      }

      .label {
        font-size: 12px;
        color: var(--fg);
        transition: color var(--dur-base) var(--ease-out);
      }
    `;
  }

  template() {
    const label = this.attr('label');
    return `
      <div class="circle" part="circle">
        <div class="dot" part="dot"></div>
      </div>
      ${label ? `<span class="label" part="label">${label}</span>` : '<span class="label"><slot></slot></span>'}
    `;
  }

  hydrate() {
    this.setAttribute('role', 'radio');
    this.setAttribute('tabindex', this.checked ? '0' : '-1');
    this.setAttribute('aria-checked', String(this.checked));

    this.addEventListener('click', () => {
      if (this.bool('disabled') || this.checked) return;
      this.emit('change', {
        value: this.attr('value'),
        name:  this.attr('name'),
      });
    });
  }

  update() {
    this._render();
    this.hydrate();
    this.setAttribute('aria-checked', String(this.bool('checked')));
    this.setAttribute('tabindex', this.checked ? '0' : '-1');
  }
}

customElements.define('tok-radio', TokRadio);


/* ── tok-radio-group ───────────────────────────────────── */

export class TokRadioGroup extends HTMLElement {
  static observedAttributes = ['name'];

  connectedCallback() {
    this.setAttribute('role', 'radiogroup');
    this._propagateName();

    // Listen for changes from children
    this.addEventListener('tok-change', (e) => {
      if (e.target.tagName !== 'TOK-RADIO') return;
      e.stopPropagation();

      // Deselect siblings, select target
      this.querySelectorAll('tok-radio').forEach(r => {
        r.checked = r === e.target;
      });

      // Re-emit from the group itself
      this.dispatchEvent(new CustomEvent('tok-change', {
        detail: { value: e.detail.value, name: this.getAttribute('name') },
        bubbles: true,
        composed: true,
      }));
    });
  }

  attributeChangedCallback() {
    this._propagateName();
  }

  _propagateName() {
    const name = this.getAttribute('name');
    if (!name) return;
    this.querySelectorAll('tok-radio').forEach(r => r.setAttribute('name', name));
  }

  get value() {
    return this.querySelector('tok-radio[checked]')?.getAttribute('value') ?? null;
  }
}

customElements.define('tok-radio-group', TokRadioGroup);
