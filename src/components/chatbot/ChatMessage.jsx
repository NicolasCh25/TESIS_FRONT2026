import { TarjetaProyectoChat } from "./TarjetaProyectoChat";
import { MdSmartToy, MdPerson } from "react-icons/md";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  // 🧹 FUNCIÓN DE LIMPIEZA VISUAL: Si el texto contiene campos estructurados en crudo
  // que ahora van a estar dentro de las tarjetas, los removemos del párrafo para que no se dupliquen.
  const limpiarTextoBot = (texto) => {
    if (!texto) return "";
    return texto
      .replace(/Autor:\s*.*(\n|$)/gi, "")
      .replace(/Tutor:\s*.*(\n|$)/gi, "")
      .replace(/Carrera:\s*.*(\n|$)/gi, "")
      .replace(/Período:\s*.*(\n|$)/gi, "")
      .replace(/Tecnologías:\s*.*(\n|$)/gi, "")
      .replace(/PDF disponible:\s*.*(\n|$)/gi, "")
      .replace(/\n{2,}/g, "\n\n") // Quita saltos de línea huérfanos
      .trim();
  };

  // Intentamos estructurar la información si el bot envió metadata
  const textoLimpio = isBot ? limpiarTextoBot(message.text) : message.text;

  // Si no llegaron proyectos en el objeto estructurado pero se detecta texto en bruto,
  // creamos un objeto de respaldo leyendo los datos antes de eliminarlos.
  const extraerProyectoDeEmergencia = (textoOriginal) => {
    if (!textoOriginal || !textoOriginal.includes("Autor:")) return null;
    return {
      titulo: textoOriginal.match(/Proyectos relacionados a "(.*?)"/i)?.[1] || "Proyecto Encontrado",
      autor: textoOriginal.match(/Autor:\s*(.*)/i)?.[1],
      tutor: textoOriginal.match(/Tutor:\s*(.*)/i)?.[1],
      carrera: textoOriginal.match(/Carrera:\s*(.*)/i)?.[1],
      periodo: textoOriginal.match(/Período:\s*(.*)/i)?.[1],
      archivoPDF: textoOriginal.match(/PDF disponible:\s*(https?:\/\/[^\s]+)/i)?.[1]
    };
  };

  const proyectosARenderizar = message.proyectos && message.proyectos.length > 0
    ? message.proyectos
    : (() => {
        const emergencia = extraerProyectoDeEmergencia(message.text);
        return emergencia ? [emergencia] : [];
      })();

  return (
    <div className={`flex gap-3 w-full my-2 animate-fadeIn ${isBot ? "justify-start" : "justify-end"}`}>
      {/* Icono identificador de rol */}
      {isBot && (
        <div className="bg-[#17243D] text-[#F5BD45] p-2 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <MdSmartToy size={18} />
        </div>
      )}

      {/* Contenedor e interfaz de la burbuja */}
      <div className={`max-w-[75%] flex flex-col gap-1.5`}>
        {textoLimpio && (
          <div className={`p-4 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed border ${
            isBot 
              ? "bg-white text-gray-800 border-gray-100 rounded-tl-sm" 
              : "bg-[#17243D] text-white border-[#17243D] rounded-tr-sm"
          }`}>
            <p className="whitespace-pre-line font-medium">{textoLimpio}</p>
          </div>
        )}

        {/* ✅ RENDERIZADO FLEXIBLE DE TARJETAS: Si hay más de uno, se alinean como grid/tarjetas */}
        {isBot && proyectosARenderizar.length > 0 && (
          <div className="flex flex-col gap-3 mt-1 w-full">
            {proyectosARenderizar.map((proj, idx) => (
              <TarjetaProyectoChat key={idx} proyecto={proj} />
            ))}
          </div>
        )}
      </div>

      {!isBot && (
        <div className="bg-[#F5BD45] text-[#17243D] p-2 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <MdPerson size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;