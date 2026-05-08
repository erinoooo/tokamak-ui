/**
 * tokamak-ui · tok-select
 *
 * A <select> wrapped in a parallelogram shell.
 * Pass <option> children as normal — they're slotted into the inner select.
 *
 * Attributes:
 *   name     — forwarded to inner <select>
 *   disabled — boolean
 *
 * Properties:
 *   .value   — get/set selected value
 *
 * Events:
 *   tok-change — { value } — fires on selection change. Bubbles, composed.
 *
 * @example
 *   <tok-select name="env">
 *     <option value="prod">Production</option>
 *     <option value="dev">Development</option>
 *   </tok-select>
 */

import { TokamakElement } from '../utils.js';

export class TokSelect extends TokamakElement {
  static observedAttributes = ['name', 'disabled'];

  get value() { return this.$('select')?.value ?? ''; }
  set value(v) {
    const s = this.$('select');
    if (s) s.value = v;
  }

  styles() {
    const disabled = this.bool('disabled');
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

      /* Chevron SVG baked in — monochrome */
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
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        opacity: ${disabled ? '0.4' : '1'};
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: var(--fg);
        transition: color var(--dur-base) var(--ease-out);
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23888'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 14px center;
      }

      /* Options inherit from body — no shadow for <option> */
      option {
        background: #ffffff;
        color: #080808;
      }
    `;
  }

  template() {
    const name = this.attr('name');
    const dis  = this.bool('disabled');
    // Collect options from light DOM before shadow takes over
    const opts = [...this.querySelectorAll('option')]
      .map(o => `<option value="${o.value || o.textContent.trim()}" ${o.selected ? 'selected' : ''}>${o.textContent}</option>`)
      .join('');

    return `
      <div class="shell" part="shell">
        <select part="select" ${name ? `name="${name}"` : ''} ${dis ? 'disabled' : ''}>
          ${opts}
        </select>
      </div>
    `;
  }

  hydrate() {
    this.$('select').addEventListener('change', (e) => {
      this.emit('change', { value: e.target.value });
    });
  }
}

customElements.define('tok-select', TokSelect);
