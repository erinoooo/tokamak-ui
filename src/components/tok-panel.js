/**
 * tokamak-ui · tok-panel
 *
 * The signature Tokamak component.
 * A drawer panel with a circular leading edge. A circle of radius 80vh
 * forms the left boundary, clipped to viewport edges by overflow:hidden.
 * The hard cut at the screen boundary is intentional.
 *
 * Attributes:
 *   open  — boolean; presence = panel is open
 *   width — CSS value for panel width (default: "60%")
 *
 * Properties:
 *   .open — get/set open state
 *
 * Methods:
 *   .show()   — open the panel
 *   .hide()   — close the panel
 *   .toggle() — toggle open/closed
 *
 * Events:
 *   tok-open  — fires when panel finishes opening. Bubbles, composed.
 *   tok-close — fires when panel finishes closing. Bubbles, composed.
 *
 * Slots:
 *   (default)  — panel body content
 *   title      — panel heading text
 *   subtitle   — panel description text
 *   actions    — footer action buttons
 *
 * @example
 *   <tok-panel id="settings">
 *     <span slot="title">Settings</span>
 *     <span slot="subtitle">Adjust your configuration.</span>
 *     <tok-field label="Endpoint">
 *       <tok-input placeholder="https://..."></tok-input>
 *     </tok-field>
 *     <div slot="actions">
 *       <tok-button>Save</tok-button>
 *     </div>
 *   </tok-panel>
 *
 *   <script>
 *     document.querySelector('#settings').show();
 *   </script>
 */

import { TokamakElement } from '../utils.js';

export class TokPanel extends TokamakElement {
  static observedAttributes = ['open', 'width'];

  get open() { return this.bool('open'); }
  set open(v) {
    v ? this.setAttribute('open', '') : this.removeAttribute('open');
  }

  show()   { this.open = true;  }
  hide()   { this.open = false; }
  toggle() { this.open = !this.open; }

  styles() {
    const width = this.attr('width', '60%');

    return `
      :host {
        display: contents; /* doesn't add layout to the host itself */
      }

      /* ── Overlay backdrop ── */
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        z-index: 400;
        pointer-events: none;
        transition: background var(--dur-slow) var(--ease-out);
      }

      .overlay.open {
        background: rgba(0, 0, 0, 0.52);
        pointer-events: all;
      }

      /* ── Panel wrapper — clips the circle ── */
      .wrap {
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: ${width};
        overflow: hidden; /* ← this clips the circle at screen edges */
        transform: translateX(100%);
        transition: transform var(--dur-slow) var(--ease-spring);
        will-change: transform;
      }

      .overlay.open .wrap {
        transform: translateX(0);
      }

      /* ── The circle that forms the leading edge ──
         radius = 80vh → diameter = 160vh
         Center at: x = 80vh from panel left, y = 50% (screen center)
         Leftmost point of circle: panel left boundary at screen center.
         Overflows viewport by ~30vh top and bottom — clipped by .wrap.
      ── */
      .circle {
        position: absolute;
        width: 160vh;
        height: 160vh;
        border-radius: 50%;
        background: var(--bg);
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        box-shadow: -4px 0 80px rgba(0, 0, 0, 0.14);
        transition: background var(--dur-base) var(--ease-out);
        pointer-events: none;
      }

      /* ── Scrollable content area ──
         Left padding must clear the circle arc.
         Arc x at screen top/bottom ≈ 80 - √(80²−50²) ≈ 18vh from panel left.
         24vh left padding gives breathing room.
      ── */
      .content {
        position: absolute;
        inset: 0;
        padding: 64px 56px 64px 24vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
      }

      .content::-webkit-scrollbar { width: 3px; }
      .content::-webkit-scrollbar-thumb { background: var(--border); }

      /* ── Close button ── */
      .close-btn {
        position: absolute;
        top: 28px;
        left: 24vh;
        background: none;
        border: none;
        color: var(--fg-2);
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        cursor: pointer;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 6px 0;
        transition: color var(--dur-fast) var(--ease-out);
        z-index: 1;
      }

      .close-btn:hover { color: var(--fg); }

      /* ── Panel header ── */
      .header {
        margin-top: 48px;
        margin-bottom: 28px;
      }

      .title-slot {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--fg);
        display: block;
        margin-bottom: 6px;
        transition: color var(--dur-base) var(--ease-out);
      }

      .subtitle-slot {
        font-size: 12px;
        color: var(--fg-2);
        line-height: 1.8;
        display: block;
        transition: color var(--dur-base) var(--ease-out);
      }

      /* ── Footer actions ── */
      .actions {
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid var(--border);
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        transition: border-color var(--dur-base) var(--ease-out);
      }

      /* Animate panel content in on open */
      .overlay.open .content {
        animation: panelIn var(--dur-slow) var(--ease-spring) 80ms both;
      }

      @keyframes panelIn {
        from { opacity: 0; transform: translateX(24px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
  }

  template() {
    const isOpen = this.bool('open');
    return `
      <div class="overlay ${isOpen ? 'open' : ''}" part="overlay">
        <div class="wrap" part="wrap">
          <div class="circle" part="circle"></div>
          <button class="close-btn" part="close">← close</button>
          <div class="content" part="content">
            <div class="header">
              <span class="title-slot"><slot name="title"></slot></span>
              <span class="subtitle-slot"><slot name="subtitle"></slot></span>
            </div>
            <slot></slot>
            <div class="actions">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  hydrate() {
    // Close on backdrop click
    this.$('.overlay').addEventListener('click', (e) => {
      if (e.target === this.$('.overlay')) this.hide();
    });

    // Close button
    this.$('.close-btn').addEventListener('click', () => this.hide());

    // Escape key
    this._keyHandler = (e) => {
      if (e.key === 'Escape' && this.open) this.hide();
    };
    document.addEventListener('keydown', this._keyHandler);

    // Transition end events
    this.$('.wrap').addEventListener('transitionend', () => {
      if (this.open) this.emit('open');
      else           this.emit('close');
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._keyHandler);
  }

  update(name) {
    if (name === 'open') {
      const overlay = this.$('.overlay');
      if (overlay) overlay.classList.toggle('open', this.bool('open'));
      // Trap/restore focus
      if (this.bool('open')) {
        this._prevFocus = document.activeElement;
        this.$('.close-btn')?.focus();
        document.body.style.overflow = 'hidden';
      } else {
        this._prevFocus?.focus();
        document.body.style.overflow = '';
      }
    } else {
      this._render();
      this.hydrate();
    }
  }
}

customElements.define('tok-panel', TokPanel);
