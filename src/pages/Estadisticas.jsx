import { useEffect, useState, useRef } from "react"; 
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TarjetasResumen from "../components/stats/TarjetasResumen";
import GraficosEstadisticos from "../components/stats/GraficosEstadisticos";
import { ToastContainer, toast } from "react-toastify";
import { MdDownload } from "react-icons/md"; 
import jsPDF from "jspdf"; 
import html2canvas from "html2canvas"; 

const Estadisticas = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const reportRef = useRef(); 

  const [metricas, setMetricas] = useState({ totalProyectos: 0, totalTutores: 0, totalPeriodos: 0 });
  const [datosCarrera, setDatosCarrera] = useState([]);
  const [datosTutor, setDatosTutor] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("Todas");
  const [tutoresGenerales, setTutoresGenerales] = useState([]);

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

  // --- ✅ FUNCIÓN CORREGIDA PARA GENERAR EL PDF ---
  const descargarInforme = async () => {
    const elemento = reportRef.current;
    const idToast = toast.loading("Generando informe PDF...");

    try {
      const canvas = await html2canvas(elemento, {
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#F9FAFB", // ✅ Evita errores de oklch/colores modernos
        windowWidth: 1280, // ✅ Asegura que Recharts tenga ancho para renderizar
        onclone: (clonedDoc) => {
          // Forzamos el contenedor clonado a tener un ancho fijo para evitar el error -1 de Recharts
          const el = clonedDoc.getElementById('report-container');
          if (el) {
            el.style.width = "1200px";
            el.style.padding = "40px";
          }
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Encabezado estilizado en el PDF
      pdf.setFillColor(23, 36, 61); // #17243D
      pdf.rect(0, 0, pdfWidth, 40, 'F');
      
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text("REPORTE ESTADÍSTICO - PORTAL PIC", 15, 18);
      
      pdf.setFontSize(10);
      pdf.setTextColor(245, 189, 69); // #F5BD45
      pdf.text(`Carrera consultada: ${carreraSeleccionada}`, 15, 28);
      
      pdf.setTextColor(200, 200, 200);
      pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, pdfWidth - 45, 28);
      
      // Añadir la imagen capturada
      pdf.addImage(imgData, "PNG", 0, 45, pdfWidth, pdfHeight);
      
      pdf.save(`Reporte_PIC_${carreraSeleccionada.replace(/\s+/g, '_')}.pdf`);
      toast.update(idToast, { render: "Informe descargado con éxito", type: "success", isLoading: false, autoClose: 3000 });

    } catch (error) {
      console.error("Error PDF:", error);
      toast.update(idToast, { render: "Error al generar el PDF", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      
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

      {/* ✅ id="report-container" añadido para la captura correcta */}
      <div ref={reportRef} id="report-container" className="bg-gray-50 p-4 rounded-xl">
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