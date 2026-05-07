import { useForm } from "react-hook-form";

const FormularioProyecto = ({ onSubmit, setArchivo, rol, cargando }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2.5 px-4 text-gray-700 transition-all duration-200";
  const labelClass = "mb-1.5 block text-sm font-bold text-[#17243D]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Título */}
        <div className="md:col-span-2">
          <label className={labelClass}>Título del Proyecto</label>
          <input
            type="text"
            placeholder="Título del proyecto"
            className={inputClass}
            {...register("titulo", { required: "El título es obligatorio" })}
          />
          {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
        </div>

        {/* Autor */}
        <div>
          <label className={labelClass}>Autor</label>
          <input 
            type="text" 
            className={inputClass} 
            {...register("autor", { required: "Requerido" })} 
          />
          {errors.autor && <p className="text-red-500 text-xs mt-1">{errors.autor.message}</p>}
        </div>

        {/* Tutor */}
        <div>
          <label className={labelClass}>Tutor</label>
          <input 
            type="text" 
            className={inputClass} 
            {...register("tutor", { required: "Requerido" })} 
          />
          {errors.tutor && <p className="text-red-500 text-xs mt-1">{errors.tutor.message}</p>}
        </div>

        {/* ✅ Carrera (COMBOBOX) */}
        <div>
          <label className={labelClass}>Carrera</label>
          <select
            className={inputClass}
            defaultValue=""
            {...register("carrera", { required: "La carrera es obligatoria" })}
          >
            <option value="" disabled>Seleccione una carrera</option>
            <option value="Tecnología Superior en Desarrollo de Software">
              Tecnología Superior en Desarrollo de Software
            </option>
            <option value="Agua y Saneamiento">
              Agua y Saneamiento
            </option>
            <option value="Electrónica">
              Electrónica
            </option>
            <option value="Mecánica">
              Mecánica
            </option>
            <option value="Electricidad">
              Electricidad
            </option>
          </select>
          {errors.carrera && <p className="text-red-500 text-xs mt-1">{errors.carrera.message}</p>}
        </div>

        {/* Periodo Académico */}
        <div>
          <label className={labelClass}>Periodo Académico</label>
          <input 
            placeholder="2026-a" 
            className={inputClass} 
            {...register("periodoAcademico", { required: "Requerido" })} 
          />
          {errors.periodoAcademico && <p className="text-red-500 text-xs mt-1">{errors.periodoAcademico.message}</p>}
        </div>

        {/* Palabras Clave */}
        <div>
          <label className={labelClass}>Palabras Clave</label>
          <input 
            className={inputClass} 
            {...register("palabrasClave", { required: "Requerido" })} 
          />
          {errors.palabrasClave && <p className="text-red-500 text-xs mt-1">{errors.palabrasClave.message}</p>}
        </div>

        {/* Tecnologías */}
        <div>
          <label className={labelClass}>Tecnologías</label>
          <input 
            className={inputClass} 
            {...register("tecnologias", { required: "Requerido" })} 
          />
          {errors.tecnologias && <p className="text-red-500 text-xs mt-1">{errors.tecnologias.message}</p>}
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea 
          className={`${inputClass} h-32 resize-none`} 
          {...register("descripcion", { required: "Requerido" })} 
        />
        {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
      </div>

      {/* Archivo PDF */}
      <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <label className={labelClass}>Archivo del Proyecto (archivoPDF)</label>
        <input 
          type="file" 
          accept=".pdf"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#17243D] file:text-white"
          onChange={(e) => setArchivo(e.target.files[0] || null)}
        />
      </div>

      <button
        type="submit"
        disabled={rol === "invitado" || cargando}
        className="w-full font-black py-4 rounded-xl shadow-lg bg-[#17243D] text-white hover:bg-[#2c3e50] transition-all disabled:opacity-50 uppercase"
      >
        {cargando ? "REGISTRANDO..." : "FINALIZAR REGISTRO"}
      </button>
    </form>
  );
};

export default FormularioProyecto;