import ReactMarkdown from 'react-markdown';
import { MdPictureAsPdf, MdPerson, MdComputer, MdSmartToy, MdSchool } from "react-icons/md";



// ✅ Función para parsear proyectos estructurados desde el texto crudo (útil para historial y F5)
const parseProjectsFromText = (text) => {
  if (!text) return [];
  
  const projects = [];
  const lines = text.split("\n").map(l => l.trim());
  let currentProject = null;
  
  const isProjectKeyword = (str) => {
    return /^(Autor|Tutor|Tutora|Carrera|Periodo|Período|Tecnologías|Tecnologias|PDF|Repositorio|Video)/i.test(str) ||
           /PDF disponible en/i.test(str);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    // Formato 1: "PoliGym EPN : Autor: Nicolás Chiguano | Tutora: Yadira Franco"
    const headerMatch = line.match(/^(.+?)\s*:\s*Autor\s*:\s*(.+)$/i);
    
    if (headerMatch) {
      if (currentProject && currentProject.titulo && currentProject.archivoPDF) {
        projects.push(currentProject);
      }
      
      const titulo = headerMatch[1].trim();
      const autorText = headerMatch[2].split("|")[0].trim();
      
      currentProject = {
        _id: `parsed-${i}`,
        titulo: titulo,
        autor: autorText,
        tecnologias: "",
        archivoPDF: ""
      };
      continue;
    }
    
    // Formato 2: "Autor: Edison Cruz | Tutor: Ing. Becerra" (con el título en la línea anterior)
    const autorMatch = line.match(/^Autor\s*:\s*(.+)$/i);
    if (autorMatch) {
      // Intentar buscar el título en la línea anterior
      let prevIndex = i - 1;
      let titulo = "Proyecto sin título";
      while (prevIndex >= 0) {
        const prevLine = lines[prevIndex];
        if (prevLine && !isProjectKeyword(prevLine)) {
          titulo = prevLine;
          break;
        }
        prevIndex--;
      }
      
      if (currentProject && currentProject.titulo && currentProject.archivoPDF) {
        projects.push(currentProject);
      }
      
      currentProject = {
        _id: `parsed-${i}`,
        titulo: titulo,
        autor: autorMatch[1].split("|")[0].trim(),
        tecnologias: "",
        archivoPDF: ""
      };
      
      // Buscar tutor en la misma línea
      const tutorInLine = line.match(/Tutor(?:a)?\s*:\s*([^|]+)/i);
      if (tutorInLine) {
        currentProject.tutor = tutorInLine[1].trim();
      }
      continue;
    }
    
    if (currentProject) {
      // Carrera: ...
      const carreraMatch = line.match(/^Carrera\s*:\s*([^|]+)/i);
      if (carreraMatch) {
        currentProject.carrera = carreraMatch[1].trim();
      }
      // Buscar periodo si está en la misma línea (Carrera: ... | Periodo: ...)
      const periodoInLine = line.match(/Periodo\s*:\s*(.+)$/i);
      if (periodoInLine) {
        currentProject.periodoAcademico = periodoInLine[1].trim();
      }
      
      // Tecnologías: ...
      const tecMatch = line.match(/^(Tecnologías|Tecnologias)\s*:\s*(.+)$/i);
      if (tecMatch) {
        currentProject.tecnologias = tecMatch[2].trim();
        continue;
      }
      
      // PDF: ... o PDF disponible en: ...
      const pdfMatch = line.match(/^(PDF|PDF disponible en)\s*:\s*(https?:\/\/\S+)$/i);
      if (pdfMatch) {
        currentProject.archivoPDF = pdfMatch[2].trim();
        continue;
      }
      
      if (!currentProject.archivoPDF && line.startsWith("https://") && line.includes("cloudinary") && line.endsWith(".pdf")) {
        currentProject.archivoPDF = line;
        continue;
      }

      // Repositorio: ...
      const repoMatch = line.match(/^Repositorio\s*:\s*(https?:\/\/\S+)$/i);
      if (repoMatch) {
        currentProject.repositorio = repoMatch[1].trim();
        continue;
      }
    }
  }
  
  if (currentProject && currentProject.titulo && currentProject.archivoPDF) {
    projects.push(currentProject);
  }
  
  return projects;
};

