/**
 * tokamak-ui · tok-card
 *
 * Surface container with a parallelogram border shell.
 * Hover darkens the border. Supports optional badge, title, body,
 * or arbitrary slotted content.
 *
 * Attributes:
 *   title  — heading text (optional; use slot for richer content)
 *   body   — body text   (optional)
 *   badge  — badge label shown above title (optional)
 *
 * Slots:
 *   (default) — overrides title/body when used directly
 *   badge     — custom badge element
 *   title     — custom title element
 *   footer    — optional footer content
 *
 * @example
 *   <tok-card title="Uptime" body="99.98%" badge="stable"></tok-card>
 *
 *   <tok-card>
 *     <span slot="title">Custom Title</span>
 *     <p>Full slot-driven content.</p>
 *   </tok-card>
 */

import { TokamakElement } from '../utils.js';

export class TokCard extends TokamakElement {
  static observedAttributes = ['title', 'body', 'badge'];

  styles() {
    return `
      :host { display: block; }

      .shell {
        position: relative;
        padding: 24px;
        cursor: default;
      }

      .shell::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--bg-2);
        border: 1px solid var(--border);
        transform: skewX(var(--skew));
        transition:
          border-color var(--dur-fast) var(--ease-out),
          background   var(--dur-base) var(--ease-out);
        z-index: 0;
      }

      :host(:hover) .shell::before {
        border-color: var(--border-hi);
      }

      .inner {
        position: relative;
        z-index: 1;
      }

      .badge-wrap {
        margin-bottom: 8px;
      }

      /* Inline badge — same parallelogram rules */
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 0 8px;
        height: 17px;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        background: var(--fg);
        color: var(--bg);
        transform: skewX(var(--skew));
      }
      .badge span {
        display: inline-block;
        transform: skewX(calc(var(--skew) * -1));
      }

      .title {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--fg);
        margin-bottom: 6px;
        transition: color var(--dur-base) var(--ease-out);
      }

      .body {
        font-size: 11px;
        color: var(--fg-2);
        line-height: 1.75;
        transition: color var(--dur-base) var(--ease-out);
      }

      .footer {
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--border);
        transition: border-color var(--dur-base) var(--ease-out);
      }

      /* Slot-based footer only visible if slotted content present */
      slot[name="footer"]::slotted(*) {
        display: block;
      }
    `;
  }

  template() {
    const title = this.attr('title');
    const body  = this.attr('body');
    const badge = this.attr('badge');

    return `
      <div class="shell" part="shell">
        <div class="inner">
          <slot name="badge">
            ${badge ? `<div class="badge-wrap"><div class="badge"><span>${badge}</span></div></div>` : ''}
          </slot>
          <slot name="title">
            ${title ? `<div class="title" part="title">${title}</div>` : ''}
          </slot>
          <slot>
            ${body ? `<div class="body" part="body">${body}</div>` : ''}
          </slot>
          <slot name="footer">
          </slot>
        </div>
      </div>
    `;
  }
}

customElements.define('tok-card', TokCard);
