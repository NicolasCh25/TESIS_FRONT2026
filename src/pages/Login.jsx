import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch"; 
import { storeAuth } from "../context/storeAuth"; 
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rolVisual, setRolVisual] = useState(""); 
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const fetchDataBackend = useFetch();
  const auth = storeAuth(); 

  const handleLogin = async (dataForm) => {
    if (!rolVisual.trim()) {
      return toast.warning("Por favor selecciona un rol institucional");
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}api/login`;

    const dataToSend = {
      email: dataForm.email,
      password: dataForm.password,
    };

    try {
      const response = await fetchDataBackend(url, dataToSend, "POST");

      if (response) {
        // ✅ Pasamos los 4 parámetros: token, rol, nombre y apellido
        auth.setToken(
          response.token, 
          response.rol || rolVisual, 
          response.nombre,
          response.apellido 
        );
        
        toast.success(`¡Bienvenido(a) ${response.nombre || ''}!`);
        
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Error: Credenciales inválidas o cuenta no activa";
      toast.error(errorMsg);
      console.error("Detalle técnico:", error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-8 overflow-y-auto bg-gray-100">
      <ToastContainer />
      {/* Fondo con imagen institucional */}
      <div className="absolute inset-0 bg-[url('/esfot.jpg')] bg-no-repeat bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Header institucional */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#17243D] shadow-xl flex items-center justify-between px-6 z-20">
        <div className="h-full py-2 flex items-center justify-center">
           <img src="/logoPIC.png" alt="Logo Portal PIC" className="h-[90px] w-auto object-contain" />
        </div>
        <Link to="/" className="text-white hover:text-yellow-400 font-bold text-sm transition-colors">
            Volver al Inicio
        </Link>
      </div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8 mx-4 my-8 mt-24 border border-gray-200 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-0 mt-4">
          <span className="text-[#F5BD45]">BIENVENIDO(A)</span> <br />
          <span className="text-[#17243D] uppercase tracking-tighter">AL PORTAL PIC</span>
        </h1>

        <small className="text-gray-600 block mb-6 text-center text-sm mt-2">
          Ingresa tus credenciales de la Politécnica
        </small>

        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@epn.edu.ec"
              className="block w-full rounded-full border border-gray-300 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2.5 px-4 text-gray-700 transition-all"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-bold ml-2">{errors.email.message}</p>}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********************"
                className="block w-full rounded-full border border-gray-300 py-2.5 px-4 pr-10 text-gray-700 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] transition-all"
                {...register("password", { required: "La contraseña es obligatoria" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-[#17243D]"
              >
                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1 font-bold ml-2">{errors.password.message}</p>}
          </div>

          {/* Botones */}
          <div className="pt-4 space-y-3">
            <button type="submit" className="py-3 w-full block text-center bg-[#17243D] text-white font-bold rounded-full hover:shadow-lg hover:bg-[#1F3059] transition-all duration-300 active:scale-95">
              Iniciar Sesión
            </button>
            
            {/* ✅ Botón corregido para dirigir a la página de Registro Público */}
            <Link 
              to="/registro" 
              className="py-3 px-8 bg-[#F5BD45] text-[#17243D] font-extrabold rounded-full hover:shadow-lg hover:bg-yellow-500 w-full text-center transition-all duration-300 active:scale-95 block"
            >
              Registrarme
            </Link>
          </div>
        </form>

        <div className="mt-8 mb-6 flex items-center justify-center">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="px-4 text-xs text-gray-400 font-bold uppercase">O</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="flex flex-col items-center gap-4 text-sm font-medium">
          <Link to="/forgot" className="text-gray-500 hover:text-[#17243D] transition-colors hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;