// ✅ Función para limpiar la descripción repetida de los proyectos en el texto crudo de la IA
const cleanMessageText = (text) => {
  if (!text) return "";
  
  const lines = text.split("\n");
  const cleanedLines = [];
  const projects = parseProjectsFromText(text);
  const titles = projects.map(p => p.titulo.toLowerCase());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === "") {
      if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] !== "") {
        cleanedLines.push("");
      }
      continue;
    }
    
    // Ignoramos líneas que contienen palabras clave del proyecto
    const containsProjectPattern = 
      /^(Autor|Tutor|Tutora|Carrera|Periodo|Período|Tecnologías|Tecnologias|PDF|Repositorio|Video)/i.test(line) ||
      /:\s*(Autor|Tutor|Tutora|Carrera|Periodo|Período|Tecnologías|Tecnologias|PDF|Repositorio|Video)/i.test(line) ||
      line.includes("https://res.cloudinary.com") ||
      line.includes("https://github.com") ||
      /PDF disponible en/i.test(line);
      
    if (containsProjectPattern) {
      continue;
    }
    
    // Si la línea es exactamente el título de uno de los proyectos detectados, la ignoramos
    if (titles.includes(line.toLowerCase())) {
      continue;
    }
    
    // Si la línea contiene un título seguido de ": Autor" (como en la primera versión)
    if (/: Autor/i.test(line)) {
      continue;
    }
    
    cleanedLines.push(lines[i]);
  }
  
  return cleanedLines.join("\n").trim();
};

const ChatMessage = ({ message, esFlotante = false }) => {
  const isBot = message.sender === "bot";

  // Unificamos los proyectos de la respuesta JSON o los parseados del texto
  const proyectos = (() => {
    if (message.proyectos && message.proyectos.length > 0) {
      return message.proyectos;
    }
    return isBot ? parseProjectsFromText(message.text) : [];
  })();

  const tieneProyectosValidos = isBot && proyectos.length > 0 && proyectos.some(p => p.archivoPDF);

  // Si hay proyectos para mostrar en tarjetas, limpiamos la lista cruda del texto para que no se duplique
  const textoAMostrar = tieneProyectosValidos ? cleanMessageText(message.text) : message.text;

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-6 animate-fadeIn px-2`}>
      <div className={`flex gap-3 w-full max-w-[95%] sm:max-w-[88%] ${isBot ? "flex-row" : "flex-row-reverse"}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${
          isBot ? "bg-[#F5BD45] text-[#17243D]" : "bg-[#17243D] text-white"
        }`}>
          {isBot ? <MdSmartToy size={18} /> : <MdPerson size={18} />}
        </div>

        <div className={`p-4 rounded-2xl shadow-md border w-full transition-all ${
          isBot ? "bg-white border-gray-200 text-gray-800 rounded-tl-none" : "bg-[#17243D] text-white border-transparent rounded-tr-none"
        }`}>
          
          {/* Contenedor de Texto */}
          {textoAMostrar && (
            <div className="text-sm leading-relaxed break-words overflow-wrap-anywhere prose prose-sm max-w-full">
              {isBot ? (
                <ReactMarkdown 
                  components={{
                    a: ({node, ...props}) => (
                      <a {...props} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold break-all" />
                    )
                  }}
                >
                  {textoAMostrar}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{textoAMostrar}</p>
              )}
            </div>
          )}

          {/* ✅ Tarjetas interactivas responsivas */}
          {tieneProyectosValidos && (
            <div className={`mt-4 border-t border-gray-100 pt-4 ${
              esFlotante 
                ? "flex flex-col gap-3" 
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            }`}>
              {proyectos.map((pro, index) => {
                if (!pro.archivoPDF) return null;

                return (
                  <div 
                    key={pro._id || `parsed-pro-${index}`} 
                    className="bg-gray-50/85 hover:bg-slate-50 border-l-4 border-[#F5BD45] p-4 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-[12px] font-black text-[#17243D] uppercase leading-tight tracking-tight mb-2">
                        {pro.titulo}
                      </h4>
                      
                      <div className="space-y-1.5 text-[10px] text-gray-600 font-bold">
                        <div className="flex items-center gap-1.5">
                          <MdPerson size={13} className="text-[#17243D] flex-shrink-0" />
                          <span className="truncate">{pro.autor}</span>
                        </div>
                        
                        {pro.carrera && (
                          <div className="flex items-center gap-1.5">
                            <MdSchool size={13} className="text-[#17243D] flex-shrink-0" />
                            <span className="truncate uppercase text-[9px]">{pro.carrera}</span>
                          </div>
                        )}
                        
                        {pro.tecnologias && (
                          <div className="flex items-center gap-1.5">
                            <MdComputer size={13} className="text-[#17243D] flex-shrink-0" />
                            <span className="truncate">
                              {Array.isArray(pro.tecnologias) ? pro.tecnologias.join(", ") : pro.tecnologias}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 pt-3 border-t border-gray-200/50">
                      <a 
                        href={pro.archivoPDF} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider"
                      >
                        <MdPictureAsPdf size={14} /> PDF
                      </a>
                      
                      {pro.repositorio && (
                        <a 
                          href={pro.repositorio} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                        >
                          <MdComputer size={14} className="text-[#17243D]" /> Repositorio
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;