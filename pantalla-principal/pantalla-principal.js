// Nomes dos meses em espanhol
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

// Elementos do header
const heroNombre = document.getElementById("heroNombre");
const heroEstado = document.getElementById("heroEstado");
const heroFecha = document.getElementById("heroFecha");

// Elementos do calendário
const calendarMonthEl = document.getElementById("calendarMonth");
const calendarYearEl = document.getElementById("calendarYear");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

/* NOVO: selects de mês e ano */
const monthSelector = document.getElementById("monthSelector");
const yearSelector = document.getElementById("yearSelector");

let currentDate = new Date();

/* NOVO: elemento global de tooltip */
let avatarTooltipEl = null;

/* NOVO: mock de trabalhadores por dia (só para visual) */
const mockWorkers = {
  3: [
    { iniciales: "GH", nombre: "Guilherme Henrique", estado: "operando" },
    { iniciales: "JM", nombre: "Juan Martín", estado: "ausente" },
  ],
  4: [
    { iniciales: "EA", nombre: "Eduardo Augusto", estado: "operando" },
  ],
  5: [
    { iniciales: "CO", nombre: "Carlos Ortega", estado: "receso" },
    { iniciales: "FS", nombre: "Fabio Silva", estado: "operando" },
    { iniciales: "GD", nombre: "Gonzalo Díaz", estado: "vacaciones" },
  ],
  10: [
    { iniciales: "ZZ", nombre: "ZZPrueba", estado: "vacaciones" },
  ],
  15: [
    { iniciales: "EG", nombre: "Enéias Gabriel", estado: "ausente" },
  ],
  20: [
    { iniciales: "MB", nombre: "María Beltrán", estado: "baja" },
  ],
  22: [
    { iniciales: "MF", nombre: "Maicon Fernando", estado: "operando" },
    { iniciales: "LR", nombre: "Luis Ramos", estado: "receso" },
  ],
};


/**
 * Lê dados da URL (?user=&estado=) e preenche o header
 */
(function initHeaderFromURL() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");
  const estado = params.get("estado");

  if (user && heroNombre) {
    heroNombre.textContent = user.toUpperCase();
  }

  if (estado && heroEstado) {
    heroEstado.textContent = estado.toUpperCase().replace("_", " ");
  }

  const hoy = new Date();
  const dia = hoy.getDate().toString().padStart(2, "0");
  const mesNombre = MONTHS_ES[hoy.getMonth()];
  const textoFecha = `${dia} de ${mesNombre}`;
  if (heroFecha) heroFecha.textContent = textoFecha;
})();

/**
 * Calcula número da semana ISO
 */
function getISOWeek(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday in current week decides the year
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}
/**
 * Converte estado em label legível
 */
function formatEstadoLabel(estado) {
  switch (estado) {
    case "operando":
      return "Operando";
    case "vacaciones":
      return "Vacaciones";
    case "ausente":
      return "Ausente";
    case "receso":
      return "Receso";
    case "baja":
      return "Baja médica";
    default:
      return estado;
  }
}

/**
 * Mostra tooltip perto do avatar
 */
function showAvatarTooltip(worker, target) {
  hideAvatarTooltip();

  avatarTooltipEl = document.createElement("div");
  avatarTooltipEl.className = "avatar-tooltip";
  avatarTooltipEl.innerHTML = `
    <div><strong>${worker.nombre}</strong></div>
    <div>${formatEstadoLabel(worker.estado)}</div>
  `;

  document.body.appendChild(avatarTooltipEl);

  const rect = target.getBoundingClientRect();
  const tipRect = avatarTooltipEl.getBoundingClientRect();

  const top = rect.top + window.scrollY - tipRect.height - 8;
  const left = rect.left + window.scrollX;

  avatarTooltipEl.style.top = `${top}px`;
  avatarTooltipEl.style.left = `${left}px`;
  avatarTooltipEl.style.display = "block";
}

/**
 * Esconde tooltip
 */
function hideAvatarTooltip() {
  if (avatarTooltipEl) {
    avatarTooltipEl.remove();
    avatarTooltipEl = null;
  }
}

/**
 * Constrói o calendário por semanas (segunda a domingo),
 * com coluna "Semana XX" + badges de estados.
 */
