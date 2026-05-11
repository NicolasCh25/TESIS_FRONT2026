import { useForm } from "react-hook-form";
import { MdPerson, MdEmail, MdUpdate } from "react-icons/md";

const CardActualizarUsuario = ({ onSubmit, cargando, datosIniciales }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: datosIniciales
  });

  const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2.5 px-10 text-gray-700 transition-all duration-200";
  const labelClass = "mb-1.5 block text-sm font-bold text-[#17243D] uppercase tracking-wider";

  return (
    <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#17243D] tracking-tight uppercase">
          Editar <span className="text-[#F5BD45]">Perfil</span>
        </h1>
        <div className="h-1.5 w-24 bg-[#F5BD45] mx-auto mt-2 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className={labelClass}>Nombre</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><MdPerson size={20}/></span>
              <input
                type="text"
                className={inputClass}
                {...register("nombre", { required: "El nombre es obligatorio" })}
              />
            </div>
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label className={labelClass}>Apellido</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><MdPerson size={20}/></span>
              <input
                type="text"
                className={inputClass}
                {...register("apellido", { required: "El apellido es obligatorio" })}
              />
            </div>
            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
          </div>
        </div>

        {/* Email (Solo lectura si tu back no permite cambiarlo) */}
        <div>
          <label className={labelClass}>Correo Institucional</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400"><MdEmail size={20}/></span>
            <input
              type="email"
              className={inputClass}
              {...register("email", { 
                required: "El correo es obligatorio",
                pattern: { value: /^[a-zA-Z0-9._%+-]+@epn\.edu\.ec$/, message: "Debe ser @epn.edu.ec" }
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full font-black py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            cargando ? "bg-gray-400 cursor-not-allowed" : "bg-[#17243D] hover:bg-[#F5BD45] hover:text-[#17243D] text-white"
          }`}
        >
          <MdUpdate size={24} />
          {cargando ? "GUARDANDO..." : "ACTUALIZAR DATOS"}
        </button>
      </form>
    </div>
  );
};

export default CardActualizarUsuario;