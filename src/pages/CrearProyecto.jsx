import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import FormularioProyecto from "../components/projects/FormularioProyecto"; 
import "react-toastify/dist/ReactToastify.css";

const CrearProyecto = () => {
  const fetchDataBackend = useFetch();
  const [archivo, setArchivo] = useState(null);
  const navigate = useNavigate();
  const { token, rol } = storeAuth();
  const [cargando, setCargando] = useState(false);

  const registrarProyecto = async (dataForm) => {
    if (rol === "invitado") {
      toast.warning("Modo invitado: no puedes crear proyectos");
      return;
    }

    setCargando(true);
    try {
      const formData = new FormData();
      Object.entries(dataForm).forEach(([key, value]) => formData.append(key, value));
      if (archivo) formData.append("archivo_proyecto", archivo);

      const url = `${import.meta.env.VITE_BACKEND_URL}/proyecto/registro`;
      const response = await fetchDataBackend(url, formData, "POST", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success("¡Proyecto registrado con éxito!");
        setTimeout(() => navigate('/dashboard/list'), 2000);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex justify-center items-center py-10 px-4 overflow-hidden bg-gray-50">
      <ToastContainer />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/esfot.jpg')" }}
      ></div>
      
      {/* Contenedor visual para que mantenga el estilo de "Card" */}
      <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#17243D] tracking-tight uppercase">
            Registrar <span className="text-[#F5BD45]">Nuevo Proyecto</span>
          </h1>
          <div className="h-1.5 w-24 bg-[#F5BD45] mx-auto mt-2 rounded-full"></div>
        </div>

        {/*Usamos el componente FormularioProyecto */}
        <FormularioProyecto 
          onSubmit={registrarProyecto} 
          setArchivo={setArchivo} 
          rol={rol} 
          cargando={cargando}
        />
      </div>
    </div>
  );
};

export default CrearProyecto;