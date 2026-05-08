/**
 * tokamak-ui · tok-progress
 *
 * Parallelogram progress bar with spring-animated fill.
 *
 * Attributes:
 *   value  — number 0–100 (default: 0)
 *   label  — description text shown bottom-left
 *   size   — "sm" | "md" | "lg"  (default: "md")
 *
 * Properties:
 *   .value — get/set progress (animates smoothly)
 *
 * @example
 *   <tok-progress value="68" label="Build progress"></tok-progress>
 */

import { TokamakElement } from '../utils.js';

const HEIGHTS = { sm: '4px', md: '8px', lg: '12px' };

export class TokProgress extends TokamakElement {
  static observedAttributes = ['value', 'label', 'size'];

  get value() { return parseFloat(this.attr('value', '0')); }
  set value(v) {
    this.setAttribute('value', String(Math.min(100, Math.max(0, v))));
  }

  styles() {
    const sz = HEIGHTS[this.attr('size', 'md')] ?? HEIGHTS.md;

    return `
      :host { display: block; }

      .track {
        position: relative;
        height: ${sz};
        background: var(--bg-3);
        border: 1px solid var(--border);
        transform: skewX(var(--skew));
        overflow: hidden;
        transition:
          background var(--dur-base) var(--ease-out),
          border-color var(--dur-base) var(--ease-out);
      }

      .fill {
        position: absolute;
        top: 0; left: 0; bottom: 0;
        background: var(--fg);
        transition:
          width var(--dur-slow) var(--ease-spring),
          background var(--dur-base) var(--ease-out);
      }

      .meta {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        font-size: 9px;
        letter-spacing: 0.1em;
        color: var(--fg-3);
        transition: color var(--dur-base) var(--ease-out);
      }
    `;
  }

  template() {
    const val   = Math.min(100, Math.max(0, parseFloat(this.attr('value', '0'))));
    const label = this.attr('label');

    return `
      <div class="track" part="track" role="progressbar" aria-valuenow="${val}" aria-valuemin="0" aria-valuemax="100">
        <div class="fill" part="fill" style="width: ${val}%"></div>
      </div>
      <div class="meta" part="meta">
        <span>${label}</span>
        <span>${Math.round(val)}%</span>
      </div>
    `;
  }

  // Smooth value updates — only animate the fill, don't re-render
  update(name, _old, newVal) {
    if (name === 'value') {
      const val  = Math.min(100, Math.max(0, parseFloat(newVal)));
      const fill = this.$('.fill');
      const meta = this.$('.meta span:last-child');
      const track = this.$('.track');

      if (fill) fill.style.width = `${val}%`;
      if (meta) meta.textContent = `${Math.round(val)}%`;
      if (track) track.setAttribute('aria-valuenow', val);
    } else {
      this._render();
    }
  }
}

customElements.define('tok-progress', TokProgress);
