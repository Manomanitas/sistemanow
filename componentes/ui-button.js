class UIButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "fullwidth", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          font-family: system-ui, -apple-system, "SF Pro Text", sans-serif;
        }
        button {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          width: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.01em;
          line-height: 1.1;
          transition: transform 120ms ease, background-color 160ms ease, border-color 160ms ease, color 160ms ease;
          border: 1px solid transparent;
          color: #ffffff;
          background: linear-gradient(90deg, #475569, #1c2539);
        }
        button:hover:not(:disabled) { background: linear-gradient(90deg, #0ea4e971, #22c55e71); }
        button:active:not(:disabled) { transform: translateY(1px); }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #e5e7eb;
        }
        .btn-secondary:hover:not(:disabled) {
          background: linear-gradient(90deg, #0ea4e971, #22c55e71);
        }
        .btn-ghost {
          background: transparent;
          border-color: linear-gradient(90deg, #0ea4e971, #22c55e71);
          color: #e5e7eb;
        }
        .btn-ghost:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
        }
        .btn-success {
          background: #22c55e;
          border-color: #16a34a;
          color: #0b2a13;
        }
        .btn-success:hover:not(:disabled) {
          background: #16a34a;
          color: #06210e;
        }
        :host([fullwidth]) {
          display: block;
        }
        :host([fullwidth]) button {
          width: 100%;
        }
      </style>
      <button part="button" class="btn-primary">
        <slot></slot>
      </button>
    `;
    this._button = this.shadowRoot.querySelector("button");
  }

  connectedCallback() {
    this._upgradeProperty("disabled");
    this._upgradeProperty("variant");
    this._upgradeProperty("fullwidth");
    this._sync();
  }

  attributeChangedCallback() {
    this._sync();
  }

  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _sync() {
    const variant = (this.getAttribute("variant") || "primary").toLowerCase();
    this._button.className = `btn-${variant}`;
    this._button.disabled = this.disabled;
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute("disabled");
    } else {
      this.setAttribute("disabled", "");
    }
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }
}

customElements.define("ui-button", UIButton);
