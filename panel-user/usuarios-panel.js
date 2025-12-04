const { useMemo, useState } = React;

const USERS = [
  {
    nombre: "ADMINISTRADOR",
    telefono: "600616000",
    estado: "SIN FICHAR",
    ultimo: "-",
    sitio: "-",
    episPend: false,
    vehiculo: "-",
  },
  {
    nombre: "ALMACEN",
    telefono: "600615600",
    estado: "SIN FICHAR",
    ultimo: "08:12",
    sitio: "Almacen central",
    episPend: false,
    vehiculo: "-",
  },
  {
    nombre: "BERNABE S.",
    telefono: "665973426",
    estado: "OPERANDO",
    ultimo: "09:11",
    sitio: "Obra #123 - Valencia 124",
    episPend: true,
    vehiculo: "Partner - 1234-ABC",
  },
  {
    nombre: "CATALIN ANGELO Q.",
    telefono: "642669715",
    estado: "OPERANDO",
    ultimo: "08:55",
    sitio: "Ruta zona norte",
    episPend: false,
    vehiculo: "Transit - 5678-DEF",
  },
  {
    nombre: "EDUARDO AUGUSTO O.",
    telefono: "655439311",
    estado: "OPERANDO",
    ultimo: "10:05",
    sitio: "Oficina - Sede central",
    episPend: false,
    vehiculo: "-",
  },
  {
    nombre: "ENEIAS GABRIEL D.",
    telefono: "608425433",
    estado: "SIN FICHAR",
    ultimo: "-",
    sitio: "-",
    episPend: false,
    vehiculo: "-",
  },
  {
    nombre: "FRANCISCO JAVIER S.",
    telefono: "676338505",
    estado: "OPERANDO",
    ultimo: "09:37",
    sitio: "Obra #221 - Sueca",
    episPend: false,
    vehiculo: "-",
  },
  {
    nombre: "GUILHERME H. C. B.",
    telefono: "640361984",
    estado: "SIN FICHAR",
    ultimo: "-",
    sitio: "-",
    episPend: false,
    vehiculo: "-",
  },
  {
    nombre: "IGNACIO S.",
    telefono: "657326330",
    estado: "OPERANDO",
    ultimo: "08:49",
    sitio: "Obra #311 - Gandia",
    episPend: true,
    vehiculo: "-",
  },
  {
    nombre: "INSTALACION A.",
    telefono: "677096532",
    estado: "SIN FICHAR",
    ultimo: "-",
    sitio: "-",
    episPend: false,
    vehiculo: "-",
  },
].map((u, i) => ({ ...u, id: i + 1 }));

const estadoConfig = {
  OPERANDO: { state: "operando", label: "Operando" },
  "SIN FICHAR": { state: "sin-fichar", label: "Sin fichar" },
};

const estadoFiltroConfig = [
  { key: "TODOS", label: "Todos", state: "neutral" },
  { key: "OPERANDO", label: "Operando", state: "operando" },
  { key: "SIN FICHAR", label: "Sin fichar", state: "sin-fichar" },
];

function EstadoPill({ estado }) {
  const cfg = estadoConfig[estado] || { state: "neutral", label: estado || "Estado" };
  return React.createElement("ui-pill", cfg);
}

function EpisPill({ pendiente }) {
  return React.createElement("ui-pill", {
    state: pendiente ? "parado" : "operando",
    label: pendiente ? "EPIs pendientes" : "EPIs al dia",
  });
}

function CountPill({ state = "neutral", label }) {
  return React.createElement("ui-pill", { state, label });
}

function FilterPill({ active, label, state, onClick }) {
  const className = `pill-toggle${active ? " is-active" : ""}`;
  return (
    <button type="button" className={className} onClick={onClick}>
      {React.createElement("ui-pill", { state, label })}
    </button>
  );
}

function UsuariosPanel() {
  const [query, setQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [seleccion, setSeleccion] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtrados = useMemo(() => {
    let data = USERS;
    if (query.trim()) {
      const needle = query.toLowerCase();
      data = data.filter(
        (u) =>
          u.nombre.toLowerCase().includes(needle) ||
          (u.telefono || "").toLowerCase().includes(needle)
      );
    }
    if (filtroEstado !== "TODOS") {
      data = data.filter((u) => u.estado === filtroEstado);
    }
    return data;
  }, [query, filtroEstado]);

  const total = filtrados.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pages);
  const pageData = useMemo(
    () => filtrados.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtrados, currentPage]
  );

  const counts = useMemo(
    () => ({
      total: USERS.length,
      operando: USERS.filter((u) => u.estado === "OPERANDO").length,
      sinFichar: USERS.filter((u) => u.estado === "SIN FICHAR").length,
      episPend: USERS.filter((u) => u.episPend).length,
    }),
    []
  );

  const toggleRow = (id) => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allIds = pageData.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => seleccion.has(id));

  const toggleAll = () => {
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleAction = (id, action) => {
    if (action === "Gestionar") {
      window.location.href = "../gestion-user/gestion-usuario-admin.html?userId=" + id;
      return;
    }
    if (action === "Perfil") {
      window.location.href = "../perfil-tec/perfil-tecnico.html?userId=" + id;
      return;
    }
    if (action === "Fichajes") {
      alert("Abrir fichajes del usuario #" + id);
      return;
    }
  };

  const handleBulk = (type) => {
    const ids = Array.from(seleccion);
    if (!ids.length) return;
    const text =
      type === "export"
        ? "Exportar fichajes de: "
        : type === "aviso"
        ? "Enviar aviso a: "
        : "Asignar obra para: ";
    console.log(text + ids.join(", "));
  };

  return (
    <div className="page-shell">
      <div className="content">
        <div className="glass-card header-card">
          <div className="header-top">
            <div>
              <div className="header-kicker">Panel de gestion de usuarios</div>
              <h1 className="header-title">Usuarios</h1>
              <p className="header-subtitle">
                Vista general de los tecnicos y su estado de fichaje, ubicacion y EPIs
                pendientes. Usa los filtros para ir directo a los casos activos.
              </p>
            </div>
            <div className="pill-row">
              <CountPill state="curso" label={`Total ${counts.total}`} />
              <CountPill state="operando" label={`Operando ${counts.operando}`} />
              <CountPill state="sin-fichar" label={`Sin fichar ${counts.sinFichar}`} />
              <CountPill state="parado" label={`EPIs pendientes ${counts.episPend}`} />
            </div>
          </div>
        </div>

        <div className="glass-card filters-card">
          <div className="field">
            <label htmlFor="buscar">Buscar usuario</label>
            <input
              id="buscar"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Nombre o telefono"
            />
          </div>
          <div className="field">
            <label>Filtrar por estado</label>
            <div className="filter-pills">
              {estadoFiltroConfig.map((item) => (
                <FilterPill
                  key={item.key}
                  active={filtroEstado === item.key}
                  label={item.label}
                  state={item.state}
                  onClick={() => {
                    setFiltroEstado(item.key);
                    setPage(1);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="field">
            <label>Acciones rapidas</label>
            <div className="action-buttons">
              <ui-button variant="secondary" onClick={() => handleBulk("aviso")}>
                Avisar seleccion
              </ui-button>
              <ui-button variant="ghost" onClick={() => handleBulk("export")}>
                Exportar
              </ui-button>
              <ui-button variant="primary" onClick={() => handleBulk("asignar")}>
                Asignar a obra
              </ui-button>
            </div>
          </div>
        </div>

        <div className="glass-card table-card">
          <div className="table-actions">
            <div className="table-meta">
              <CountPill
                state={seleccion.size ? "operando" : "neutral"}
                label={`${seleccion.size} seleccionados`}
              />
              <CountPill state="estudio" label={`${total} visibles`} />
            </div>
            <div className="action-buttons">
              <ui-button variant="secondary" onClick={() => handleBulk("aviso")}>
                Notificar
              </ui-button>
              <ui-button variant="ghost" onClick={() => handleBulk("export")}>
                Exportar
              </ui-button>
            </div>
          </div>

          <div className="usuarios-table-scroll">
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="selection-checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Estado</th>
                  <th>Ultimo fichaje</th>
                  <th>Ubicacion</th>
                  <th>EPIs</th>
                  <th>Vehiculo</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="selection-checkbox"
                        checked={seleccion.has(u.id)}
                        onChange={() => toggleRow(u.id)}
                      />
                    </td>
                    <td>{u.nombre}</td>
                    <td className="text-muted">{u.telefono}</td>
                    <td className="status-cell">
                      <EstadoPill estado={u.estado} />
                    </td>
                    <td className="text-muted">{u.ultimo}</td>
                    <td className="text-muted">
                      <span className="truncate" title={u.sitio}>
                        {u.sitio}
                      </span>
                    </td>
                    <td>
                      <EpisPill pendiente={u.episPend} />
                    </td>
                    <td className="text-muted">{u.vehiculo}</td>
                    <td style={{ textAlign: "right" }}>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          handleAction(u.id, e.target.value);
                          e.currentTarget.value = "";
                        }}
                        className="actions-select"
                      >
                        <option value="">Acciones</option>
                        <option value="Gestionar">Gestionar</option>
                        <option value="Perfil">Perfil</option>
                        <option value="Fichajes">Fichajes</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="empty-row">
                      Sin resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span className="text-muted">
              Mostrando {pageData.length} de {total} usuarios
            </span>
            <div className="pager">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <CountPill state="neutral" label={`${currentPage} / ${pages}`} />
              <button
                type="button"
                disabled={currentPage >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UsuariosPanel />);
