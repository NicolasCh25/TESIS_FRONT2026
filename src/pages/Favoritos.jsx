import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaEstudiante from "../components/list/TablaEstudiante";
import DetalleModal from "../components/public/DetalleModal";
import { MdArrowBack } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Favoritos = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const navigate = useNavigate();

  const [favoritos, setFavoritos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const obtenerFavoritos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith("/")
      ? import.meta.env.VITE_BACKEND_URL
      : `${import.meta.env.VITE_BACKEND_URL}`;

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
    const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith("/") 
      ? import.meta.env.VITE_BACKEND_URL 
      : `${import.meta.env.VITE_BACKEND_URL}`;
    const urlFav = `${baseUrl}api/favoritos/${pro._id}`;

    try {
      await fetchDataBackend(urlFav, null, "DELETE", {
        Authorization: `Bearer ${token}`
      });
      setFavoritos(prev => prev.filter(f => f._id !== pro._id));
      toast.info("Eliminado de favoritos");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-[#17243D] uppercase">
          Mis <span className="text-[#F5BD45]">Favoritos</span>
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl font-bold text-xs uppercase text-gray-600 hover:bg-gray-50 transition-all"
        >
          <MdArrowBack size={18} /> Volver al Repositorio
        </button>
      </div>

      <div className="animate-fadeIn">
        <TablaEstudiante
          proyectos={favoritos}
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

export default Favoritos;