import { MdInfo, MdCheckCircle, MdCancel } from "react-icons/md";

const TablaLogs = ({ logs }) => {
  // Helper para renderizar los detalles JSON de forma legible según la acción
  const formatDetalles = (log) => {
    if (!log.detalles) return <span className="text-gray-400 italic">Sin detalles</span>;
    const { emailAfectado, nuevoEstado, titulo, motivo } = log.detalles;
    
    if (emailAfectado) return `Afectado: ${emailAfectado} (${nuevoEstado})`;
    if (titulo) return `Proyecto: "${titulo}"`;
    if (motivo) return `Motivo: ${motivo}`;
    return JSON.stringify(log.detalles);
  };

  const formatAccion = (accion) => {
    return accion.replace(/_/g, " ").toUpperCase();
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <br className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest" />
          <tr>
            <th className="p-4 pl-6">Fecha / Hora</th>
            <th className="p-4">Usuario Responsable</th>
            <th className="p-4">Rol</th>
            <th className="p-4">Acción</th>
            <th className="p-4">Estado</th>
            <th className="p-4 pr-6">Detalles de Operación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
              {/* Fecha */}
              <td className="p-4 pl-6 font-medium text-gray-500 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              {/* Email */}
              <td className="p-4 font-bold text-[#17243D]">
                {log.email || <span className="text-gray-400 italic font-medium">N/A (Sistema)</span>}
              </td>
              {/* Rol */}
              <td className="p-4">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  log.usuarioModelo === "Administrador" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                }`}>
                  {log.usuarioModelo}
                </span>
              </td>
              {/* Acción */}
              <td className="p-4 font-semibold text-gray-700 tracking-tight text-xs">
                {formatAccion(log.accion)}
              </td>
              {/* Resultado */}
              <td className="p-4">
                <span className={`flex items-center gap-1 text-xs font-bold uppercase ${
                  log.resultado === "exito" ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {log.resultado === "exito" ? <MdCheckCircle size={16} /> : <MdCancel size={16} />}
                  {log.resultado}
                </span>
              </td>
              {/* Detalles */}
              <td className="p-4 pr-6 text-xs text-gray-500 font-medium max-w-xs truncate" title={formatDetalles(log)}>
                {formatDetalles(log)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaLogs;