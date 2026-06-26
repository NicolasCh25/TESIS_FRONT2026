import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { MdPictureAsPdf, MdPerson, MdComputer, MdSmartToy, MdSchool, MdInfo } from "react-icons/md";
import { storeAuth } from "../../context/storeAuth";
import { toast } from "react-toastify";

// ✅ Función para normalizar títulos de proyectos y facilitar comparaciones
const cleanTitle = (title) => {
  return (title || "")
    .toLowerCase()
    .replace(/\*/g, "")
    .replace(/proyecto/gi, "")
    .trim();
};

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
      
      const titulo = headerMatch[1].replace(/\*/g, "").trim();
      const autorText = headerMatch[2].split("|")[0].trim();
      
      currentProject = {
        _id: `parsed-${i}`,
        titulo: titulo,
        autor: autorText,
        tecnologias: "",
        archivoPDF: ""
      };
      
      const tutorInLine = headerMatch[2].match(/Tutor(?:a)?\s*:\s*([^|]+)/i);
      if (tutorInLine) {
        currentProject.tutor = tutorInLine[1].trim();
      }
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
          const cleanedPrev = prevLine.toLowerCase().replace(/\*/g, "").replace(/#/g, "").trim();
          if (
            cleanedPrev !== "proyectos" && 
            cleanedPrev !== "proyecto" && 
            cleanedPrev !== "proyectos recomendados" && 
            cleanedPrev !== "proyectos relacionados" &&
            cleanedPrev !== "proyectos relacionados con"
          ) {
            titulo = prevLine.replace(/\*/g, "").trim();
            break;
          }
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

// ✅ Función para parsear ideas de proyectos sugeridas por la IA (cuando no hay en BD)
const parseIdeasFromText = (text) => {
  if (!text) return [];
  
  const ideas = [];
  const lines = text.split("\n").map(l => l.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const ideaMatch = line.match(/^(\d+)\.\s*(.+)$/);
    if (ideaMatch) {
      const content = ideaMatch[2];
      
      const techMatch = content.match(/(?:Tecnologías sugeridas|Tecnologias sugeridas|Tecnologías|Tecnologias)\s*:\s*(.+)$/i);
      
      let tecnologias = "";
      let textoSinTech = content;
      
      if (techMatch) {
        tecnologias = techMatch[1].trim();
        textoSinTech = content.substring(0, content.indexOf(techMatch[0])).trim();
      }
      
      let titulo = "";
      let descripcion = "";
      
      const boldMatch = textoSinTech.match(/^\*\*(.+?)\*\*(.+)$/);
      if (boldMatch) {
        titulo = boldMatch[1].trim();
        descripcion = boldMatch[2].trim();
      } else {
        const sentenceMatch = textoSinTech.match(/^(.+?)(?:\s+Este proyecto|\s+Se propone|\s+Consiste en|\s+Desarrolla|\s+Crea|\s+Utiliza|\.|$)/i);
        if (sentenceMatch) {
          titulo = sentenceMatch[1].trim();
          descripcion = textoSinTech.substring(titulo.length).trim();
          if (descripcion.startsWith(".")) descripcion = descripcion.substring(1).trim();
        } else {
          titulo = textoSinTech;
          descripcion = "";
        }
      }
      
      if (titulo) {
        ideas.push({
          _id: `idea-${i}`,
          titulo: titulo,
          descripcion: descripcion || textoSinTech,
          tecnologias: tecnologias,
          esIdea: true
        });
      }
    }
  }
  
  return ideas;
};

// ✅ Función para limpiar la descripción repetida de los proyectos en el texto crudo de la IA
const cleanMessageText = (text, tieneProyectos, tieneIdeas) => {
  if (!text) return "";
  
  const lines = text.split("\n");
  const cleanedLines = [];
  
  const projects = tieneProyectos ? parseProjectsFromText(text) : [];
  const projectTitles = projects.map(p => p.titulo.toLowerCase());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === "") {
      if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] !== "") {
        cleanedLines.push("");
      }
      continue;
    }
    
    // Si tiene ideas, filtramos las líneas que corresponden a las ideas numeradas
    if (tieneIdeas && /^(\d+)\.\s*(.+)$/.test(line)) {
      continue;
    }
    
    // Si tiene proyectos, filtramos las líneas de metadatos de proyectos
    if (tieneProyectos) {
      const containsProjectPattern = 
        /^(Autor|Tutor|Tutora|Carrera|Periodo|Período|Tecnologías|Tecnologias|PDF|Repositorio|Video)/i.test(line) ||
        /:\s*(Autor|Tutor|Tutora|Carrera|Periodo|Período|Tecnologías|Tecnologias|PDF|Repositorio|Video)/i.test(line) ||
        line.includes("https://res.cloudinary.com") ||
        line.includes("https://github.com") ||
        /PDF disponible en/i.test(line);
        
      if (containsProjectPattern) {
        continue;
      }
      
      const cleanedLineLower = line.toLowerCase().replace(/\*/g, "").replace(/#/g, "").trim();
      if (
        projectTitles.includes(line.toLowerCase()) || 
        cleanedLineLower === "proyectos" ||
        cleanedLineLower === "proyecto" ||
        cleanedLineLower === "proyecto sin título" ||
        cleanedLineLower === "proyectos recomendados" ||
        cleanedLineLower === "proyectos relacionados" ||
        cleanedLineLower === "proyectos relacionados con"
      ) {
        continue;
      }
      
      if (/: Autor/i.test(line)) {
        continue;
      }
    }
    
    cleanedLines.push(lines[i]);
  }
  
  return cleanedLines.join("\n").trim();
};

