import { Link } from 'react-router-dom'; // ✅ Corregido a react-router-dom
import { useForm } from 'react-hook-form';
// import { ToastContainer } from 'react-toastify';
// import { useFetch } from '../hooks/useFetch';

export default function Forgot() { // ✅ Cambiado a export default para mantener consistencia
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Mock temporal hasta tener el backend
  // const fetchDataBackend = useFetch();

  const sendMail = async (dataForm) => {
    console.log("Correo a recuperar:", dataForm.email);
    alert("Simulación: Se ha enviado un enlace de recuperación a tu correo.");
    
    /* CÓDIGO REAL COMENTADO
    const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`;
    await fetchDataBackend(url, dataForm, 'POST');
    */
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-8 overflow-y-auto bg-gray-100">
      {/* <ToastContainer /> */}

      {/* Fondo institucional */}
      <div className="absolute inset-0 bg-[url('/public/esfot.jpg')] bg-no-repeat bg-cover bg-center opacity-40"></div>
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
          <span className="text-[#F5BD45]">RECUPERAR</span> <br />
          <span className="text-[#17243D] uppercase">CONTRASEÑA</span>
        </h1>

        <small className="text-gray-600 block mb-6 text-center text-sm mt-2">
          Ingresa tu correo electrónico institucional y te enviaremos las instrucciones.
        </small>

        <form className="space-y-4" onSubmit={handleSubmit(sendMail)}>

          {/* Campo correo electrónico */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              placeholder="Ej: nombre.apellido@epn.edu.ec" 
              className="block w-full rounded-full border border-gray-300 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2 px-4 text-gray-700"
              {...register("email", { 
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo inválida"
                }
              })}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Botón Enviar */}
          <button 
            type="submit"
            className="py-2 w-full block text-center bg-[#17243D] text-white font-bold rounded-full hover:scale-105 transition-transform duration-300 hover:bg-[#1F3059] mt-6"
          >
            Enviar enlace
          </button>

        </form>

        {/* Separador */}
        <div className="mt-6 mb-6 flex items-center justify-center">
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        {/* Enlace para volver al Login */}
        <div className="flex flex-col items-center gap-4 text-sm">
          <p className="text-gray-600">¿Ya recordaste tu contraseña?</p>
          <Link 
            to="/login" 
            className="py-2 px-8 bg-[#F5BD45] text-[#17243D] font-extrabold rounded-full hover:scale-105 transition-transform duration-300 hover:bg-yellow-500 w-full text-center"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
}