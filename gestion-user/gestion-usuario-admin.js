const { useState, useMemo } = React;

// =================== PALETA / BASE ===================
const COLORS = {
  primary: "#16A34A",
  accent: "#10B981",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#dc2626",
  muted: "rgba(255,255,255,0.35)",
  avatar: "#ff6019",
  border: "rgba(255,255,255,0.12)",
  glass: "rgba(10,14,25,0.72)", // igual ?s outras telas
};

const TABS = [
  "DATOS",
  "CONDUCCIÓN",
  "FORMACIÓN",
  "FICHAJES",
  "AUSENCIA",
  "VACACIONES",
];

// =================== COMPONENTES BASE ===================
function PageShell({ children }) {
  return (
    <div className="min-h-screen w-full relative">
      <div className="min-h-screen w-full px-4 py-6 relative z-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
}

function Frosted({ children, className = "", style = {} }) {
  return (
    <div
      className={
        "rounded-2xl border shadow-[0_18px_50px_rgba(0,0,0,0.35)] bg-slate-900/70 backdrop-blur-2xl border-white/10 " +
        className
      }
      style={style}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="px-4 py-2 border-b border-white/10 bg-white/5 text-white/90 text-sm font-semibold tracking-wide">
      {children}
    </div>
  );
}

function Labeled({ label, children, required = false }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] text-white/70">
        {label}
        {required && <span className="text-red-300 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        "rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 px-3 py-2 outline-none " +
        (props.className || "")
      }
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={
        "rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 outline-none " +
        (props.className || "")
      }
    >
      {props.children}
    </select>
  );
}

function Button({ tone = "primary", children, className = "", ...rest }) {
  const map = {
    primary: "bg-[#16a34a] text-white hover:bg-[#15803d]",
    ghost:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };
  return (
    <button
      {...rest}
      className={
        "rounded-xl px-4 py-2 text-sm font-semibold transition " +
        map[tone] +
        " " +
        className
      }
    >
      {children}
    </button>
  );
}

// Avatar com iniciais + bolinha de estado
function Avatar({ name, status }) {
  const initials =
    (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("") || "—";

  let dotColor = "rgba(148,163,184,1)"; // cinza
  if (status === "OPERANDO") dotColor = "#22c55e"; // verde
  else if (status === "EN PAUSA") dotColor = "#facc15"; // amarelo
  else if (status === "BAJA") dotColor = "#ef4444";

  return (
    <div className="relative">
      <div
        className="h-20 w-20 rounded-full grid place-items-center text-white text-2xl font-extrabold shadow-lg border border-white/20"
        style={{ backgroundColor: COLORS.avatar }}
        title={name}
      >
        {initials}
      </div>
      <span
        className="absolute -bottom-1 right-1 h-4 w-4 rounded-full border border-slate-900 shadow"
        style={{ backgroundColor: dotColor }}
      />
    </div>
  );
}

// Header com avatar + tabs + estado
function Header({ nombre, estado, tab, setTab }) {
  const estadoLabel = (() => {
    if (estado === "OPERANDO") return "Operando";
    if (estado === "EN PAUSA") return "En pausa";
    if (estado === "BAJA") return "Baja";
    if (estado === "SIN FICHAR") return "Sin fichar";
    return estado || "Sin estado";
  })();
  const estadoSlug = (() => {
    if (estado === "OPERANDO") return "operando";
    if (estado === "EN PAUSA") return "receso";
    if (estado === "BAJA") return "ausente";
    if (estado === "SIN FICHAR") return "neutral";
    return "neutral";
  })();

  return (
    <Frosted className="mb-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={nombre} status={estado} />
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {nombre}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <ui-pill
                state={estadoSlug}
                label={estadoLabel.toUpperCase()}
              ></ui-pill>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/70">
                ID interno · #00464
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "rounded-full px-4 py-1.5 text-[11px] font-semibold border transition " +
                (t === tab
                  ? "bg-[#16a34a] text-white border-[#15803d] shadow-[0_10px_30px_rgba(22,163,74,0.35)]"
                  : "bg-transparent text-white/80 border-white/15 hover:bg-white/10")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </Frosted>
  );
}

// =================== BLOCOS / TABS ===================

// Cards de documentos
function DocCard({ title, k, state, setState }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
      <div className="text-white/80 text-sm font-semibold mb-2">
        {title}
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Labeled label="Número">
          <Input
            value={state[k]?.numero || ""}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                [k]: { ...(s[k] || {}), numero: e.target.value },
              }))
            }
          />
        </Labeled>
        <Labeled label="Vencimiento">
          <Input
            type="date"
            value={state[k]?.vence || ""}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                [k]: { ...(s[k] || {}), vence: e.target.value },
              }))
            }
          />
        </Labeled>
        <Labeled label="Imagen">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setState((s) => ({
                ...s,
                [k]: {
                  ...(s[k] || {}),
                  file: e.target.files?.[0]?.name || "",
                },
              }))
            }
          />
        </Labeled>
      </div>
    </div>
  );
}

