const { useEffect, useState } = React;

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

function Frosted({ children, className = "", style = {} }) {
  return (
    <div
      className={
        "rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.25)] " + className
      }
      style={{
        borderColor: COLORS.border,
        background: COLORS.glass,
        backdropFilter: "blur(18px)",
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

function AvatarPresupuesto({ titulo }) {
  const parts = (titulo || "").split(/\s+/).filter(Boolean);
  const first = parts[0] || "";
  const second = parts[1] || "";
  const initials =
    (first[0] || "").toUpperCase() + (second[0] || "").toUpperCase();
  return (
    <div
      className="h-8 w-8 rounded-full grid place-items-center text-[11px] font-bold text-white shadow-lg"
      style={{ backgroundColor: COLORS.avatar }}
    >
      {initials || "PR"}
    </div>
  );
}

function EstadoPill({ estado }) {
  let bg = "bg-slate-500/30 text-slate-100";
  if (estado === "En estudio") bg = "bg-sky-500/20 text-sky-100";
  if (estado === "En curso") bg = "bg-emerald-500/20 text-emerald-100";
  if (estado === "Parado") bg = "bg-amber-500/20 text-amber-100";
  if (estado === "Facturado") bg = "bg-indigo-500/20 text-indigo-100";
  if (estado === "Cerrado") bg = "bg-slate-600/40 text-slate-100";

  return (
    <span className={"px-2 py-[3px] rounded-full text-[11px] " + bg}>
      {estado}
    </span>
  );
}

function BarraProgreso({ value }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-2 rounded-full"
        style={{
          width: v + "%",
          background:
            "linear-gradient(90deg, rgba(56,189,248,1) 0%, rgba(34,197,94,1) 100%)",
        }}
      />
    </div>
  );
}

const OBRA_INFO = {
  id: 101,
  codigo: "OB-2025-001",
  nombre: "Calle Jesús 12",
  cliente: "TELDOMO",
  direccion: "Calle Jesús 12, 46007 — Valencia",
  tipo: "Rehabilitación de fachada e impermeabilización",
  estado: "En curso",
  fechaInicio: "03/11/2025",
  fechaPrevistaFin: "30/01/2026",
};

const MOCK_PRESUPUESTOS = [
  {
    id: 464,
    titulo: "Reparación de fachada",
    codigoPresupuesto: "1-23255",
    estado: "Facturado",
    importe: 7230.5,
    avance: 100,
    contactoNombre: "JOSÉ LUIS",
    contactoTelefono: "635 220 271",
    ultimaActualizacion: "14:10:19",
  },
  {
    id: 472,
    titulo: "Impermeabilización de terraza",
    codigoPresupuesto: "1-23269",
    estado: "En curso",
    importe: 12320.0,
    avance: 81,
    contactoNombre: "FELIPE ALMEIDA",
    contactoTelefono: "635 220 271",
    ultimaActualizacion: "10:11:20",
  },
  {
    id: 481,
    titulo: "Impermeabilización cubierta",
    codigoPresupuesto: "1-23280",
    estado: "En estudio",
    importe: 9800.0,
    avance: 22,
    contactoNombre: "ANDRÉ FELIPE",
    contactoTelefono: "635 220 271",
    ultimaActualizacion: "10:11:20",
  },
  {
    id: 489,
    titulo: "Patologías forjados — Escalera interior",
    codigoPresupuesto: "1-23299",
    estado: "Parado",
    importe: 8650.5,
    avance: 77,
    contactoNombre: "AMANECIO",
    contactoTelefono: "635 220 271",
    ultimaActualizacion: "Ayer",
  },
];

const MOCK_ACTIVIDADES = [
  {
    id: 1,
    tipo: "foto",
    texto: "JORGE COY · ha subido una foto de la fachada principal",
    hace: "hace 3 min",
  },
  {
    id: 2,
    tipo: "documento",
    texto: "CATALIN ANGHELO · ha subido una factura de compra",
    hace: "hace 3 h",
  },
  {
    id: 3,
    tipo: "estado",
    texto: "Presupuesto 1-23255 ha pasado a estado Facturado",
    hace: "ayer",
  },
];

// ====== ACTIVIDADES DETALLADAS PARA LA PANTALLA "VER MÁS" ======
const ACTIVIDADES_DETALLADAS = [
  {
    id: 101,
    fechaGrupo: "Hoy",
    hora: "09:12",
    tipo: "fichaje",
    actor: "JORGE COY",
    contexto: "Calle Jesús 12",
    descripcion: "ha fichado ENTRADA en la obra",
    detalle: "Entrada · 09:12 · App móvil",
  },
  {
    id: 102,
    fechaGrupo: "Hoy",
    hora: "09:15",
    tipo: "foto",
    actor: "JORGE COY",
    contexto: "Calle Jesús 12",
    descripcion: "ha subido una foto de la fachada principal",
    detalle: "Foto añadida al parte diario",
  },
  {
    id: 103,
    fechaGrupo: "Hoy",
    hora: "10:03",
    tipo: "mensaje",
    actor: "ANGELO",
    contexto: "Presupuesto 1-23255",
    descripcion: "envió un mensaje en el presupuesto 1-23255",
    detalle: "“Revisar grietas en el lateral izquierdo antes de cerrar OT”",
  },
  {
    id: 104,
    fechaGrupo: "Hoy",
    hora: "10:27",
    tipo: "documento",
    actor: "CATALIN ANGHELO",
    contexto: "Calle Jesús 12",
    descripcion: "ha subido una factura de compra",
    detalle: "Factura proveedor MATERIALES LEVANTE · 1.230,50 €",
  },
  {
    id: 105,
    fechaGrupo: "Hoy",
    hora: "11:02",
    tipo: "presupuesto",
    actor: "OFICINA TÉCNICA",
    contexto: "Calle Jesús 12",
    descripcion: "se ha creado el presupuesto 1-23310",
    detalle: "Presupuesto 1-23310 · Patologías forjados patio interior",
  },
  {
    id: 106,
    fechaGrupo: "Hoy",
    hora: "11:45",
    tipo: "pedido",
    actor: "CATALIN ANGHELO",
    contexto: "Calle Jesús 12",
    descripcion: "registró un pedido de materiales",
    detalle: "Pedido nº 58231 · Mortero monocapa · 18 sacos",
  },
  {
    id: 107,
    fechaGrupo: "Hoy",
    hora: "12:08",
    tipo: "estado",
    actor: "OFICINA TÉCNICA",
    contexto: "Presupuesto 1-23280",
    descripcion: "ha pasado a estado En curso",
    detalle: "Presupuesto 1-23280 · Impermeabilización cubierta",
  },
  {
    id: 108,
    fechaGrupo: "Hoy",
    hora: "13:32",
    tipo: "fichaje",
    actor: "LUIS RAMOS",
    contexto: "Calle Jesús 12",
    descripcion: "ha fichado SALIDA para la pausa comida",
    detalle: "Salida · 13:32 · Pausa comida",
  },
  {
    id: 109,
    fechaGrupo: "Ayer",
    hora: "08:57",
    tipo: "presupuesto",
    actor: "OFICINA TÉCNICA",
    contexto: "Calle Jesús 12",
    descripcion: "se ha vinculado el presupuesto 1-23299 a la obra",
    detalle:
      "Presupuesto 1-23299 · Patologías forjados — Escalera interior",
  },
  {
    id: 110,
    fechaGrupo: "Ayer",
    hora: "10:41",
    tipo: "estado",
    actor: "OFICINA TÉCNICA",
    contexto: "Presupuesto 1-23255",
    descripcion: "ha pasado a estado Facturado",
    detalle: "Importe final · 7.230,50 €",
  },
  {
    id: 111,
    fechaGrupo: "Esta semana",
    hora: "16:12",
    tipo: "mensaje",
    actor: "ADMINISTRACIÓN",
    contexto: "Presupuesto 1-23269",
    descripcion: "envió un mensaje al cliente",
    detalle:
      "“Adjuntamos presupuesto para impermeabilización de terraza”",
  },
  {
    id: 112,
    fechaGrupo: "Esta semana",
    hora: "17:03",
    tipo: "documento",
    actor: "ADMINISTRACIÓN",
    contexto: "Presupuesto 1-23269",
    descripcion: "ha subido la factura emitida al cliente",
    detalle: "Factura nº F-2025-0341 · 12.320,00 €",
  },
];

const MOCK_TECNICOS_OBRA = [
  { id: 1, nombre: "JORGE COY", estado: "OPERANDO" },
  { id: 2, nombre: "LUIS RAMOS", estado: "EN PAUSA" },
  { id: 3, nombre: "CATALIN ANGELO", estado: "OPERANDO" },
];

const ESTADO_TECNICO_COLORS = {
  OPERANDO: { dot: "#22c55e", label: "Operando" },
  "EN PAUSA": { dot: "#facc15", label: "En pausa" },
  AUSENTE: { dot: "#f97316", label: "Ausente" },
  BAJA: { dot: "#ef4444", label: "Baja" },
};

function AvatarTecnicoObra({ tecnico }) {
  const parts = tecnico.nombre.split(" ");
  const initials =
    (parts[0]?.[0] || "").toUpperCase() +
    (parts[1]?.[0] || "").toUpperCase();
  const cfg =
    ESTADO_TECNICO_COLORS[tecnico.estado] ||
    ESTADO_TECNICO_COLORS["OPERANDO"];

  return (
    <div className="relative group">
      <div className="h-9 w-9 rounded-full grid place-items-center text-[11px] font-bold text-white shadow-lg bg-orange-500/90 border border-white/20">
        {initials}
      </div>
      <span
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full border border-slate-900 shadow"
        style={{ backgroundColor: cfg.dot }}
      />
      <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900/95 text-[10px] text-white px-2 py-1 rounded-lg border border-white/10 whitespace-nowrap z-20">
        {tecnico.nombre} · {cfg.label}
      </div>
    </div>
  );
}

// ========= MODAL AÑADIR PRESUPUESTO / OT =========
function AddPresupuestoModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    tipoCliente: "CLIENTE POTENCIAL",
    nombreCliente: "",
    movil: "",
    telefono: "",
    correoCliente: "",
    nombreJefeObra: "",
    telefonoJefeObra: "",
    clienteEmiteCodigo: "NO",
    servicio: "",
    tipoTrabajo: "Orden de trabajo regular",
  });

  useEffect(() => {
    if (!open) {
      setForm({
        tipoCliente: "CLIENTE POTENCIAL",
        nombreCliente: "",
        movil: "",
        telefono: "",
        correoCliente: "",
        nombreJefeObra: "",
        telefonoJefeObra: "",
        clienteEmiteCodigo: "NO",
        servicio: "",
        tipoTrabajo: "Orden de trabajo regular",
      });
    }
  }, [open]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (onCreate) onCreate(form);
  }

  function handleClear() {
    setForm({
      tipoCliente: "CLIENTE POTENCIAL",
      nombreCliente: "",
      movil: "",
      telefono: "",
      correoCliente: "",
      nombreJefeObra: "",
      telefonoJefeObra: "",
      clienteEmiteCodigo: "NO",
      servicio: "",
      tipoTrabajo: "Orden de trabajo regular",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="font-semibold text-sm text-white">
            AÑADIR PRESUPUESTO / OT
          </div>
          <button
            className="text-white/60 hover:text-white text-lg leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 py-4 overflow-y-auto text-xs text-white"
        >
          <div className="mb-3">
            <label className="block mb-1 text-[11px] text-white/70">
              Seleccione el tipo de cliente
            </label>
            <select
              name="tipoCliente"
              value={form.tipoCliente}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            >
              <option>CLIENTE POTENCIAL</option>
              <option>CLIENTE HABITUAL</option>
              <option>COMUNIDAD DE PROPIETARIOS</option>
              <option>OTRO</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-[11px] text-white/70">
              Nombre del cliente
            </label>
            <input
              name="nombreCliente"
              value={form.nombreCliente}
              onChange={handleChange}
              placeholder="Nombre del cliente o nombre fiscal"
              className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1 text-[11px] text-white/70">
                Móvil
              </label>
              <input
                name="movil"
                value={form.movil}
                onChange={handleChange}
                placeholder="Indique el número de móvil"
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                type="tel"
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-white/70">
                Teléfono (opcional)
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Indique el número de teléfono"
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                type="tel"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-[11px] text-white/70">
              Correo del cliente (opcional)
            </label>
            <input
              name="correoCliente"
              value={form.correoCliente}
              onChange={handleChange}
              placeholder="Correo electrónico del cliente"
              className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              type="email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1 text-[11px] text-white/70">
                Nombre Jefe de obra
              </label>
              <input
                name="nombreJefeObra"
                value={form.nombreJefeObra}
                onChange={handleChange}
                placeholder="Nombre del jefe de la obra"
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                type="text"
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-white/70">
                Teléfono Jefe de obra
              </label>
              <input
                name="telefonoJefeObra"
                value={form.telefonoJefeObra}
                onChange={handleChange}
                placeholder="Móvil del jefe de la obra"
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                type="tel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1 text-[11px] text-white/70">
                El cliente emite código de pedido
              </label>
              <select
                name="clienteEmiteCodigo"
                value={form.clienteEmiteCodigo}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              >
                <option value="NO">NO</option>
                <option value="SI">SÍ</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-white/70">
                Servicio
              </label>
              <select
                name="servicio"
                value={form.servicio}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              >
                <option value="">seleccione un servicio</option>
                <option>Rehabilitación de fachada</option>
                <option>Impermeabilización</option>
                <option>Mantenimiento</option>
                <option>Urgencia / avería</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-[11px] text-white/70">
              Seleccione el tipo de trabajo
            </label>
            <select
              name="tipoTrabajo"
              value={form.tipoTrabajo}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            >
              <option>Orden de trabajo regular</option>
              <option>Orden de trabajo urgente</option>
              <option>Presupuesto sin ejecución inmediata</option>
            </select>
          </div>

          <div className="flex justify-between gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleClear}
              className="w-1/2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold py-2"
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="w-1/2 rounded-xl bg-[#007AFF] hover:bg-[#0060d6] text-xs font-semibold py-2"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========= ITEM VISUAL PARA LA LISTA DE ACTIVIDADES =========
function ActivityTypeDot({ tipo }) {
  let color = "bg-slate-400";
  if (tipo === "foto") color = "bg-sky-400";
  else if (tipo === "documento") color = "bg-amber-400";
  else if (tipo === "estado") color = "bg-emerald-400";
  else if (tipo === "fichaje") color = "bg-purple-400";
  else if (tipo === "mensaje") color = "bg-indigo-400";
  else if (tipo === "pedido") color = "bg-pink-400";
  else if (tipo === "presupuesto") color = "bg-cyan-400";

  return <span className={"h-2.5 w-2.5 rounded-full " + color} />;
}

function ActivityTypeBadge({ tipo }) {
  const map = {
    foto: "Foto subida",
    documento: "Documento / factura",
    estado: "Cambio de estado",
    fichaje: "Fichaje",
    mensaje: "Mensaje",
    pedido: "Pedido",
    presupuesto: "Presupuesto",
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] bg-white/5 border border-white/10">
      <ActivityTypeDot tipo={tipo} />
      <span>{map[tipo] || "Actividad"}</span>
    </span>
  );
}

// ========= PANTALLA COMPLETA · ÚLTIMAS ACTIVIDADES =========
function UltimasActividadesView({ onVolver }) {
  const [filtro, setFiltro] = useState("TODOS");

  const tipos = [
    "TODOS",
    "fichaje",
    "foto",
    "mensaje",
    "documento",
    "pedido",
    "presupuesto",
    "estado",
  ];

  const actividadesFiltradas = ACTIVIDADES_DETALLADAS.filter((a) =>
    filtro === "TODOS" ? true : a.tipo === filtro
  );

  // agrupación simple por fechaGrupo
  const grupos = actividadesFiltradas.reduce((acc, act) => {
    if (!acc[act.fechaGrupo]) acc[act.fechaGrupo] = [];
    acc[act.fechaGrupo].push(act);
    return acc;
  }, {});

  const ordenFecha = ["Hoy", "Ayer", "Esta semana"];

  return (
    <div className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="min-h-screen w-full bg-black/75 flex flex-col items-center px-4 py-6 text-white">
        <div className="w-full max-w-[1180px] space-y-4">
          <Frosted className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-[12px] opacity-70 uppercase tracking-wide">
                  Últimas actividades · Obra
                </div>
                <div className="text-xl font-semibold">
                  {OBRA_INFO.nombre}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Cliente: {OBRA_INFO.cliente} · {OBRA_INFO.tipo}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Aquí se muestran todas las acciones realizadas por los
                  técnicos y la oficina sobre esta obra y sus órdenes /
                  presupuestos.
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button tone="ghost" onClick={onVolver}>
                  ← Volver al panel de gestión
                </Button>
                <div className="text-[11px] text-white/60">
                  Técnicos asignados:
                </div>
                <div className="flex gap-2">
                  {MOCK_TECNICOS_OBRA.map((t) => (
                    <AvatarTecnicoObra key={t.id} tecnico={t} />
                  ))}
                </div>
              </div>
            </div>
          </Frosted>

          <Frosted className="p-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div>
                <div className="text-sm font-semibold">
                  Línea de tiempo de la obra
                </div>
                <div className="text-[11px] text-white/70 mt-1">
                  Fichajes, fotos, documentos, pedidos, cambios de estado,
                  mensajes y creación de presupuestos.
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {tipos.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFiltro(t)}
                    className={
                      "px-2.5 py-1 rounded-full text-[11px] border transition " +
                      (filtro === t
                        ? "bg-white text-slate-900 border-white"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10")
                    }
                  >
                    {t === "TODOS"
                      ? "Todos"
                      : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-5">
                  {ordenFecha.map((grupo) =>
                    grupos[grupo] ? (
                      <div key={grupo}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-px flex-1 bg-white/10" />
                          <div className="text-[11px] uppercase tracking-wide text-white/60">
                            {grupo}
                          </div>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div className="space-y-3">
                          {grupos[grupo].map((act) => (
                            <div key={act.id} className="relative pl-8">
                              <div className="absolute left-2 top-2 -translate-x-1/2">
                                <div className="h-3 w-3 rounded-full bg-slate-900 border border-white/30 grid place-items-center">
                                  <ActivityTypeDot tipo={act.tipo} />
                                </div>
                              </div>

                              <div className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <div className="text-[11px] text-white/60">
                                      {act.hora} · {act.contexto}
                                    </div>
                                    <div className="text-[13px] text-white mt-0.5">
                                      <span className="font-semibold">
                                        {act.actor}
                                      </span>{" "}
                                      {act.descripcion}
                                    </div>
                                  </div>
                                  <ActivityTypeBadge tipo={act.tipo} />
                                </div>
                                {act.detalle && (
                                  <div className="text-[11px] text-white/65 mt-1">
                                    {act.detalle}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </Frosted>
        </div>
      </div>
    </div>
  );
}

// ========= PANEL PRINCIPAL =========
function PanelGestionObra() {
  const API_BASE = window.MANO_API_BASE || null;

  const [presupuestos, setPresupuestos] = useState(MOCK_PRESUPUESTOS);
  const [lastSync, setLastSync] = useState(new Date());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState(
    MOCK_PRESUPUESTOS[0]
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("panel"); // "panel" | "actividades"

  useEffect(() => {
    let intervalId;

    async function fetchPresupuestos() {
      if (!API_BASE) {
        setPresupuestos((prev) =>
          prev.map((p, idx) => {
            if (idx === 1 || Math.random() < 0.15) {
              const isCerrado =
                p.estado === "Facturado" || p.estado === "Cerrado";
              const nuevoAvance = isCerrado
                ? 100
                : Math.min(100, p.avance + Math.round(Math.random() * 4));
              let nuevoEstado = p.estado;
              if (nuevoAvance >= 100 && p.estado === "En curso") {
                nuevoEstado = "Facturado";
              }
              return {
                ...p,
                avance: nuevoAvance,
                estado: nuevoEstado,
                ultimaActualizacion: new Date().toLocaleTimeString("es-ES"),
              };
            }
            return p;
          })
        );
        setLastSync(new Date());
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          (API_BASE || "") + "/obras/" + OBRA_INFO.id + "/presupuestos"
        );
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        setPresupuestos(data);
        setLastSync(new Date());
      } catch (e) {
        console.error(e);
        setError("No se pudieron actualizar los presupuestos en tiempo real.");
      } finally {
        setLoading(false);
      }
    }

    fetchPresupuestos();
    intervalId = setInterval(fetchPresupuestos, 15000);

    return () => clearInterval(intervalId);
  }, [API_BASE]);

  const stats = (() => {
    const total = presupuestos.length;
    const enCurso = presupuestos.filter((p) => p.estado === "En curso").length;
    const facturados = presupuestos.filter((p) => p.estado === "Facturado")
      .length;
    const importeTotal = presupuestos.reduce(
      (acc, p) => acc + (p.importe || 0),
      0
    );
    return { total, enCurso, facturados, importeTotal };
  })();

  // ÚNICA função manejar clicar em "Gestionar orden"
  function handleGestionarOrden(p) {
    const url = new URL("orden-trabajo-v3-tabs.html", window.location.href);
    url.searchParams.set("id", p.id);
    url.searchParams.set("titulo", p.titulo);
    url.searchParams.set("codigo", p.codigoPresupuesto);
    url.searchParams.set("contacto", p.contactoNombre || "");
    url.searchParams.set("telefono", p.contactoTelefono || "");
    url.searchParams.set("cliente", OBRA_INFO.cliente || "");
    url.searchParams.set("direccion", OBRA_INFO.direccion || "");
    window.location.href = url.toString();
  }

  function handleVerGoogleMaps() {
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(OBRA_INFO.direccion);
    window.open(url, "_blank");
  }

  function handleModificarObra() {
    alert("Acción para MODIFICAR OBRA (abrir pantalla de edición de obra).");
  }

  function handleAñadirPresupuesto() {
    setShowAddModal(true);
  }

  function handleAccesos() {
    window.location.href = "Accesos/accesos.html";
  }

  function handleCreatePresupuesto(form) {
    const nuevo = {
      id: Date.now(),
      titulo: form.tipoTrabajo,
      codigoPresupuesto: "AUTO-" + Date.now().toString().slice(-4),
      estado: "En estudio",
      importe: 0,
      avance: 0,
      contactoNombre: form.nombreCliente || "CONTACTO",
      contactoTelefono: form.movil || "",
      ultimaActualizacion: new Date().toLocaleTimeString("es-ES"),
    };
    setPresupuestos((prev) => [nuevo, ...prev]);
    setShowAddModal(false);
    alert("Presupuesto / OT creado (simulación en la vista previa).");
  }

  // ======= RENDER ALTERNANDO VISTAS =======
  if (view === "actividades") {
    return (
      <>
        <UltimasActividadesView onVolver={() => setView("panel")} />
        <AddPresupuestoModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreatePresupuesto}
        />
      </>
    );
  }

  // ======= VISTA PRINCIPAL PANEL =======
  return (
    <>
      <div className="relative min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="min-h-screen w-full bg-black/70 flex flex-col items-center px-4 py-6 text-white">
          <div className="w-full max-w-[1180px] space-y-4">
            <Frosted className="p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <div className="text-[12px] opacity-70 uppercase tracking-wide">
                    Panel de gestión · Obra
                  </div>
                  <div className="text-xl font-semibold">
                    {OBRA_INFO.nombre}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Cliente: {OBRA_INFO.cliente} · {OBRA_INFO.tipo}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {OBRA_INFO.direccion}
                  </div>
                  <div className="text-[11px] opacity-60 mt-1">
                    Inicio: {OBRA_INFO.fechaInicio} · Prevista fin:{" "}
                    {OBRA_INFO.fechaPrevistaFin}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-xs">
                  <div
                    className={
                      "flex items-center gap-2 px-2 py-1 rounded-full " +
                      (error
                        ? "bg-red-500/20 text-red-100"
                        : "bg-emerald-500/20 text-emerald-100")
                    }
                  >
                    <span
                      className={
                        "h-2 w-2 rounded-full " +
                        (error
                          ? "bg-red-400"
                          : "bg-emerald-400 animate-pulse")
                      }
                    />
                    <span>
                      {error
                        ? "Error en actualización en tiempo real"
                        : "En tiempo real activo"}
                    </span>
                  </div>
                  <div className="opacity-70">
                    {lastSync
                      ? "Última sincronización: " +
                        lastSync.toLocaleTimeString("es-ES")
                      : "Sincronizando…"}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {MOCK_TECNICOS_OBRA.map((t) => (
                      <AvatarTecnicoObra key={t.id} tecnico={t} />
                    ))}
                  </div>
                </div>
              </div>
            </Frosted>

            <Frosted className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">
                  Acciones rápidas de la obra
                </div>
                <div className="text-[11px] text-white/70 mt-1">
                  Enlaces y herramientas para gestionar esta obra en general.
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleVerGoogleMaps}>
                  Ver dirección en Google Maps
                </Button>
                <Button tone="ghost" onClick={handleModificarObra}>
                  Modificar obra
                </Button>
                <Button tone="ghost" onClick={handleAñadirPresupuesto}>
                  Añadir presupuesto / OT
                </Button>
                <Button tone="ghost" onClick={handleAccesos}>
                  Accesos
                </Button>
              </div>
            </Frosted>

            <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1.1fr,1.2fr] gap-3">
              <Frosted className="p-3">
                <div className="text-[11px] opacity-70 mb-1">
                  Órdenes / presupuestos de la obra
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {stats.total}
                </div>
                <div className="text-[11px] opacity-70 mt-1">
                  {stats.enCurso} en curso · {stats.facturados} facturados
                </div>
              </Frosted>

              <Frosted className="p-3">
                <div className="text-[11px] opacity-70 mb-1">
                  Importe total estimado
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {stats.importeTotal.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </div>
                <div className="text-[11px] opacity-70 mt-1">
                  Suma de todos los presupuestos vinculados a esta obra
                </div>
              </Frosted>

              <Frosted className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold">
                    Últimas actividades
                  </div>
                  <Button
                    tone="ghost"
                    className="!px-2 !py-1 text-[11px]"
                    onClick={() => setView("actividades")}
                  >
                    Ver más
                  </Button>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {MOCK_ACTIVIDADES.map((a) => (
                    <div key={a.id} className="flex items-start gap-2">
                      <span
                        className={
                          "mt-[3px] h-2 w-2 rounded-full " +
                          (a.tipo === "foto"
                            ? "bg-sky-400"
                            : a.tipo === "documento"
                            ? "bg-amber-400"
                            : "bg-emerald-400")
                        }
                      />
                      <div className="flex-1">
                        <div className="text-white/90">{a.texto}</div>
                        <div className="text-white/50">{a.hace}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Frosted>
            </div>

            <Frosted className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold">
                  Órdenes / presupuestos de la obra ({presupuestos.length})
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  {loading && (
                    <span className="opacity-70">Actualizando…</span>
                  )}
                  <Button
                    tone="ghost"
                    className="!px-2 !py-1"
                    onClick={() => window.location.reload()}
                  >
                    Refrescar
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs text-white/90">
                  <thead className="text-white/70">
                    <tr>
                      <th className="px-3 py-2">ORDEN / PRESUPUESTO</th>
                      <th className="px-3 py-2">CONTACTO</th>
                      <th className="px-3 py-2">ESTADO</th>
                      <th className="px-3 py-2 text-right">IMPORTE</th>
                      <th className="px-3 py-2 w-[170px]">AVANCE</th>
                      <th className="px-3 py-2 text-right">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presupuestos.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
                        onClick={() => setSelectedPresupuesto(p)}
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="text-[13px] font-semibold">
                                {p.titulo}
                              </div>
                              <div className="text-[11px] text-white/60">
                                Presupuesto {p.codigoPresupuesto} · OT #
                                {p.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <div className="text-[13px]">
                            {p.contactoNombre}
                          </div>
                          <div className="text-[11px] text-white/70">
                            {p.contactoTelefono}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <EstadoPill estado={p.estado} />
                          <div className="text-[10px] text-white/50 mt-1">
                            Actualizado: {p.ultimaActualizacion}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top text-right">
                          <div className="text-[13px]">
                            {p.importe.toLocaleString("es-ES", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <BarraProgreso value={p.avance} />
                          <div className="text-[11px] text-white/70 mt-1 text-right">
                            {p.avance}% completado
                          </div>
                        </td>
                        <td className="px-3 py-3 align-top text-right">
                          <Button
                            tone="primary"
                            className="!px-3 !py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGestionarOrden(p);
                            }}
                          >
                            Gestionar orden
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Frosted>
          </div>
        </div>
      </div>

      <AddPresupuestoModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleCreatePresupuesto}
      />
    </>
  );
}

function Component() {
  return <PanelGestionObra />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Component />);
