// Navbar colapsável + navegação + label dinâmico no mobile
(function () {
  const shell = document.getElementById("navShell");
  const toggle = document.getElementById("navToggle");
  const items = document.querySelectorAll(".nav-item[data-link]");
  const homeBtn = document.querySelector(".nav-home");
  const labels = document.querySelectorAll(".nav-label");
  const userName =
    (document.querySelector(".nav-user-name")?.textContent || "").trim();

  if (!shell || !toggle) return;

  // Memoriza label original
  labels.forEach((label) => {
    if (!label.dataset.original) {
      label.dataset.original = label.textContent.trim();
    }
  });

  function updateMobileActiveLabel(activeItem) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    labels.forEach((label) => {
      const original = label.dataset.original || "";
      label.textContent = isMobile ? "" : original;
    });
  }

  // Começa fechada
  shell.classList.remove("open");

  toggle.addEventListener("click", () => {
    shell.classList.toggle("open");
  });

  function setActive(item) {
    items.forEach((el) => el.classList.remove("is-active"));
    if (item) item.classList.add("is-active");
    updateMobileActiveLabel(item);
  }

  // Clique nos itens: navega
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const link = item.getAttribute("data-link");
      if (link) {
        window.location.href = link;
      }
    });
  });

  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "../index.html";
      }
    });
  }

  // Marca item ativo pela URL atual
  const currentPath = window.location.pathname;

  let matched = false;
  items.forEach((item) => {
    const link = item.getAttribute("data-link");
    if (!link) return;

    const linkLastPart = link.split("/").pop();
    if (currentPath.endsWith(linkLastPart)) {
      setActive(item);
      matched = true;
    }
  });

  // Fallback: primeiro item ativo
  if (!matched && items.length) {
    setActive(items[0]);
  } else {
    updateMobileActiveLabel(shell.querySelector(".nav-item.is-active"));
  }
})();