function buildCalendar(date) {
  if (!calendarGrid) return;

  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  /* mantém o texto do mês/ano no header */
  if (calendarMonthEl) calendarMonthEl.textContent = MONTHS_ES[month];
  if (calendarYearEl) calendarYearEl.textContent = year.toString();

  /* sincroniza selects com currentDate */
  if (monthSelector) monthSelector.value = month;
  if (yearSelector) yearSelector.value = year;

  // Primeiro e último dia do mês
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Dia da semana JS (0=domingo ... 6=sábado) -> offset para começar em segunda (0=segunda)
  const jsWeekday = firstDay.getDay();
  const startOffset = (jsWeekday + 6) % 7; // 0=segunda

  // Data inicial: segunda da semana que contém o dia 1
  const startDate = new Date(year, month, 1 - startOffset);

  // Cabeçalho: nomes dos dias (L a D)
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const headerRow = document.createElement("div");
  headerRow.className = "calendar-daynames-row";

  // Espaço para a coluna "W/XX"
  const emptyHead = document.createElement("div");
  headerRow.appendChild(emptyHead);

  weekDays.forEach((d) => {
    const el = document.createElement("div");
    el.className = "calendar-dayname";
    el.textContent = d;
    headerRow.appendChild(el);
  });

  calendarGrid.appendChild(headerRow);

  let current = new Date(startDate);

  // Máximo 6 semanas exibidas
  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const weekRow = document.createElement("div");
    weekRow.className = "calendar-week-row";
    // Label da semana (ISO)
    const label = document.createElement("div");
    label.className = "calendar-week-label";

    const isoWeek = getISOWeek(current);

    // Só o texto W/44
    label.innerHTML = `W/<strong>${isoWeek}</strong>`;

    // tooltip com intervalo da semana
    const monday = new Date(current);
    const sunday = new Date(current);
    sunday.setDate(sunday.getDate() + 6);
    label.title = `Del ${monday.getDate()} ${
      MONTHS_ES[monday.getMonth()]
    } al ${sunday.getDate()} ${MONTHS_ES[sunday.getMonth()]}`;

    weekRow.appendChild(label);


    // 7 dias: L a D
    let weekHasMonthDay = false;

    for (let i = 0; i < 7; i++) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";

      if (current.getMonth() !== month) {
        cell.classList.add("calendar-cell-muted");
      } else {
        weekHasMonthDay = true;
      }

      const number = document.createElement("div");
      number.className = "calendar-day-number";
      number.textContent = current.getDate().toString();
      cell.appendChild(number);

      // NOVO: ícones de trabalhadores
      const iconsWrap = document.createElement("div");
      iconsWrap.className = "calendar-worker-icons";

      if (current.getMonth() === month) {
        const dayOfMonth = current.getDate();
        const workersForDay = mockWorkers[dayOfMonth] || [];

        workersForDay.forEach((w) => {
          const avatar = document.createElement("div");
          avatar.className = "calendar-avatar";
          avatar.textContent = w.iniciales;

          // dot de estado reaproveitando as classes da legenda
          const dot = document.createElement("span");
          dot.classList.add("legend-dot");

          switch (w.estado) {
            case "operando":
              dot.classList.add("legend-operando");
              break;
            case "vacaciones":
              dot.classList.add("legend-vacaciones");
              break;
            case "ausente":
              dot.classList.add("legend-ausente");
              break;
            case "receso":
              dot.classList.add("legend-receso");
              break;
            case "baja":
              dot.classList.add("legend-baja");
              break;
            default:
              break;
          }

          dot.style.position = "absolute";
          dot.style.bottom = "-2px";
          dot.style.right = "-2px";
          dot.style.border = "2px solid #020617";

          avatar.appendChild(dot);

          // tooltip
          avatar.addEventListener("mouseenter", () =>
            showAvatarTooltip(w, avatar)
          );
          avatar.addEventListener("mouseleave", () => hideAvatarTooltip());

          iconsWrap.appendChild(avatar);
        });
      }

      cell.appendChild(iconsWrap);
      weekRow.appendChild(cell);

      // próximo dia
      current.setDate(current.getDate() + 1);
    }
    // Botão "Ampliar semana" embaixo da linha de dias
    const expandCell = document.createElement("div");
    expandCell.className = "calendar-week-expand-cell";

    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "calendar-week-expand-btn";
    expandBtn.textContent = "Ampliar semana";

    expandBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      console.log("Ampliar semana", isoWeek);
      // aqui no futuro você abre a vista detalhada dessa semana
    });

    expandCell.appendChild(expandBtn);
    weekRow.appendChild(expandCell);

    // Se a semana não tem nenhum dia do mês (só restos antes/depois) e já passámos algumas, paramos
    if (!weekHasMonthDay && weekIndex > 3) break;

    calendarGrid.appendChild(weekRow);
  }
}

const btnHerramientas = document.getElementById("btnHerramientas");

if (btnHerramientas) {
  btnHerramientas.addEventListener("click", () => {
    window.location.href = "../herramientas/herramientas-panel.html";
  });
}

const btnCrearObra = document.getElementById("btnCrearObra");

if (btnCrearObra) {
  btnCrearObra.addEventListener("click", () => {
    window.location.href = "../calendario-obras/calendario-obras.html";
  });
}
// Navegação de mês
if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    buildCalendar(currentDate);
  });
}
// Select de mês
if (monthSelector) {
  monthSelector.innerHTML = "";
  MONTHS_ES.forEach((mes, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = mes.toUpperCase();
    monthSelector.appendChild(opt);
  });

  monthSelector.addEventListener("change", () => {
    const novoMes = parseInt(monthSelector.value, 10);
    if (!isNaN(novoMes)) {
      currentDate.setMonth(novoMes);
      buildCalendar(currentDate);
    }
  });
}

// Select de ano
if (yearSelector) {
  yearSelector.innerHTML = "";
  const anoAtual = new Date().getFullYear();
  for (let ano = anoAtual - 5; ano <= anoAtual + 5; ano++) {
    const opt = document.createElement("option");
    opt.value = ano;
    opt.textContent = ano.toString();
    yearSelector.appendChild(opt);
  }

  yearSelector.addEventListener("change", () => {
    const novoAno = parseInt(yearSelector.value, 10);
    if (!isNaN(novoAno)) {
      currentDate.setFullYear(novoAno);
      buildCalendar(currentDate);
    }
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    buildCalendar(currentDate);
  });
}

// Inicializa calendário na data atual
buildCalendar(currentDate);
