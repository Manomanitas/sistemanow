/* ============================================================
   FICHAJE – JS COMPLETO (CORREGIDO)
   Fluxo completo: EPIs → Sitio → Transporte → OPERANDO
   Con estados corregidos y navegación mejorada
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       CONFIGURACIÓN INICIAL DEL TÉCNICO (simulación)
    ============================================================ */
    const user = {
        nombre: "EDUARDO AUGUSTO",
        rol: "TÉCNICO",
        needsEPIs: true,
        hasCarnet: true,
        carnetValido: true,
    };

    /* ============================================================
       ESTADOS POSIBLES DEL TÉCNICO
    ============================================================ */
    const ESTADOS = {
        SIN_FICHAR: { 
            label: "SIN FICHAR", 
            class: "state-sin-fichar",
            mensaje: "No has realizado fichajes en el día de hoy."
        },
        OPERANDO: { 
            label: "OPERANDO", 
            class: "state-operando",
            mensaje: "Estás actualmente en horario laboral."
        },
        RECESO: { 
            label: "EN RECESO", 
            class: "state-receso",
            mensaje: "Estás en período de descanso."
        },
        VACACIONES: { 
            label: "VACACIONES", 
            class: "state-vacaciones",
            mensaje: "Te encuentras en período de vacaciones. Disfruta de tu descanso."
        },
        AUSENTE: { 
            label: "AUSENTE", 
            class: "state-ausente",
            mensaje: "Actualmente estás marcado como ausente."
        },
        BAJA_MEDICA: { 
            label: "BAJA MÉDICA", 
            class: "state-baja-medica",
            mensaje: "Te encuentras de baja médica. Cualquier actividad deberá ser autorizada."
        },
        TERMINADO: { 
            label: "TERMINADO", 
            class: "state-terminado",
            mensaje: "Ya has realizado todos los fichajes del día. Mañana se reiniciará el contador de fichajes."
        },
    };

    const ROTACION_ESTADOS = [
        "SIN_FICHAR", "OPERANDO", "RECESO", "VACACIONES",
        "AUSENTE", "BAJA_MEDICA", "TERMINADO"
    ];

    let estadoActual = "SIN_FICHAR";

    /* ============================================================
       DOM ELEMENTS
    ============================================================ */
    const fichajeCard = document.getElementById("fichajeCard");
    const estadoText = document.getElementById("estadoText");
    const statusPill = document.getElementById("statusPill");
    const mensajeTexto = document.getElementById("mensajeTexto");

    const nombreTecnico = document.getElementById("nombreTecnico");
    nombreTecnico.textContent = `${user.nombre}.`;

    const fechaText = document.getElementById("fechaText");
    const horaText = document.getElementById("horaText");

    /* Views */
    const stepHome = document.getElementById("stepHome");
    const stepEpis = document.getElementById("stepEpis");
    const stepSitio = document.getElementById("stepSitio");
    const stepTransporte = document.getElementById("stepTransporte");
    const stepOperando = document.getElementById("stepOperando");

    /* Stepper */
    const stepper = document.getElementById("stepper");
    const stepBars = document.querySelectorAll(".step-bar");
    const stepActualSpan = document.getElementById("stepActual");

    /* Botones principales */
    const btnFicharEntrada = document.getElementById("btnFicharEntrada");
    const btnContinuarSistema = document.getElementById("btnContinuarSistema");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    /* Botones estado OPERANDO */
    const btnSalidaReceso = document.getElementById("btnSalidaReceso");
    const btnTerminarDia = document.getElementById("btnTerminarDia");
    const btnContinuarSistemaOperando = document.getElementById("btnContinuarSistemaOperando");
    const btnCerrarSesionOperando = document.getElementById("btnCerrarSesionOperando");

    /* EPIs */
    let episFotos = [];
    let episPendiente = false;

    const btnAddEpis = document.getElementById("btnAddEpis");
    const inputEpisFotos = document.getElementById("inputEpisFotos");
    const btnPosponerEpis = document.getElementById("btnPosponerEpis");
    const btnConfirmarEpis = document.getElementById("btnConfirmarEpis");

    const episThumbs = document.getElementById("episThumbs");
    const episCounter = document.getElementById("episCounter");
    const episPendingAlert = document.getElementById("episPendingAlert");
    const episError = document.getElementById("episError");

    /* Sitio */
    const listaSitios = document.getElementById("listaSitios");
    const btnConfirmarSitio = document.getElementById("btnConfirmarSitio");
    let sitioSeleccionado = null;

    /* Transporte */
    let conduce = user.hasCarnet && user.carnetValido;
    let vehiculoSeleccionado = null;

    const btnHoyConduzco = document.getElementById("btnHoyConduzco");
    const btnHoyNoConduzco = document.getElementById("btnHoyNoConduzco");
    const listaVehiculos = document.getElementById("listaVehiculos");
    const btnGuardarJornada = document.getElementById("btnGuardarJornada");

    /* Banner */
    const bannerEpis = document.getElementById("bannerEpis");

    /* ============================================================
       DATA / HORA
    ============================================================ */
    function actualizarFechaHora() {
        const ahora = new Date();
        fechaText.textContent = ahora.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
        });
        horaText.textContent = ahora.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 60000);

    /* ============================================================
       ALTERAR ESTADO DEL TÉCNICO
    ============================================================ */
    function aplicarEstado(estado) {
        estadoActual = estado;
        const configEstado = ESTADOS[estado];

        // Remover clases anteriores
        Object.values(ESTADOS).forEach(s => {
            fichajeCard.classList.remove(s.class);
        });

        // Aplicar nuevo estado
        fichajeCard.classList.add(configEstado.class);
        estadoText.textContent = configEstado.label;
        mensajeTexto.textContent = configEstado.mensaje;

        // Mostrar vista correspondiente
        if (estado === "SIN_FICHAR") {
            mostrarStep(0); // Vista home
        } else if (estado === "OPERANDO") {
            mostrarStep(4); // Vista operando específica
        } else {
            mostrarStep(0); // Vista home para otros estados
        }
    }

    /* ============================================================
       STEP VIEW
    ============================================================ */
    let stepActual = 0;

    function mostrarStep(step) {
        stepActual = step;

        // Ocultar todas las vistas
        stepHome.classList.remove("step-view-active");
        stepEpis.classList.remove("step-view-active");
        stepSitio.classList.remove("step-view-active");
        stepTransporte.classList.remove("step-view-active");
        stepOperando.classList.remove("step-view-active");

        if (step === 0) {
            // Vista home (SIN FICHAR u otros estados)
            stepper.classList.add("stepper-hidden");
            stepHome.classList.add("step-view-active");
        } else if (step === 4) {
            // Vista OPERANDO específica
            stepper.classList.add("stepper-hidden");
            stepOperando.classList.add("step-view-active");
        } else {
            // Wizard de fichaje (steps 1-3)
            stepper.classList.remove("stepper-hidden");
            stepActualSpan.textContent = step;

            // Actualizar barras de progreso
            document.querySelectorAll(".step-bar").forEach((bar, i) => {
                bar.classList.toggle("step-bar-active", i < step);
            });

            if (step === 1) stepEpis.classList.add("step-view-active");
            if (step === 2) stepSitio.classList.add("step-view-active");
            if (step === 3) stepTransporte.classList.add("step-view-active");
        }
    }

    /* ============================================================
       EVENTOS: HOME
    ============================================================ */
    btnFicharEntrada.addEventListener("click", () => {
        mostrarStep(1);
    });

    btnContinuarSistema.addEventListener("click", () => {
        window.location.href = "/pantalla-principal/pantalla-principal.html";
    });

    btnCerrarSesion.addEventListener("click", () => {
        window.location.href = "/login/login.html";
    });

    /* ============================================================
       EVENTOS: OPERANDO
    ============================================================ */
    btnSalidaReceso.addEventListener("click", () => {
        aplicarEstado("RECESO");
    });

    btnTerminarDia.addEventListener("click", () => {
        aplicarEstado("TERMINADO");
    });

    btnContinuarSistemaOperando.addEventListener("click", () => {
        window.location.href = "/pantalla-principal/pantalla-principal.html";
    });

    btnCerrarSesionOperando.addEventListener("click", () => {
        window.location.href = "/login/login.html";
    });

    /* ============================================================
       EPIs
    ============================================================ */
    btnAddEpis.addEventListener("click", () => inputEpisFotos.click());

    inputEpisFotos.addEventListener("change", (e) => {
        const archivos = Array.from(e.target.files);
        archivos.forEach(file => {
            episFotos.push({
                name: file.name,
                url: URL.createObjectURL(file)
            });
        });

        actualizarEpisUI();
        episPendiente = false;
        episError.classList.add("wizard-alert-hidden");
        episPendingAlert.classList.add("wizard-alert-hidden");
        bannerEpis.classList.add("epis-banner-hidden");
    });

    function actualizarEpisUI() {
        episThumbs.innerHTML = "";
        episFotos.forEach(f => {
            const div = document.createElement("div");
            div.className = "epis-thumb";
            const img = document.createElement("img");
            img.src = f.url;
            div.appendChild(img);
            episThumbs.appendChild(div);
        });
        episCounter.textContent = `${episFotos.length} foto(s) añadida(s).`;
    }

    btnPosponerEpis.addEventListener("click", () => {
        episPendiente = true;
        episPendingAlert.classList.remove("wizard-alert-hidden");
        bannerEpis.classList.remove("epis-banner-hidden");
        mostrarStep(2);
    });

    btnConfirmarEpis.addEventListener("click", () => {
        if (episFotos.length === 0 && !episPendiente) {
            episError.textContent = "Sube al menos 1 foto o pospone.";
            episError.classList.remove("wizard-alert-hidden");
            return;
        }
        mostrarStep(2);
    });

    /* ============================================================
       SITIO
    ============================================================ */
    const asignaciones = [
        { id: "OFICINA", label: "Oficina Central", tipo: "OFICINA" },
        { id: "OBRA123", label: "Obra Calle Valencia 124", tipo: "OBRA" },
        { id: "RUTA", label: "Ruta Norte", tipo: "RUTA" },
    ];

    function cargarSitios() {
        listaSitios.innerHTML = "";
        asignaciones.forEach(s => {
            const item = document.createElement("button");
            item.className = "wizard-list-item";
            item.textContent = s.label;
            item.addEventListener("click", () => {
                sitioSeleccionado = s;
                document.querySelectorAll(".wizard-list-item")
                    .forEach(el => el.classList.remove("selected"));
                item.classList.add("selected");
                btnConfirmarSitio.disabled = false;
            });
            listaSitios.appendChild(item);
        });
    }
    cargarSitios();

    btnConfirmarSitio.addEventListener("click", () => {
        mostrarStep(3);
    });

    /* ============================================================
       TRANSPORTE
    ============================================================ */
    const vehiculos = [
        { id: "V1", label: "Peugeot Partner • 1234-ABC" },
        { id: "V2", label: "Ford Transit • 5678-DEF" },
    ];

    function actualizarToggle() {
        btnHoyConduzco.classList.toggle("toggle-pill-active", conduce);
        btnHoyNoConduzco.classList.toggle("toggle-pill-active", !conduce);
        cargarVehiculos();
    }

    btnHoyConduzco.addEventListener("click", () => {
        conduce = true;
        vehiculoSeleccionado = null;
        actualizarToggle();
        btnGuardarJornada.disabled = true;
    });

    btnHoyNoConduzco.addEventListener("click", () => {
        conduce = false;
        actualizarToggle();
        btnGuardarJornada.disabled = false;
    });

    function cargarVehiculos() {
        listaVehiculos.innerHTML = "";
        if (!conduce) return;

        vehiculos.forEach(v => {
            const item = document.createElement("button");
            item.className = "wizard-list-item";
            item.textContent = v.label;

            item.addEventListener("click", () => {
                vehiculoSeleccionado = v;
                document.querySelectorAll("#listaVehiculos .wizard-list-item")
                    .forEach(el => el.classList.remove("selected"));

                item.classList.add("selected");
                btnGuardarJornada.disabled = false;
            });

            listaVehiculos.appendChild(item);
        });
    }
    actualizarToggle();

    btnGuardarJornada.addEventListener("click", () => {
        // Finalizar wizard y cambiar a estado OPERANDO
        aplicarEstado("OPERANDO");
    });

    /* ============================================================
       BANNER ROXO
    ============================================================ */
    bannerEpis.addEventListener("click", () => {
        if (episPendiente) {
            mostrarStep(1);
        }
    });

    /* ============================================================
       PILL DO ESTADO → ALTERAR ESTADOS (para testing)
    ============================================================ */
    statusPill.addEventListener("click", () => {
        let index = ROTACION_ESTADOS.indexOf(estadoActual);
        index = (index + 1) % ROTACION_ESTADOS.length;
        aplicarEstado(ROTACION_ESTADOS[index]);
    });

    /* ============================================================
       INICIAR EN "SIN FICHAR"
    ============================================================ */
    aplicarEstado("SIN_FICHAR");

});