import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaEstudiante from "../components/list/TablaEstudiante";
import DetalleModal from "../components/public/DetalleModal";
import { MdStar, MdSearch } from "react-icons/md"; 
import { toast, ToastContainer } from "react-toastify";

const Estudiante = ({ vistaFavoritos = false }) => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("titulo");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  
  const [verFavoritos, setVerFavoritos] = useState(vistaFavoritos);
  const [favoritos, setFavoritos] = useState([]);

  const carrerasDisponibles = [
    "Tecnología Superior en Desarrollo de Software",
    "Tecnología Superior en Electromecánica",
    "Tecnología Superior en Agua y Saniamiento Ambiental",
    "Tecnología Superior en Procesamiento Industrial de la Madera",
    "Tecnología Superior en Procesamiento de Alimentos",
    "Tecnología Superior en Redes y Telecomunicaciones"
  ];

  useEffect(() => {
    setVerFavoritos(vistaFavoritos);
  }, [vistaFavoritos]);

  const obtenerProyectos = async () => {
    // ✅ MANTENEMOS TU LÓGICA DE BASEURL ORIGINAL
    const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith("/")
      ? import.meta.env.VITE_BACKEND_URL
      : `${import.meta.env.VITE_BACKEND_URL}`;

    const valor = busqueda.trim();
    // ✅ MAPEAMOS EL FILTRO PARA EL BACKEND
    const campoBackend = filtro === "periodo" ? "periodoAcademico" : filtro;
    const query = valor ? `?${campoBackend}=${encodeURIComponent(valor)}` : "";

    try {
      const url = `${baseUrl}api/proyectos${query}`;
      const response = await fetchDataBackend(url, null, "GET", { Authorization: `Bearer ${token}` });
      const resultados = Array.isArray(response?.resultados) ? response.resultados.filter(p => p && p._id) : [];
      setProyectos(resultados);
    } catch (error) { setProyectos([]); }
  };

  const obtenerFavoritos = async () => {
    // ✅ MANTENEMOS TU LÓGICA DE BASEURL ORIGINAL
    const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith("/")
      ? import.meta.env.VITE_BACKEND_URL
      : `${import.meta.env.VITE_BACKEND_URL}`;

    try {
      const url = `${baseUrl}api/favoritos`;
      const response = await fetchDataBackend(url, null, "GET", { Authorization: `Bearer ${token}` });
      const listaFavs = Array.isArray(response) ? response : (response?.favoritos || []);
      const favoritosValidos = listaFavs.filter(f => f && f._id);
      setFavoritos(favoritosValidos);
    } catch (error) { setFavoritos([]); }
  };

  useEffect(() => {
    obtenerProyectos();
    obtenerFavoritos();
  }, [busqueda, filtro, token]);

  const toggleFav = async (pro) => {
    if (!pro || !pro._id) return;
    const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith("/") ? import.meta.env.VITE_BACKEND_URL : `${import.meta.env.VITE_BACKEND_URL}`;
    const esFav = favoritos.some(f => f && f._id === pro._id);
    const urlFav = `${baseUrl}api/favoritos/${pro._id}`;

    try {
      if (esFav) {
        await fetchDataBackend(urlFav, null, "DELETE", { Authorization: `Bearer ${token}` });
        setFavoritos(prev => prev.filter(f => f && f._id !== pro._id));
        toast.info("Eliminado de favoritos");
      } else {
        await fetchDataBackend(urlFav, null, "POST", { Authorization: `Bearer ${token}` });
        setFavoritos(prev => {
          const existe = prev.some(f => f && f._id === pro._id);
          if (existe) return prev;
          return [...prev, pro];
        });
        toast.success("¡Agregado a favoritos!");
      }
    } catch (error) { toast.error("Error en favoritos"); }
  };

  const listaAMostrar = useMemo(() => {
    const data = verFavoritos ? favoritos : proyectos;
    return Array.isArray(data) ? data.filter(p => p && p._id) : [];
  }, [verFavoritos, favoritos, proyectos]);

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-sans">
      <ToastContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-black text-[#17243D] uppercase tracking-tight">
          {verFavoritos ? "Mis" : "Repositorio"} <span className="text-[#F5BD45]">{verFavoritos ? "Favoritos" : "PIC"}</span>
        </h1>

        <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
          {!verFavoritos && (
            <>
              <button
                onClick={() => navigate("/dashboard/favoritos")}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5BD45] text-[#17243D] rounded-xl font-bold text-xs uppercase shadow-md hover:bg-[#e2ad3a] transition-all h-[42px]"
              >
                <MdStar size={18} /> Mis Favoritos
              </button>

              {/* ✅ BARRA UNIFICADA CON ICONO DE LUPA */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[42px]">
                <div className="flex items-center px-3 border-r bg-gray-50 h-full">
                  <MdSearch className="text-gray-400 mr-2" size={18} />
                  <select 
                    value={filtro} 
                    onChange={(e) => { setFiltro(e.target.value); setBusqueda(""); }} 
                    className="bg-transparent font-bold text-[10px] sm:text-xs text-[#17243D] uppercase outline-none cursor-pointer"
                  >
                    <option value="titulo">Título</option>
                    <option value="autor">Autor</option>
                    <option value="carrera">Carrera</option>
                    <option value="periodo">Periodo</option>
                  </select>
                </div>

                {filtro === "carrera" ? (
                  <select 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                    className="px-4 py-2 w-full md:w-72 text-sm outline-none bg-white cursor-pointer font-medium"
                  >
                    <option value="">Selecciona carrera...</option>
                    {carrerasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    placeholder={`Buscar por ${filtro}...`} 
                    className="px-4 py-2 w-full md:w-72 text-sm outline-none" 
                    value={busqueda} 
                    onChange={(e) => setBusqueda(e.target.value)} 
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div key={location.pathname} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 animate-fadeIn">
        <TablaEstudiante 
          proyectos={listaAMostrar} 
          onVer={setProyectoSeleccionado} 
          favoritos={favoritos} 
          onToggleFav={toggleFav} 
        />
      </div>

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