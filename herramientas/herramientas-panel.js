document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchHerr");
  const selectEstado = document.getElementById("filterEstado");
  const selectUbicacion = document.getElementById("filterUbicacion");
  const quickPills = document.querySelectorAll("[data-filter-quick]");
  const rows = Array.from(document.querySelectorAll(".tool-row"));

  const countLabel = document.getElementById("toolsCountVisible");
  const footerInfo = document.getElementById("toolsFooterInfo");
  const pageIndicator = document.getElementById("toolsPageIndicator");
  const btnPrev = document.getElementById("toolsPrevPage");
  const btnNext = document.getElementById("toolsNextPage");

  const PAGE_SIZE = 7;
  let filteredRows = [...rows];
  let currentPage = 1;
  let estadoQuick = "todas"; // usado pelos pills

  function normalizar(str) {
    return (str || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function esIncidencia(state) {
    return (
      state === "por-recibir" ||
      state === "indisponible" ||
      state === "devolucion" ||
      state === "solicitada"
    );
  }

  function aplicarFiltros() {
    const texto = normalizar(searchInput?.value || "");
    const valorEstadoSelect = selectEstado?.value || "todos";
    const ubicSel = selectUbicacion?.value || "todas";

    filteredRows = rows.filter((row) => {
      const dataText = normalizar(row.dataset.text || "");
      const state = row.dataset.state || "";
      const ubic = row.dataset.ubicacion || "";

      // Texto
      const okTexto = !texto || dataText.includes(texto);

      // Estado – combinando select + quick pill
      let okEstado = true;

      // Lógica de incidencias
      const filtroIncidencias =
        estadoQuick === "incidencias" || valorEstadoSelect === "incidencias";

      if (filtroIncidencias) {
        okEstado = esIncidencia(state);
      } else {
        const estadoFiltro =
          valorEstadoSelect !== "todos" ? valorEstadoSelect : estadoQuick;

        if (estadoFiltro && estadoFiltro !== "todas") {
          okEstado = state === estadoFiltro;
        } else {
          okEstado = true;
        }
      }

      // Ubicación
      let okUbic = true;
      if (ubicSel !== "todas") {
        okUbic = ubic === ubicSel;
      }

      return okTexto && okEstado && okUbic;
    });

    currentPage = 1;
    aplicarPaginacion();
  }

  function aplicarPaginacion() {
    const total = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    // Esconde todas
    rows.forEach((row) => {
      row.style.display = "none";
    });

    // Mostra somente as da página atual
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    filteredRows.slice(start, end).forEach((row) => {
      row.style.display = "";
    });

    // Atualiza textos
    if (countLabel) {
      const mostradas = Math.min(PAGE_SIZE, total === 0 ? 0 : total - start);
      countLabel.textContent = `Mostrando ${mostradas} de ${total} herramienta${
        total === 1 ? "" : "s"
      }`;
    }

    if (footerInfo) {
      footerInfo.textContent = `Mostrando ${
        total === 0 ? 0 : Math.min(PAGE_SIZE, total - start)
      } de ${total} herramientas — Página ${currentPage} / ${totalPages}`;
    }

    if (pageIndicator) {
      pageIndicator.textContent = `Página ${currentPage} / ${totalPages}`;
    }

    // Botões
    if (btnPrev) btnPrev.disabled = currentPage <= 1 || total === 0;
    if (btnNext) btnNext.disabled = currentPage >= totalPages || total === 0;
  }

  // Eventos de paginação
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        aplicarPaginacion();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      const totalPages = Math.max(
        1,
        Math.ceil(filteredRows.length / PAGE_SIZE)
      );
      if (currentPage < totalPages) {
        currentPage++;
        aplicarPaginacion();
      }
    });
  }

  // Eventos texto / selects
  if (searchInput) {
    searchInput.addEventListener("input", aplicarFiltros);
  }

  if (selectUbicacion) {
    selectUbicacion.addEventListener("change", aplicarFiltros);
  }

  if (selectEstado) {
    selectEstado.addEventListener("change", () => {
      // Quando mexe no select, resetamos o quick para "todas"
      estadoQuick = "todas";
      quickPills.forEach((p) => p.classList.remove("is-active"));
      const pillTodas = document.querySelector('[data-filter-quick="todas"]');
      if (pillTodas) pillTodas.classList.add("is-active");

      // Se quisermos um modo incidencias via select – opcional
      if (selectEstado.value === "incidencias") {
        estadoQuick = "incidencias";
      }

      aplicarFiltros();
    });
  }

  // Pills rápidas
  quickPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      quickPills.forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");

      const filtro = pill.getAttribute("data-filter-quick") || "todas";
      estadoQuick = filtro;

      // Ao clicar numa pill, voltamos o select para "todos"
      if (selectEstado) {
        selectEstado.value = "todos";
      }

      aplicarFiltros();
    });
  });

  // Botão voltar
  const backBtn = document.getElementById("navBackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      }
    });
  }

  // Inicialização
  aplicarFiltros();
});
