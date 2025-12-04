// Definição dos passos e páginas alvo
const stepsConfig = {
  guia: {
    kicker: "Paso 01 · Guía de estilo",
    title: "Revisa primero la guía rápida de diseño",
    text: `
En la guía de estilo encontrarás los componentes base (cards, avatares, estados,
pills, botones) y los colores oficiales del sistema. Sirve como referencia visual
para mantener todas las vistas coherentes (login, fichajes, panel principal, etc.).
    `.trim(),
    path: "/guia-de-estilo/guia-rapido-designer.html",
    goal: "Alinear el frontend con la misma base visual.",
    buttonLabel: "Abrir guía de estilo",
    href: "./guia-de-estilo/guia-rapido-designer.html",
  },
  login: {
    kicker: "Paso 02 · Login de técnicos",
    title: "Validar el flujo de acceso al sistema",
    text: `
Esta pantalla permite que el técnico introduzca su usuario y contraseña.
Desde aquí, tras un login correcto, se accede a la pantalla de fichaje inicial.
Comprueba el comportamiento, estados de error y la integración con el backend.
    `.trim(),
    path: "/login/login.html",
    goal: "Probar el inicio de sesión real del técnico.",
    buttonLabel: "Abrir pantalla de login",
    href: "./login/login.html",
  },
  fichajes: {
    kicker: "Paso 03 · Fichajes iniciales",
    title: "Revisar el flujo de fichaje y estados",
    text: `
Después del login, el técnico llega a la pantalla de fichaje. Aquí se prueban
los diferentes estados (Operando, Receso, Vacaciones, Ausente, Terminado) y
los botones que cambian el estado para las pruebas del desarrollo.
    `.trim(),
    path: "/fichajes/fichaje-inicio.html",
    goal: "Asegurar que los fichajes y estados funcionan como esperado.",
    buttonLabel: "Abrir pantalla de fichaje",
    href: "./fichajes/fichaje-inicio.html",
  },
  principal: {
    kicker: "Paso 04 · Pantalla principal",
    title: "Visualizar la vista general del sistema",
    text: `
La pantalla principal muestra un resumen del técnico (estado, fichajes del día,
accesos rápidos a módulos y calendario de trabajadores). Es el punto central
desde el que se navega al resto de módulos del sistema.
    `.trim(),
    path: "/pantalla-principal/pantalla-principal.html",
    goal: "Validar la experiencia general e interacción entre módulos.",
    buttonLabel: "Abrir pantalla principal",
    href: "./pantalla-principal/pantalla-principal.html",
  },
    orden: {
    kicker: "Paso 05 · Pantalla de Orden de Trabajo",
    title: "Gestionar una orden/aviso/presupuesto",
    text: `
Esta vista corresponde a la gestión completa de una Orden de Trabajo concreta
(es decir, un aviso, presupuesto u orden ya creada). Desde aquí se controla
toda la información de esa orden específica: técnicos asignados, actividades
realizadas, documentos adjuntos, coste de obra, estados de garantía y
cualquier actualización relacionada con ese trabajo en particular.
    `.trim(),
    path: "/orden-trab/orden-trabajo-v3-tabs.html",
    goal:
      "Centralizar toda la información y acciones de una única Orden de Trabajo.",
    buttonLabel: "Abrir pantalla de Orden de Trabajo",
    href: "./orden-trab/orden-trabajo-v3-tabs.html",
  },
    obras: {
      kicker: "Paso 06 • Panel de Obras",
      title: "Gestionar Obras Completas y sus Ordenés/Presupuestos. ",
      text:`
Esta vista corresponde al panel general de gestión de obras. 
Desde aquí se visualiza de forma resumida la información clave de cada obra (datos principales, 
técnicos implicados, accesos, acciones rápidas y últimas actividades registradas), sirviendo 
como punto de entrada para profundizar en el detalle de una obra concreta. Permite al usuario 
identificar rápidamente qué obras están en curso, acceder a sus órdenes, revisar el histórico de 
movimientos y navegar hacia pantallas más específicas (accesos, órdenes de trabajo, documentación, etc.) 
manteniendo siempre una visión global del estado de la obra.
    `.trim(),
      path: "/panel-obras/panel-obras.html",
      goal:
        "Centralizar toda la información y acciones de una obra completa.",
      buttonLabel: "Abrir Panel de Obras",
      href: "./panel-obras/panel-obras.html",  
    },

};

// Elementos da UI
const stepItems = document.querySelectorAll(".step-item");
const detailKicker = document.getElementById("detailKicker");
const detailTitle = document.getElementById("detailTitle");
const detailText = document.getElementById("detailText");
const detailPath = document.getElementById("detailPath");
const detailGoal = document.getElementById("detailGoal");
const detailButton = document.getElementById("detailButton");

// Função para atualizar a área de detalhe
function setActiveStep(stepKey) {
  const config = stepsConfig[stepKey];
  if (!config) return;

  // Atualiza classes na lista
  stepItems.forEach((item) => {
    const key = item.getAttribute("data-step");
    if (key === stepKey) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Atualiza textos e botão
  detailKicker.textContent = config.kicker;
  detailTitle.textContent = config.title;
  detailText.textContent = config.text;
  detailPath.textContent = config.path;
  detailGoal.textContent = config.goal;
  detailButton.textContent = config.buttonLabel;
  detailButton.href = config.href;
}

// Listeners nos passos
stepItems.forEach((item) => {
  item.addEventListener("click", () => {
    const key = item.getAttribute("data-step");
    setActiveStep(key);
  });
});

// Estado inicial: guía de estilo
setActiveStep("guia");
