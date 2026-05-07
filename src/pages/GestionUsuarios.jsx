import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaUsuarios from "../components/users/TablaUsuarios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

const GestionUsuarios = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerUsuarios = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/usuarios`;

    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      // 🔥 CORRECCIÓN CLAVE (adaptarse a cómo responde el backend)
      if (response) {
        setUsuarios(response.usuarios || response.data || response);
      }

    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar permanentemente a este usuario?")) {
      const url = `${import.meta.env.VITE_BACKEND_URL}api/usuario/eliminar/${id}`;
      
      try {
        const response = await fetchDataBackend(url, null, "DELETE", {
          Authorization: `Bearer ${token}`
        });

        if (response) {
          toast.success("Usuario eliminado");
          obtenerUsuarios();
        }

      } catch (error) {
        toast.error("Error al eliminar usuario");
      }
    }
  };

  const handleEditar = (id) => navigate(`/dashboard/usuarios/actualizar/${id}`);

  // 🔥 CORRECCIÓN: evitar error si viene null o undefined
  const filtrados = usuarios.filter(user => 
    (user.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <ToastContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D]">
            GESTIÓN DE <span className="text-[#F5BD45]">USUARIOS</span>
          </h1>
          <p className="text-gray-500 text-sm">Administra los accesos al Portal PIC</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar usuario..." 
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F5BD45] outline-none shadow-sm" 
            onChange={(e) => setBusqueda(e.target.value)} 
          />
          
          <Link 
            to="/dashboard/usuarios/registrar" 
            className="flex items-center justify-center gap-2 bg-[#17243D] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#1F3059] transition-all shadow-md hover:scale-105"
          >
            <MdPersonAdd size={22} />
            Nuevo Usuario
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <TablaUsuarios 
          usuarios={filtrados} 
          handleEliminar={handleEliminar} 
          handleEditar={handleEditar} 
        />
      </div>
    </div>
  );
};

export default GestionUsuarios;