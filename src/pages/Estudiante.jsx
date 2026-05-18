import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaEstudiante from "../components/list/TablaEstudiante";
import DetalleModal from "../components/public/DetalleModal";
import { MdStar, MdStarBorder } from "react-icons/md";

const Estudiante = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("titulo");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("pic_favs");
    return saved ? JSON.parse(saved) : [];
  });

  const carrerasDisponibles = [
    "Tecnología Superior en Desarrollo de Software",
    "Tecnología Superior en Electromecánica",
    "Tecnología Superior en Agua y Saniamiento Ambiental",
    "Tecnología Superior en Procesamiento Industrial de la Madera",
    "Tecnología Superior en Procesamiento de Alimentos",
    "Tecnología Superior en Redes y Telecomunicaciones"
  ];

  useEffect(() => {
    localStorage.setItem("pic_favs", JSON.stringify(favoritos));
  }, [favoritos]);

  const obtenerProyectos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    const valor = busqueda.trim();
    const campoBackend = filtro === "periodo" ? "periodoAcademico" : filtro;
    const query = valor ? `?${campoBackend}=${encodeURIComponent(valor)}` : "";

    try {
      const response = await fetchDataBackend(`${baseUrl}api/proyectos${query}`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      if (response?.resultados) setProyectos(response.resultados);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { obtenerProyectos(); }, [busqueda, filtro]);
  useEffect(() => { setBusqueda(""); }, [filtro]);

  const toggleFav = (pro) => {
    setFavoritos(prev => 
      prev.some(f => f._id === pro._id) 
        ? prev.filter(f => f._id !== pro._id) 
        : [...prev, pro]
    );
  };

  const listaAMostrar = verFavoritos ? favoritos : proyectos;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D] uppercase">
            Repositorio <span className="text-[#F5BD45]">PIC</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Panel de Consulta Estudiantil</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* BOTÓN FILTRO FAVORITOS */}
          <button 
            onClick={() => setVerFavoritos(!verFavoritos)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
              verFavoritos ? "bg-[#F5BD45] text-[#17243D] shadow-lg" : "bg-white text-gray-400 border border-gray-200"
            }`}
          >
            {verFavoritos ? <MdStar size={18}/> : <MdStarBorder size={18}/>}
            {verFavoritos ? "Mis Favoritos" : "Todos"}
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