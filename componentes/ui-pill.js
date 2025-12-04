const PILL_STATES = {
  // Guia de estilo ? estados de servicio
  nuevo: { bg: "rgba(14, 165, 233, 0.20)", dot: "#38bdf8", text: "#e0f2fe" },
  aceptado: { bg: "rgba(16, 185, 129, 0.20)", dot: "#22c55e", text: "#d1fae5" },
  finalizado: { bg: "rgba(16, 185, 129, 0.28)", dot: "#16a34a", text: "#d1fae5" },
  cancelado: { bg: "rgba(239, 68, 68, 0.28)", dot: "#ef4444", text: "#fecdd3" },
  citado: { bg: "rgba(245, 158, 11, 0.22)", dot: "#f59e0b", text: "#fde68a" },
  oficina: { bg: "rgba(99, 102, 241, 0.22)", dot: "#818cf8", text: "#e0e7ff" },
  cobro: { bg: "rgba(168, 85, 247, 0.20)", dot: "#a855f7", text: "#f3e8ff" },
  moroso: { bg: "rgba(220, 38, 38, 0.35)", dot: "#dc2626", text: "#fecdd3" },
  garantia: { bg: "rgba(6, 182, 212, 0.22)", dot: "#06b6d4", text: "#cffafe" },

  // Estados custom usados nas telas
  estudio: { bg: "rgba(14, 165, 233, 0.20)", dot: "#38bdf8", text: "#e0f2fe" },
  curso: { bg: "rgba(16, 185, 129, 0.20)", dot: "#22c55e", text: "#d1fae5" },
  parado: { bg: "rgba(245, 158, 11, 0.22)", dot: "#f59e0b", text: "#fde68a" },
  facturado: { bg: "rgba(168, 85, 247, 0.20)", dot: "#a855f7", text: "#f3e8ff" },
  cerrado: { bg: "rgba(148, 163, 184, 0.25)", dot: "#94a3b8", text: "#e5e7eb" },

  // Estados de t?cnico (guia)
  operando: { bg: "rgba(16, 185, 129, 0.20)", dot: "#22c55e", text: "#d1fae5" },
  receso: { bg: "rgba(245, 158, 11, 0.20)", dot: "#f59e0b", text: "#fde68a" },
  vacaciones: { bg: "rgba(59, 130, 246, 0.20)", dot: "#3b82f6", text: "#bfdbfe" },
  ausente: { bg: "rgba(220, 38, 38, 0.35)", dot: "#dc2626", text: "#fecdd3" },
  baja: { bg: "rgba(139, 92, 246, 0.20)", dot: "#8b5cf6", text: "#e9d5ff" },
  neutral: { bg: "rgba(156, 163, 175, 0.20)", dot: "#9ca3af", text: "#e5e7eb" },
  "sin-fichar": { bg: "rgba(148, 163, 184, 0.20)", dot: "#94a3b8", text: "#e5e7eb" },
  sin_fichar: { bg: "rgba(148, 163, 184, 0.20)", dot: "#94a3b8", text: "#e5e7eb" },
  terminado: { bg: "rgba(16, 185, 129, 0.28)", dot: "#16a34a", text: "#d1fae5" },
  "baja-medica": { bg: "rgba(139, 92, 246, 0.20)", dot: "#8b5cf6", text: "#e9d5ff" },
  baja_medica: { bg: "rgba(139, 92, 246, 0.20)", dot: "#8b5cf6", text: "#e9d5ff" },
};

class UIPill extends HTMLElement {
  static get observedAttributes() {
    return ["state", "label"];
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
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: var(--pill-bg, rgba(156, 163, 175, 0.20));
          color: var(--pill-text, #e5e7eb);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: var(--pill-dot, #9ca3af);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
        }
      </style>
      <div class="pill">
        <span class="dot"></span>
        <span class="label"><slot></slot></span>
      </div>
    `;
  }

  connectedCallback() {
    this._sync();
  }

  attributeChangedCallback() {
    this._sync();
  }

  _sync() {
    const stateKey = (this.getAttribute("state") || "neutral").toLowerCase();
    const { bg, dot, text } = PILL_STATES[stateKey] || PILL_STATES.neutral;
    this.style.setProperty("--pill-bg", bg);
    this.style.setProperty("--pill-dot", dot);
    this.style.setProperty("--pill-text", text);

    const labelAttr = this.getAttribute("label");
    const label = labelAttr || this.textContent || stateKey.toUpperCase();
    const labelEl = this.shadowRoot.querySelector(".label");
    if (labelEl) {
      labelEl.textContent = label;
    }
  }
}

customElements.define("ui-pill", UIPill);
