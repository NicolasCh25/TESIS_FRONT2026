import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TarjetasResumen from "../components/stats/TarjetasResumen";
import GraficosEstadisticos from "../components/stats/GraficosEstadisticos";
import { ToastContainer } from "react-toastify";

const Estadisticas = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  // Estado inicial para métricas y gráficos
  const [metricas, setMetricas] = useState({ totalProyectos: 0, totalUsuarios: 0, totalCarreras: 0 });
  const [datosGrafico, setDatosGrafico] = useState([]);

  /* ============================================================
     DATOS DE PRUEBA (MOCKS) - DESCOMENTAR PARA DEMOSTRACIÓN
     ============================================================ */
  
  useEffect(() => {
    setMetricas({ 
      totalProyectos: 25, 
      totalUsuarios: 15, 
      totalCarreras: 3 
    });
    setDatosGrafico([
      { name: 'Desarrollo de Software', cantidad: 12 },
      { name: 'Redes y Telecomunicaciones', cantidad: 8 },
      { name: 'Electromecánica', cantidad: 5 }
    ]);
  }, []);
  

  const cargarDatos = async () => {
    // La URL utiliza la variable de entorno configurada para la ESFOT
    const url = `${import.meta.env.VITE_BACKEND_URL}/estadisticas/resumen`;
    
    const response = await fetchDataBackend(url, null, "GET", {
      Authorization: `Bearer ${token}` // Inyección del token de seguridad
    });
    
    if (response) {
      // Se espera que el backend retorne un objeto con 'metricas' y 'porCarrera'
      setMetricas(response.metricas);
      setDatosGrafico(response.porCarrera);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50">
      <ToastContainer />
      
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#17243D] uppercase tracking-tight">
          Informes y <span className="text-[#F5BD45]">Estadísticas</span>
        </h1>
        <p className="text-gray-500 font-medium">Análisis de impacto académico del Portal PIC</p>
      </div>

      {/* Componente Presentacional: Recibe las métricas procesadas */}
      <TarjetasResumen data={metricas} />
      
      <div className="grid grid-cols-1 gap-8 mt-8">
        {/* Componente Presentacional: Renderiza los gráficos de Recharts */}
        <GraficosEstadisticos datosGrafico={datosGrafico} />
      </div>
    </div>
  );
};

export default Estadisticas;