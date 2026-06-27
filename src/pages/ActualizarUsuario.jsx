import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import CardActualizarUsuario from "../components/users/CardActualizarUsuario";
import "react-toastify/dist/ReactToastify.css";

const ActualizarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const [cargando, setCargando] = useState(false);
  const [datosUsuario, setDatosUsuario] = useState(null);

  // Cargar datos actuales del usuario
  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const urlAdmins = `${import.meta.env.VITE_BACKEND_URL}api/administradores`;
        const urlEstudiantes = `${import.meta.env.VITE_BACKEND_URL}api/usuarios`;

        // Traemos las dos listas en paralelo
        const [resAdmins, resEstudiantes] = await Promise.all([
          fetchDataBackend(urlAdmins, null, "GET", { Authorization: `Bearer ${token}` }).catch(() => []),
          fetchDataBackend(urlEstudiantes, null, "GET", { Authorization: `Bearer ${token}` }).catch(() => [])
        ]);

        const listAdmins = Array.isArray(resAdmins) ? resAdmins : (resAdmins.usuarios || resAdmins.data || []);
        const listEstudiantes = Array.isArray(resEstudiantes) ? resEstudiantes : (resEstudiantes.usuarios || resEstudiantes.data || []);

        const usuario = [...listAdmins, ...listEstudiantes].find(u => u._id === id);
        
        if (usuario) {
          setDatosUsuario(usuario);
        } else {
          toast.error("Usuario no encontrado.");
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        toast.error("Error al cargar los datos del usuario");
      }
    };
    obtenerPerfil();
  }, [id, token]);

  const handleActualizar = async (dataForm) => {
    setCargando(true);
    try {
      // Usamos el endpoint unificado y funcional /api/perfil para actualizar datos del perfil
      const url = `${import.meta.env.VITE_BACKEND_URL}api/perfil`;
      
      const response = await fetchDataBackend(url, dataForm, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success(response.msg || "¡Perfil actualizado!");
        setTimeout(() => navigate('/dashboard/usuarios'), 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.msg || error.message || "Error al actualizar";
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  if (!datosUsuario && id) return <div className="text-center p-10 font-bold">Cargando...</div>;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex justify-center items-center py-10 px-4 overflow-hidden bg-gray-50">
      <ToastContainer />
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/esfot.jpg')" }}
      ></div>

      <CardActualizarUsuario 
        onSubmit={handleActualizar} 
        cargando={cargando}
        datosIniciales={datosUsuario}
      />
    </div>
  );
};

export default ActualizarUsuario;