import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { toast, ToastContainer } from "react-toastify";
import { MdArrowBack } from "react-icons/md";
import FormularioUsuario from "../components/users/FormularioUsuario";
import "react-toastify/dist/ReactToastify.css";

const RegistrarUsuario = () => {
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  
  const [cargando, setCargando] = useState(false);
  // ✅ Nuevo estado para capturar errores específicos del backend (como usuario duplicado)
  const [errorServer, setErrorServer] = useState("");

  const handleRegistro = async (dataForm) => {
    setCargando(true);
    setErrorServer(""); // Limpiamos errores previos al intentar registrar
    
    const url = `${import.meta.env.VITE_BACKEND_URL}api/administradores`;

    try {
      const response = await fetchDataBackend(url, dataForm, "POST", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success(response.msg || "Administrador registrado con éxito.");
        // Redirigir tras éxito
        setTimeout(() => navigate("/dashboard/users"), 2500);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      
      // ✅ Capturamos el mensaje del backend (ej: "Usuario ya registrado")
      const msgError = error.response?.data?.msg || "Error al procesar el registro";
      
      // Lo mostramos en el Toast y también lo pasamos al formulario
      toast.error(msgError);
      setErrorServer(msgError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={4000} />
      
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-[#17243D] mb-8 font-bold transition-all group"
      >
        <MdArrowBack size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        VOLVER A LA LISTA
      </button>

      {/* Contenedor del Formulario */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#17243D] p-8 text-center md:text-left border-b-4 border-[#F5BD45]">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Nuevo <span className="text-[#F5BD45]">Administrador</span>
          </h1>
          <p className="text-gray-300 text-sm mt-1 font-medium">
            Registra los datos para crear una nueva cuenta de administrador.
          </p>
        </div>

        <div className="p-8 md:p-12 bg-gray-50/30">
          {/* ✅ Pasamos el errorServer al formulario para que lo muestre en pantalla */}
          <FormularioUsuario 
            onSubmit={handleRegistro} 
            cargando={cargando} 
            errorServer={errorServer} 
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrarUsuario;