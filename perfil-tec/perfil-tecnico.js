// Sidebar: expandir / colapsar
const appShell = document.getElementById("appShell");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebarToggle && appShell) {
  sidebarToggle.addEventListener("click", () => {
    const collapsed = appShell.classList.toggle("sidebar-collapsed");
    appShell.classList.toggle("sidebar-expanded", !collapsed);
    sidebarToggle.textContent = collapsed ? "≡" : "‹";
    sidebarToggle.setAttribute(
      "aria-label",
      collapsed ? "Expandir menú" : "Contraer menú"
    );
  });
}

// Tabs simples (DATOS, FICHAJES, NÓMINAS, AUSENCIAS, VACACIONES)
const tabButtons = document.querySelectorAll(".tab-pill");
const tabContents = document.querySelectorAll("[data-tab-content]");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");
    if (!target) return;

    tabButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    tabContents.forEach((section) => {
      const key = section.getAttribute("data-tab-content");
      section.classList.toggle("is-hidden", key !== target);
    });
  });
});
