const { useEffect, useState } = React;

// ================== PALETA / COMPONENTES BASE ==================
const COLORS = {
  primary: "#007AFF",
  accent: "#7C3AED",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#EF4444",
  muted: "rgba(255,255,255,0.35)",
  avatar: "#FF611A",
  border: "rgba(255,255,255,0.15)",
  glass: "rgba(15,23,42,0.68)",
};


// LISTA DE SUB-ESTADOS (em ordem de ciclo)
const SUBESTADOS = [
  "A Presupuestar",
  "Presupuestado",
  "Citado",
  "En Espera",
  "En Curso",
  "En Curso Reparos",
  "Pendiente de Firma Remota",
  "Pendiente de Pedido",
  "Facturado",
  "Pendiente de Cobro",
  "Confirming",
  "Pagado",
  "Completada",
  "Moroso",
];

// A que "estado de servicio" se asocia cada sub-estado (para color)
const SUBESTADO_TONE = {
  "A Presupuestar": "nuevo",
  Presupuestado: "aceptado",
  Citado: "citado",
  "En Espera": "citado",
  "En Curso": "aceptado",
  "En Curso Reparos": "aceptado",
  "Pendiente de Firma Remota": "citado",
  "Pendiente de Pedido": "oficina",
  Facturado: "aceptado",
  "Pendiente de Cobro": "cobro",
  Confirming: "cobro",
  Pagado: "pagado",
  Completada: "finalizado",
  Moroso: "moroso",
};

function getSubestadoStyle(nombre) {
  if (!nombre) {
    return {
      bg: "bg-emerald-500/20",
      border: "border-emerald-400/40",
      text: "text-emerald-100",
      dot: "bg-emerald-400",
    };
  }

  const tone = SUBESTADO_TONE[nombre] || "default";

  switch (tone) {
    case "nuevo": // azul
      return {
        bg: "bg-sky-500/15",
        border: "border-sky-500/60",
        text: "text-sky-100",
        dot: "bg-sky-400",
      };
    case "aceptado": // verde "ACEPTADO"
      return {
        bg: "bg-emerald-500/15",
        border: "border-emerald-400/70",
        text: "text-emerald-100",
        dot: "bg-emerald-400",
      };
    case "finalizado": // verde mais forte "FINALIZADO"
      return {
        bg: "bg-emerald-600/20",
        border: "border-emerald-500/80",
        text: "text-emerald-100",
        dot: "bg-emerald-500",
      };
    case "citado": // amarelo "CITADO"
      return {
        bg: "bg-amber-500/15",
        border: "border-amber-400/70",
        text: "text-amber-100",
        dot: "bg-amber-400",
      };
    case "oficina": // roxo/indigo "GESTIÓN DE OFICINA"
      return {
        bg: "bg-indigo-500/18",
        border: "border-indigo-400/70",
        text: "text-indigo-100",
        dot: "bg-indigo-400",
      };
    case "cobro": // fúcsia "ESTADO DE COBRO"
      return {
        bg: "bg-fuchsia-500/18",
        border: "border-fuchsia-400/70",
        text: "text-fuchsia-100",
        dot: "bg-fuchsia-400",
      };
    case "pagado": // verde pago
      return {
        bg: "bg-green-500/25",
        border: "border-green-400/80",
        text: "text-green-100",
        dot: "bg-green-400",
      };
    case "moroso": // vermelho "MOROSO"
      return {
        bg: "bg-red-600/20",
        border: "border-red-500/80",
        text: "text-red-100",
        dot: "bg-red-500",
      };
    default:
      return {
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/40",
        text: "text-emerald-100",
        dot: "bg-emerald-400",
      };
  }
}

