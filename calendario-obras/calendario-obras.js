// =======================================
// CALENDARIO DE OBRAS · JS COMPLETO
// =======================================

// Meses em espanhol
const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Referências de elementos principais
const yearSelect = document.getElementById("yearSelect");
const monthSelect = document.getElementById("monthSelect");

const calendarGrid = document.getElementById("obrasCalendarGrid");

let currentDate = new Date();

// ==========================
// MOCK DE OBRAS POR DIA
// (substituir depois por dados reais)
// ==========================
const mockObras = {
  "2025-11-02": [
    { titulo: "Avisos terminados", estado: "en-curso" },
    { titulo: "Avisos facturados", estado: "facturada" },
  ],
  "2025-11-03": [{ titulo: "Obra en cobro", estado: "en-cobro" }],
  "2025-11-06": [
    { titulo: "Avisos activos", estado: "en-curso" },
    { titulo: "Avisos terminados", estado: "en-curso" },
  ],
  "2025-11-13": [
    { titulo: "Avisos en garantía", estado: "garantia" },
    { titulo: "Avisos cancelados", estado: "cancelada" },
  ],
  "2025-11-24": [{ titulo: "Obra presupuestada", estado: "programada" }],
  "2025-11-27": [{ titulo: "5 avisos activos", estado: "en-curso" }],
};

// ==========================
// SELECTORES DE AÑO / MES
// ==========================
function initSelectors() {
  if (!yearSelect || !monthSelect) return;

  const yearNow = currentDate.getFullYear();

  // Años (5 antes, 5 depois)
  for (let y = yearNow - 5; y <= yearNow + 5; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y.toString();
    if (y === yearNow) opt.selected = true;
    yearSelect.appendChild(opt);
  }

  // Meses
  MONTHS_ES.forEach((mes, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = mes;
    if (index === currentDate.getMonth()) opt.selected = true;
    monthSelect.appendChild(opt);
  });
}

// ==========================
// CONSTRUÇÃO DO CALENDÁRIO
// ==========================
function buildCalendar(date) {
  if (!calendarGrid) return;

  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  // Primeiro dia do mês
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay(); // 0=Domingo ... 6=Sábado

  // Dias no mês atual
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Último dia do mês anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const totalCells = 42; // 6 semanas x 7 dias

  const today = new Date();
  const isSameMonth =
    today.getFullYear() === year && today.getMonth() === month;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "obras-day-cell";

    const dayNumberEl = document.createElement("div");
    dayNumberEl.className = "obras-day-number";

    let dayNumber;
    let cellMonth = month;
    let cellYear = year;
    let isMuted = false;

    if (i < firstWeekday) {
      // Dias do mês anterior
      dayNumber = prevMonthLastDay - (firstWeekday - 1 - i);
      cellMonth = month - 1;
      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear = year - 1;
      }
      isMuted = true;
    } else if (i >= firstWeekday + daysInMonth) {
      // Dias do mês seguinte
      dayNumber = i - (firstWeekday + daysInMonth) + 1;
      cellMonth = month + 1;
      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear = year + 1;
      }
      isMuted = true;
    } else {
      // Dias do mês atual
      dayNumber = i - firstWeekday + 1;
    }

    dayNumberEl.textContent = dayNumber.toString();
    cell.appendChild(dayNumberEl);

    if (isMuted) {
      cell.classList.add("obras-day-cell-muted");
    }

    // Destacar "Hoje"
    if (
      isSameMonth &&
      !isMuted &&
      dayNumber === today.getDate() &&
      cellYear === today.getFullYear()
    ) {
      cell.classList.add("obras-day-today");
    }

    // Lista de obras do dia
    const obrasListEl = document.createElement("div");
    obrasListEl.className = "obras-day-list";

    const key = `${cellYear}-${String(cellMonth + 1).padStart(2, "0")}-${String(
      dayNumber
    ).padStart(2, "0")}`;

    const obrasDia = mockObras[key] || [];

    obrasDia.forEach((obra) => {
      const item = document.createElement("div");
      item.className = "obras-day-item";

      const block = document.createElement("span");
      block.classList.add("obras-state-block");

      switch (obra.estado) {
        case "programada":
          block.classList.add("obras-state-programada");
          break;
        case "en-curso":
          block.classList.add("obras-state-en-curso");
          break;
        case "en-cobro":
          block.classList.add("obras-state-en-cobro");
          break;
        case "facturada":
          block.classList.add("obras-state-facturada");
          break;
        case "garantia":
          block.classList.add("obras-state-garantia");
          break;
        case "cancelada":
          block.classList.add("obras-state-cancelada");
          break;
        default:
          block.classList.add("obras-state-programada");
      }

      const text = document.createElement("span");
      text.textContent = obra.titulo;

      item.appendChild(block);
      item.appendChild(text);
      obrasListEl.appendChild(item);
    });

    cell.appendChild(obrasListEl);
    calendarGrid.appendChild(cell);
  }
}

