import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import FormularioRegistroPublico from "../components/auth/FormularioRegistroPublico";
import "react-toastify/dist/ReactToastify.css";

const RegistroPublico = () => {
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();

  const handleRegistro = async (dataForm) => {
    setCargando(true);
    // Endpoint público de registro
    const url = `${import.meta.env.VITE_BACKEND_URL}api/registro`;

    try {
      const response = await fetchDataBackend(url, dataForm, "POST");

      if (response) {
        toast.success("¡Registro exitoso! Revisa tu correo para confirmar.");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al registrarse";
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-12 overflow-y-auto bg-gray-100">
      <ToastContainer />
      
      {/* Fondo institucional */}
      <div className="absolute inset-0 bg-[url('/esfot.jpg')] bg-no-repeat bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Card de Registro */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 mx-4 border border-gray-200 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#17243D] tracking-tighter uppercase">
            Únete al <span className="text-[#F5BD45]">Portal PIC</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Crea tu cuenta de estudiante hoy mismo</p>
        </div>

        {/* Llamada al Formulario Modulado */}
        <FormularioRegistroPublico onSubmit={handleRegistro} cargando={cargando} />

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600 font-medium">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-[#17243D] font-black hover:underline">
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistroPublico;