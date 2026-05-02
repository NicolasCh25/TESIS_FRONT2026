import { useForm } from "react-hook-form";

const FormularioProyecto = ({ onSubmit, setArchivo, rol }) => {
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
            placeholder="Ej. Diseño e implementación de un sistema..."
            className={inputClass}
            {...register("titulo", { required: "El título es obligatorio" })}
          />
          {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>}
        </div>

        {/* Carrera */}
        <div>
          <label className={labelClass}>Carrera</label>
          <select className={inputClass} {...register("carrera", { required: "Seleccione una carrera" })}>
            <option value="">Seleccione su carrera</option>
            <option>Desarrollo de Software</option>
            <option>Redes y Telecomunicaciones</option>
            <option>Electromecánica</option>
            <option>Agua y Saneamiento Ambiental</option>
            <option>Procesamiento Industrial de la Madera</option>
            <option>Procesamiento de Alimentos</option>
          </select>
          {errors.carrera && <p className="text-red-500 text-xs mt-1">{errors.carrera.message}</p>}
        </div>

        {/* Estudiante */}
        <div>
          <label className={labelClass}>Autor / Estudiante</label>
          <input className={inputClass} placeholder="Nombre completo" {...register("estudiante", { required: "Nombre requerido" })} />
          {errors.estudiante && <p className="text-red-500 text-xs mt-1">{errors.estudiante.message}</p>}
        </div>

        {/* Fecha y Tecnologías */}
        <div>
          <label className={labelClass}>Fecha de Entrega</label>
          <input type="date" className={inputClass} {...register("fecha_realizacion", { required: "Fecha requerida" })} />
        </div>
        <div>
          <label className={labelClass}>Tecnologías / Herramientas</label>
          <input placeholder="Ej. React, Cisco, LabVIEW" className={inputClass} {...register("tecnologias")} />
        </div>

        {/* GitHub y Video */}
        <div>
          <label className={labelClass}>Repositorio (GitHub/GitLab)</label>
          <input placeholder="https://github.com/usuario/repo" className={inputClass} {...register("github_url")} />
        </div>
        <div>
          <label className={labelClass}>Video Demostrativo (URL)</label>
          <input placeholder="YouTube / Drive" className={inputClass} {...register("video_url")} />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className={labelClass}>Resumen del Proyecto</label>
        <textarea
          placeholder="Describe el problema y la solución técnica..."
          className={`${inputClass} h-32 resize-none`}
          {...register("descripcion", { required: "El resumen es obligatorio" })}
        />
        {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
      </div>

      {/* Carga de Archivos */}
      <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <label className={labelClass}>Documento PDF o ZIP del Proyecto</label>
        <input 
          type="file" 
          accept=".pdf,.zip,.rar"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#17243D] file:text-white hover:file:bg-[#F5BD45] transition-all cursor-pointer"
          onChange={(e) => setArchivo(e.target.files[0])}
        />
      </div>

      {rol === "invitado" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg text-yellow-700 text-xs font-bold">
          ⚠️ MODO INVITADO: El botón de guardado está deshabilitado.
        </div>
      )}

      <button
        type="submit"
        disabled={rol === "invitado"}
        className={`w-full font-black py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 ${
          rol === "invitado"
            ? "bg-gray-400 cursor-not-allowed opacity-50"
            : "bg-[#17243D] hover:bg-[#2c3e50] text-white hover:shadow-[#17243D]/30"
        }`}
      >
        FINALIZAR REGISTRO
      </button>
    </form>
  );
};

export default FormularioProyecto;