import { MdClose, MdPictureAsPdf, MdVideoLibrary, MdPerson, MdCalendarToday, MdLabel } from "react-icons/md";

const DetalleModal = ({ proyecto, onClose }) => {
  if (!proyecto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#17243D]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-slideUp">
        
        {/* Header del Modal */}
        <div className="bg-[#17243D] p-6 text-white flex justify-between items-start">
          <div>
            <span className="text-[#F5BD45] text-[10px] font-black uppercase tracking-widest">{proyecto.carrera}</span>
            <h2 className="text-xl md:text-2xl font-black uppercase leading-tight mt-1">{proyecto.titulo}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <MdClose size={30} />
          </button>
        </div>

        {/* Contenido Scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          
          {/* Info Rápida */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-2xl text-[#17243D]"><MdPerson size={20}/></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Autor</p><p className="font-bold text-sm">{proyecto.autor}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-2xl text-[#17243D]"><MdCalendarToday size={20}/></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Periodo</p><p className="font-bold text-sm">{proyecto.periodoAcademico}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-2xl text-[#17243D]"><MdLabel size={20}/></div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Tutor</p><p className="font-bold text-sm">{proyecto.tutor}</p></div>
            </div>
          </div>

          {/* Resumen */}
          <div>
            <h3 className="text-[#17243D] font-black uppercase text-xs mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-[#F5BD45] rounded-full"></span> Resumen del Proyecto
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-justify bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
              "{proyecto.descripcion}"
            </p>
          </div>

          {/* Tecnologías y Tags */}
          <div className="flex flex-wrap gap-2">
             {proyecto.tecnologias?.map((tec, i) => (
               <span key={i} className="px-3 py-1 bg-[#17243D] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">{tec}</span>
             ))}
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={proyecto.archivoPDF} 
              target="_blank" 
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-700 transition-all shadow-lg active:scale-95"
            >
              <MdPictureAsPdf size={20} /> Ver Documento PDF
            </a>
            
            {proyecto.linkVideo && (
              <a 
                href={proyecto.linkVideo} 
                target="_blank" 
                className="flex-1 flex items-center justify-center gap-2 bg-[#17243D] text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-gray-800 transition-all shadow-lg active:scale-95 border-b-4 border-[#F5BD45]"
              >
                <MdVideoLibrary size={20} /> Ver Video Explicativo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleModal;