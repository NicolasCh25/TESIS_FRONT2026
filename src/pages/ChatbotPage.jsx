import { useState, useEffect, useRef } from "react";
import { MdSend, MdSmartToy, MdHistory, MdDelete, MdAddComment, MdClose, MdChatBubbleOutline } from "react-icons/md";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import ChatMessage from "../components/chatbot/ChatMessage"; 
import { toast, ToastContainer } from "react-toastify";

const ChatbotPage = () => {
  const [showHistory, setShowHistory] = useState(false); 
  const [inputValue, setInputValue] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [historialChats, setHistorialChats] = useState([]);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! Soy el asistente del Portal PIC. ¿En qué puedo ayudarte hoy?" }
  ]);

  const fetchDataBackend = useFetch();
  const scrollRef = useRef(null);

  // ✅ CAMBIO SOLICITADO: Uso de selector individual de Zustand
  const token = storeAuth((state) => state.token);
  const rol = storeAuth((state) => state.rol);

  const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith('/') 
    ? import.meta.env.VITE_BACKEND_URL 
    : `${import.meta.env.VITE_BACKEND_URL}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const tokenFinal = token || sessionStorage.getItem("token");
    if (tokenFinal) cargarListaConversaciones(tokenFinal);
  }, [token]);

  const cargarListaConversaciones = async (tokenValido) => {
    const authToUse = tokenValido || token || sessionStorage.getItem("token");
    if (!authToUse) return;
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones`, null, "GET", {
        Authorization: `Bearer ${authToUse}`
      });
      if (response && response.conversaciones) {
        setHistorialChats(response.conversaciones);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  const seleccionarConversacion = async (id) => {
    const tokenFinal = token || sessionStorage.getItem("token");
    if (!tokenFinal) return;
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones/${id}`, null, "GET", {
        Authorization: `Bearer ${tokenFinal}`
      });
      if (response && response.conversacion) {
        setCurrentChatId(id);
        setMessages(response.conversacion.mensajes.map(m => ({
          sender: m.rol === "usuario" ? "user" : "bot",
          text: m.contenido
        })));
        if (window.innerWidth < 1024) setShowHistory(false);
      }
    } catch (error) {
      toast.error("No se pudo cargar la conversación");
    }
  };

  const eliminarConversacion = async (e, id) => {
    e.stopPropagation(); 
    const tokenFinal = token || sessionStorage.getItem("token");
    if (!tokenFinal) return;
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones/${id}`, null, "DELETE", {
        Authorization: `Bearer ${tokenFinal}`
      });
      if (response) {
        toast.success("Conversación eliminada");
        setHistorialChats(prev => prev.filter(chat => chat._id !== id));
        if (currentChatId === id) iniciarNuevoChat();
      }
    } catch (error) {
      toast.error("Error al eliminar la conversación");
    }
  };

  const iniciarNuevoChat = () => {
    setCurrentChatId(null);
    setMessages([{ sender: "bot", text: "¡Hola! Iniciamos una nueva conversación. ¿En qué te ayudo?" }]);
    if (window.innerWidth < 1024) setShowHistory(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const msgAEnviar = inputValue.trim();
    if (!msgAEnviar) return;

    // ✅ CAMBIO SOLICITADO: Agregar validación del token antes del fetch
    const tokenFinal = token || sessionStorage.getItem("token");

    if (!tokenFinal) {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "No existe una sesión activa. Inicia sesión nuevamente."
        }
      ]);
      return;
    }

    setInputValue("");
    setMessages(prev => [...prev, { sender: "user", text: msgAEnviar }]);

    try {
      const url = `${baseUrl}api/chatbot`;
      
      const bodyData = { mensaje: msgAEnviar };
      if (currentChatId) {
        bodyData.conversacionId = currentChatId;
      }

      // ✅ CAMBIO SOLICITADO: Líneas de console.log justo antes del fetch
      console.log("TOKEN ZUSTAND:", token);
      console.log("TOKEN SESSION:", sessionStorage.getItem("token"));

      // ✅ CAMBIO SOLICITADO: Modificación del fetch usando tokenFinal
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenFinal}`
        },
        body: JSON.stringify(bodyData)
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.msg || "Error de respuesta del servidor");
      }

      if (response) {
        if (response.conversacionId && !currentChatId) {
          setCurrentChatId(response.conversacionId);
        }

        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: response.respuesta || "Procesado correctamente.",
          proyectos: response.proyectos || []
        }]);

        setTimeout(() => {
          cargarListaConversaciones(tokenFinal);
        }, 800);
      }
    } catch (error) {
      console.error("Error en handleSend:", error);
      setMessages(prev => [...prev, { sender: "bot", text: error.message || "Error de conexión." }]);
    }
  };

  return (
    <div className="p-4 lg:p-6 h-[calc(100vh-110px)] flex flex-col animate-fadeIn">
      <ToastContainer />
      
      <div className="mb-4 border-b-2 border-[#F5BD45] pb-2 inline-block self-start">
        <h1 className="text-xl lg:text-2xl font-black text-[#17243D]">
          ASISTENTE <span className="text-[#F5BD45]">VIRTUAL PIC</span>
        </h1>
        <p className="text-gray-500 font-medium italic uppercase text-[9px]">Consulta inteligente de proyectos ({rol || "Usuario"})</p>
      </div>

      <div className="flex-grow bg-white rounded-3xl shadow-xl border border-gray-100 flex overflow-hidden h-full relative">
        
        {/* PANEL IZQUIERDO: Estilo claro */}
        <div className={`
          ${showHistory ? "flex" : "hidden lg:flex"} 
          w-full lg:w-[260px] xl:w-[290px] bg-slate-50 text-gray-800 flex-col flex-shrink-0 border-r border-gray-200 z-20 absolute lg:relative h-full inset-0 lg:inset-auto
        `}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white flex-shrink-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#17243D]">Historial de Chats</h4>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={iniciarNuevoChat}
                className="p-2 bg-gray-100 text-[#17243D] rounded-xl hover:bg-[#F5BD45] transition-all active:scale-95 border border-gray-200"
                title="Nuevo chat"
              >
                <MdAddComment size={16} />
              </button>
              <button onClick={() => setShowHistory(false)} className="lg:hidden p-2 bg-gray-100 rounded-xl text-gray-700">
                <MdClose size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-grow p-3 overflow-y-auto space-y-2 custom-scrollbar">
            {historialChats.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center p-4 italic">No hay chats previos</p>
            ) : (
              historialChats.map((chat) => (
                <div 
                  key={chat._id}
                  onClick={() => seleccionarConversacion(chat._id)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border text-left ${
                    currentChatId === chat._id 
                      ? "bg-white text-[#17243D] font-bold border-[#F5BD45] shadow-md ring-1 ring-[#F5BD45]/30" 
                      : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 max-w-[80%] truncate">
                    <MdChatBubbleOutline size={14} className={currentChatId === chat._id ? "text-[#F5BD45]" : "text-gray-400"} />
                    <p className="text-xs truncate uppercase tracking-tight font-semibold">
                      {chat.titulo || "Consulta sin título"}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => eliminarConversacion(e, chat._id)}
                    className="transition-colors p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <MdDelete size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="flex-grow flex flex-col bg-gray-50 h-full relative">
          
          <div className="bg-[#17243D] p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                className="lg:hidden bg-gray-800 text-white p-2 rounded-xl"
              >
                <MdHistory size={18} />
              </button>
              <div className="bg-[#F5BD45] p-2 rounded-xl">
                <MdSmartToy className="text-[#17243D]" size={18} />
              </div>
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-tight">Soporte IA</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[7px] text-green-400 font-black uppercase">En línea</p>
                </div>
              </div>
            </div>
            <button 
              onClick={iniciarNuevoChat} 
              className="hidden sm:block text-[10px] font-black bg-[#F5BD45] text-[#17243D] px-3 py-2 rounded-xl uppercase tracking-wider hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              Nuevo Chat
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 p-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Haz una consulta al repositorio institucional..."
              className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17243D]/10 focus:border-[#17243D] transition-all"
            />
            <button 
              type="submit"
              className="bg-[#17243D] text-white p-3 rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg active:scale-95 flex items-center justify-center flex-shrink-0"
            >
              <MdSend size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatbotPage;