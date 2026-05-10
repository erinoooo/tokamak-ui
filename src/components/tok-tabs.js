/**
 * tokamak-ui · tok-tabs
 *
 * Parallelogram tab strip.
 *
 * Attributes:
 *   tabs   — comma-separated list of tab labels (changes rebuild the strip)
 *   active — initially active label (defaults to first tab)
 *
 * Properties:
 *   .active — get/set active tab (patches state, no re-render)
 *
 * Events:
 *   tok-change — { tab, index } on switch. Bubbles, composed.
 */

import { TokamakElement, esc } from '../utils.js';

export class TokTabs extends TokamakElement {
  static observedAttributes = ['tabs', 'active'];

  get active() {
    return this.attr('active') || this._tabs()[0] || '';
  }

  set active(v) {
    if (v == null) this.removeAttribute('active');
    else           this.setAttribute('active', v);
  }

  _tabs() {
    return this.attr('tabs').split(',').map(s => s.trim()).filter(Boolean);
  }

  styles() {
    return `
      :host { display: block; }

      .strip {
        display: flex;
        border-bottom: 1.5px solid var(--tok-border);
        transition: border-color var(--tok-dur-base) var(--tok-ease-out);
      }

      button {
        padding: 10px 20px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--tok-fg-2);
        cursor: pointer;
        border: none;
        background: none;
        font-family: 'JetBrains Mono', monospace;
        border-bottom: 2px solid transparent;
        margin-bottom: -1.5px;
        transform: skewX(var(--tok-skew));
        transition:
          color var(--tok-dur-fast) var(--tok-ease-out),
          border-color var(--tok-dur-fast) var(--tok-ease-out);
        outline: none;
      }

      button:hover { color: var(--tok-fg); }
      button:focus-visible {
        outline: 2px solid var(--tok-fg);
        outline-offset: -2px;
      }

      button.active {
        color: var(--tok-fg);
        border-bottom-color: var(--tok-fg);
      }

      button .inner {
        display: inline-block;
        transform: skewX(calc(var(--tok-skew) * -1));
      }
    `;
  }

  template() {
    const tabs   = this._tabs();
    const active = this.attr('active') || tabs[0] || '';
    return `<div class="strip" part="strip" role="tablist">${
      tabs.map((t, i) => {
        const isActive = t === active;
        return `<button
          role="tab"
          data-label="${esc(t)}"
          data-index="${i}"
          class="${isActive ? 'active' : ''}"
          part="tab${isActive ? ' tab-active' : ''}"
          aria-selected="${isActive}"
          tabindex="${isActive ? '0' : '-1'}"
        ><span class="inner">${esc(t)}</span></button>`;
      }).join('')
    }</div>`;
  }

  hydrate() {
    this.$('.strip').addEventListener('click', (e) => {
      const btn = e.target.closest('button[role="tab"]');
      if (!btn) return;
      const label = btn.dataset.label;
      const index = parseInt(btn.dataset.index, 10);
      if (label === this.active) return;
      this.setAttribute('active', label);
      this.emit('change', { tab: label, index });
    });

    this.$('.strip').addEventListener('keydown', (e) => {
      const focused = this.shadowRoot.activeElement;
      if (!focused || focused.getAttribute('role') !== 'tab') return;
      const all = this.$$('button[role="tab"]');
      const i = all.indexOf(focused);
      if (e.key === 'ArrowRight' && i < all.length - 1) { all[i + 1].focus(); e.preventDefault(); }
      if (e.key === 'ArrowLeft'  && i > 0)              { all[i - 1].focus(); e.preventDefault(); }
      if (e.key === 'Home') { all[0].focus(); e.preventDefault(); }
      if (e.key === 'End')  { all[all.length - 1].focus(); e.preventDefault(); }
    });
  }

  update(name, _old, newVal) {
    if (name === 'active') {
      // Patch visual state only — no re-render
      const target = newVal || this._tabs()[0];
      this.$$('button[role="tab"]').forEach(btn => {
        const isActive = btn.dataset.label === target;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      return;
    }
    if (name === 'tabs') {
      // Tab labels changed — rebuild strip and re-hydrate listeners
      this._render();
      this.hydrate();
    }
  }
}

customElements.define('tok-tabs', TokTabs);
