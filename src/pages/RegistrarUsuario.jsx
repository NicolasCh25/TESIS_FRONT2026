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

  const handleRegistro = async (dataForm) => {
    setCargando(true);
    
    // 🚀 URL ajustada al endpoint de administradores que confirmaste en Postman
    const url = "https://repositiorio-pic.onrender.com/api/administradores";

    try {
      // Enviamos los datos (nombre, apellido, email, password) al endpoint
      const response = await fetchDataBackend(url, dataForm, "POST", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        // El mensaje del backend es: "Administrador creado, revisa tu correo para confirmar"
        toast.success(response.msg || "Administrador registrado con éxito.");
        
        // Redirigir a la lista de usuarios tras el éxito
        setTimeout(() => navigate("/dashboard/users"), 2500);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      const msg = error.response?.data?.msg || "Error al procesar el registro";
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fadeIn">
      <ToastContainer />
      
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
          {/* El formulario ahora solo pide Nombre, Apellido, Email y Password */}
          <FormularioUsuario onSubmit={handleRegistro} cargando={cargando} />
        </div>
      </div>
    </div>
  );
};

export default RegistrarUsuario;