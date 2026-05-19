import { useEffect, useState, useMemo } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TarjetasResumen from "../components/stats/TarjetasResumen";
import GraficosEstadisticos from "../components/stats/GraficosEstadisticos";
import { ToastContainer, toast } from "react-toastify";

const Estadisticas = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  const [metricas, setMetricas] = useState({ totalProyectos: 0, totalTutores: 0, totalPeriodos: 0 });
  const [datosCarrera, setDatosCarrera] = useState([]);
  const [tutoresRaw, setTutoresRaw] = useState([]); 
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("Todas");

  const resumirNombre = (nombre) => {
    return nombre
      .replace("Tecnología Superior en ", "")
      .replace("Tecnología Superior de ", "")
      .replace("Procesamiento Industrial de la Madera", "Madera")
      .replace("Agua y Saniamiento Ambiental", "Agua y Saneamiento")
      .trim();
  };

  const cargarDatos = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/estadisticas`;
    try {
      const response = await fetchDataBackend(url, null, "GET", { Authorization: `Bearer ${token}` });
      if (response) {
        setMetricas({
          totalProyectos: response.totalProyectos || 0,
          totalTutores: response.proyecto_tutor?.length || 0,
          totalPeriodos: response.proyecto_periodo?.length || 0
        });

        // ✅ Gráfico de barras (intacto)
        setDatosCarrera(response.proyecto_carrera?.map(item => ({
          name: resumirNombre(item._id),
          fullName: item._id,
          cantidad: item.total
        })) || []);

        setTutoresRaw(response.proyecto_tutor || []);
      }
    } catch (error) {
      toast.error("Error al sincronizar estadísticas");
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // ✅ Filtro que solo afecta al gráfico de pastel
  const datosTutorFiltrados = useMemo(() => {
    if (carreraSeleccionada === "Todas") {
      return tutoresRaw.map(t => ({ name: t._id, cantidad: t.total }));
    }
    // Aquí filtramos los top tutores para que el gráfico no se amontone
    return tutoresRaw.slice(0, 6).map(t => ({ name: t._id, cantidad: t.total }));
  }, [carreraSeleccionada, tutoresRaw]);

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#17243D] uppercase tracking-tight">
          Informes y <span className="text-[#F5BD45]">Estadísticas</span>
        </h1>
      </div>

      <TarjetasResumen data={metricas} />
      
      <div className="mt-8">
        <GraficosEstadisticos 
          datosCarrera={datosCarrera} 
          datosTutor={datosTutorFiltrados}
          carreraSeleccionada={carreraSeleccionada}
          setCarreraSeleccionada={setCarreraSeleccionada}
          carrerasOriginales={datosCarrera} 
        />
      </div>
    </div>
  );
};

export default Estadisticas;