const ChatMessage = ({ message, esFlotante = false }) => {
  const isBot = message.sender === "bot";
  const navigate = useNavigate();
  const [resolvedProjects, setResolvedProjects] = useState({});

  // Unificamos los proyectos de la respuesta JSON cruzando datos con los parseados del texto
  const proyectos = (() => {
    if (!isBot) return [];

    const textProjects = parseProjectsFromText(message.text);
    const textIdeas = parseIdeasFromText(message.text);
    const apiProyectos = message.proyectos || [];

    let list = [];

    // 1. Agregar proyectos del API y cruzarlos con los del texto
    apiProyectos.forEach(p => {
      const match = textProjects.find(tp => 
        cleanTitle(p.titulo) === cleanTitle(tp.titulo) ||
        (p.autor && tp.autor && p.autor.toLowerCase().trim() === tp.autor.toLowerCase().trim())
      );
      
      list.push({
        ...p,
        archivoPDF: p.archivoPDF || match?.archivoPDF || "",
        tutor: p.tutor || match?.tutor || "",
        periodoAcademico: p.periodoAcademico || match?.periodoAcademico || "",
        tecnologias: p.tecnologias || match?.tecnologias || "",
        esIdea: p.esIdea !== undefined ? p.esIdea : false
      });
    });

    // 2. Agregar los proyectos parseados de texto que no estén en la lista
    textProjects.forEach(tp => {
      const exists = list.some(p => 
        cleanTitle(p.titulo) === cleanTitle(tp.titulo) ||
        (p.archivoPDF && tp.archivoPDF && p.archivoPDF.trim() === tp.archivoPDF.trim()) ||
        (p.autor && tp.autor && p.autor.toLowerCase().trim() === tp.autor.toLowerCase().trim())
      );
      if (!exists) {
        list.push({
          ...tp,
          esIdea: false
        });
      }
    });

    // 3. Agregar las ideas parseadas de texto que no estén en la lista
    textIdeas.forEach(ti => {
      const exists = list.some(p => 
        cleanTitle(p.titulo) === cleanTitle(ti.titulo)
      );
      if (!exists) {
        list.push({
          ...ti,
          esIdea: true
        });
      }
    });

    return list;
  })();

  // Un proyecto es real si tiene archivo PDF o no es idea
  const tieneProyectosValidos = isBot && proyectos.length > 0 && (proyectos.some(p => p.esIdea || p.archivoPDF));
  
  const tieneIdeas = tieneProyectosValidos && proyectos.every(p => p.esIdea);
  const tieneProyectos = tieneProyectosValidos && proyectos.some(p => !p.esIdea || p.archivoPDF);

  // Si hay proyectos para mostrar en tarjetas, limpiamos la lista cruda del texto para que no se duplique
  const textoAMostrar = tieneProyectosValidos 
    ? cleanMessageText(message.text, tieneProyectos, tieneIdeas) 
    : message.text;

  // Resolutor de proyectos en background (para buscar título real si es de historial o F5)
  useEffect(() => {
    if (!isBot || proyectos.length === 0) return;
    
    const toResolve = proyectos.filter(p => 
      !p.esIdea && 
      (p._id?.startsWith("parsed-") || p.titulo === "Proyectos" || p.titulo === "Proyecto sin título" || !p.titulo)
    );
    
    if (toResolve.length === 0) return;
    
    const resolveAll = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
      const tokenFinal = sessionStorage.getItem("token") || storeAuth.getState().token;
      
      const newResolved = { ...resolvedProjects };
      let changed = false;
      
      for (const pro of toResolve) {
        if (newResolved[pro._id]) continue;
        
        try {
          let match = null;
          
          // 1. Intentar buscar por autor (muy eficiente)
          if (pro.autor && !pro.autor.toLowerCase().includes("proyecto")) {
            const url = `${baseUrl}/api/proyectos?autor=${encodeURIComponent(pro.autor)}`;
            const res = await fetch(url, {
              headers: { Authorization: `Bearer ${tokenFinal}` }
            });
            if (res.ok) {
              const response = await res.json();
              const list = response.resultados || response.proyectos || (Array.isArray(response) ? response : []);
              match = list.find(p => 
                (p.archivoPDF && pro.archivoPDF && p.archivoPDF.trim() === pro.archivoPDF.trim()) ||
                (p.autor && pro.autor && p.autor.toLowerCase().trim() === pro.autor.toLowerCase().trim())
              );
            }
          }
          
          // 2. Fallback: búsqueda por paginación tradicional
          if (!match && pro.archivoPDF) {
            let paginaActual = 1;
            let totalPaginas = 1;
            do {
              const url = `${baseUrl}/api/proyectos?limit=50&page=${paginaActual}`;
              const res = await fetch(url, {
                headers: { Authorization: `Bearer ${tokenFinal}` }
              });
              if (!res.ok) break;
              const response = await res.json();
              const list = response.resultados || response.proyectos || (Array.isArray(response) ? response : []);
              match = list.find(p => 
                (p.archivoPDF && pro.archivoPDF && p.archivoPDF.trim() === pro.archivoPDF.trim())
              );
              if (match) break;
              totalPaginas = response.totalPaginas || 1;
              paginaActual++;
            } while (paginaActual <= totalPaginas);
          }
          
          if (match) {
            newResolved[pro._id] = {
              _id: match._id,
              titulo: match.titulo,
              autor: match.autor,
              tutor: match.tutor || match.tutora || pro.tutor || "",
              carrera: match.carrera || pro.carrera || "",
              periodoAcademico: match.periodoAcademico || pro.periodoAcademico || "",
              tecnologias: match.tecnologias || pro.tecnologias || "",
              archivoPDF: match.archivoPDF || pro.archivoPDF || "",
              repositorio: match.repositorio || pro.repositorio || ""
            };
            changed = true;
          }
        } catch (err) {
          console.error("Error al resolver proyecto:", err);
        }
      }
      
      if (changed) {
        setResolvedProjects(prev => ({ ...prev, ...newResolved }));
      }
    };
    
    resolveAll();
  }, [message.text, message.proyectos]);

  // Proyectos finales con resolución de datos aplicada
  const proyectosFinales = proyectos.map(p => {
    if (resolvedProjects[p._id]) {
      return {
        ...p,
        ...resolvedProjects[p._id]
      };
    }
    return p;
  });

  // ✅ Redirección segura al Detalle del Proyecto (con búsqueda en backend por si es parseado de historial)
  const handleVerDetalle = async (pro) => {
    if (pro._id && !pro._id.startsWith("parsed-")) {
      navigate(`/dashboard/detalle/${pro._id}`);
      return;
    }
    
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
      const tokenFinal = sessionStorage.getItem("token") || storeAuth.getState().token;
      
      let encontrado = null;
      let paginaActual = 1;
      let totalPaginas = 1;

      do {
        const url = `${baseUrl}/api/proyectos?limit=50&page=${paginaActual}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${tokenFinal}`
          }
        });
        const response = await res.json();

        if (response) {
          const listaProyectos = response.resultados || response.proyectos || (Array.isArray(response) ? response : []);
          
          const match = listaProyectos.find(p => 
            (p.archivoPDF && pro.archivoPDF && p.archivoPDF.trim() === pro.archivoPDF.trim()) ||
            cleanTitle(p.titulo) === cleanTitle(pro.titulo)
          );
          
          if (match && match._id) {
            encontrado = match;
            break;
          }
          
          totalPaginas = response.totalPaginas || 1;
          paginaActual++;
        } else {
          break;
        }
      } while (paginaActual <= totalPaginas);

      if (encontrado && encontrado._id) {
        navigate(`/dashboard/detalle/${encontrado._id}`);
      } else {
        toast.error("No se pudo localizar el ID del proyecto en el servidor.");
      }
    } catch (error) {
      console.error("Error al buscar ID de proyecto:", error);
      toast.error("Error al redirigir al detalle.");
    }
  };

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
              {proyectosFinales.map((pro, index) => {
                const esIdeaCard = pro.esIdea && !pro.archivoPDF;
                if (!pro.archivoPDF && !esIdeaCard) return null;

                // Título descriptivo si el título parseado es genérico o ausente
                const displayTitle = (!pro.titulo || pro.titulo === "Proyectos" || pro.titulo === "Proyecto sin título")
                  ? (pro.autor ? `Proyecto de ${pro.autor}` : "Proyecto Recomendado")
                  : pro.titulo;

                return (
                  <div 
                    key={pro._id || `parsed-pro-${index}`} 
                    className={`p-4 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between ${
                      esIdeaCard 
                        ? "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-blue-500" 
                        : "bg-gray-50/85 hover:bg-slate-50 border-l-4 border-[#F5BD45]"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="text-[12px] font-black text-[#17243D] uppercase leading-tight tracking-tight">
                          {displayTitle.replace(/\*/g, '')}
                        </h4>
                        {esIdeaCard && (
                          <span className="bg-blue-100 text-blue-800 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                            Idea IA
                          </span>
                        )}
                      </div>
                      
                      {esIdeaCard ? (
                        <p className="text-[10px] text-gray-600 font-medium leading-relaxed mb-3">
                          {pro.descripcion}
                        </p>
                      ) : (
                        <div className="space-y-1.5 text-[10px] text-gray-600 font-bold">
                          <div className="flex items-center gap-1.5">
                            <MdPerson size={13} className="text-[#17243D] flex-shrink-0" />
                            <span className="truncate">{pro.autor}</span>
                          </div>
                          
                          {(pro.tutor || pro.tutora) && (
                            <div className="flex items-center gap-1.5">
                              <MdPerson size={13} className="text-[#17243D] flex-shrink-0" />
                              <span className="truncate">Tutor: {pro.tutor || pro.tutora}</span>
                            </div>
                          )}
                          
                          {pro.carrera && (
                            <div className="flex items-center gap-1.5">
                              <MdSchool size={13} className="text-[#17243D] flex-shrink-0" />
                              <span className="truncate uppercase text-[9px]">{pro.carrera}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {pro.tecnologias && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold mt-1.5">
                          <MdComputer size={13} className="text-[#17243D] flex-shrink-0" />
                          <span className="truncate">
                            {Array.isArray(pro.tecnologias) ? pro.tecnologias.join(", ") : pro.tecnologias}
                          </span>
                        </div>
                      )}
                    </div>

                    {!esIdeaCard && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 pt-3 border-t border-gray-200/50">
                        <button 
                          onClick={() => handleVerDetalle(pro)}
                          className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#17243D] hover:text-[#F5BD45] cursor-pointer transition-colors uppercase tracking-wider bg-transparent border-none p-0"
                        >
                          <MdInfo size={14} className="text-[#17243D]" /> DETALLE
                        </button>

                        {pro.archivoPDF && (
                          <a 
                            href={pro.archivoPDF} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider"
                          >
                            <MdPictureAsPdf size={14} /> PDF
                          </a>
                        )}
                        
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
                    )}
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