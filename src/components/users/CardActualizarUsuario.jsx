import { useForm } from "react-hook-form";

const CardActualizarUsuario = ({ onSubmit, cargando, datosIniciales, rolAdmin }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: datosIniciales
  });

  const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2.5 px-4 text-gray-700 transition-all duration-200";
  const labelClass = "mb-1.5 block text-sm font-bold text-[#17243D]";

  return (
    <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#17243D] tracking-tight uppercase">
          Editar <span className="text-[#F5BD45]">Usuario</span>
        </h1>
        <div className="h-1.5 w-24 bg-[#F5BD45] mx-auto mt-2 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className={labelClass}>Nombre Completo</label>
          <input
            type="text"
            className={inputClass}
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Correo Institucional</label>
          <input
            type="email"
            className={inputClass}
            {...register("email", { required: "El correo es obligatorio" })}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Rol de Usuario</label>
          <select className={inputClass} {...register("rol", { required: "Seleccione un rol" })}>
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className={`w-full font-black py-4 rounded-xl shadow-lg transition-all duration-300 ${
            cargando ? "bg-gray-400" : "bg-[#17243D] hover:bg-[#2c3e50] text-white"
          }`}
        >
          {cargando ? "GUARDANDO..." : "ACTUALIZAR DATOS"}
        </button>
      </form>
    </div>
  );
};

export default CardActualizarUsuario;