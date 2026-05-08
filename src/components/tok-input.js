/**
 * tokamak-ui · tok-input
 *
 * A text input wrapped in a parallelogram shell.
 * The shell highlights on focus; the input itself is transparent.
 *
 * Attributes:
 *   placeholder — forwarded to the inner <input>
 *   value       — initial value (also settable as a JS property)
 *   type        — forwarded to the inner <input> (default: "text")
 *   disabled    — boolean
 *   name        — forwarded to inner <input>
 *
 * Properties:
 *   .value      — get/set the current value
 *
 * Events:
 *   tok-input   — { value } — fires on every keystroke. Bubbles, composed.
 *   tok-change  — { value } — fires on blur. Bubbles, composed.
 *
 * @example
 *   <tok-input placeholder="https://api.example.com"></tok-input>
 */

import { TokamakElement } from '../utils.js';

export class TokInput extends TokamakElement {
  static observedAttributes = ['placeholder', 'value', 'type', 'disabled', 'name'];

  // Keep value in sync without a full re-render
  get value() {
    return this.$('input')?.value ?? this.attr('value', '');
  }
  set value(v) {
    const input = this.$('input');
    if (input) input.value = v;
    this.setAttribute('value', v);
  }

  styles() {
    const disabled = this.bool('disabled');
    return `
      :host { display: block; }

      .shell {
        position: relative;
        display: block;
      }

      /* Parallelogram background — the "shell" */
      .shell::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--bg-2);
        border: 1.5px solid var(--border);
        transform: skewX(var(--skew));
        transition:
          border-color var(--dur-fast) var(--ease-out),
          background   var(--dur-fast) var(--ease-out);
        z-index: 0;
        pointer-events: none;
      }

      .shell:focus-within::before {
        border-color: var(--border-hi);
        background: var(--bg);
      }

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
        color: var(--fg);
        opacity: ${disabled ? '0.4' : '1'};
        cursor: ${disabled ? 'not-allowed' : 'text'};
        transition: color var(--dur-base) var(--ease-out);
      }

      input::placeholder {
        color: var(--fg-3);
        transition: color var(--dur-base) var(--ease-out);
      }
    `;
  }

  template() {
    const ph   = this.attr('placeholder');
    const val  = this.attr('value');
    const type = this.attr('type', 'text');
    const name = this.attr('name');
    const dis  = this.bool('disabled');

    return `
      <div class="shell" part="shell">
        <input
          part="input"
          type="${type}"
          placeholder="${ph}"
          value="${val}"
          ${name ? `name="${name}"` : ''}
          ${dis  ? 'disabled' : ''}
        />
      </div>
    `;
  }

  hydrate() {
    const input = this.$('input');

    input.addEventListener('input', () => {
      this.emit('input', { value: input.value });
    });

    input.addEventListener('change', () => {
      this.emit('change', { value: input.value });
    });
  }

  // Don't fully re-render on value change — just update the input
  update(name, _old, val) {
    if (name === 'value') {
      const input = this.$('input');
      if (input && input.value !== val) input.value = val;
    } else {
      this._render();
      this.hydrate();
    }
  }
}

customElements.define('tok-input', TokInput);
