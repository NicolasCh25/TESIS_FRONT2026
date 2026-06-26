import { TarjetaProyectoChat } from "./TarjetaProyectoChat";
import { MdSmartToy, MdPerson } from "react-icons/md";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  // 🧹 1. FUNCIÓN PARA LIMPIEZA TOTAL DEL TEXTO
  const limpiarTextoBot = (texto) => {
    if (!texto) return "";
    return texto
      // Elimina las líneas completas de metadatos de los proyectos para que no se dupliquen
      .replace(/(?:Título|Autor|Tutor|Carrera|Período|Tecnologías|PDF disponible|Enlace|Documento):\s*.*(\n|$)/gi, "")
      // Elimina asteriscos de negrita, guiones de listas sueltos y formatos Markdown residuales
      .replace(/\*\*+/g, "")
      .replace(/^[\s*-]+\s*/gm, "")
      // Limpia enlaces en formato Markdown [Texto](url) o remanentes
      .replace(/\[\s*Ver\s*PDF\s*\]\([^\)]+\)/gi, "")
      .replace(/\[\s*Enlace\s*\]\([^\)]+\)/gi, "")
      // Normaliza los saltos de línea múltiples
      .replace(/\n{2,}/g, "\n\n")
      .trim();
  };

  // 🕵️‍♂️ 2. EXTACTOR GLOBAL INTELIGENTE DE PROYECTOS MULTIPLES
  const extraerMultiplesProyectos = (textoOriginal) => {
    if (!textoOriginal) return [];

    // Dividimos el texto usando palabras clave como "Título:" o "Proyecto:" para separar cada bloque
    const bloques = textoOriginal.split(/(?=Título:|Proyecto \d+:)/i);
    const proyectosEncontrados = [];

    // Si el texto está dividido en bloques, procesamos cada uno
    if (bloques.length > 1) {
      bloques.forEach((bloque) => {
        if (!bloque.toLowerCase().includes("autor:") && !bloque.toLowerCase().includes("tutor:")) return;

        // Extraemos las variables limpiando asteriscos o corchetes residuales
        const titulo = bloque.match(/(?:Título|Proyecto \d+):\s*(.*)/i)?.[1]?.replace(/[\*\+]/g, "").trim();
        const autor = bloque.match(/Autor:\s*(.*)/i)?.[1]?.replace(/[\*\+]/g, "").trim();
        const tutor = bloque.match(/Tutor:\s*(.*)/i)?.[1]?.replace(/[\*\+]/g, "").trim();
        const carrera = bloque.match(/Carrera:\s*(.*)/i)?.[1]?.replace(/[\*\+]/g, "").trim();
        const periodo = bloque.match(/(?:Período|Periodo):\s*(.*)/i)?.[1]?.replace(/[\*\+]/g, "").trim();
        
        // Extrae CUALQUIER URL http/https que venga en el bloque (ya sea en un [Markdown](url) o suelta)
        const urlMatch = bloque.match(/(https?:\/\/[^\s\)\*]+)/i);
        const archivoPDF = urlMatch ? urlMatch[1] : null;

        if (titulo || autor) {
          proyectosEncontrados.push({ titulo, autor, tutor, carrera, periodo, archivoPDF });
        }
      });
    }

    return proyectosEncontrados;
  };

  // Procesamos el texto y los proyectos
  const textoLimpio = isBot ? limpiarTextoBot(message.text) : message.text;

  const proyectosARenderizar = message.proyectos && message.proyectos.length > 0
    ? message.proyectos
    : (isBot ? extraerMultiplesProyectos(message.text) : []);

  return (
    <div className={`flex gap-3 w-full my-2 animate-fadeIn ${isBot ? "justify-start" : "justify-end"}`}>
      {/* Icono de la IA */}
      {isBot && (
        <div className="bg-[#17243D] text-[#F5BD45] p-2 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <MdSmartToy size={18} />
        </div>
      )}

      {/* Burbuja de Texto Principal */}
      <div className="max-w-[80%] flex flex-col gap-1.5 w-full">
        {textoLimpio && (
          <div className={`p-4 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed border ${
            isBot 
              ? "bg-white text-gray-800 border-gray-100 rounded-tl-sm text-left" 
              : "bg-[#17243D] text-white border-[#17243D] rounded-tr-sm text-right"
          }`}>
            <p className="whitespace-pre-line font-medium">{textoLimpio}</p>
          </div>
        )}

        {/* ✅ LISTADO DE TARJETAS: Renderiza múltiples tarjetas de proyectos alineadas en cuadrícula/lista */}
        {isBot && proyectosARenderizar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 w-full max-w-4xl">
            {proyectosARenderizar.map((proj, idx) => (
              <TarjetaProyectoChat key={idx} proyecto={proj} />
            ))}
          </div>
        )}
      </div>

      {/* Icono del Usuario */}
      {!isBot && (
        <div className="bg-[#F5BD45] text-[#17243D] p-2 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <MdPerson size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;