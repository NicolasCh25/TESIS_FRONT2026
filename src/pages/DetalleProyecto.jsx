import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { toast } from "react-toastify";
import { MdArrowBack, MdPerson, MdSchool, MdCalendarToday, MdCode, MdDescription, MdPictureAsPdf, MdLabel } from "react-icons/md";

const DetalleProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const [proyecto, setProyecto] = useState(null);

  useEffect(() => {
    const obtenerProyecto = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
        const url = `${baseUrl}api/proyectos`;
        const response = await fetchDataBackend(url, null, "GET", {
          Authorization: `Bearer ${token}`
        });

        if (response?.resultados) {
          const encontrado = response.resultados.find((p) => p._id === id);
          if (encontrado) {
            setProyecto(encontrado);
          } else {
            toast.error("Proyecto no encontrado");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar proyecto");
      }
    };
    obtenerProyecto();
  }, [id, token]);

  if (!proyecto) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17243D]"></div>
        <span className="ml-3 font-bold text-[#17243D]">Cargando proyecto...</span>
      </div>
    );
  }

  // Componente pequeño para las etiquetas de información
  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 transition-hover hover:shadow-md">
      <div className="bg-[#17243D] p-2 rounded-lg text-[#F5BD45]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-gray-800 font-medium">{value || "No especificado"}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-[#17243D] mb-6 font-bold transition-all group"
      >
        <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        VOLVER
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO DESTACADO */}
        <div className="bg-[#17243D] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5BD45] opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <span className="bg-[#F5BD45] text-[#17243D] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
              Detalle del Trabajo de Integración
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              {proyecto.titulo}
            </h1>
          </div>
        </div>

        {/* CUERPO DE LA INFORMACIÓN */}
        <div className="p-6 md:p-10">
          
          {/* GRID DE INFORMACIÓN RÁPIDA */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <InfoCard icon={MdPerson} label="Autor" value={proyecto.autor} />
            <InfoCard icon={MdSchool} label="Tutor" value={proyecto.tutor} />
            <InfoCard icon={MdSchool} label="Carrera" value={proyecto.carrera} />
            <InfoCard icon={MdCalendarToday} label="Periodo" value={proyecto.periodoAcademico} />
          </div>

          <div className="space-y-8">
            
            {/* DESCRIPCIÓN / RESUMEN */}
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                <MdDescription className="text-[#F5BD45]" size={24} />
                <h2 className="text-xl font-black text-[#17243D] uppercase tracking-tighter">Resumen del Proyecto</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-justify bg-gray-50/50 p-6 rounded-2xl italic">
                "{proyecto.descripcion}"
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              {/* TECNOLOGÍAS */}
              <section>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <MdCode className="text-[#F5BD45]" size={24} />
                  <h2 className="text-lg font-black text-[#17243D] uppercase tracking-tighter">Tecnologías</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proyecto.tecnologias?.split(',').map((tech, i) => (
                    <span key={i} className="bg-[#17243D]/5 text-[#17243D] px-3 py-1 rounded-lg text-sm font-bold border border-[#17243D]/10">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </section>

              {/* PALABRAS CLAVE */}
              <section>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <MdLabel className="text-[#F5BD45]" size={24} />
                  <h2 className="text-lg font-black text-[#17243D] uppercase tracking-tighter">Palabras Clave</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proyecto.palabrasClave?.split(',').map((word, i) => (
                    <span key={i} className="text-gray-500 text-sm font-medium">
                      #{word.trim()}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* SECCIÓN DE DESCARGA */}
            <div className="mt-10 p-6 bg-[#17243D]/5 rounded-3xl border-2 border-dashed border-[#17243D]/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="bg-red-100 text-red-600 p-4 rounded-full">
                  <MdPictureAsPdf size={40} />
                </div>
                <div>
                  <h3 className="font-black text-[#17243D] text-lg uppercase tracking-tighter">Documentación Completa</h3>
                  <p className="text-gray-500 text-sm">Descarga o visualiza el archivo PDF original.</p>
                </div>
              </div>

              {proyecto.archivoPDF ? (
                <a
                  href={proyecto.archivoPDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto text-center bg-[#17243D] text-white px-8 py-4 rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all font-black shadow-lg flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
                >
                  <MdPictureAsPdf size={20} />
                  Ver Documento
                </a>
              ) : (
                <span className="text-red-400 font-bold italic">Archivo no disponible</span>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProyecto;