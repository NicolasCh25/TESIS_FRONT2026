import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useFetch } from '../hooks/useFetch';
import 'react-toastify/dist/ReactToastify.css';

export default function Forgot() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const fetchDataBackend = useFetch();

  const sendMail = async (dataForm) => {
    // Endpoint actualizado según tu Postman
    const url = `${import.meta.env.VITE_BACKEND_URL}api/recuperar-password`;

    try {
      const response = await fetchDataBackend(url, { email: dataForm.email }, "POST");

      if (response) {
        toast.success(response.msg || "Enlace enviado. Revisa tu correo institucional.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Error al solicitar la recuperación";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-8 overflow-y-auto bg-gray-100">
      <ToastContainer />

      <div className="absolute inset-0 bg-[url('/esfot.jpg')] bg-no-repeat bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-black/25"></div>

      <div className="absolute top-0 left-0 right-0 h-16 bg-[#17243D] shadow-xl flex items-center justify-between px-6 z-20">
        <div className="h-full py-2 flex items-center justify-center">
           <img src="/logoPIC.png" alt="Logo Portal PIC" className="h-[90px] w-auto object-contain" />
        </div>
        <Link to="/" className="text-white hover:text-yellow-400 font-bold text-sm transition-colors">
            Volver al Inicio
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8 mx-4 my-8 mt-24 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-0 mt-4">
          <span className="text-[#F5BD45]">RECUPERAR</span> <br />
          <span className="text-[#17243D] uppercase">CONTRASEÑA</span>
        </h1>

        <small className="text-gray-600 block mb-6 text-center text-sm mt-2">
          Ingresa tu correo electrónico institucional y te enviaremos las instrucciones.
        </small>

        <form className="space-y-4" onSubmit={handleSubmit(sendMail)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              placeholder="Ej: nicolas.chiguano@epn.edu.ec" 
              className="block w-full rounded-full border border-gray-300 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2 px-4 text-gray-700"
              {...register("email", { 
                required: "El correo es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Dirección de correo inválida" }
              })}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1 font-bold">{errors.email.message}</p>}
          </div>

          <button 
            type="submit"
            className="py-3 w-full block text-center bg-[#17243D] text-white font-bold rounded-full hover:scale-105 transition-transform duration-300 hover:bg-[#1F3059] mt-6"
          >
            Enviar enlace
          </button>
        </form>

        <div className="mt-6 mb-6 flex items-center justify-center">
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <div className="flex flex-col items-center gap-4 text-sm font-medium">
          <p className="text-gray-600">¿Ya recordaste tu contraseña?</p>
          <Link 
            to="/login" 
            className="py-2 px-8 bg-[#F5BD45] text-[#17243D] font-extrabold rounded-full hover:scale-105 transition-transform duration-300 hover:bg-yellow-500 w-full text-center"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}