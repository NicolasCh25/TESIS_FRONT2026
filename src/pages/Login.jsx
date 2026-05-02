import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom"; // ✅ CORRECCIÓN 1: Importar de react-router-dom
import { useForm } from "react-hook-form";
// import { ToastContainer } from "react-toastify"; // Comentado temporalmente si no has instalado react-toastify
// import { useFetch } from "../hooks/useFetch"; // Comentado hasta que implementemos tu hook
// import storeAuth  from "../context/storeAuth"; // Comentado hasta que configuremos tu contexto

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Mocks temporales para que no se rompa la vista (Luego descomentamos los reales)
  // const fetchDataBackend = useFetch();
  // const { setToken, setRol: setRolGlobal } = storeAuth();

  const handleLogin = async (dataForm) => {
    if (!rol.trim()) {
      return alert("Por favor selecciona un rol");
    }

    console.log("Datos enviados:", { ...dataForm, rol });
    
    // Simulación de login exitoso temporalmente
    alert("Login simulado exitoso. Redirigiendo...");
    
    // ✅ CAMBIO AQUÍ: Cambiamos "/dashboard/list" por "/dashboard"
    navigate("/dashboard"); 
    
    /* CÓDIGO REAL COMENTADO HASTA TENER EL BACKEND
    const url = `${import.meta.env.VITE_BACKEND_URL}/administrador/login`;

    const dataToSend = {
      email: dataForm.email,
      password: dataForm.password,
      rol: rol,
    };

    const response = await fetchDataBackend(url, dataToSend, "POST");

    if (response) {
      setToken(response.token);         
      setRolGlobal(response.rol);       
      navigate("/dashboard"); // Asegúrate de cambiarlo aquí también para el futuro
    }
    */
  };

  const handleInvitado = () => {
    // setToken("TOKEN_INVITADO"); 
    // setRolGlobal("invitado");   
    
    // ✅ CAMBIO AQUÍ: Cambiamos "/dashboard/list" por "/dashboard"
    navigate("/dashboard"); 
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-8 overflow-y-auto bg-gray-100">
      {/* <ToastContainer /> */}

      {/* Fondo (Asegúrate de tener esfot.jpg en la carpeta public/images/ o public/) */}
      <div className="absolute inset-0 bg-[url('/esfot.jpg')] bg-no-repeat bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Header institucional */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#17243D] shadow-xl flex items-center justify-between px-6 z-20">
        <div className="h-full py-2 flex items-center justify-center">
          {/* ✅ CORRECCIÓN 2: Uso del logo de la EPN de prueba si no tienes logoPIC.png aún */}
           <img src="/logoPIC.png" alt="Escudo EPN" className="h-[90px] w-auto object-contain" />
        </div>
        <Link to="/" className="text-white hover:text-yellow-400 font-bold text-sm">
           Volver al Inicio
        </Link>
      </div>

      {/* Card Principal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8 mx-4 my-8 mt-24 border border-gray-200">
        
        <h1 className="text-3xl font-bold text-center mb-0 mt-4">
          <span className="text-[#F5BD45]">BIENVENIDO(A)</span> <br />
          <span className="text-[#17243D] uppercase">AL PORTAL PIC</span>
        </h1>

        <small className="text-gray-600 block mb-6 text-center text-sm mt-2">
          Por favor ingresa tus credenciales
        </small>

        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>

          {/* Correo */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="block w-full rounded-full border border-gray-300 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2 px-4 text-gray-700"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********************"
                className="block w-full rounded-full border border-gray-300 py-2 px-4 pr-10 text-gray-700 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D]"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>

            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Rol */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Selecciona tu Rol
            </label>

            <div className="relative">
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="block w-full appearance-none rounded-full border border-gray-300 py-2 px-4 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] text-gray-700"
              >
                <option value="">Selecciona un rol</option>
                <option value="administrador">Administrador</option>
                <option value="estudiante">Estudiante</option>
              </select>

              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-600">
                ▼
              </div>
            </div>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            className="py-2 w-full block text-center bg-[#17243D] text-white font-bold rounded-full hover:scale-105 transition-transform duration-300 hover:bg-[#1F3059] mt-6"
          >
            Iniciar Sesión
          </button>

          {/* Botón invitado */}
          <button
            type="button"
            onClick={handleInvitado}
            className="py-2 px-8 bg-[#F5BD45] text-[#17243D] font-extrabold rounded-full hover:scale-105 transition-transform duration-300 hover:bg-yellow-500 w-full text-center"
          >
            Ingresar como Invitado
          </button>

        </form>

        {/* Separador */}
        <div className="mt-6 mb-6 flex items-center justify-center">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-4 text-sm text-gray-500">O</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Enlaces inferiores */}
        <div className="flex flex-col items-center gap-4 text-sm">
          <Link to="/forgot" className="underline text-gray-600 hover:text-[#17243D] transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
          
          {/* <Link
            to="/register"
            className="..."
          >
            Registrarse
          </Link> */}
        </div>

      </div>
    </div>
  );
};

export default Login;