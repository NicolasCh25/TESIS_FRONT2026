import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaLogs from "../components/logs/TablaLogs";
import FiltroLogs from "../components/logs/FiltroLogs";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineShield } from "react-icons/md";

const Logs = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();

  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ accion: "", resultado: "" });

  const obtenerLogs = async () => {
    setCargando(true);
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    
    // Armamos query dinámico para filtros si se seleccionan
    const queryParams = [];
    if (filtros.accion) queryParams.push(`accion=${filtros.accion}`);
    if (filtros.resultado) queryParams.push(`resultado=${filtros.resultado}`);
    
    const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const url = `${baseUrl}/api/logs${query}`;

    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      if (response && response.logs) {
        setLogs(response.logs);
      }
    } catch (error) {
      console.error("Error al obtener logs:", error);
      toast.error("Error al obtener bitácora de seguridad");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (token) obtenerLogs();
  }, [token, filtros]);

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />

      {/* Encabezado */}
      <div className="mb-8 border-b-2 border-[#F5BD45] pb-4 inline-block self-start">
        <h1 className="text-3xl font-black text-[#17243D] flex items-center gap-2 uppercase tracking-tight">
          <MdOutlineShield className="text-[#F5BD45]" /> BITÁCORA DE <span className="text-[#F5BD45]">AUDITORÍA</span>
        </h1>
        <p className="text-gray-400 text-sm font-medium">Registro histórico y trazas de operaciones críticas en el sistema</p>
      </div>

      {/* Filtros Modulares */}
      <FiltroLogs onFiltrar={setFiltros} />

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {cargando ? (
          <div className="p-20 text-center font-bold text-[#17243D] animate-pulse uppercase tracking-widest text-sm">
            Procesando trazas de seguridad...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-medium italic">
            No se han registrado operaciones bajo los filtros seleccionados.
          </div>
        ) : (
          <TablaLogs logs={logs} />
        )}
      </div>
    </div>
  );
};

export default Logs;