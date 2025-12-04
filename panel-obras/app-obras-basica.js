const { useState } = React;

// ====== TOKENS DE CORES / ESTILO (iguais ao painel principal) ======
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

// ====== COMPONENTES BASE: FROSTED + BUTTON ======
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

// ====== INFO BÁSICA DA OBRA ======
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

// ====== PÁGINA: OBRA COM DADOS BÁSICOS ======
function PanelGestionObraBasica() {
  const [lastSync] = useState(new Date());

  function handleVerGoogleMaps() {
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(OBRA_INFO.direccion);
    window.open(url, "_blank");
  }

  function handleModificarObra() {
    alert("Aquí se abriría la pantalla para MODIFICAR la obra.");
  }

  function handleAñadirPresupuesto() {
    alert(
      "Aquí iría el flujo para crear un presupuesto / OT (en esta vista previa aún no hay datos)."
    );
  }

  function handleAccesos() {
    alert("Aquí se abriría la pantalla de ACCESOS de la obra.");
  }

  return (
    <>
      <div className="relative min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="min-h-screen w-full bg-black/70 flex flex-col items-center px-4 py-6 text-white">
          <div className="w-full max-w-[1180px] space-y-4">
            {/* ========== HEADER OBRA ========== */}
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

                  <div className="mt-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white/70">
                    Esta vista corresponde a una obra que solo tiene los{" "}
                    <span className="font-semibold text-white">
                      datos básicos
                    </span>{" "}
                    registrados. Cuando se creen documentos, fotos y órdenes,
                    aparecerán automáticamente en los bloques inferiores.
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-xs">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Datos básicos registrados</span>
                  </div>
                  <div className="opacity-70">
                    Última actualización:{" "}
                    {lastSync.toLocaleTimeString("es-ES")}
                  </div>
                </div>
              </div>
            </Frosted>

            {/* ========== ACCIONES RÁPIDAS ========== */}
            <Frosted className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                    Acciones rápidas de la obra
                  </div>
                  <div className="text-sm text-white/80">
                    Enlaces y herramientas para gestionar esta obra en un
                    click.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <Button onClick={handleVerGoogleMaps}>
                    Ver dirección en Google Maps
                  </Button>
                  <Button onClick={handleModificarObra}>Modificar obra</Button>
                  <Button onClick={handleAñadirPresupuesto}>
                    Añadir presupuesto / OT
                  </Button>
                  <Button onClick={handleAccesos}>Accesos</Button>
                </div>
              </div>
            </Frosted>

            {/* ========== GRID CARDS SUPERIORES ========== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ---- DOCUMENTOS ---- */}
              <Frosted className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Documentos
                    </div>
                    <div className="text-xs text-white/70">
                      Facturas, albaranes, certificados de andamios, etc.
                    </div>
                  </div>
                  <Button
                    tone="ghost"
                    className="!px-3 !py-1 text-[11px]"
                    onClick={() =>
                      alert(
                        "En una obra sin documentos, este botón podría ir al módulo de Documentos para subir el primero."
                      )
                    }
                  >
                    Ver más
                  </Button>
                </div>

                <div className="mt-3 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 px-3 py-4 text-[11px] text-white/65">
                  <div className="font-semibold text-white/80 mb-1">
                    Aún no hay documentos en esta obra.
                  </div>
                  <p>
                    Cuando se suban facturas, albaranes o certificados,
                    aparecerán aquí en forma de lista. Podrás ver un resumen del
                    gasto total y abrir cada documento en una vista previa
                    rápida.
                  </p>
                </div>
              </Frosted>

              {/* ---- GALERÍA ---- */}
              <Frosted className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Galería
                    </div>
                    <div className="text-xs text-white/70">
                      Fotos del antes, durante y después de la obra.
                    </div>
                  </div>
                  <Button
                    tone="ghost"
                    className="!px-3 !py-1 text-[11px]"
                    onClick={() =>
                      alert(
                        "Aquí se abriría la galería completa. De momento no hay fotos."
                      )
                    }
                  >
                    Ver más
                  </Button>
                </div>

                <div className="mt-3 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 px-3 py-4 text-[11px] text-white/65">
                  <div className="font-semibold text-white/80 mb-1">
                    Sin fotos todavía.
                  </div>
                  <p>
                    Cuando los técnicos suban imágenes desde el móvil, verás
                    aquí una tira de miniaturas con las últimas fotos de
                    fachada, cubiertas, detalles de daños, etc. Podrás abrirlas
                    en grande y ver las etiquetas por tipo de trabajo.
                  </p>
                </div>
              </Frosted>

              {/* ---- ÚLTIMAS ACTIVIDADES ---- */}
              <Frosted className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                      Últimas actividades
                    </div>
                    <div className="text-xs text-white/70">
                      Resumen en tiempo real de lo que pasa en la obra.
                    </div>
                  </div>
                  <Button
                    tone="ghost"
                    className="!px-3 !py-1 text-[11px]"
                    onClick={() =>
                      alert(
                        "Vista detallada de actividades. En este caso no hay nada registrado todavía."
                      )
                    }
                  >
                    Ver más
                  </Button>
                </div>

                <div className="mt-3 rounded-2xl border border-dashed border-white/20 bg-slate-900/50 px-3 py-4 text-[11px] text-white/65">
                  <div className="font-semibold text-white/80 mb-1">
                    No hay actividades registradas.
                  </div>
                  <p>
                    Una vez que existan fichajes, cambios de estado, subida de
                    documentos o creación de nuevas órdenes, verás aquí un
                    timeline con quién hizo qué y a qué hora.
                  </p>
                </div>
              </Frosted>
            </div>

            {/* ========== ÓRDENES / PRESUPUESTOS (TABELA VAZIA) ========== */}
            <Frosted className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                    Órdenes / presupuestos de la obra
                  </div>
                  <div className="text-xs text-white/70">
                    Cuando crees un presupuesto o una OT, aparecerá listado
                    aquí.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/60">
                    <tr>
                      <th className="px-3 py-2 font-medium">Orden / Presupuesto</th>
                      <th className="px-3 py-2 font-medium">Contacto</th>
                      <th className="px-3 py-2 font-medium">Estado</th>
                      <th className="px-3 py-2 font-medium text-right">Importe</th>
                      <th className="px-3 py-2 font-medium text-right">Avance</th>
                      <th className="px-3 py-2 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-white/10">
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-[11px] text-white/60"
                      >
                        Todavía no hay{" "}
                        <span className="font-semibold text-white">
                          presupuestos ni órdenes
                        </span>{" "}
                        creados para esta obra. Usa el botón{" "}
                        <span className="font-semibold">
                          “Crear primer presupuesto / OT”
                          </span>{" "}
                        para iniciar el flujo.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Frosted>
          </div>
        </div>
      </div>
    </>
  );
}

// ====== MONTAGEM ======
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<PanelGestionObraBasica />);
