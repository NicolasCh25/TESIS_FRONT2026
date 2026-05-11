import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TarjetasResumen from "../components/stats/TarjetasResumen";
import GraficosEstadisticos from "../components/stats/GraficosEstadisticos";
import { ToastContainer, toast } from "react-toastify";

const Estadisticas = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  const [metricas, setMetricas] = useState({ totalProyectos: 0, totalTutores: 0, totalTecnologias: 0 });
  const [datosCarrera, setDatosCarrera] = useState([]);
  const [datosTutor, setDatosTutor] = useState([]);

  const cargarDatos = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/estadisticas`;
    
    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      
      if (response) {
        // 1. Mapeo para Tarjetas
        setMetricas({
          totalProyectos: response.totalProyectos || 0,
          totalTutores: response.proyecto_tutor?.length || 0,
          totalTecnologias: response.proyecto_tecnologias?.length || 0
        });

        // 2. Mapeo para Gráfico de Carreras (Recharts necesita 'name' y 'cantidad')
        const formateadoCarreras = response.proyecto_carrera?.map(item => ({
          name: item._id,
          cantidad: item.total
        })) || [];
        setDatosCarrera(formateadoCarreras);

        // 3. Mapeo para Gráfico de Tutores
        const formateadoTutores = response.proyecto_tutor?.map(item => ({
          name: item._id,
          cantidad: item.total
        })) || [];
        setDatosTutor(formateadoTutores);
      }
    } catch (error) {
      console.error("Error estadisticas:", error);
      toast.error("Error al sincronizar estadísticas reales");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#17243D] uppercase tracking-tight">
          Informes y <span className="text-[#F5BD45]">Estadísticas</span>
        </h1>
        <p className="text-gray-500 font-medium italic underline decoration-[#F5BD45]">
          Análisis de impacto académico en tiempo real
        </p>
      </div>

      <TarjetasResumen data={metricas} />
      
      <div className="mt-8">
        <GraficosEstadisticos 
          datosCarrera={datosCarrera} 
          datosTutor={datosTutor} 
        />
      </div>
    </div>
  );
};

export default Estadisticas;