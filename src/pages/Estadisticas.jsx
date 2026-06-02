import { useEffect, useState, useRef } from "react"; // ✅ Agregado useRef
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TarjetasResumen from "../components/stats/TarjetasResumen";
import GraficosEstadisticos from "../components/stats/GraficosEstadisticos";
import { ToastContainer, toast } from "react-toastify";
import { MdDownload } from "react-icons/md"; // ✅ Icono para el botón
import jsPDF from "jspdf"; // ✅ Importar jsPDF
import html2canvas from "html2canvas"; // ✅ Importar html2canvas

const Estadisticas = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const reportRef = useRef(); // ✅ Referencia para el área del PDF

  const [metricas, setMetricas] = useState({ totalProyectos: 0, totalTutores: 0, totalPeriodos: 0 });
  const [datosCarrera, setDatosCarrera] = useState([]);
  const [datosTutor, setDatosTutor] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("Todas");
  const [tutoresGenerales, setTutoresGenerales] = useState([]);

  // --- TUS FUNCIONES EXISTENTES (MANTENIDAS) ---
  const resumirNombre = (nombre) => {
    return nombre
      .replace("Tecnología Superior en ", "")
      .replace("Tecnología Superior de ", "")
      .replace("Procesamiento Industrial de la Madera", "Maderas")
      .replace("Agua y Saniamiento Ambiental", "Agua y Saneamiento")
      .trim();
  };

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
        if (carreraSeleccionada === "Todas") setDatosTutor(tutoresFormateados);
      }
    } catch (error) {
      toast.error("Error al cargar estadísticas globales");
    }
  };

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

  useEffect(() => { cargarDatosGlobales(); }, []);
  useEffect(() => { filtrarTutoresPorCarrera(carreraSeleccionada); }, [carreraSeleccionada]);

  // --- ✅ NUEVA FUNCIÓN PARA GENERAR EL PDF ---
  const descargarInforme = async () => {
    const elemento = reportRef.current;
    const canvas = await html2canvas(elemento, {
      scale: 2, // Mayor calidad
      useCORS: true, // Para imágenes externas si las hubiera
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Encabezado del PDF
    pdf.setFontSize(18);
    pdf.setTextColor(23, 36, 61); // Tu azul #17243D
    pdf.text("REPORTE ESTADÍSTICO - PORTAL PIC", 15, 20);
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 15, 28);
    
    // Añadir la imagen capturada de los gráficos
    pdf.addImage(imgData, "PNG", 0, 35, pdfWidth, pdfHeight);
    
    pdf.save(`Reporte_PIC_${carreraSeleccionada}.pdf`);
    toast.success("Informe descargado correctamente");
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      
      {/* Encabezado con Botón de Descarga */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D] uppercase tracking-tight">
            Informes y <span className="text-[#F5BD45]">Estadísticas</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">Visualización de datos del repositorio ESFOT</p>
        </div>

        <button 
          onClick={descargarInforme}
          className="flex items-center gap-2 bg-[#17243D] text-white px-6 py-3 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-[#F5BD45] hover:text-[#17243D] transition-all duration-300"
        >
          <MdDownload size={20} />
          Descargar Informe PDF
        </button>
      </div>

      {/* ÁREA QUE SERÁ CAPTURADA POR EL PDF */}
      <div ref={reportRef} className="bg-gray-50 p-4 rounded-xl">
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
    </div>
  );
};

export default Estadisticas;