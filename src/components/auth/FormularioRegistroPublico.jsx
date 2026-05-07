import { useForm } from "react-hook-form";
import { MdPerson, MdEmail, MdLock, MdSchool } from "react-icons/md";

const FormularioRegistroPublico = ({ onSubmit, cargando }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Lista de carreras según tu Mongoose enum
  const carreras = [
    "Tecnología Superior en Desarrollo de Software",
    "Tecnología Superior en Redes y Telecomunicaciones",
    "Tecnología Superior en Electromecánica",
    "Tecnología Superior en Agua y Saneamiento Ambiental",
    "Tecnología Superior en Procesamiento Industrial de la Madera",
    "Tecnología Superior en Procesamiento de Alimentos"
  ];

  const inputClass = "block w-full rounded-full border border-gray-300 py-2.5 px-10 text-gray-700 focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><MdPerson size={20} /></span>
          <input 
            type="text" placeholder="Nombre" className={inputClass}
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p className="text-red-600 text-[10px] font-bold ml-4 mt-1">{errors.nombre.message}</p>}
        </div>

        {/* Apellido */}
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><MdPerson size={20} /></span>
          <input 
            type="text" placeholder="Apellido" className={inputClass}
            {...register("apellido", { required: "El apellido es obligatorio" })}
          />
          {errors.apellido && <p className="text-red-600 text-[10px] font-bold ml-4 mt-1">{errors.apellido.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><MdEmail size={20} /></span>
        <input 
          type="email" placeholder="Correo Institucional" className={inputClass}
          {...register("email", { 
            required: "El correo es obligatorio",
            pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
          })}
        />
        {errors.email && <p className="text-red-600 text-[10px] font-bold ml-4 mt-1">{errors.email.message}</p>}
      </div>

      {/* Carrera - ComboBox */}
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><MdSchool size={20} /></span>
        <select 
          className={`${inputClass} appearance-none cursor-pointer`}
          {...register("carrera", { required: "Selecciona tu carrera" })}
        >
          <option value="">Selecciona tu carrera</option>
          {carreras.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-xs">▼</div>
        {errors.carrera && <p className="text-red-600 text-[10px] font-bold ml-4 mt-1">{errors.carrera.message}</p>}
      </div>

      {/* Password */}
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><MdLock size={20} /></span>
        <input 
          type="password" placeholder="Contraseña (mín. 8 caracteres)" className={inputClass}
          {...register("password", { 
            required: "La contraseña es obligatoria",
            minLength: { value: 8, message: "Mínimo 8 caracteres" }
          })}
        />
        {errors.password && <p className="text-red-600 text-[10px] font-bold ml-4 mt-1">{errors.password.message}</p>}
      </div>

      <button 
        type="submit" disabled={cargando}
        className="w-full py-3 bg-[#17243D] text-white font-bold rounded-full hover:bg-[#1F3059] transition-all transform active:scale-95 shadow-lg"
      >
        {cargando ? "Registrando..." : "CREAR CUENTA"}
      </button>
    </form>
  );
};

export default FormularioRegistroPublico;