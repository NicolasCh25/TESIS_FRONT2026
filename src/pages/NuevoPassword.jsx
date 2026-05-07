import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import 'react-toastify/dist/ReactToastify.css';

export default function NuevoPassword() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const [tokenValido, setTokenValido] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // 1. Validamos el token con GET según tu Postman
  useEffect(() => {
    const comprobarToken = async () => {
      const url = `${import.meta.env.VITE_BACKEND_URL}api/recuperar-password/${token}`;
      try {
        await fetchDataBackend(url, null, "GET");
        setTokenValido(true);
      } catch (error) {
        toast.error("El enlace ha expirado o es inválido.");
      }
    };
    comprobarToken();
  }, [token]);

  // 2. Enviamos la nueva contraseña con POST al endpoint correcto
  const handleNuevoPassword = async (dataForm) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}api/nuevo-password/${token}`;
    
    // Enviamos password y confirmpassword como pide tu backend
    const dataToSend = {
      password: dataForm.password,
      confirmpassword: dataForm.confirmpassword
    };

    try {
      const response = await fetchDataBackend(url, dataToSend, "POST");
      if (response) {
        toast.success(response.msg || "¡Contraseña actualizada con éxito!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "No se pudo actualizar");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-8 bg-gray-100">
      <ToastContainer />
      <div className="absolute inset-0 bg-[url('/esfot.jpg')] bg-no-repeat bg-cover bg-center opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-[#17243D] uppercase mb-6 tracking-tighter">
          Nueva <span className="text-[#F5BD45]">Contraseña</span>
        </h1>

        {tokenValido ? (
          <form className="space-y-4" onSubmit={handleSubmit(handleNuevoPassword)}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ingresa tu nueva clave</label>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres"
                className="block w-full rounded-full border border-gray-300 py-2 px-4 focus:ring-1 focus:ring-[#17243D] outline-none"
                {...register("password", { 
                  required: "La contraseña es obligatoria",
                  minLength: { value: 8, message: "Debe tener al menos 8 caracteres" }
                })}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1 font-bold">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirma tu clave</label>
              <input 
                type="password" 
                placeholder="Repite la contraseña"
                className="block w-full rounded-full border border-gray-300 py-2 px-4 focus:ring-1 focus:ring-[#17243D] outline-none"
                {...register("confirmpassword", { 
                  required: "La confirmación es obligatoria",
                  validate: (val) => {
                    if (watch('password') !== val) {
                      return "Las contraseñas no coinciden";
                    }
                  }
                })}
              />
              {errors.confirmpassword && <p className="text-red-600 text-xs mt-1 font-bold">{errors.confirmpassword.message}</p>}
            </div>

            <button type="submit" className="w-full bg-[#17243D] text-white py-3 rounded-full font-bold hover:bg-[#1F3059] transition-all duration-300">
              Guardar Contraseña
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-red-500 font-bold mb-4">Lo sentimos, este enlace no es válido.</p>
            <Link to="/forgot" className="text-[#17243D] font-bold hover:underline">Solicitar uno nuevo</Link>
          </div>
        )}
      </div>
    </div>
  );
}