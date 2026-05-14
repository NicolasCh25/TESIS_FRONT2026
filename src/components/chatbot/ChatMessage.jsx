import ReactMarkdown from 'react-markdown';
import { MdPictureAsPdf, MdPerson, MdComputer, MdSmartToy } from "react-icons/md";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-6 animate-fadeIn px-2`}>
      <div className={`flex gap-3 max-w-[88%] ${isBot ? "flex-row" : "flex-row-reverse"}`}>
        
        {/* Avatar Opcional para mejor visualización */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
          isBot ? "bg-[#F5BD45] text-[#17243D]" : "bg-[#17243D] text-white"
        }`}>
          {isBot ? <MdSmartToy size={18} /> : <MdPerson size={18} />}
        </div>

        <div className={`p-4 rounded-2xl shadow-md border ${
          isBot ? "bg-white border-gray-200 text-gray-800 rounded-tl-none" : "bg-[#17243D] text-white border-transparent rounded-tr-none"
        }`}>
          
          {/* ✅ CONTENEDOR DE TEXTO CON CORRECCIÓN DE DESBORDE Y MARKDOWN */}
          <div className="text-sm leading-relaxed break-words overflow-wrap-anywhere prose prose-sm max-w-full">
            {isBot ? (
              <ReactMarkdown 
                components={{
                  // Asegura que los enlaces dentro del texto se vean bien y no rompan el diseño
                  a: ({node, ...props}) => (
                    <a {...props} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold break-all" />
                  )
                }}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}
          </div>

          {/* Tarjetas interactivas de proyectos */}
          {isBot && message.proyectos?.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
              {message.proyectos.map((pro) => (
                <div key={pro._id} className="bg-gray-50 border-l-4 border-[#F5BD45] p-3 rounded-r-xl shadow-sm">
                  <h4 className="text-[11px] font-black text-[#17243D] uppercase leading-tight">{pro.titulo}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-gray-500 mt-2 font-bold">
                    <span className="flex items-center gap-1"><MdPerson size={12} className="text-[#17243D]"/> {pro.autor}</span>
                    <span className="flex items-center gap-1"><MdComputer size={12} className="text-[#17243D]"/> {Array.isArray(pro.tecnologias) ? pro.tecnologias.join(", ") : pro.tecnologias}</span>
                  </div>
                  <a 
                    href={pro.archivoPDF} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider"
                  >
                    <MdPictureAsPdf size={14} /> VER DOCUMENTO PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;