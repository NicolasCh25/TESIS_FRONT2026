import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import CardActualizar from "../components/projects/CardActualizar";

const ActualizarProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const { token, rol } = storeAuth();
  
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Efecto para simular la carga de datos del proyecto a editar
  useEffect(() => {
    toast.info(`Cargando datos del proyecto: ${id}`);
    // Aquí harías el fetch para traer los datos actuales y precargar el form
  }, [id]);

  const handleActualizar = async (dataForm) => {
    if (rol === "invitado") {
      toast.warning("Modo invitado: no puedes editar proyectos");
      return;
    }

    setCargando(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/proyecto/actualizar/${id}`;
      // Lógica de FormData para el envío
      const formData = new FormData();
      Object.entries(dataForm).forEach(([key, value]) => formData.append(key, value));
      if (archivo) formData.append("archivo_proyecto", archivo);

      const response = await fetchDataBackend(url, formData, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success("¡Proyecto actualizado correctamente!");
        setTimeout(() => navigate('/dashboard/list'), 2000);
      }
    } catch (error) {
      toast.error("Error al actualizar el proyecto");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex justify-center items-center py-10 px-4 overflow-hidden bg-gray-50">
      <ToastContainer />
      
      {/* Fondo con imagen de la ESFOT (Misma que CrearProyecto) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/esfot.jpg')" }}
      ></div>

      <CardActualizar 
        onSubmit={handleActualizar}
        setArchivo={setArchivo}
        rol={rol}
        cargando={cargando}
      />
    </div>
  );
};

export default ActualizarProyecto;