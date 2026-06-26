import { TarjetaProyectoChat } from "./TarjetaProyectoChat";
import { MdSmartToy, MdPerson } from "react-icons/md";

const ChatMessage = ({ message }) => {
  const isBot = message.sender === "bot";

  // 🧹 1. FUNCIÓN PARA LIMPIEZA TOTAL DEL TEXTO (Remueve los datos que irán dentro de las tarjetas)
  const limpiarTextoBot = (texto) => {
    if (!texto) return "";
    return texto
      .replace(/(?:Título|Proyecto \d+|Autor|Tutor|Carrera|Período|Periodo|Tecnologías|PDF disponible|Enlace|Documento):\s*.*(\n|$)/gi, "")
      .replace(/[\*\+]/g, "") // Elimina asteriscos de Markdown
      .replace(/^[\s*-]+\s*/gm, "") // Elimina guiones sueltos de listas
      .replace(/\[\s*Ver\s*PDF\s*\]\([^\)]+\)/gi, "") // Quita enlaces en formato Markdown
      .replace(/https?:\/\/[^\s\)\*]+/gi, "") // Quita URLs sueltas del texto principal
      .replace(/\n{2,}/g, "\n\n") // Normaliza saltos de línea
      .trim();
  };

  // 🕵️‍♂️ 2. EXTRACTOR INTELIGENTE Y SEGURO LÍNEA POR LÍNEA
  const extraerMultiplesProyectos = (textoOriginal) => {
    if (!textoOriginal) return [];

    // Buscamos todas las ocurrencias globales de cada campo en el texto
    const titulos = [...textoOriginal.matchAll(/(?:Título|Proyecto \d+):\s*(.*)/gi)].map(m => m[1].replace(/[\*]/g, "").trim());
    const autores = [...textoOriginal.matchAll(/Autor:\s*(.*)/gi)].map(m => m[1].replace(/[\*]/g, "").trim());
    const tutores = [...textoOriginal.matchAll(/Tutor:\s*(.*)/gi)].map(m => m[1].replace(/[\*]/g, "").trim());
    const carreras = [...textoOriginal.matchAll(/Carrera:\s*(.*)/gi)].map(m => m[1].replace(/[\*]/g, "").trim());
    const periodos = [...textoOriginal.matchAll(/(?:Período|Periodo):\s*(.*)/gi)].map(m => m[1].replace(/[\*]/g, "").trim());
    
    // Captura todas las URLs de Cloudinary o HTTP/HTTPS que vengan en el texto
    const urls = [...textoOriginal.matchAll(/(https?:\/\/[^\s\)\*]+)/gi)].map(m => m[1].trim());

    const proyectosEncontrados = [];
    
    // Usamos el total de títulos o autores encontrados como cantidad base de proyectos
    const cantidadProyectos = Math.max(titulos.length, autores.length);

    for (let i = 0; i < cantidadProyectos; i++) {
      proyectosEncontrados.push({
        titulo: titulos[i] || `Proyecto Recomendado ${i + 1}`,
        autor: autores[i] || null,
        tutor: tutores[i] || null,
        carrera: carreras[i] || null,
        periodo: periodos[i] || null,
        // Asignamos la URL correspondiente de forma secuencial si existen
        archivoPDF: urls[i] || null
      });
    }

    return proyectosEncontrados;
  };

  // Procesamos los datos
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
      <div className="max-w-[85%] flex flex-col gap-1.5 w-full">
        {textoLimpio && (
          <div className={`p-4 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed border ${
            isBot 
              ? "bg-white text-gray-800 border-gray-100 rounded-tl-sm text-left" 
              : "bg-[#17243D] text-white border-[#17243D] rounded-tr-sm text-right"
          }`}>
            <p className="whitespace-pre-line font-medium">{textoLimpio}</p>
          </div>
        )}

        {/* ✅ GRILLA DE TARJETAS MODULARES */}
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