import { MdPictureAsPdf, MdPerson, MdComputer } from "react-icons/md";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4 animate-fadeIn`}>
      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
        isBot ? "bg-white border border-gray-200 text-gray-800" : "bg-[#17243D] text-white"
      }`}>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.text}
        </p>

        {/* Si el bot devuelve proyectos, mostramos tarjetas interactivas */}
        {isBot && message.proyectos?.length > 0 && (
          <div className="mt-4 space-y-3">
            {message.proyectos.map((pro) => (
              <div key={pro._id} className="bg-gray-50 border-l-4 border-[#F5BD45] p-3 rounded-r-lg">
                <h4 className="text-xs font-black text-[#17243D] uppercase">{pro.titulo}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                  <MdPerson size={12} /> <span>{pro.autor}</span>
                  <MdComputer size={12} /> <span>{pro.tecnologias.join(", ")}</span>
                </div>
                <a 
                  href={pro.archivoPDF} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-red-600 hover:underline"
                >
                  <MdPictureAsPdf /> VER DOCUMENTO PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;