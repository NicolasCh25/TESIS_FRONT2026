import { useForm } from "react-hook-form";
import { MdSave, MdPerson, MdEmail, MdLock } from "react-icons/md";

const FormularioUsuario = ({ onSubmit, cargando }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#17243D] focus:border-transparent outline-none transition-all shadow-sm";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-bold text-[#17243D] mb-2 uppercase tracking-wide">Nombre</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <MdPerson size={20} />
            </span>
            <input 
              type="text"
              placeholder="Ej. Gabriel"
              className={inputClass}
              {...register("nombre", { required: "El nombre es obligatorio" })}
            />
          </div>
          {errors.nombre && <p className="text-red-500 text-xs mt-1 font-bold">{errors.nombre.message}</p>}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-bold text-[#17243D] mb-2 uppercase tracking-wide">Apellido</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <MdPerson size={20} />
            </span>
            <input 
              type="text"
              placeholder="Ej. Escobar"
              className={inputClass}
              {...register("apellido", { required: "El apellido es obligatorio" })}
            />
          </div>
          {errors.apellido && <p className="text-red-500 text-xs mt-1 font-bold">{errors.apellido.message}</p>}
        </div>
      </div>

      {/* Email con Validación Institucional */}
      <div>
        <label className="block text-sm font-bold text-[#17243D] mb-2 uppercase tracking-wide">Correo Institucional</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <MdEmail size={20} />
          </span>
          <input 
            type="email"
            placeholder="nicolas.chiguano@epn.edu.ec"
            className={inputClass}
            {...register("email", { 
              required: "El correo es obligatorio",
              pattern: { 
                value: /^[a-zA-Z0-9._%+-]+@epn\.edu\.ec$/, 
                message: "Solo se permiten correos @epn.edu.ec" 
              }
            })}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
      </div>

      {/* Password con Validación de Complejidad */}
      <div>
        <label className="block text-sm font-bold text-[#17243D] mb-2 uppercase tracking-wide">Contraseña Temporal</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <MdLock size={20} />
          </span>
          <input 
            type="password"
            placeholder="Mínimo 8 caracteres"
            className={inputClass}
            {...register("password", { 
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
              validate: {
                format: (value) => 
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value) || 
                  "Debe contener mayúscula, minúscula y número"
              }
            })}
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={cargando}
        className={`w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-95 ${
          cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#17243D] hover:bg-[#F5BD45] hover:text-[#17243D] hover:shadow-2xl'
        }`}
      >
        <MdSave size={24} />
        {cargando ? "PROCESANDO..." : "REGISTRAR ADMINISTRADOR"}
      </button>
    </form>
  );
};

export default FormularioUsuario;