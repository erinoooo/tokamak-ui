/**
 * tokamak-ui · tok-card
 *
 * Surface container with a parallelogram border shell.
 *
 * Attributes:
 *   title  — heading text
 *   body   — body text
 *   badge  — badge label above title
 *
 * Slots:
 *   (default) — body content (overrides `body` attribute)
 *   title     — custom title element (overrides `title` attribute)
 *   badge     — custom badge element (overrides `badge` attribute)
 *   footer    — bottom footer area
 */

import { TokamakElement, esc } from '../utils.js';

export class TokCard extends TokamakElement {
  static observedAttributes = ['title', 'body', 'badge'];

  styles() {
    return `
      :host { display: block; }

      .shell {
        position: relative;
        padding: 24px;
        min-height: 60px;
      }

      .shell::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--tok-bg-2);
        border: 1px solid var(--tok-border);
        transform: skewX(var(--tok-skew));
        transition:
          border-color var(--tok-dur-fast) var(--tok-ease-out),
          background   var(--tok-dur-base) var(--tok-ease-out);
        z-index: 0;
      }

      :host(:hover) .shell::before {
        border-color: var(--tok-border-hi);
      }

      .inner {
        position: relative;
        z-index: 1;
      }

      .badge-wrap { margin-bottom: 8px; }
      .badge-wrap:empty { display: none; }

      .badge-fallback {
        display: inline-flex;
        align-items: center;
        padding: 0 8px;
        height: 17px;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        background: var(--tok-fg);
        color: var(--tok-bg);
        transform: skewX(var(--tok-skew));
      }
      .badge-fallback span {
        display: inline-block;
        transform: skewX(calc(var(--tok-skew) * -1));
      }

      .title-fallback {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--tok-fg);
        margin-bottom: 6px;
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }
      .title-fallback:empty { display: none; }

      .body-fallback {
        font-size: 11px;
        color: var(--tok-fg-2);
        line-height: 1.75;
        transition: color var(--tok-dur-base) var(--tok-ease-out);
      }
      .body-fallback:empty { display: none; }

      .footer {
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--tok-border);
        transition: border-color var(--tok-dur-base) var(--tok-ease-out);
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
            <div class="badge-wrap">${badge ? `<div class="badge-fallback"><span>${esc(badge)}</span></div>` : ''}</div>
          </slot>
          <slot name="title">
            <div class="title-fallback" part="title">${esc(title)}</div>
          </slot>
          <slot>
            <div class="body-fallback" part="body">${esc(body)}</div>
          </slot>
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  update(name) {
    if (name === 'title') {
      const el = this.$('.title-fallback');
      if (el) el.textContent = this.attr('title');
      return;
    }
    if (name === 'body') {
      const el = this.$('.body-fallback');
      if (el) el.textContent = this.attr('body');
      return;
    }
    if (name === 'badge') {
      const wrap = this.$('.badge-wrap');
      if (!wrap) return;
      const v = this.attr('badge');
      wrap.innerHTML = v ? `<div class="badge-fallback"><span></span></div>` : '';
      if (v) wrap.querySelector('span').textContent = v;
    }
  }
}

customElements.define('tok-card', TokCard);
