import { useEffect, useState } from "react";
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
  const [datosTutor, setDatosTutor] = useState([]);

  // ✅ Función para resumir nombres de carreras
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
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      
      if (response) {
        setMetricas({
          totalProyectos: response.totalProyectos || 0,
          totalTutores: response.proyecto_tutor?.length || 0,
          totalPeriodos: response.proyecto_periodo?.length || 0
        });

        // ✅ Formateo con nombres cortos para las barras
        const formateadoCarreras = response.proyecto_carrera?.map(item => ({
          name: resumirNombre(item._id),
          fullName: item._id, // Guardamos el nombre real para el tooltip
          cantidad: item.total
        })) || [];
        setDatosCarrera(formateadoCarreras);

        const formateadoTutores = response.proyecto_tutor?.map(item => ({
          name: item._id,
          cantidad: item.total
        })) || [];
        setDatosTutor(formateadoTutores);
      }
    } catch (error) {
      console.error("Error estadisticas:", error);
      toast.error("Error al sincronizar estadísticas");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#17243D] uppercase tracking-tight">
          Informes y <span className="text-[#F5BD45]">Estadísticas</span>
        </h1>
        <div className="h-1 w-20 bg-[#F5BD45] mt-2 rounded-full"></div>
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