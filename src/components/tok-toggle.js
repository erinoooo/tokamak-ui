/**
 * tokamak-ui · tok-toggle
 *
 * Spring-animated parallelogram toggle switch.
 *
 * Attributes:
 *   label   — text label beside the toggle
 *   checked — boolean; presence = on
 *   disabled — boolean
 *
 * Properties:
 *   .checked — get/set the current on/off state
 *
 * Events:
 *   tok-change — { checked: boolean } — fires on toggle. Bubbles, composed.
 *
 * @example
 *   <tok-toggle label="Enable telemetry" checked></tok-toggle>
 */

import { TokamakElement } from '../utils.js';

export class TokToggle extends TokamakElement {
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
        gap: 12px;
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
        opacity: ${disabled ? '0.4' : '1'};
        user-select: none;
        transition: opacity var(--dur-base) var(--ease-out);
      }

      .track {
        width: 46px;
        height: 24px;
        flex-shrink: 0;
        position: relative;
        transform: skewX(var(--skew));
        background: ${on ? 'var(--fg)' : 'var(--bg-3)'};
        border: 1.5px solid ${on ? 'var(--fg)' : 'var(--border)'};
        transition:
          background var(--dur-base) var(--ease-out),
          border-color var(--dur-base) var(--ease-out);
      }

      .thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        background: ${on ? 'var(--bg)' : 'var(--fg-2)'};
        transform: translateX(${on ? '22px' : '0'});
        transition:
          transform var(--dur-base) var(--ease-spring),
          background var(--dur-base) var(--ease-out);
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
      <div class="track" part="track">
        <div class="thumb" part="thumb"></div>
      </div>
      ${label ? `<span class="label" part="label">${label}</span>` : ''}
    `;
  }

  hydrate() {
    this.addEventListener('click', () => {
      if (this.bool('disabled')) return;
      this.checked = !this.checked;
      this.emit('change', { checked: this.checked });
    });

    this.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!this.bool('disabled')) {
          this.checked = !this.checked;
          this.emit('change', { checked: this.checked });
        }
      }
    });

    this.setAttribute('role', 'switch');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', String(this.checked));
  }

  update() {
    this._render();
    this.hydrate();
    this.setAttribute('aria-checked', String(this.bool('checked')));
  }
}

customElements.define('tok-toggle', TokToggle);