// ==========================
// EVENTOS DOS SELECTS / HOY
// ==========================
if (yearSelect && monthSelect) {
  yearSelect.addEventListener("change", () => {
    const y = parseInt(yearSelect.value, 10);
    if (!Number.isNaN(y)) {
      currentDate.setFullYear(y);
      buildCalendar(currentDate);
    }
  });

  monthSelect.addEventListener("change", () => {
    const m = parseInt(monthSelect.value, 10);
    if (!Number.isNaN(m)) {
      currentDate.setMonth(m);
      buildCalendar(currentDate);
    }
  });
}

// ==========================
// INICIALIZAÇÃO
// ==========================
initSelectors();
buildCalendar(currentDate);

// =======================================
// MODAL "CREAR OBRA"
// =======================================

const obraModalBackdrop = document.getElementById("obraModalBackdrop");
const obraModalCloseBtn = document.getElementById("obraModalCloseBtn");
const obraBtnCancelar = document.getElementById("obraBtnCancelar");
const obraBtnCrearSimple = document.getElementById("obraBtnCrearSimple");
const obraBtnCrearConOT = document.getElementById("obraBtnCrearConOT");
const crearBtnSide = document.getElementById("btnCrearObraSide");

let obraCurrentStep = 1;

function setObraStep(step) {
  obraCurrentStep = step;
  const steps = document.querySelectorAll(".obra-step");
  steps.forEach((s) => {
    const sStep = parseInt(s.getAttribute("data-step"), 10);
    s.classList.toggle("obra-step-hidden", sStep !== step);
  });

  const pills = document.querySelectorAll(".obra-step-pill");
  pills.forEach((p) => {
    const pStep = parseInt(p.getAttribute("data-step"), 10);
    p.classList.toggle("obra-step-pill-active", pStep === step);
  });
}

function openObraModal() {
  if (!obraModalBackdrop) return;
  obraModalBackdrop.classList.add("is-open");
  setObraStep(1);
}

function closeObraModal() {
  if (!obraModalBackdrop) return;
  obraModalBackdrop.classList.remove("is-open");
}

// Abrir modal pelo botão lateral "Crear obra"
if (crearBtnSide) {
  crearBtnSide.addEventListener("click", () => {
    openObraModal();
  });
}

// Fechar modal (X e Cancelar)
if (obraModalCloseBtn) {
  obraModalCloseBtn.addEventListener("click", closeObraModal);
}
if (obraBtnCancelar) {
  obraBtnCancelar.addEventListener("click", closeObraModal);
}

// Clique fora do card fecha o modal
if (obraModalBackdrop) {
  obraModalBackdrop.addEventListener("click", (ev) => {
    if (ev.target === obraModalBackdrop) {
      closeObraModal();
    }
  });
}

// Botão "Crear obra" (sem OT) -> redireciona a panel-obras.html
if (obraBtnCrearSimple) {
  obraBtnCrearSimple.addEventListener("click", () => {
    console.log("Crear obra simple (sin OT)...");
    window.location.href = "../panel-obras/panel-obras-basica.html";
  });
}
// Botão "Crear obra y añadir OT/presupuesto"
if (obraBtnCrearConOT) {
  obraBtnCrearConOT.addEventListener("click", () => {
    if (obraCurrentStep === 1) {
      // Primeiro clique → vai para Paso 2
      setObraStep(2);
      const stepEl = document.querySelector('.obra-step[data-step="2"]');
      if (stepEl) stepEl.scrollTop = 0;
    } else {
      // Passo 2 → criar obra + OT
      console.log("Crear obra + OT/presupuesto...");
      window.location.href = "../panel-obras/panel-obras.html";
    }
  });
}

// ===============================================
//  DOCUMENTACIÓN – SUBIDA DE ARCHIVOS (AQUI!!!)
// ===============================================
const obraDocsBtn = document.getElementById("obraDocsBtn");
const obraDocsInput = document.getElementById("obraDocsInput");
const obraDocsList = document.getElementById("obraDocsList");

if (obraDocsBtn && obraDocsInput) {
  obraDocsBtn.addEventListener("click", () => {
    obraDocsInput.click();
  });

  obraDocsInput.addEventListener("change", () => {
    if (!obraDocsList) return;
    obraDocsList.innerHTML = "";

    const files = Array.from(obraDocsInput.files || []);
    files.forEach((file) => {
      const li = document.createElement("li");
      const pill = document.createElement("span");
      pill.className = "obra-doc-pill";
      const sizeKB = Math.round(file.size / 1024);
      pill.textContent = `${file.name} (${sizeKB} KB)`;
      li.appendChild(pill);
      obraDocsList.appendChild(li);
    });
  });
}

