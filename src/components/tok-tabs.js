/**
 * tokamak-ui · tok-tabs
 *
 * Parallelogram tab strip with an animated active indicator.
 * Tabs are defined either by the `tabs` attribute (comma-separated)
 * or by slotting <tok-tab> children.
 *
 * Attributes:
 *   tabs   — comma-separated list of tab labels  e.g. "Overview,Tokens,API"
 *   active — initially active tab label (defaults to first)
 *
 * Properties:
 *   .active — get/set the currently active tab by label
 *
 * Events:
 *   tok-change — { tab: string, index: number } — fires on tab switch. Bubbles, composed.
 *
 * @example
 *   <tok-tabs tabs="Overview,Tokens,Components" active="Tokens"></tok-tabs>
 */

import { TokamakElement } from '../utils.js';

export class TokTabs extends TokamakElement {
  static observedAttributes = ['tabs', 'active'];

  get active() {
    return this.attr('active') || this._tabs()[0] || '';
  }

  set active(label) {
    this.setAttribute('active', label);
  }

  _tabs() {
    return this.attr('tabs').split(',').map(s => s.trim()).filter(Boolean);
  }

  styles() {
    return `
      :host { display: block; }

      .strip {
        display: flex;
        border-bottom: 1.5px solid var(--border);
        transition: border-color var(--dur-base) var(--ease-out);
        position: relative;
      }

      button {
        position: relative;
        padding: 10px 20px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--fg-2);
        cursor: pointer;
        border: none;
        background: none;
        font-family: 'JetBrains Mono', monospace;
        /* Bottom border sits on top of strip border */
        border-bottom: 2px solid transparent;
        margin-bottom: -1.5px;
        transform: skewX(var(--skew));
        transition:
          color var(--dur-fast) var(--ease-out),
          border-color var(--dur-fast) var(--ease-out),
          background var(--dur-fast) var(--ease-out);
        outline: none;
      }

      button:hover {
        color: var(--fg);
      }

      button:focus-visible {
        outline: 2px solid var(--fg);
        outline-offset: -2px;
      }

      button.active {
        color: var(--fg);
        border-bottom-color: var(--fg);
      }

      button .inner {
        display: inline-block;
        transform: skewX(calc(var(--skew) * -1));
      }
    `;
  }

  template() {
    const tabs   = this._tabs();
    const active = this.active;

    return `
      <div class="strip" part="strip" role="tablist">
        ${tabs.map((t, i) => `
          <button
            role="tab"
            aria-selected="${t === active}"
            data-label="${t}"
            data-index="${i}"
            class="${t === active ? 'active' : ''}"
            part="tab ${t === active ? 'tab-active' : ''}"
            tabindex="${t === active ? '0' : '-1'}"
          ><span class="inner">${t}</span></button>
        `).join('')}
      </div>
    `;
  }

  hydrate() {
    this.$$('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.dataset.label;
        const index = parseInt(btn.dataset.index);
        if (label === this.active) return;

        // Update active without full re-render for smoothness
        this.$$('button').forEach(b => {
          const isActive = b.dataset.label === label;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', String(isActive));
          b.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        this.setAttribute('active', label);
        this.emit('change', { tab: label, index });
      });
    });

    // Arrow key navigation
    this.$$('button').forEach((btn, i, all) => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { all[Math.min(i + 1, all.length - 1)]?.focus(); e.preventDefault(); }
        if (e.key === 'ArrowLeft')  { all[Math.max(i - 1, 0)]?.focus(); e.preventDefault(); }
      });
    });
  }

  // Don't re-render on active change — hydrate already handles it
  update(name) {
    if (name !== 'active') {
      this._render();
      this.hydrate();
    }
  }
}

customElements.define('tok-tabs', TokTabs);
