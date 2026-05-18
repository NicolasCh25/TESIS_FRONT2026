import { useEffect, useState, useMemo } from "react";
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
  const [favoritos, setFavoritos] = useState([]); // ✅ Siempre inicia como array

  const carrerasDisponibles = [
    "Tecnología Superior en Desarrollo de Software",
    "Tecnología Superior en Electromecánica",
    "Tecnología Superior en Agua y Saniamiento Ambiental",
    "Tecnología Superior en Procesamiento Industrial de la Madera",
    "Tecnología Superior en Procesamiento de Alimentos",
    "Tecnología Superior en Redes y Telecomunicaciones"
  ];

  // 1. Obtener Proyectos
  const obtenerProyectos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    const valor = busqueda.trim();
    const campoBackend = filtro === "periodo" ? "periodoAcademico" : filtro;
    const query = valor ? `?${campoBackend}=${encodeURIComponent(valor)}` : "";

    try {
      const response = await fetchDataBackend(`${baseUrl}/api/proyectos${query}`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      // ✅ Si no hay resultados, nos aseguramos de que sea un array vacío
      setProyectos(response?.resultados || []);
    } catch (error) { 
      setProyectos([]);
    }
  };

  // 2. Obtener Favoritos
  const obtenerFavoritos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    try {
      const response = await fetchDataBackend(`${baseUrl}/api/favoritos`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      
      // ✅ IMPORTANTE: Validar si la respuesta es el array directo o viene dentro de un objeto
      const listaFavs = Array.isArray(response) ? response : (response?.favoritos || []);
      setFavoritos(listaFavs);
    } catch (error) { 
      setFavoritos([]);
    }
  };

  useEffect(() => { 
    obtenerProyectos(); 
    obtenerFavoritos();
  }, [busqueda, filtro, token]);

  // 3. Agregar/Quitar Favoritos
  const toggleFav = async (pro) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    const esFav = favoritos.some(f => f._id === pro._id);
    
    try {
      if (esFav) {
        await fetchDataBackend(`${baseUrl}/api/favoritos/${pro._id}`, null, "DELETE", {
          Authorization: `Bearer ${token}`
        });
        setFavoritos(prev => prev.filter(f => f._id !== pro._id));
        toast.info("Eliminado de favoritos");
      } else {
        await fetchDataBackend(`${baseUrl}/api/favoritos/${pro._id}`, null, "POST", {
          Authorization: `Bearer ${token}`
        });
        setFavoritos(prev => [...prev, pro]);
        toast.success("¡Agregado a favoritos!");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos");
    }
  };

  // ✅ 4. Lógica de renderizado segura (Evita el error insertBefore)
  const listaAMostrar = useMemo(() => {
    const data = verFavoritos ? favoritos : proyectos;
    return Array.isArray(data) ? data : [];
  }, [verFavoritos, favoritos, proyectos]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-black text-[#17243D] uppercase">
          Repositorio <span className="text-[#F5BD45]">PIC</span>
        </h1>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setVerFavoritos(!verFavoritos)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
              verFavoritos ? "bg-[#F5BD45] text-[#17243D]" : "bg-white text-gray-400 border"
            }`}
          >
            {verFavoritos ? <MdStar size={18}/> : <MdStarBorder size={18}/>}
            {verFavoritos ? "Viendo Favoritos" : "Todos los Proyectos"}
          </button>

          {/* Filtros */}
          <select 
            value={filtro} 
            onChange={(e) => {setFiltro(e.target.value); setBusqueda("")}}
            className="px-3 py-2 rounded-xl border bg-white font-bold text-xs text-[#17243D] uppercase"
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
              className="px-4 py-2 w-full md:w-72 rounded-xl border bg-white text-sm"
            >
              <option value="">Selecciona carrera...</option>
              {carrerasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          ) : (
            <input 
              type="text" 
              placeholder={`Buscar por ${filtro}...`}
              className="px-4 py-2 w-full md:w-72 rounded-xl border text-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* ✅ Pasamos los datos siempre validados como Array */}
      <TablaEstudiante 
        proyectos={listaAMostrar}
        onVer={setProyectoSeleccionado}
        favoritos={favoritos}
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