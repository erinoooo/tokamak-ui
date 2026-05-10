/**
 * tokamak-ui · tok-progress
 *
 * Parallelogram progress bar with spring-animated fill.
 *
 * Attributes:
 *   value  — number 0–100 (default: 0)
 *   label  — descriptor text below-left
 *   size   — "sm" | "md" | "lg" (default: "md")
 *
 * Properties:
 *   .value — get/set; animates smoothly
 */

import { TokamakElement, esc } from '../utils.js';

function clamp(v) {
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export class TokProgress extends TokamakElement {
  static observedAttributes = ['value', 'label', 'size'];

  get value() { return clamp(this.attr('value', '0')); }
  set value(v) { this.setAttribute('value', String(clamp(v))); }

  styles() {
    return `
      :host { display: block; }

      .track {
        position: relative;
        background: var(--tok-bg-3);
        border: 1px solid var(--tok-border);
        transform: skewX(var(--tok-skew));
        overflow: hidden;
        transition:
          background   var(--tok-dur-base) var(--tok-ease-out),
          border-color var(--tok-dur-base) var(--tok-ease-out);
      }

      :host(:not([size])) .track,
      :host([size="md"])  .track { height: 8px; }
      :host([size="sm"])  .track { height: 4px; }
      :host([size="lg"])  .track { height: 12px; }

      .fill {
        position: absolute;
        top: 0; left: 0; bottom: 0;
        background: var(--tok-fg);
        width: 0%;
        transition:
          width      var(--tok-dur-slow) var(--tok-ease-spring),
          background var(--tok-dur-base) var(--tok-ease-out);
      }

      .meta {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        font-size: 9px;
        letter-spacing: 0.1em;
        color: var(--tok-fg-3);
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }
      .meta .label:empty { display: none; }
    `;
  }

  template() {
    const v = this.value;
    return `
      <div class="track" part="track" role="progressbar"
           aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100">
        <div class="fill" part="fill" style="width: ${v}%"></div>
      </div>
      <div class="meta" part="meta">
        <span class="label">${esc(this.attr('label'))}</span>
        <span class="pct">${Math.round(v)}%</span>
      </div>
    `;
  }

  update(name) {
    if (name === 'value') {
      const v = this.value;
      const fill = this.$('.fill');
      const pct  = this.$('.pct');
      const track = this.$('.track');
      if (fill)  fill.style.width  = `${v}%`;
      if (pct)   pct.textContent   = `${Math.round(v)}%`;
      if (track) track.setAttribute('aria-valuenow', String(v));
      return;
    }
    if (name === 'label') {
      const el = this.$('.label');
      if (el) el.textContent = this.attr('label');
    }
    // size handled by CSS attribute selector
  }
}

customElements.define('tok-progress', TokProgress);