function BankCard({ state, setState }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
      <div className="text-white/80 text-sm font-semibold mb-2">
        INFORMACIÓN BANCARIA
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Labeled label="Entidad">
          <Input
            value={state.banco || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, banco: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Nº de cuenta">
          <Input
            value={state.cuenta || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, cuenta: e.target.value }))
            }
          />
        </Labeled>
      </div>
    </div>
  );
}

// ---- TAB DATOS
function TabDatos({ state, setState }) {
  return (
    <Frosted className="mb-4">
      <SectionTitle>INFORMACIÓN PERSONAL</SectionTitle>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Labeled label="Fecha de alta en SS" required>
          <Input
            type="date"
            value={state.altaSS}
            onChange={(e) =>
              setState((s) => ({ ...s, altaSS: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Email" required>
          <Input
            type="email"
            value={state.email}
            onChange={(e) =>
              setState((s) => ({ ...s, email: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Teléfono">
          <Input
            value={state.telefono}
            onChange={(e) =>
              setState((s) => ({ ...s, telefono: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Nombre" required>
          <Input
            value={state.nombre}
            onChange={(e) =>
              setState((s) => ({ ...s, nombre: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Apellido" required>
          <Input
            value={state.apellido}
            onChange={(e) =>
              setState((s) => ({ ...s, apellido: e.target.value }))
            }
          />
        </Labeled>
      </div>

      <SectionTitle>DOMICILIO</SectionTitle>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Labeled label="Municipio">
          <Input
            value={state.municipio}
            onChange={(e) =>
              setState((s) => ({ ...s, municipio: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Calle">
          <Input
            value={state.calle}
            onChange={(e) =>
              setState((s) => ({ ...s, calle: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Número">
          <Input
            value={state.numero}
            onChange={(e) =>
              setState((s) => ({ ...s, numero: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Piso">
          <Input
            value={state.piso}
            onChange={(e) =>
              setState((s) => ({ ...s, piso: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Puerta">
          <Input
            value={state.puerta}
            onChange={(e) =>
              setState((s) => ({ ...s, puerta: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Cód. Postal">
          <Input
            value={state.cp}
            onChange={(e) =>
              setState((s) => ({ ...s, cp: e.target.value }))
            }
          />
        </Labeled>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <DocCard
          title="DNI"
          k="dni"
          state={state}
          setState={setState}
        />
        <DocCard
          title="Tarjeta Sanitaria"
          k="sanitaria"
          state={state}
          setState={setState}
        />
        <BankCard state={state} setState={setState} />
      </div>

      <div className="p-4 flex justify-end">
        <Button>ACTUALIZAR</Button>
      </div>
    </Frosted>
  );
}

// ---- TAB CONDUCCIÓN
function TabConduccion({ state, setState }) {
  return (
    <Frosted className="mb-4">
      <SectionTitle>PERMISO DE CONDUCCIÓN</SectionTitle>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Labeled label="Permiso" required>
          <Select
            value={state.drivePerm || "NO PERMITIDO"}
            onChange={(e) =>
              setState((s) => ({ ...s, drivePerm: e.target.value }))
            }
          >
            {[
              "NO PERMITIDO",
              "B",
              "B+E",
              "C",
              "C+E",
              "D",
              "ADR",
            ].map((x) => (
              <option key={x} value={x} className="bg-zinc-900">
                {x}
              </option>
            ))}
          </Select>
        </Labeled>
        <Labeled label="Nº Carnet">
          <Input
            value={state.carnetNum || ""}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                carnetNum: e.target.value,
              }))
            }
          />
        </Labeled>
        <Labeled label="Vence">
          <Input
            type="date"
            value={state.carnetVence || ""}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                carnetVence: e.target.value,
              }))
            }
          />
        </Labeled>
        <Labeled label="Archivo (foto)">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setState((s) => ({
                ...s,
                carnetFile: e.target.files?.[0]?.name || "",
              }))
            }
          />
        </Labeled>
      </div>
      <div className="p-4 flex justify-end">
        <Button>GUARDAR</Button>
      </div>
    </Frosted>
  );
}

// ---- TAB FORMACIÓN
function TabFormacion({ state, setState }) {
  const addForm = () =>
    setState((s) => ({
      ...s,
      forms: [
        ...(s.forms || []),
        {
          id: "form-" + Date.now(),
          titulo: "Nueva formación",
          exp: "",
          ven: "",
          file: "",
        },
      ],
    }));

  const upd = (id, patch) =>
    setState((s) => ({
      ...s,
      forms: (s.forms || []).map((f) =>
        f.id === id ? { ...f, ...patch } : f
      ),
    }));

  const del = (id) =>
    setState((s) => ({
      ...s,
      forms: (s.forms || []).filter((f) => f.id !== id),
    }));

  return (
    <Frosted className="mb-4">
      <div className="flex items-center justify-between">
        <SectionTitle>FORMACIÓN DEL USUARIO</SectionTitle>
        <div className="pr-4">
          <Button tone="ghost" onClick={addForm}>
            + Añadir
          </Button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {(state.forms || []).map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-white/15 bg-white/5 p-3"
          >
            <div className="text-white/80 text-sm font-semibold mb-2">
              <Input
                value={f.titulo}
                onChange={(e) => upd(f.id, { titulo: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Labeled label="Fecha de expedición">
                <Input
                  type="date"
                  value={f.exp}
                  onChange={(e) => upd(f.id, { exp: e.target.value })}
                />
              </Labeled>
              <Labeled label="Fecha de vencimiento">
                <Input
                  type="date"
                  value={f.ven}
                  onChange={(e) => upd(f.id, { ven: e.target.value })}
                />
              </Labeled>
              <Labeled label="Imagen">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    upd(f.id, {
                      file: e.target.files?.[0]?.name || "",
                    })
                  }
                />
              </Labeled>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button tone="ghost" onClick={() => del(f.id)}>
                Eliminar
              </Button>
              <Button>Guardar</Button>
            </div>
          </div>
        ))}
      </div>
    </Frosted>
  );
}

// ---- TAB FICHAJES
function TabFichajes({ fichajes }) {
  const [open, setOpen] = useState(null);

  const monthKey = (fecha) => {
    const [dd, mm, yyyy] = fecha.split("-");
    return `${yyyy}-${mm}`;
  };

  const monthLabel = (key) => {
    const [y, m] = key.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  const groups = useMemo(() => {
    const map = new Map();
    fichajes.forEach((r) => {
      const k = monthKey(r.fecha);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(r);
    });

    const entries = Array.from(map.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    entries.forEach(([, arr]) =>
      arr.sort((a, b) => {
        const [da, ma, ya] = a.fecha.split("-");
        const [db, mb, yb] = b.fecha.split("-");
        return (
          new Date(`${ya}-${ma}-${da}`).getTime() -
          new Date(`${yb}-${mb}-${db}`).getTime()
        );
      })
    );
    return entries;
  }, [fichajes]);

  return (
    <Frosted className="mb-4">
      <SectionTitle>FICHAJES DEL USUARIO — Agrupado por mes</SectionTitle>
      <div className="p-4 space-y-3">
        {groups.map(([key, items]) => (
          <div
            key={key}
            className="rounded-xl border border-white/12 bg-white/5 overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === key ? null : key)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/10"
            >
              <div className="text-white/90 font-semibold capitalize">
                {monthLabel(key)}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm">
                  {items.length} registros
                </span>
                <span className="rounded-full bg-white/10 border border-white/15 text-white text-xs px-2 py-1">
                  {open === key ? "Ocultar" : "Ver detalles"}
                </span>
              </div>
            </button>
            {open === key && (
              <div className="px-3 pb-3 overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="text-white/70">
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Entrada</th>
                      <th className="px-3 py-2">Salida</th>
                      <th className="px-3 py-2">Tiempo trabajo</th>
                      <th className="px-3 py-2">Sitio</th>
                      <th className="px-3 py-2">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="px-3 py-2 text-white/90">
                          {r.fecha}
                        </td>
                        <td className="px-3 py-2 text-white/90">
                          {r.entrada}
                        </td>
                        <td className="px-3 py-2 text-white/90">
                          {r.salida}
                        </td>
                        <td className="px-3 py-2 text-white/90">
                          {r.tiempo}
                        </td>
                        <td className="px-3 py-2 text-white/90 truncate max-w-[240px]">
                          {r.sitio}
                        </td>
                        <td className="px-3 py-2">
                          <Button tone="ghost">Gestionar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </Frosted>
  );
}

// ---- TAB AUSENCIA
function TabAusencia({ state, setState }) {
  return (
    <Frosted className="mb-4">
      <SectionTitle>ESTABLECER AUSENCIA</SectionTitle>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Labeled label="Inicio" required>
          <Input
            type="date"
            value={state.ausIni || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, ausIni: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Regreso" required>
          <Input
            type="date"
            value={state.ausFin || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, ausFin: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Tipo" required>
          <Select
            value={state.ausTipo || "NO REMUNERADA"}
            onChange={(e) =>
              setState((s) => ({ ...s, ausTipo: e.target.value }))
            }
          >
            {[
              "NO REMUNERADA",
              "REMUNERADA",
              "BAJA",
              "MÉDICA",
              "OTRA",
            ].map((x) => (
              <option key={x} value={x} className="bg-zinc-900">
                {x}
              </option>
            ))}
          </Select>
        </Labeled>
        <Labeled label="Motivo">
          <input
            className="rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 px-3 py-2 outline-none"
            placeholder="Motivo"
            value={state.ausMotivo || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, ausMotivo: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Email gestoria">
          <Input
            type="email"
            value={state.ausEmail || "laboral@aficassores.com"}
            onChange={(e) =>
              setState((s) => ({ ...s, ausEmail: e.target.value }))
            }
          />
        </Labeled>
      </div>
      <div className="p-4 flex justify-end">
        <Button>Definir</Button>
      </div>
      <SectionTitle>HISTORIAL DE AUSENCIA</SectionTitle>
      <div className="p-4 text-white/70">No hay historial…</div>
    </Frosted>
  );
}

// ---- TAB VACACIONES
function TabVacaciones({ state, setState }) {
  return (
    <Frosted className="mb-4">
      <SectionTitle>ACUMULADO</SectionTitle>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-white/70">
              <th className="px-3 py-2">Mes</th>
              <th className="px-3 py-2">Fichaje lun/vie</th>
              <th className="px-3 py-2">Fichaje sab/dom</th>
              <th className="px-3 py-2">Acum. vacaciones</th>
            </tr>
          </thead>
          <tbody>
            {state.vacTable.map((r) => (
              <tr
                key={r.mes}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="px-3 py-2 text-white/90">{r.mes}</td>
                <td className="px-3 py-2 text-white/90">{r.lv}</td>
                <td className="px-3 py-2 text-white/90">{r.sd}</td>
                <td className="px-3 py-2 text-white/90">{r.acum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SectionTitle>ASIGNAR VACACIONES</SectionTitle>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Labeled label="Inicio">
          <Input
            type="date"
            value={state.vacIni || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, vacIni: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Regreso">
          <Input
            type="date"
            value={state.vacFin || ""}
            onChange={(e) =>
              setState((s) => ({ ...s, vacFin: e.target.value }))
            }
          />
        </Labeled>
        <Labeled label="Email gestión">
          <Input
            type="email"
            value={state.vacEmail || "laboral@aficassores.com"}
            onChange={(e) =>
              setState((s) => ({ ...s, vacEmail: e.target.value }))
            }
          />
        </Labeled>
      </div>
      <div className="p-4 flex justify-end">
        <Button>Definir</Button>
      </div>
      <SectionTitle>HISTORIAL</SectionTitle>
      <div className="p-4 text-white/70">Sin historial…</div>
    </Frosted>
  );
}

// =================== ROOT COMPONENT ===================
function GestionUsuarioAdminV2() {
  const [tab, setTab] = useState("DATOS");
  const [estadoActual] = useState("OPERANDO"); // usado para a bolinha do avatar

  const [state, setState] = useState({
    altaSS: "2025-04-09",
    email: "jorgec@manomanitas.es",
    nombre: "JORGE",
    apellido: "COY",
    municipio: "CHIVA",
    calle: "CALLE 20 POBLADO MEDITERR",
    numero: "PARCELA 117",
    piso: "1",
    puerta: "28",
    cp: "46360",
    telefono: "693339923",
    dni: {},
    sanitaria: {},
    banco: "",
    cuenta: "",
    drivePerm: "NO PERMITIDO",
    carnetNum: "",
    carnetVence: "",
    forms: [
      {
        id: "f1",
        titulo: "PREVENCIÓN RIESGOS ELÉCTRICOS",
        exp: "",
        ven: "",
        file: "",
      },
      {
        id: "f2",
        titulo: "APTO MÉDICO",
        exp: "",
        ven: "",
        file: "",
      },
    ],
    ausIni: "",
    ausFin: "",
    ausTipo: "NO REMUNERADA",
    ausMotivo: "",
    ausEmail: "laboral@aficassores.com",
    vacTable: [
      { mes: "Enero", lv: 1, sd: 1, acum: "0.11 día(s)" },
      { mes: "Febrero", lv: 0, sd: 0, acum: "0.00 día(s)" },
      { mes: "Marzo", lv: 1, sd: 0, acum: "0.11 día(s)" },
      { mes: "Abril", lv: 0, sd: 0, acum: "0.00 día(s)" },
      { mes: "Mayo", lv: 2, sd: 0, acum: "0.22 día(s)" },
      { mes: "Junio", lv: 0, sd: 0, acum: "0.00 día(s)" },
      { mes: "Julio", lv: 2, sd: 0, acum: "0.22 día(s)" },
      { mes: "Agosto", lv: 1, sd: 0, acum: "0.11 día(s)" },
      { mes: "Septiembre", lv: 0, sd: 0, acum: "0.00 día(s)" },
      { mes: "Octubre", lv: 1, sd: 0, acum: "0.11 día(s)" },
      { mes: "Noviembre", lv: 0, sd: 0, acum: "0.00 día(s)" },
    ],
  });

  const fichajes = useMemo(() => {
    const make = (day, mm, idPrefix) => ({
      id: `${idPrefix}-${String(day).padStart(2, "0")}-${mm}`,
      fecha: `${String(day).padStart(2, "0")}-${mm}-2025`,
      entrada: "08:12",
      salida: "16:00",
      tiempo: "07:48h",
      sitio: "Oficina — Sede Central",
    });
    return [
      ...Array.from({ length: 12 }, (_, i) => make(i + 1, "10", "OCT")),
      ...Array.from({ length: 8 }, (_, i) => make(i + 1, "09", "SEP")),
      ...Array.from({ length: 5 }, (_, i) => make(i + 20, "08", "AGO")),
    ];
  }, []);

  const fullName = `${state.nombre} ${state.apellido}`.trim();

  return (
    <PageShell>
      <Header
        nombre={fullName}
        estado={estadoActual}
        tab={tab}
        setTab={setTab}
      />
      {tab === "DATOS" && <TabDatos state={state} setState={setState} />}
      {tab === "CONDUCCIÓN" && (
        <TabConduccion state={state} setState={setState} />
      )}
      {tab === "FORMACIÓN" && (
        <TabFormacion state={state} setState={setState} />
      )}
      {tab === "FICHAJES" && <TabFichajes fichajes={fichajes} />}
      {tab === "AUSENCIA" && (
        <TabAusencia state={state} setState={setState} />
      )}
      {tab === "VACACIONES" && (
        <TabVacaciones state={state} setState={setState} />
      )}
    </PageShell>
  );
}

// MONTAR
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GestionUsuarioAdminV2 />);
