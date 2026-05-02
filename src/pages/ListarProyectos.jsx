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

  /* --- DESCOMENTAR PARA PRUEBAS SIN BACKEND --- */
  
  useEffect(() => {
    setProyectos([
      { _id: "1", titulo: "Portal PIC - ESFOT", carrera: "Desarrollo de Software", autor: "Nicolás Chiguano" },
      { _id: "2", titulo: "Red IoT Ambiental", carrera: "Redes y Telecomunicaciones", autor: "Karla Rodriguez" }
    ]);
  }, []);
  

  const obtenerProyectos = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/proyectos`;
    const response = await fetchDataBackend(url, null, "GET", {
      Authorization: `Bearer ${token}`
    });
    if (response) setProyectos(response);
  };

  useEffect(() => {
    obtenerProyectos();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
      const url = `${import.meta.env.VITE_BACKEND_URL}/proyecto/eliminar/${id}`;
      const response = await fetchDataBackend(url, null, "DELETE", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success("Proyecto eliminado con éxito");
        obtenerProyectos(); // Refresca la lista desde el Back
      }
    }
  };

  const handleEditar = (id) => navigate(`/dashboard/actualizar/${id}`);

  const filtrados = proyectos.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.carrera.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-[#17243D]">GESTIONAR <span className="text-[#F5BD45]">PROYECTOS</span></h1>
        <input type="text" placeholder="Buscar..." className="px-4 py-2 w-full md:w-80 rounded-xl border focus:ring-2 focus:ring-[#F5BD45] outline-none" onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      <TablaProyectos proyectos={filtrados} handleEliminar={handleEliminar} handleEditar={handleEditar} />
    </div>
  );
};

export default ListarProyectos;