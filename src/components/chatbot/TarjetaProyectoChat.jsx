import { MdSchool, MdPerson, MdCalendarToday, MdPictureAsPdf } from "react-icons/md";

export const TarjetaProyectoChat = ({ proyecto }) => {
  if (!proyecto) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden my-3 max-w-md transition-all hover:shadow-lg animate-fadeIn text-left">
      {/* Encabezado de la Tarjeta */}
      <div className="bg-[#17243D] p-4">
        <span className="bg-[#F5BD45] text-[#17243D] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
          Proyecto Recomendado
        </span>
        <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2">
          {proyecto.titulo || "Trabajo de Integración Curricular"}
        </h3>
      </div>

      {/* Cuerpo con la metadata del Proyecto */}
      <div className="p-4 grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
        {proyecto.autor && (
          <div className="flex items-center gap-2 text-gray-600">
            <MdPerson className="text-[#F5BD45] shrink-0" size={18} />
            <p className="truncate"><span className="font-bold">Autor:</span> {proyecto.autor}</p>
          </div>
        )}
        
        {proyecto.tutor && (
          <div className="flex items-center gap-2 text-gray-600">
            <MdPerson className="text-gray-400 shrink-0" size={18} />
            <p className="truncate"><span className="font-bold">Tutor:</span> {proyecto.tutor}</p>
          </div>
        )}

        {proyecto.carrera && (
          <div className="flex items-center gap-2 text-gray-600">
            <MdSchool className="text-[#17243D] shrink-0" size={18} />
            <p className="truncate"><span className="font-bold">Carrera:</span> {proyecto.carrera}</p>
          </div>
        )}

        {proyecto.periodo && (
          <div className="flex items-center gap-2 text-gray-600">
            <MdCalendarToday className="text-gray-400 shrink-0" size={16} />
            <p className="truncate"><span className="font-bold">Periodo:</span> {proyecto.periodo}</p>
          </div>
        )}
      </div>

      {/* Acción de la Tarjeta */}
      {proyecto.archivoPDF && (
        <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex justify-end">
          <a
            href={proyecto.archivoPDF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#17243D] text-white px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-sm"
          >
            <MdPictureAsPdf size={14} />
            Visualizar Documento
          </a>
        </div>
      )}
    </div>
  );
};