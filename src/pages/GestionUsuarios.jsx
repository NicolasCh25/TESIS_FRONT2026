import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaUsuarios from "../components/users/TablaUsuarios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";

const GestionUsuarios = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  const [admins, setAdmins] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [activoTab, setActivoTab] = useState("admins"); // "admins" o "estudiantes"

  // 1. OBTENER LISTADO DE ADMINISTRADORES
  const obtenerUsuarios = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/administradores`;

    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        const dataFinal = Array.isArray(response) 
          ? response 
          : (response.usuarios || response.data || []);
        
        setAdmins(dataFinal);
      }
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      toast.error("No se pudieron cargar los administradores");
    }
  };

  // 2. OBTENER LISTADO DE ESTUDIANTES
  const obtenerEstudiantes = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/usuarios`;

    try {
      const response = await fetchDataBackend(url, null, "GET", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        const dataFinal = Array.isArray(response) 
          ? response 
          : (response.usuarios || response.data || []);
        
        setEstudiantes(dataFinal);
      }
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      toast.error("No se pudieron cargar los estudiantes");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
    obtenerEstudiantes();
  }, []);

  // 3. CAMBIAR ESTADO (ACTIVO/INACTIVO)
  const handleCambiarEstado = async (id, nuevoEstado) => {
    // Se utiliza el endpoint unificado /api/usuarios/estado/:id que funciona para ambos roles y permite activar/desactivar en DB
    const url = `${import.meta.env.VITE_BACKEND_URL}api/usuarios/estado/${id}`;
    
    try {
      const response = await fetchDataBackend(url, { estado: nuevoEstado }, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success(response.msg || `Estado actualizado a ${nuevoEstado}`);
        obtenerUsuarios();
        obtenerEstudiantes();
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al actualizar el estado del usuario");
    }
  };

  // 4. ELIMINAR PERMANENTE
  const handleEliminar = async (id) => {
    if (window.confirm("¿Deseas eliminar permanentemente a este usuario?")) {
      const url = `${import.meta.env.VITE_BACKEND_URL}api/usuario/eliminar/${id}`;
      
      try {
        const response = await fetchDataBackend(url, null, "DELETE", {
          Authorization: `Bearer ${token}`
        });

        if (response) {
          toast.success("Usuario eliminado exitosamente");
          obtenerUsuarios();
          obtenerEstudiantes();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar el usuario");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17243D]">
            GESTIÓN DE <span className="text-[#F5BD45]">USUARIOS</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Administra estados y privilegios de acceso</p>
        </div>

        <div className="w-full md:w-auto">
          <Link 
            to="/dashboard/usuarios/registrar" 
            className="flex items-center justify-center gap-2 bg-[#17243D] text-white px-6 py-3 rounded-2xl font-black hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <MdPersonAdd size={24} />
            NUEVO USUARIO
          </Link>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActivoTab("admins")}
          className={`pb-3 font-black text-sm uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activoTab === "admins"
              ? "border-[#F5BD45] text-[#17243D]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Administradores ({admins.length})
        </button>
        <button
          onClick={() => setActivoTab("estudiantes")}
          className={`pb-3 font-black text-sm uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activoTab === "estudiantes"
              ? "border-[#F5BD45] text-[#17243D]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Estudiantes ({estudiantes.length})
        </button>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <TablaUsuarios 
          usuarios={activoTab === "admins" ? admins : estudiantes} 
          handleEliminar={handleEliminar} 
          handleCambiarEstado={handleCambiarEstado}
        />
      </div>
    </div>
  );
};

export default GestionUsuarios;