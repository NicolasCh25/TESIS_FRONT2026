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

  // 1. LISTAR ADMINISTRADORES
  const obtenerUsuarios = async () => {
    // Usamos el endpoint específico que pasaste
    const url = "https://repositiorio-pic.onrender.com/api/administradores";

    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        // Al ser un array directo en el JSON de respuesta:
        setUsuarios(Array.isArray(response) ? response : (response.usuarios || []));
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 2. CAMBIAR ESTADO (ACTIVO/INACTIVO)
  const handleCambiarEstado = async (id, nuevoEstado) => {
    const url = `https://repositiorio-pic.onrender.com/api/administradores/estado/${id}`;
    
    try {
      const response = await fetchDataBackend(url, { estado: nuevoEstado }, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success(response.msg || `Estado actualizado a ${nuevoEstado}`);
        obtenerUsuarios(); // Recargamos la tabla
      }
    } catch (error) {
      toast.error("Error al cambiar el estado");
    }
  };

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
        toast.error("Error al eliminar");
      }
    }
  };

  const handleEditar = (id) => navigate(`/dashboard/usuarios/actualizar/${id}`);

  return (
    <div className="p-6 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D]">
            GESTIÓN DE <span className="text-[#F5BD45]">USUARIOS</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Activa o desactiva privilegios de administrador</p>
        </div>

        <div className="w-full md:w-auto">
          <Link 
            to="/dashboard/usuarios/registrar" 
            className="flex items-center justify-center gap-2 bg-[#17243D] text-white px-6 py-3 rounded-2xl font-black hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg hover:scale-105"
          >
            <MdPersonAdd size={24} />
            NUEVO USUARIO
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <TablaUsuarios 
          usuarios={usuarios} 
          handleEliminar={handleEliminar} 
          handleEditar={handleEditar}
          handleCambiarEstado={handleCambiarEstado} // Pasamos la nueva función
        />
      </div>
    </div>
  );
};

export default GestionUsuarios;