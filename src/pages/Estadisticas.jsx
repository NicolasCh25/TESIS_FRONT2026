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

  // --- ✅ A. FUNCIÓN DE LIMPIEZA DE COLORES OKLCH ---
  const limpiarColoresParaPDF = (contenedor) => {
    const elementos = contenedor.querySelectorAll("*");
    elementos.forEach((el) => {
      try {
        const estilos = window.getComputedStyle(el);
        if (estilos.color?.includes("oklch")) el.style.color = "#17243D";
        if (estilos.backgroundColor?.includes("oklch")) el.style.backgroundColor = "#FFFFFF";
        if (estilos.borderColor?.includes("oklch")) el.style.borderColor = "#E5E7EB";
      } catch (error) {
        console.error("Error al limpiar estilos:", error);
      }
    });
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

  // --- ✅ B, C y D. DESCARGA DE INFORME MEJORADA ---
  const descargarInforme = async () => {
    const elemento = reportRef.current;
    if (!elemento) {
      toast.error("No se encontró el contenido del informe");
      return;
    }

    const idToast = toast.loading("Generando informe PDF multi-página...");

    try {
      // Limpiamos estilos antes de capturar
      limpiarColoresParaPDF(elemento);
      
      // Esperamos a que Recharts termine de renderizar en el DOM real
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(elemento, {
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1400, 
        windowHeight: elemento.scrollHeight, // ✅ Sugerencia C aplicada
        onclone: async (clonedDoc) => {
          const el = clonedDoc.getElementById('report-container');
          if (el) {
            el.style.width = "1300px";
            el.style.padding = "40px";
            el.style.background = "#ffffff";
          }
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // ✅ Sugerencia D: Lógica de multi-página
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 10; // Margen inicial

      // Encabezado solo en la primera página
      pdf.setFillColor(23, 36, 61);
      pdf.rect(0, 0, pdfWidth, 40, 'F');
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text("REPORTE ESTADÍSTICO - PORTAL PIC", 15, 22);

      // Añadir imagen (Manejo de múltiples páginas)
      pdf.addImage(imgData, "PNG", 0, 45, pdfWidth, pdfHeight);
      heightLeft -= (pageHeight - 45);

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Reporte_PIC_${carreraSeleccionada.replace(/\s+/g, '_')}.pdf`);
      toast.update(idToast, { render: "Informe descargado con éxito", type: "success", isLoading: false, autoClose: 3000 });

    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.update(idToast, { render: "Error al procesar el PDF", type: "error", isLoading: false, autoClose: 3000 });
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