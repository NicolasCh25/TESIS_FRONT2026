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
        // Usamos el GET de administradores para traer la info actual
        const url = `${import.meta.env.VITE_BACKEND_URL}api/administradores`;
        const response = await fetchDataBackend(url, null, "GET", {
          Authorization: `Bearer ${token}`
        });

        if (response) {
          const usuario = response.find(u => u._id === id);
          if (usuario) setDatosUsuario(usuario);
        }
      } catch (error) {
        toast.error("Error al cargar los datos del usuario");
      }
    };
    obtenerPerfil();
  }, [id, token]);

  const handleActualizar = async (dataForm) => {
    setCargando(true);
    try {
      // Endpoint de tu Postman: Actualizar Perfil
      const url = `${import.meta.env.VITE_BACKEND_URL}api/administradores/perfil`;
      
      const response = await fetchDataBackend(url, dataForm, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success(response.msg || "¡Perfil actualizado!");
        setTimeout(() => navigate('/dashboard/users'), 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al actualizar";
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