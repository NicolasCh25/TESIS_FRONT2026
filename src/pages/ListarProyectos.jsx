import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaProyectos from "../components/list/TablaProyectos"; 
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

const ListarProyectos = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const navigate = useNavigate(); 

  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("autor"); 

  const obtenerProyectos = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

    const valor = busqueda.trim();

    // 👇 construir query dinámico según filtro
    const query = valor ? `?${filtro}=${encodeURIComponent(valor)}` : "";

    const url = `${baseUrl}api/proyectos${query}`;

    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      if (response && response.resultados) {
        setProyectos(response.resultados);
      }

    } catch (error) {
      console.error("Error en Proyectos:", error);
    }
  };

  useEffect(() => {
    obtenerProyectos();
  }, [busqueda, filtro]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
      const url = `${baseUrl}/api/eliminar-proyecto/${id}`;
      
      try {
        const response = await fetchDataBackend(url, null, "DELETE", {
          Authorization: `Bearer ${token}`
        });

        if (response) {
          toast.success(response.msg);
          obtenerProyectos();
        }

      } catch (error) {
        toast.error("Error al eliminar");
      }
    }
  };

  const handleEditar = (id) => navigate(`/dashboard/actualizar/${id}`);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-[#17243D]">
          GESTIONAR <span className="text-[#F5BD45]">PROYECTOS</span>
        </h1>

        {/* 🔥 FILTROS + BUSCADOR */}
        <div className="flex gap-2 w-full md:w-auto">

          {/* SELECTOR DE FILTRO */}
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 rounded-xl border outline-none"
          >
            <option value="autor">Autor</option>
            <option value="carrera">Carrera</option>
            <option value="periodo">Periodo</option>
            <option value="titulo">Título</option>
          </select>

          {/* INPUT DE BÚSQUEDA */}
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="px-4 py-2 w-full md:w-80 rounded-xl border outline-none" 
            onChange={(e) => setBusqueda(e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <TablaProyectos 
          proyectos={proyectos} 
          handleEliminar={handleEliminar} 
          handleEditar={handleEditar} 
        />
      </div>
    </div>
  );
};

export default ListarProyectos;