import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaEstudiante from "../components/list/TablaEstudiante";
import DetalleModal from "../components/public/DetalleModal";
import { MdArrowBack, MdDelete, MdChecklist } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Favoritos = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const navigate = useNavigate();

  const [favoritos, setFavoritos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const obtenerFavoritos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const url = `${baseUrl}api/favoritos`;
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      const listaFavs = Array.isArray(response) ? response : (response?.favoritos || []);
      setFavoritos(listaFavs.filter(f => f && f._id));
    } catch (error) {
      setFavoritos([]);
    }
  };

  useEffect(() => {
    obtenerFavoritos();
  }, [token]);

  const toggleFav = async (pro) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const urlFav = `${baseUrl}api/favoritos/${pro._id}`;

    try {
      await fetchDataBackend(urlFav, null, "DELETE", {
        Authorization: `Bearer ${token}`
      });
      setFavoritos(prev => prev.filter(f => f._id !== pro._id));
      setSeleccionados(prev => prev.filter(id => id !== pro._id));
      toast.info("Eliminado de favoritos");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  // Funciones de selección
  const handleSelectUno = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(prev => prev.filter(item => item !== id));
    } else {
      setSeleccionados(prev => [...prev, id]);
    }
  };

  const handleSelectTodos = () => {
    if (seleccionados.length === favoritos.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(favoritos.map(f => f._id));
    }
  };

  // Nuevas funciones de eliminación masiva
  const handleEliminarTodos = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar TODOS tus favoritos?")) {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${baseUrl}api/favoritos`;

      try {
        const response = await fetchDataBackend(url, null, "DELETE", {
          Authorization: `Bearer ${token}`
        });

        if (response) {
          toast.success(response.msg || "Todos los favoritos fueron eliminados");
          setFavoritos([]);
          setSeleccionados([]);
        }
      } catch (error) {
        console.error("Error al eliminar todos los favoritos:", error);
        toast.error("Error al intentar eliminar todos los favoritos");
      }
    }
  };

  const handleEliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar los ${seleccionados.length} favoritos seleccionados?`)) {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${baseUrl}api/favoritos/seleccionados`;

      try {
        const response = await fetchDataBackend(url, { proyectos: seleccionados }, "DELETE", {
          Authorization: `Bearer ${token}`
        });

        if (response) {
          toast.success(response.msg || "Favoritos seleccionados eliminados");
          setFavoritos(prev => prev.filter(f => !seleccionados.includes(f._id)));
          setSeleccionados([]);
        }
      } catch (error) {
        console.error("Error al eliminar favoritos seleccionados:", error);
        toast.error("Error al intentar eliminar los favoritos seleccionados");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D] uppercase">
            Mis <span className="text-[#F5BD45]">Favoritos</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium italic mt-1 uppercase">
            Gestiona tus proyectos preferidos
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase text-gray-600 hover:bg-gray-50 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MdArrowBack size={18} /> Volver al Repositorio
        </button>
      </div>

      {/* Panel de operaciones de eliminación masiva */}
      {favoritos.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-3xl shadow-xl border border-gray-100 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <MdChecklist size={20} className="text-[#F5BD45]" />
            <span>{seleccionados.length} de {favoritos.length} seleccionados</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleEliminarSeleccionados}
              disabled={seleccionados.length === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                seleccionados.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
                  : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-transparent active:scale-95"
              }`}
            >
              <MdDelete size={16} /> Eliminar Seleccionados ({seleccionados.length})
            </button>
            <button
              onClick={handleEliminarTodos}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md hover:bg-red-700 active:scale-95 cursor-pointer"
            >
              <MdDelete size={16} /> Eliminar Todos
            </button>
          </div>
        </div>
      )}

      <div>
        <TablaEstudiante
          proyectos={favoritos}
          onVer={setProyectoSeleccionado}
          favoritos={favoritos}
          onToggleFav={toggleFav}
          seleccionable={true}
          seleccionados={seleccionados}
          onSelectUno={handleSelectUno}
          onSelectTodos={handleSelectTodos}
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

export default Favoritos;