function Frosted({ children, className = "", blur = 18, style = {} }) {
  return (
    <div
      className={
        "rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.25)] " + className
      }
      style={{
        borderColor: COLORS.border,
        background: COLORS.glass,
        backdropFilter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, tone = "primary", className = "", ...rest }) {
  let styles =
    tone === "primary"
      ? "bg-[#007AFF] hover:bg-[#0060d6] text-white"
      : tone === "danger"
      ? "bg-[#EF4444] hover:bg-[#dc2626] text-white"
      : "bg-white/5 hover:bg-white/15 text-white border border-white/15";

  return (
    <button
      {...rest}
      className={
        "rounded-xl px-3 py-2 text-xs font-semibold transition " +
        styles +
        " " +
        className
      }
    >
      {children}
    </button>
  );
}

// ================== HELPERS ==================
function computeInitials(name = "") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const pick = (s, i = 0) => (s?.[i] || "").toUpperCase();
  if (parts.length >= 2)
    return pick(parts[0]) + (pick(parts[1]) || pick(parts[1], 1));
  if (parts.length === 1) return pick(parts[0]) + pick(parts[0], 1);
  return "";
}

function garantiaStepFromEstado(estado) {
  if (estado === "RESUELTA") return 2;
  if (estado === "TRABAJANDO") return 1;
  return 0;
}

function garantiaTint(estado) {
  if (estado === "RESUELTA") return "rgba(22,163,74,0.16)";
  if (estado === "CANCELADA") return "rgba(220,38,38,0.16)";
  return COLORS.glass;
}

function Avatar({ name = "", status }) {
  const initials = computeInitials(name);
  const color =
    status === "OPERANDO"
      ? COLORS.success
      : status === "PAUSA"
      ? COLORS.warning
      : COLORS.muted;
  return (
    <div
      className="relative h-9 w-9 rounded-full grid place-items-center text-white text-xs font-bold shadow-md"
      style={{ backgroundColor: COLORS.avatar }}
      title={`${name} — ${status || ""}`}
    >
      {initials || "--"}
      <span
        className="absolute -bottom-1 right-0 h-3 w-3 rounded-full border border-black/40"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ================== TIMELINE (ESTADO DE SERVICIO) ==================
function Timeline({ etapas, activo }) {
  return (
    <div className="relative px-4 py-3">
      <div className="flex items-center gap-6 overflow-x-auto hide-scroll pb-4">
        {etapas.map((etapa, idx) => {
          const done = idx < activo;
          const isActive = idx === activo;

          return (
            <div key={etapa} className="min-w-[120px] flex items-center">
              <div className="relative flex flex-col items-center text-center">
                <div
                  className={
                    "h-3.5 w-3.5 rounded-full border shadow-sm transition " +
                    (isActive
                      ? "bg-[#007AFF] border-[#4D9FFF]"
                      : done
                      ? "bg-emerald-400 border-emerald-300"
                      : "bg-white/10 border-white/30")
                  }
                />
                <div
                  className={
                    "mt-1 text-[10px] md:text-[11px] whitespace-nowrap " +
                    (isActive
                      ? "text-white font-semibold"
                      : done
                      ? "text-emerald-200"
                      : "text-white/60")
                  }
                >
                  {etapa}
                </div>
              </div>

              {idx < etapas.length - 1 && (
                <div
                  className="h-[2px] flex-1 ml-3 rounded-full"
                  style={{
                    background: done
                      ? "linear-gradient(90deg,#22c55e,#2dd4bf)"
                      : "rgba(148,163,184,0.4)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoogleMapsButton({ direccion }) {
  function handleClick() {
    if (!direccion) return;
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(direccion);
    window.open(url, "_blank");
  }

  return (
    <Button
      tone="primary"
      className="flex items-center gap-2 text-xs px-3 py-2"
      onClick={handleClick}
    >
      <span>📍</span> Abrir en Google Maps
    </Button>
  );
}

// ================== COMPONENTE PRINCIPAL ==================
function OrdenDeTrabajoV3() {
  const params = new URLSearchParams(window.location.search);

  const PARAMS = {
    id: Number(params.get("id")) || null,
    titulo: params.get("titulo") || null,
    contacto: params.get("contacto") || null,
    telefono: params.get("telefono") || null,
    cliente: params.get("cliente") || "TELDOMO",
    direccion: params.get("direccion") || "Calle Jesús 12, 46007 — Valencia",
  };

  const API_BASE = window.MANO_API_BASE || "/api";
  const ORDER_ID = PARAMS.id || window.MANO_ORDER_ID || 464;

  const [tab, setTab] = useState("ACTIVIDAD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [orden, setOrden] = useState(null);
  const [tecnicosHeader, setTecnicosHeader] = useState([]);

  const [etapas] = useState([
    "Nuevo",
    "Aceptado",
    "Cancelado",
    "Citado",
    "Gestión de oficina",
    "Estado de cobro",
    "Finalizado",
    "Moroso",
    "Garantía",
  ]);

  const [timelineIndex, setTimelineIndex] = useState(2);

  const [subEstadoIndex, setSubEstadoIndex] = useState(-1);

  const [coste, setCoste] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [docs, setDocs] = useState([]);
  const [tecnicosTabla, setTecnicosTabla] = useState([]);
  const [actividadFotos, setActividadFotos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [garantias, setGarantias] = useState([]);

  const [lastSync, setLastSync] = useState(new Date());

  const estadoActual = etapas[timelineIndex];
  const subEstadoTexto =
    subEstadoIndex < 0 ? "Sin sub-estado" : SUBESTADOS[subEstadoIndex];

  useEffect(() => {
    setSubEstadoIndex(-1);
  }, [timelineIndex]);

  async function fetchJson(path, opts = {}, retries = 1) {
    try {
      const res = await fetch(`${API_BASE}${path}`, opts);
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      if (retries > 0) return fetchJson(path, opts, retries - 1);
      throw e;
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [o, th, ct, tr, dc, tf, ac, ga] = await Promise.all([
          fetchJson(`/orden/${ORDER_ID}`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/tecnicos`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/coste`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/tareas`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/documentos`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/tecnicos_tabla`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/actividad`).catch(() => null),
          fetchJson(`/orden/${ORDER_ID}/garantias`).catch(() => null),
        ]);
        if (!mounted) return;
        setLastSync(new Date());
        setOrden(
          o || {
            id: ORDER_ID,
            servicio: "AIRES ACONDICIONADOS",
            cliente: PARAMS.cliente || "CLYSEMA SL",
            telefono: PARAMS.telefono || "687290480",
            fecha: "05 de Noviembre 2025",
            horas: "8:0 hrs",
            direccion:
              PARAMS.direccion ||
              "(46940) MANISES, VALENCIA — Calle REQUENA, Nº6, Piso 0, Puerta 0",
            titulo: PARAMS.titulo || "INST TOBERAS MAQUINA 2",
          }
        );
        setTecnicosHeader(
          th || [
            { nombre: "JORGE COY", status: "OPERANDO" },
            { nombre: "LUIS RAMOS", status: "PAUSA" },
            { nombre: "CATALIN ANGELO", status: "OPERANDO" },
          ]
        );
        setCoste(
          ct || [
            {
              fecha: "05-11-2025",
              descripcion: "MANO OBRA — MANO DE OBRA MANU 05-11-2025",
              valor: "226,88 €",
            },
            {
              fecha: "05-11-2025",
              descripcion: "MANO OBRA — MANO DE OBRA LUCIANO 05-11-2025",
              valor: "302,50 €",
            },
          ]
        );
        setTareas(
          tr || [
            { titulo: "INSTALACION TOBERAS MAQUINA 2", done: true },
            { titulo: "COLOCACION DE REJILLAS EN LUDOTECA", done: true },
            {
              titulo: "COLOCAR ENCHUFE CUADRO ELECTRICO DE LA TERRAZA",
              done: true,
            },
            {
              titulo: "SELLAR SALIDA DEL RECUPERADOR LUDOTECA",
              done: true,
            },
          ]
        );
        setDocs(
          dc || [
            {
              fecha: "05-11-2025",
              documento: "conforme-trabajo-46420251105165807.pdf",
              generado: "LUCIANO RIV.",
            },
            {
              fecha: "05-11-2025",
              documento:
                "presupuesto-orden-trabajo-46420251105171534.pdf",
              generado: "ORIANNA GERALDI DOS.",
            },
            {
              fecha: "pendiente",
              documento: "Firma remota en espera doc 18",
              generado: "Administración",
            },
          ]
        );
        setActividadFotos(
          ac || [
            {
              src: "https://www.shutterstock.com/image-photo/worker-safety-gear-clean-windows-260nw-2511037229.jpg",
              autor: "Jorge Coy",
              fecha: "05-11-2025 16:49",
            },
            {
              src: "https://es.habcdn.com/photos/business/medium/n-a_489816.jpg",
              autor: "Jorge Coy",
              fecha: "05-11-2025 16:50",
            },
          ]
        );
        setTecnicosTabla(
          tf || [
            { nombre: "JORGE COY", cargo: "TÉCNICO" },
            { nombre: "LUIS RAMOS", cargo: "TÉCNICO" },
            { nombre: "CATALIN ANGELO", cargo: "TÉCNICO" },
          ]
        );
        setGarantias(
          ga || [
            {
              id: 1872,
              titulo: "Revisión unidad exterior",
              estado: "SOLICITADA",
              fecha: "06-11-2025",
            },
            {
              id: 1873,
              titulo: "Reapriete conexiones",
              estado: "RESUELTA",
              fecha: "06-11-2025",
            },
            {
              id: 1874,
              titulo: "Sustituir termostato",
              estado: "CANCELADA",
              fecha: "06-11-2025",
            },
          ]
        );
        if (o?.timelineIndex != null) setTimelineIndex(o.timelineIndex);
      } catch (e) {
        if (!mounted) return;
        setError(
          "No fue posible obtener datos en vivo. Mostrando datos de referencia."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  function handleVolverObraPrincipal() {
    window.location.href = "../panel-obras/panel-obras.html";
  }

  function handleClickSubEstado() {
    if (!SUBESTADOS.length) return;
    setSubEstadoIndex((prev) => {
      if (prev < 0) return 0;
      const next = prev + 1;
      return next >= SUBESTADOS.length ? 0 : next;
    });
  }

  function Header() {
    const hasSub = subEstadoIndex >= 0;
    const { bg, border, text, dot } = getSubestadoStyle(
      hasSub ? subEstadoTexto : null
    );
    return (
      <Frosted className="p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="text-white">
            <div className="text-[12px] md:text-[13px] opacity-70">
              PANEL DE GESTIÓN · OBRA
            </div>
            <div className="text-xl md:text-2xl font-semibold mt-1">
              {orden?.titulo || "Instalación"}
            </div>
            <div className="text-xs md:text-sm opacity-80 mt-2">
              Cliente: {orden?.cliente || "Cliente"} · {orden?.servicio}
            </div>
            <div className="text-xs md:text-sm opacity-80 mt-1">
              {orden?.direccion}
            </div>
            <div className="text-[11px] opacity-60 mt-1">
              Fecha: {orden?.fecha} · Horas: {orden?.horas}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-xs">
            <button
              type="button"
              onClick={handleClickSubEstado}
              className={
                "flex items-center gap-2 px-3 py-1 rounded-full border transition " +
                bg +
                " " +
                border +
                " " +
                text
              }
            >
              <span className={"h-2 w-2 rounded-full animate-pulse " + dot} />
              <span className="whitespace-nowrap">
                En tiempo real ·{" "}
                <span className="font-semibold">{subEstadoTexto}</span>
              </span>
            </button>
            <div className="opacity-70">
              Última sincronización: {lastSync.toLocaleTimeString("es-ES")}
            </div>

            <div className="flex items-center gap-2 mt-1">
              {tecnicosHeader.map((t, i) => (
                <Avatar key={i} name={t.nombre} status={t.status} />
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-2 justify-end">
              <Button
                tone="ghost"
                className="!px-3 !py-1.5"
                onClick={handleVolverObraPrincipal}
              >
                Volver a obra principal
              </Button>
              <GoogleMapsButton direccion={orden?.direccion} />
            </div>
          </div>
        </div>
      </Frosted>
    );
  }

  function RightAside() {
    return (
      <div className="w-full lg:w-[320px] space-y-3">
        <Frosted className="p-3 text-white/85">
          <div className="text-sm font-semibold mb-1">Resumen rápido</div>
          <div className="text-xs opacity-80 space-y-1">
            <div>Servicio: {orden?.servicio}</div>
            <div>Cliente/Empresa: {orden?.cliente}</div>
            <div>Teléfono: {orden?.telefono}</div>
            <div>
              Fecha: {orden?.fecha} • {orden?.horas}
            </div>
            <div>Ubicación: {orden?.direccion}</div>
            <div>Estado actual: {estadoActual}</div>
          </div>
        </Frosted>
        <Frosted className="p-3 text-white/85">
          <div className="text-sm font-semibold mb-1">Acciones</div>
          <div className="flex flex-col gap-2">
            <Button tone="primary">Ir a WhatsApp</Button>
            <Button tone="ghost">Ir a llamada</Button>
            <Button tone="ghost">Modificar aviso</Button>
            <Button tone="ghost">Cambiar estatus</Button>
            <Button tone="ghost">Firma externa</Button>
            <Button tone="ghost">Duplicar</Button>
            <Button tone="ghost">Compartir</Button>
          </div>
        </Frosted>
      </div>
    );
  }

  function TabActividad() {
    const [msg, setMsg] = useState("");
    return (
      <Frosted className="p-3">
        <div className="space-y-3">
          {actividadFotos.map((f, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: COLORS.border }}
            >
              <img src={f.src} className="w-full h-[220px] object-cover" />
              <div className="px-3 py-1 text-[11px] text-white/70">
                {f.autor} — {f.fecha}
              </div>
            </div>
          ))}
          <div className="text-[11px] px-3 py-1 rounded-xl bg-amber-200/70 text-black w-fit">
            {(actividadFotos[0]?.autor || "Técnico")} ha cargado el archivo
            conforme del trabajo realizado — {orden?.fecha} 16:58
          </div>
          <div
            className="flex items-center gap-2 pt-1 border-t"
            style={{ borderColor: COLORS.border }}
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Escriba una nota aquí"
              className="flex-1 bg-transparent text-white/90 placeholder-white/50 outline-none px-3 py-2"
            />
            <Button tone="ghost">📎</Button>
            <Button tone="primary">➤</Button>
          </div>
        </div>
      </Frosted>
    );
  }

  function TabCoste() {
    const sumaMano = coste.reduce((acc, f) => {
      const num = parseFloat(
        (f.valor || "0").replace(/[^0-9.,]/g, "").replace(",", ".")
      );
      return acc + (isNaN(num) ? 0 : num);
    }, 0);

    return (
      <Frosted className="p-3">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white/90">
            <thead className="text-white/70">
              <tr>
                <th className="px-3 py-2">FECHA</th>
                <th className="px-3 py-2">DESCRIPCIÓN</th>
                <th className="px-3 py-2">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {coste.map((f, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: COLORS.border }}
                >
                  <td className="px-3 py-2">{f.fecha}</td>
                  <td className="px-3 py-2">{f.descripcion}</td>
                  <td className="px-3 py-2">{f.valor}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                className="border-t"
                style={{ borderColor: COLORS.border }}
              >
                <td className="px-3 py-2" colSpan={2}>
                  Suma materiales
                </td>
                <td className="px-3 py-2">0,00 €</td>
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>
                  Suma mano de obra
                </td>
                <td className="px-3 py-2">
                  {sumaMano.toFixed(2).replace(".", ",")} €
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>
                  <strong>Total acumulado</strong>
                </td>
                <td className="px-3 py-2">
                  <strong>
                    {sumaMano.toFixed(2).replace(".", ",")} €
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="flex gap-2 pt-3">
          <Button tone="ghost">Añadir material</Button>
          <Button tone="ghost">Mano de obra</Button>
          <Button tone="primary">Generar presupuesto</Button>
        </div>
      </Frosted>
    );
  }

  function TabTareas() {
    return (
      <Frosted className="p-3">
        <ul className="space-y-2 text-white/90">
          {tareas.map((t, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl border px-3 py-2"
              style={{ borderColor: COLORS.border }}
            >
              <span>{t.titulo}</span>
              <span className="rounded-xl px-3 py-1 text-xs bg-green-600 text-white">
                {t.done ? "Tarea cumplida ✓" : "Pendiente"}
              </span>
            </li>
          ))}
        </ul>
        <div className="pt-3">
          <Button tone="primary">Añadir tareas</Button>
        </div>
      </Frosted>
    );
  }

  function TabTecnicos() {
    return (
      <Frosted className="p-3">
        <table className="min-w-full text-left text-sm text-white/90">
          <thead className="text-white/70">
            <tr>
              <th className="px-3 py-2">TÉCNICO</th>
              <th className="px-3 py-2">CARGO</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tecnicosTabla.map((t) => (
              <tr
                key={t.nombre}
                className="border-t"
                style={{ borderColor: COLORS.border }}
              >
                <td className="px-3 py-2">{t.nombre}</td>
                <td className="px-3 py-2">{t.cargo}</td>
                <td className="px-3 py-2">
                  <Button tone="ghost" className="!px-2 !py-1">
                    remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pt-3">
          <Button tone="primary">Asignar técnico</Button>
        </div>
      </Frosted>
    );
  }

  function TabFacturacion() {
    const [servicio, setServicio] = useState(
      orden?.servicio || "AIRES ACONDICIONADOS"
    );
    const [tipoMovimiento, setTipoMovimiento] = useState("Pago");

    function onCargarPago() {
      const monto = prompt("Monto del pago (ej: 120,00)", "");
      if (!monto) return;
      const fila = {
        fecha: new Date().toLocaleDateString("es-ES"),
        tipo: tipoMovimiento,
        descripcion: "Registro manual",
        monto: `${monto} €`,
      };
      setPagos((p) => [...p, fila]);
    }

    return (
      <Frosted className="p-3">
        <div
          className="flex flex-wrap items-center gap-2 pb-3 border-b"
          style={{ borderColor: COLORS.border }}
        >
          <div className="text-white/80 text-xs flex items-center gap-2">
            <label className="opacity-70">Servicio</label>
            <input
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white outline-none min-w-[240px]"
            />
            <label className="opacity-70 ml-3">Tipo</label>
            <select
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white outline-none"
            >
              <option>Pago</option>
              <option>Abono</option>
              <option>Ajuste</option>
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button tone="primary" onClick={onCargarPago}>
              Cargar pago
            </Button>
            <Button tone="primary">Parte de trabajo</Button>
            <Button tone="primary">Crear factura</Button>
          </div>
        </div>

        <div className="overflow-x-auto pt-3">
          <table className="min-w-full text-left text-sm text-white/90">
            <thead className="text-white/70">
              <tr>
                <th className="px-3 py-2">FECHA</th>
                <th className="px-3 py-2">TIPO</th>
                <th className="px-3 py-2">DESCRIPCIÓN</th>
                <th className="px-3 py-2">MONTO</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 && (
                <tr
                  className="border-t"
                  style={{ borderColor: COLORS.border }}
                >
                  <td className="px-3 py-3 text-white/60" colSpan={4}>
                    No se han registrado pagos de la orden
                  </td>
                </tr>
              )}
              {pagos.map((p, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: COLORS.border }}
                >
                  <td className="px-3 py-2">{p.fecha}</td>
                  <td className="px-3 py-2">{p.tipo}</td>
                  <td className="px-3 py-2">{p.descripcion}</td>
                  <td className="px-3 py-2">{p.monto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Frosted>
    );
  }

  function TabDocumentos() {
    function onAdjuntar() {
      alert(
        "Abrir selector de arquivos / drag & drop para adjuntar documentos."
      );
    }
    return (
      <Frosted className="p-3">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white/90">
            <thead className="text-white/70">
              <tr>
                <th className="px-3 py-2">FECHA</th>
                <th className="px-3 py-2">DOCUMENTO</th>
                <th className="px-3 py-2">GENERADO</th>
                <th className="px-3 py-2">REVISAR</th>
                <th className="px-3 py-2">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: COLORS.border }}
                >
                  <td className="px-3 py-2">{d.fecha}</td>
                  <td className="px-3 py-2">{d.documento}</td>
                  <td className="px-3 py-2">{d.generado}</td>
                  <td className="px-3 py-2">
                    <Button tone="primary" className="!px-2 !py-1">
                      ver doc
                    </Button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button tone="ghost" className="!px-2 !py-1">
                        📤
                      </Button>
                      <Button tone="ghost" className="!px-2 !py-1">
                        ≡
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pt-3">
          <Button tone="ghost" onClick={onAdjuntar}>
            Adjuntar documento
          </Button>
        </div>
      </Frosted>
    );
  }

  function EstadosLinea({ estado }) {
    return (
      <div className="flex gap-3 text-xs">
        <span
          className={
            "font-semibold " +
            (estado === "SOLICITADA" ? "text-white" : "text-white/70")
          }
        >
          Solicitada
        </span>
        <span
          className={
            "font-semibold " +
            (estado === "TRABAJANDO" ? "text-white" : "text-white/70")
          }
        >
          Trabajando
        </span>
        <span
          className={
            "font-semibold " +
            (estado === "RESUELTA" ? "text-white" : "text-white/70")
          }
        >
          Resuelto
        </span>
        {estado === "CANCELADA" && (
          <span className="font-semibold text-red-400">Cancelada</span>
        )}
      </div>
    );
  }

  function GarantiaCard({ g, defaultExpanded = false }) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const step = garantiaStepFromEstado(g.estado);
    const buttonLabel = expanded ? "Cerrar" : "Abrir";

    return (
      <Frosted
        className="p-3"
        blur={18}
        style={{ background: garantiaTint(g.estado) }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-base font-semibold">
              Garantía #{(orden?.id || ORDER_ID) + "-G" + (g.id || "")}
            </div>
            <EstadosLinea estado={g.estado} />
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <span className="text-xs">Solicitada {g.fecha}</span>
            <Button
              tone="ghost"
              className="!px-3 !py-1.5"
              onClick={() => setExpanded(!expanded)}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3">
            <Frosted className="p-3 text-white/85" blur={20}>
              <div className="text-xs opacity-70 mb-1">Información</div>
              <div className="text-sm">
                Cliente comunica que aire acondicionado ha dejado de funcionar
              </div>
            </Frosted>

            <Frosted className="p-2" blur={16}>
              <div className="px-2">
                <Timeline
                  etapas={["Solicitada", "Trabajando", "Resuelto"]}
                  activo={g.estado === "CANCELADA" ? 0 : step}
                />
              </div>
            </Frosted>

            <Frosted className="p-2" blur={16}>
              <div className="text-white/80 text-xs px-2 py-1">
                Oficina: Caso{" "}
                {g.estado === "RESUELTA"
                  ? "resuelto. Se reemplazó fusible."
                  : g.estado === "CANCELADA"
                  ? "cancelado por cliente."
                  : "en gestión."}{" "}
                — {g.fecha} 12:40
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  placeholder="Escribe un mensaje"
                  className="flex-1 bg-transparent text-white/90 placeholder-white/50 outline-none px-3 py-2"
                />
                <Button tone="primary">Enviar</Button>
              </div>
            </Frosted>
          </div>
        )}
      </Frosted>
    );
  }

  function TabGarantia() {
    return (
      <div className="space-y-3">
        {garantias.map((g, idx) => (
          <GarantiaCard key={g.id} g={g} defaultExpanded={idx === 0} />
        ))}
        <div className="pt-1">
          <Button tone="primary">Crear garantía</Button>
        </div>
      </div>
    );
  }

  // =========== LAYOUT PRINCIPAL (FUNDO + CENTRALIZAÇÃO) ===========
  return (
    <div className="relative min-h-screen w-full bg-[url('../assets/images/ciudad-de-les-artes.png')] bg-cover bg-center">
      <div className="min-h-screen w-full bg-black/70 flex flex-col items-center px-4 py-6 text-white">
        {/* Container central com mesma largura do panel-obras */}
        <div className="w-full max-w-[1180px] flex flex-col lg:flex-row gap-4">
          {/* Coluna principal */}
          <div className="w-full lg:w-[740px] space-y-3">
            <Header />

            {/* TIMELINE ESTADO DE SERVICIO */}
            <Frosted>
              <Timeline etapas={etapas} activo={timelineIndex} />
            </Frosted>

            <Frosted className="p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  "COSTO DE OBRA",
                  "TAREAS",
                  "ACTIVIDAD",
                  "TECNICOS",
                  "FACTURACION",
                  "DOCUMENTOS",
                  "GARANTIA",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={
                      "text-[11px] font-semibold px-3 py-1 rounded-lg border " +
                      (tab === t
                        ? "bg-white text-black"
                        : "bg-transparent text-white/80 border-white/20")
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Frosted>

            {loading && (
              <Frosted className="p-4 text-white/80">Cargando…</Frosted>
            )}
            {error && (
              <Frosted className="p-4 text-amber-200">{error}</Frosted>
            )}

            {!loading && tab === "ACTIVIDAD" && <TabActividad />}
            {!loading && tab === "COSTO DE OBRA" && <TabCoste />}
            {!loading && tab === "TAREAS" && <TabTareas />}
            {!loading && tab === "TECNICOS" && <TabTecnicos />}
            {!loading && tab === "FACTURACION" && <TabFacturacion />}
            {!loading && tab === "DOCUMENTOS" && <TabDocumentos />}
            {!loading && tab === "GARANTIA" && <TabGarantia />}
          </div>

          {/* Coluna lateral */}
          <div className="w-full lg:w-[340px]">
            <RightAside />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MONTAR NO ROOT =====
const rootEl = document.getElementById("root");
const root = ReactDOM.createRoot(rootEl);
root.render(<OrdenDeTrabajoV3 />);
