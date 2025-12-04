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

let currentDate = new Date();

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
 * Constrói o calendário por semanas (segunda a domingo),
 * com coluna "Semana XX" + badges de estados.
 */
function buildCalendar(date) {
  if (!calendarGrid) return;

  calendarGrid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  if (calendarMonthEl) calendarMonthEl.textContent = MONTHS_ES[month];
  if (calendarYearEl) calendarYearEl.textContent = year.toString();

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

  // Espaço para a coluna "Semana XX"
  const emptyHead = document.createElement("div");
  headerRow.appendChild(emptyHead);

  weekDays.forEach((d) => {
    const el = document.createElement("div");
    el.className = "calendar-dayname";
    el.textContent = d;
    headerRow.appendChild(el);
  });

  calendarGrid.appendChild(headerRow);

  // Mock de estados só para exemplo visual
  const mockStates = {
    3: ["operando"],
    4: ["operando"],
    5: ["operando"],
    6: ["receso"],
    7: ["operando"],
    10: ["vacaciones"],
    11: ["vacaciones"],
    15: ["ausente"],
    20: ["baja"],
    22: ["operando", "receso"],
  };

  let current = new Date(startDate);

  // Máximo 6 semanas exibidas
  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const weekRow = document.createElement("div");
    weekRow.className = "calendar-week-row";

    // Label da semana (ISO)
    const label = document.createElement("div");
    label.className = "calendar-week-label";

    const isoWeek = getISOWeek(current);
    label.textContent = `Semana ${isoWeek}`;

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

      const badgesWrap = document.createElement("div");
      badgesWrap.className = "calendar-badges";

      if (current.getMonth() === month) {
        const dayOfMonth = current.getDate();
        const statesForDay = mockStates[dayOfMonth] || [];

        statesForDay.forEach((st) => {
          const badge = document.createElement("span");
          badge.classList.add("badge-state");

          switch (st) {
            case "operando":
              badge.classList.add("badge-operando");
              badge.textContent = "OP";
              break;
            case "vacaciones":
              badge.classList.add("badge-vacaciones");
              badge.textContent = "VA";
              break;
            case "ausente":
              badge.classList.add("badge-ausente");
              badge.textContent = "AU";
              break;
            case "baja":
              badge.classList.add("badge-baja");
              badge.textContent = "BM";
              break;
            case "receso":
              badge.classList.add("badge-receso");
              badge.textContent = "RC";
              break;
            default:
              break;
          }

          badgesWrap.appendChild(badge);
        });
      }

      cell.appendChild(badgesWrap);
      weekRow.appendChild(cell);

      // próximo dia
      current.setDate(current.getDate() + 1);
    }

    // Se a semana não tem nenhum dia do mês (só restos antes/depois) e já passámos algumas, paramos
    if (!weekHasMonthDay && weekIndex > 3) break;

    calendarGrid.appendChild(weekRow);
  }
}

// Navegação de mês
if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    buildCalendar(currentDate);
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
