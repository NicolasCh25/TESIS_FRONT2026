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
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("Todas");
  
  // Guardamos los tutores generales para cuando la opción sea "Todas"
  const [tutoresGenerales, setTutoresGenerales] = useState([]);

  const resumirNombre = (nombre) => {
    return nombre
      .replace("Tecnología Superior en ", "")
      .replace("Tecnología Superior de ", "")
      .replace("Procesamiento Industrial de la Madera", "Maderas")
      .replace("Agua y Saniamiento Ambiental", "Agua y Saneamiento")
      .trim();
  };

  // Carga inicial de estadísticas globales
  const cargarDatosGlobales = async () => {
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

        setDatosCarrera(response.proyecto_carrera?.map(item => ({
          name: resumirNombre(item._id),
          fullName: item._id,
          cantidad: item.total
        })) || []);

        const tutoresFormateados = response.proyecto_tutor?.map(item => ({
          name: item._id,
          cantidad: item.total
        })) || [];
        
        setTutoresGenerales(tutoresFormateados);
        if (carreraSeleccionada === "Todas") {
          setDatosTutor(tutoresFormateados);
        }
      }
    } catch (error) {
      toast.error("Error al cargar estadísticas globales");
    }
  };

  // Función para filtrar tutores usando el endpoint de proyectos
  const filtrarTutoresPorCarrera = async (carrera) => {
    if (carrera === "Todas") {
      setDatosTutor(tutoresGenerales);
      return;
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}api/proyectos?carrera=${encodeURIComponent(carrera)}`;
    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      if (response?.resultados) {
        // Agrupamos y contamos proyectos por tutor en esta carrera
        const conteo = response.resultados.reduce((acc, pro) => {
          const nombreTutor = pro.tutor || "Sin asignar";
          acc[nombreTutor] = (acc[nombreTutor] || 0) + 1;
          return acc;
        }, {});

        const datosFiltrados = Object.keys(conteo).map(tutor => ({
          name: tutor,
          cantidad: conteo[tutor]
        }));

        setDatosTutor(datosFiltrados);
      }
    } catch (error) {
      toast.error("Error al filtrar tutores por carrera");
    }
  };

  useEffect(() => {
    cargarDatosGlobales();
  }, []);

  // Escucha cambios en el combo box
  useEffect(() => {
    filtrarTutoresPorCarrera(carreraSeleccionada);
  }, [carreraSeleccionada]);

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
          datosTutor={datosTutor}
          carreraSeleccionada={carreraSeleccionada}
          setCarreraSeleccionada={setCarreraSeleccionada}
          carrerasOriginales={datosCarrera} 
        />
      </div>
    </div>
  );
};

export default Estadisticas;