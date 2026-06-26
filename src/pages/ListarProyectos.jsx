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

    // ✅ CORRECCIÓN: Mapeo del filtro para que coincida con el campo del Backend
    const nombreFiltroBackend = filtro === "periodo" ? "periodoAcademico" : filtro;

    const query = valor
      ? `?${nombreFiltroBackend}=${encodeURIComponent(valor)}`
      : "";

    const url = `${baseUrl}api/proyectos${query}`;

    try {
      const response = await fetchDataBackend(
        url,
        null,
        "GET",
        { Authorization: `Bearer ${token}` }
      );

      if (response && response.resultados) {
        setProyectos(response.resultados);
      }
    } catch (error) {
      console.error("Error en Proyectos:", error);
      toast.error("Error al obtener proyectos");
    }
  };

  useEffect(() => {
    setBusqueda("");
  }, [filtro]);

  useEffect(() => {
    obtenerProyectos();
  }, [busqueda, filtro]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
      const url = `${baseUrl}api/proyectos/${id}`;
      try {
        const response = await fetchDataBackend(
          url,
          null,
          "DELETE",
          { Authorization: `Bearer ${token}` }
        );
        if (response) {
          toast.success(response.msg);
          obtenerProyectos();
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al eliminar");
      }
    }
  };

  const handleEditar = (proyecto) => {
    const idFinal = proyecto?._id || proyecto?.id || proyecto;
    navigate(`/dashboard/actualizar/${idFinal}`);
  };

  // ✅ CAMBIO CLAVE: Enviamos el objeto del proyecto filtrado en el state de la navegación
  const handleDetalle = (proyecto) => {
    const idFinal = proyecto?._id || proyecto?.id;
    
    if (idFinal) {
      // Pasamos el ID en la URL y el objeto completo dentro de state
      navigate(`/dashboard/detalle/${idFinal}`, { state: { proyectoSeleccionado: proyecto } });
    } else {
      // Respaldo por si TablaProyectos pasa solo la cadena de texto del ID
      navigate(`/dashboard/detalle/${proyecto}`);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-[#17243D]">
          GESTIONAR <span className="text-[#F5BD45]">PROYECTOS</span>
        </h1>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 rounded-xl border outline-none bg-white font-bold text-sm"
          >
            <option value="autor">Autor</option>
            <option value="tutor">Tutor</option>
            <option value="carrera">Carrera</option>
            <option value="periodo">Periodo</option>
            <option value="titulo">Título</option>
          </select>

          {filtro === "carrera" ? (
            <select
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 w-full md:w-80 rounded-xl border outline-none bg-white"
            >
              <option value="">Selecciona una carrera...</option>
              {carrerasDisponibles.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              placeholder={`Buscar por ${filtro}...`} 
              className="px-4 py-2 w-full md:w-80 rounded-xl border outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <TablaProyectos 
          proyectos={proyectos}
          handleEliminar={handleEliminar}
          handleEditar={handleEditar}
          handleDetalle={handleDetalle}
        />
      </div>
    </div>
  );
};

export default ListarProyectos;