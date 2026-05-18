import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaEstudiante from "../components/list/TablaEstudiante";
import DetalleModal from "../components/public/DetalleModal";
import { MdStar, MdStarBorder } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Estudiante = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("titulo");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [verFavoritos, setVerFavoritos] = useState(false);
  
  // ✅ CORRECCIÓN 1: Siempre inicializar como arreglo vacío para evitar crash
  const [favoritos, setFavoritos] = useState([]);

  const carrerasDisponibles = [
    "Tecnología Superior en Desarrollo de Software",
    "Tecnología Superior en Electromecánica",
    "Tecnología Superior en Agua y Saniamiento Ambiental",
    "Tecnología Superior en Procesamiento Industrial de la Madera",
    "Tecnología Superior en Procesamiento de Alimentos",
    "Tecnología Superior en Redes y Telecomunicaciones"
  ];

  const obtenerProyectos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    const valor = busqueda.trim();
    const campoBackend = filtro === "periodo" ? "periodoAcademico" : filtro;
    const query = valor ? `?${campoBackend}=${encodeURIComponent(valor)}` : "";

    try {
      const response = await fetchDataBackend(`${baseUrl}api/proyectos${query}`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      // ✅ CORRECCIÓN 2: Validar la estructura de la respuesta
      setProyectos(response?.resultados || []);
    } catch (error) { 
        console.error(error);
        setProyectos([]); 
    }
  };

  const obtenerFavoritos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    try {
      const response = await fetchDataBackend(`${baseUrl}api/favoritos`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      
      // ✅ CORRECCIÓN 3: Asegurar que 'favoritos' sea un arreglo plano
      // Si el back devuelve { favoritos: [...] }, usa response.favoritos
      const data = Array.isArray(response) ? response : (response?.favoritos || []);
      setFavoritos(data); 
    } catch (error) { 
        console.error("Error al obtener favoritos");
        setFavoritos([]);
    }
  };

  useEffect(() => { 
    obtenerProyectos(); 
    obtenerFavoritos();
  }, [busqueda, filtro]);

  useEffect(() => { setBusqueda(""); }, [filtro]);

  const toggleFav = async (pro) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    // Usamos el operador opcional ?. para evitar errores si favoritos no ha cargado
    const esFav = favoritos?.some(f => f._id === pro._id);
    
    try {
      if (esFav) {
        const res = await fetchDataBackend(`${baseUrl}api/favoritos/${pro._id}`, null, "DELETE", {
          Authorization: `Bearer ${token}`
        });
        if (res) {
          setFavoritos(prev => prev.filter(f => f._id !== pro._id));
          toast.info("Eliminado de favoritos");
        }
      } else {
        const res = await fetchDataBackend(`${baseUrl}api/favoritos/${pro._id}`, null, "POST", {
          Authorization: `Bearer ${token}`
        });
        if (res) {
          setFavoritos(prev => [...prev, pro]);
          toast.success("¡Agregado a favoritos!");
        }
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  // ✅ CORRECCIÓN FINAL: Seguridad extra al renderizar la lista
  const listaAMostrar = verFavoritos 
    ? (Array.isArray(favoritos) ? favoritos : []) 
    : (Array.isArray(proyectos) ? proyectos : []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D] uppercase">
            Repositorio <span className="text-[#F5BD45]">PIC</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Sesión: Estudiante</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={() => setVerFavoritos(!verFavoritos)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all shadow-sm ${
              verFavoritos ? "bg-[#F5BD45] text-[#17243D] border-[#F5BD45]" : "bg-white text-gray-400 border border-gray-200"
            }`}
          >
            {verFavoritos ? <MdStar size={18}/> : <MdStarBorder size={18}/>}
            {verFavoritos ? "Ver Todos" : "Mis Favoritos"}
          </button>

          <select 
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 rounded-xl border outline-none bg-white font-bold text-xs text-[#17243D] uppercase"
          >
            <option value="titulo">Título</option>
            <option value="autor">Autor</option>
            <option value="carrera">Carrera</option>
            <option value="periodo">Periodo</option>
          </select>

          {filtro === "carrera" ? (
            <select 
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 w-full md:w-72 rounded-xl border outline-none bg-white text-sm"
            >
              <option value="">Todas las carreras...</option>
              {carrerasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          ) : (
            <input 
              type="text" 
              placeholder={`Buscar por ${filtro}...`}
              className="px-4 py-2 w-full md:w-72 rounded-xl border outline-none text-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          )}
        </div>
      </div>

      <TablaEstudiante 
        proyectos={listaAMostrar}
        onVer={setProyectoSeleccionado}
        favoritos={Array.isArray(favoritos) ? favoritos : []}
        onToggleFav={toggleFav}
      />

      {proyectoSeleccionado && (
        <DetalleModal 
          proyecto={proyectoSeleccionado}
          onClose={() => setProyectoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default Estudiante;