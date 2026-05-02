import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import CardActualizarUsuario from "../components/users/CardActualizarUsuario";

const ActualizarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const [cargando, setCargando] = useState(false);

  // Simulación de carga de datos del usuario
  useEffect(() => {
    toast.info(`Cargando perfil del usuario: ${id}`);
  }, [id]);

  const handleActualizar = async (dataForm) => {
    setCargando(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/actualizar/${id}`;
      const response = await fetchDataBackend(url, dataForm, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success("¡Usuario actualizado con éxito!");
        setTimeout(() => navigate('/dashboard/usuarios'), 2000);
      }
    } catch (error) {
      toast.error("Error al procesar la actualización");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex justify-center items-center py-10 px-4 overflow-hidden bg-gray-50">
      <ToastContainer />
      
      {/* Imagen de fondo institucional */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/esfot.jpg')" }}
      ></div>

      <CardActualizarUsuario 
        onSubmit={handleActualizar} 
        cargando={cargando}
      />
    </div>
  );
};

export default ActualizarUsuario;