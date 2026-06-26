import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { toast } from "react-toastify";
import { 
  MdArrowBack, MdPerson, MdSchool, MdCalendarToday, 
  MdDescription, MdPictureAsPdf, MdCode, MdLabel,
  MdLink, MdPlayCircleOutline 
} from "react-icons/md";

const DetalleProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  // ✅ LÓGICA MEJORADA: Cargamos el proyecto de inmediato si viene del state de navegación
  const [proyecto, setProyecto] = useState(() => {
    if (location.state) {
      if (location.state._id || location.state.id) {
        return location.state;
      }
      if (location.state.proyectoSeleccionado) {
        return location.state.proyectoSeleccionado;
      }
    }
    return null;
  });

  useEffect(() => {
    // ✅ Si el proyecto ya existe en el state de navegación, no realizamos la petición
    if (proyecto) return;

    const obtenerProyecto = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
        
        let encontrado = null;
        let paginaActual = 1;
        let totalPaginas = 1;

        // ✅ BÚSQUEDA PAGINADA: Buscamos página por página hasta encontrar el proyecto por ID
        do {
          const url = `${baseUrl}api/proyectos?limit=50&page=${paginaActual}`;
          const response = await fetchDataBackend(url, null, "GET", {
            Authorization: `Bearer ${token}`
          });

          if (response) {
            const listaProyectos = response.resultados || response.proyectos || (Array.isArray(response) ? response : []);
            const proyectoEncontrado = listaProyectos.find((p) => p._id === id || p.id === id);
            
            if (proyectoEncontrado) {
              encontrado = proyectoEncontrado;
              break;
            }
            
            totalPaginas = response.totalPaginas || 1;
            paginaActual++;
          } else {
            break;
          }
        } while (paginaActual <= totalPaginas);

        if (encontrado) {
          setProyecto(encontrado);
        } else {
          toast.error("Proyecto no localizado en los datos cargados.");
        }
      } catch (error) {
        console.error("Error en DetalleProyecto:", error);
        toast.error("Error al cargar proyecto");
      }
    };
    
    if (id && token) obtenerProyecto();
  }, [id, token, proyecto]);

  if (!proyecto) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#17243D]"></div>
        <span className="ml-3 font-bold text-[#17243D]">Cargando proyecto...</span>
      </div>
    );
  }

  // Helper para renderizar listas
  const renderList = (data, colorClass) => {
    const items = Array.isArray(data) ? data : (data?.split(',') || []);
    return items.map((item, i) => (
      <span key={i} className={`${colorClass} px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider`}>
        {typeof item === 'string' ? item.trim() : item}
      </span>
    ));
  };

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 transition-all hover:shadow-md">
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
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-[#17243D] mb-6 font-bold transition-all group"
      >
        <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        VOLVER
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO */}
        <div className="bg-[#17243D] p-8 md:p-12 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5BD45] opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <span className="bg-[#F5BD45] text-[#17243D] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
              Trabajo de Integración Curricular
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              {proyecto.titulo}
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-10">
          
          {/* GRID DE DATOS RÁPIDOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <InfoCard icon={MdPerson} label="Autor" value={proyecto.autor} />
            <InfoCard icon={MdSchool} label="Tutor" value={proyecto.tutor} />
            <InfoCard icon={MdSchool} label="Carrera" value={proyecto.carrera} />
            <InfoCard icon={MdCalendarToday} label="Periodo" value={proyecto.periodoAcademico} />
          </div>

          <div className="space-y-8">
            
            {/* DESCRIPCIÓN */}
            <section>
              <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                <MdDescription className="text-[#F5BD45]" size={24} />
                <h2 className="text-xl font-black text-[#17243D] uppercase tracking-tighter">Descripción</h2>
              </div>
              <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-2xl border-l-4 border-[#F5BD45]">
                {proyecto.descripcion}
              </p>
            </section>

            {/* LINKS EXTERNOS */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-[#17243D]">
                  <MdLink size={24} />
                  <h3 className="font-black uppercase tracking-tighter">Repositorio de Código</h3>
                </div>
                {proyecto.repositorio ? (
                  <a href={proyecto.repositorio} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline break-all block text-sm">
                    {proyecto.repositorio}
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm italic">Link no ingresado</p>
                )}
              </section>

              <section className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-[#17243D]">
                  <MdPlayCircleOutline size={24} />
                  <h3 className="font-black uppercase tracking-tighter">Video Demostrativo</h3>
                </div>
                {proyecto.video ? (
                  <a href={proyecto.video} target="_blank" rel="noopener noreferrer" className="bg-[#F5BD45] text-[#17243D] px-4 py-2 rounded-xl text-sm font-black inline-block shadow-sm hover:shadow-md transition-all uppercase">
                    Ver Funcionamiento
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm italic">Link no ingresado</p>
                )}
              </section>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* TECNOLOGÍAS */}
              <section>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <MdCode className="text-[#F5BD45]" size={24} />
                  <h2 className="text-lg font-black text-[#17243D] uppercase tracking-tighter">Tecnologías</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {renderList(proyecto.tecnologias, "bg-[#17243D] text-white")}
                </div>
              </section>

              {/* PALABRAS CLAVE */}
              <section>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <MdLabel className="text-[#F5BD45]" size={24} />
                  <h2 className="text-lg font-black text-[#17243D] uppercase tracking-tighter">Palabras Clave</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {renderList(proyecto.palabrasClave, "bg-gray-100 text-gray-600 border border-gray-200")}
                </div>
              </section>
            </div>

            {/* SECCIÓN PDF */}
            <div className="mt-10 p-8 bg-[#17243D]/5 rounded-3xl border-2 border-dashed border-[#17243D]/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 text-red-600 p-4 rounded-full">
                  <MdPictureAsPdf size={40} />
                </div>
                <div>
                  <h3 className="font-black text-[#17243D] text-lg uppercase">Documentación PDF</h3>
                  <p className="text-gray-500 text-sm">Descarga la memoria completa del proyecto.</p>
                </div>
              </div>

              {proyecto.archivoPDF ? (
                <a href={proyecto.archivoPDF} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center bg-[#17243D] text-white px-10 py-4 rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all font-black shadow-lg uppercase text-sm tracking-widest">
                  Visualizar Documento
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