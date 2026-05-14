import { 
  MdClose, MdPictureAsPdf, MdVideoLibrary, MdPerson, MdSchool, 
  MdCalendarToday, MdDescription, MdCode, MdLabel, MdLink 
} from "react-icons/md";

const DetalleModal = ({ proyecto, onClose }) => {
  if (!proyecto) return null;

  // 🛠️ SINCRONIZACIÓN CON EL BACKEND
  const repoLink = proyecto.repositorio;
  const videoLink = proyecto.video;

  const renderList = (data, colorClass) => {
    const items = Array.isArray(data) ? data : (data?.split(',') || []);
    return items.map((item, i) => (
      <span key={i} className={`${colorClass} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm`}>
        {item.trim()}
      </span>
    ));
  };

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 transition-all hover:shadow-md">
      <div className="bg-[#17243D] p-2 rounded-lg text-[#F5BD45]">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-[#17243D] font-bold text-xs uppercase">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#17243D]/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative animate-slideUp">
        
        {/* HEADER INSTITUCIONAL */}
        <div className="bg-[#17243D] p-8 md:p-10 text-white relative">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-2">
              <span className="bg-[#F5BD45] text-[#17243D] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Detalle del Proyecto
              </span>
              <h2 className="text-xl md:text-3xl font-black uppercase leading-tight max-w-3xl">
                {proyecto.titulo}
              </h2>
            </div>
            <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-red-500 transition-all">
              <MdClose size={24} />
            </button>
          </div>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar bg-gray-50/30">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <InfoCard icon={MdPerson} label="Autor" value={proyecto.autor} />
            <InfoCard icon={MdSchool} label="Tutor" value={proyecto.tutor} />
            <InfoCard icon={MdSchool} label="Carrera" value={proyecto.carrera} />
            <InfoCard icon={MdCalendarToday} label="Periodo" value={proyecto.periodoAcademico} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 text-left">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MdDescription className="text-[#F5BD45]" size={22} />
                  <h3 className="font-black text-[#17243D] uppercase text-sm tracking-tighter">Resumen Ejecutivo</h3>
                </div>
                <p className="bg-white p-6 rounded-3xl border border-gray-100 text-gray-600 text-sm leading-relaxed border-l-8 border-[#F5BD45] italic">
                  {proyecto.descripcion || "Sin descripción disponible."}
                </p>
              </section>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-[#17243D]">
                    <MdLink size={20} className="text-[#F5BD45]" />
                    <h4 className="font-black text-[10px] uppercase">Repositorio GitHub</h4>
                  </div>
                  {repoLink ? (
                    <a href={repoLink} target="_blank" rel="noreferrer" className="text-blue-600 font-bold text-[11px] break-all hover:underline">
                      {repoLink}
                    </a>
                  ) : <p className="text-gray-400 text-[10px] italic">No disponible</p>}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left">
                  <div className="flex items-center gap-2 mb-3 text-[#17243D] justify-center sm:justify-start">
                    <MdVideoLibrary size={20} className="text-[#F5BD45]" />
                    <h4 className="font-black text-[10px] uppercase">Video Explicativo</h4>
                  </div>
                  {videoLink ? (
                    <a href={videoLink} target="_blank" rel="noreferrer" className="inline-block bg-[#17243D] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-[#F5BD45] hover:text-[#17243D] transition-all">
                      Reproducir Video
                    </a>
                  ) : <p className="text-gray-400 text-[10px] italic">No disponible</p>}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left">
                <h4 className="font-black text-[#17243D] text-[10px] uppercase mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                  <MdCode className="text-[#F5BD45]" size={16}/> Tecnologías Usadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {renderList(proyecto.tecnologias, "bg-[#17243D] text-white")}
                </div>
              </section>

              {proyecto.archivoPDF ? (
                <a href={proyecto.archivoPDF} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center bg-red-50 p-6 rounded-3xl border-2 border-dashed border-red-200 group hover:border-red-500 transition-all">
                  <MdPictureAsPdf className="text-red-500 mb-2 group-hover:scale-110 transition-transform" size={40} />
                  <span className="text-[#17243D] font-black text-[10px] uppercase tracking-widest">Documento PDF</span>
                </a>
              ) : (
                <div className="p-6 bg-gray-100 rounded-3xl text-center text-gray-400 font-bold text-[10px] uppercase italic">PDF No Cargado</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleModal;