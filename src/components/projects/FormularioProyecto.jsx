import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdLink, MdPlayCircleOutline } from "react-icons/md";

const FormularioProyecto = ({
  onSubmit,
  setArchivo,
  rol,
  cargando,
  defaultValues
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (defaultValues) {
      reset({
        titulo: defaultValues.titulo || "",
        autor: defaultValues.autor || "",
        tutor: defaultValues.tutor || "",
        carrera: defaultValues.carrera || "",
        palabrasClave: defaultValues.palabrasClave || "",
        tecnologias: defaultValues.tecnologias || "",
        descripcion: defaultValues.descripcion || "",
        repositorio: defaultValues.repositorio || "",
        video: defaultValues.video || "",
      });
    }
  }, [defaultValues, reset]);

  const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#17243D] focus:outline-none focus:ring-1 focus:ring-[#17243D] py-2.5 px-4 text-gray-700 transition-all duration-200";
  const labelClass = "mb-1.5 block text-sm font-bold text-[#17243D]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelClass}>Título del Proyecto</label>
          <input type="text" className={inputClass} {...register("titulo", { required: "El título es obligatorio" })} />
        </div>
        <div>
          <label className={labelClass}>Autor</label>
          <input type="text" className={inputClass} {...register("autor", { required: "Requerido" })} />
        </div>
        <div>
          <label className={labelClass}>Tutor</label>
          <input type="text" className={inputClass} {...register("tutor", { required: "Requerido" })} />
        </div>
        <div>
          <label className={labelClass}>Carrera</label>
          <select className={inputClass} {...register("carrera", { required: "La carrera es obligatoria" })}>
            <option value="">Seleccione una carrera</option>
            <option value="Tecnología Superior en Desarrollo de Software">Tecnología Superior en Desarrollo de Software</option>
            <option value="Tecnología Superior en Redes y Telecomunicaciones">Tecnología Superior en Redes y Telecomunicaciones</option>
            <option value="Tecnología Superior en Electromecánica">Tecnología Superior en Electromecánica</option>
            <option value="Tecnología Superior en Agua y Saniamiento Ambiental">Tecnología Superior en Agua y Saniamiento Ambiental</option>
            <option value="Tecnología Superior en Procesamiento Industrial de la Madera">Tecnología Superior en Procesamiento Industrial de la Madera</option>
            <option value="Tecnología Superior en Procesamiento de Alimentos">Tecnología Superior en Procesamiento de Alimentos</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Mes y Año de Culminación</label>
          <input 
            type="month" 
            className={inputClass} 
            {...register("fechaMes", { required: "Requerido" })} 
          />
          {errors.fechaMes && <p className="text-red-500 text-xs mt-1">{errors.fechaMes.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Palabras Clave</label>
          <input className={inputClass} {...register("palabrasClave", { required: "Requerido" })} />
        </div>
        <div>
          <label className={labelClass}>Tecnologías</label>
          <input className={inputClass} {...register("tecnologias", { required: "Requerido" })} />
        </div>
        <div>
          <label className={labelClass}>Repositorio (Opcional)</label>
          <div className="relative">
            <MdLink className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="url" className={`${inputClass} pl-10`} {...register("repositorio")} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Video (Opcional)</label>
          <div className="relative">
            <MdPlayCircleOutline className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="url" className={`${inputClass} pl-10`} {...register("video")} />
          </div>
        </div>
      </div>
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea className={`${inputClass} h-32 resize-none`} {...register("descripcion", { required: "Requerido" })} />
      </div>
      <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <label className={labelClass}>Archivo del Proyecto (PDF)</label>
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
        {cargando ? "PROCESANDO..." : "FINALIZAR REGISTRO"}
      </button>
    </form>
  );
};

export default FormularioProyecto;