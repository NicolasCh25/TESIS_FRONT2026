import { useState, useEffect, useRef } from "react";
import { MdChat, MdClose, MdSend, MdSmartToy, MdHistory, MdDelete, MdAddComment } from "react-icons/md";
import { useFetch } from "../../hooks/useFetch";
import { storeAuth } from "../../context/storeAuth";
import ChatMessage from "./ChatMessage";
import { toast, ToastContainer } from "react-toastify";

const ChatbotFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Controla el panel lateral en móviles
  const [inputValue, setInputValue] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [historialChats, setHistorialChats] = useState([]); // Guarda la lista de conversaciones
  
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! Soy el asistente del Portal PIC. ¿En qué puedo ayudarte hoy?" }
  ]);

  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const scrollRef = useRef(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith('/') 
    ? import.meta.env.VITE_BACKEND_URL 
    : `${import.meta.env.VITE_BACKEND_URL}`;

  // Auto-scroll al recibir o enviar mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cargar la lista de conversaciones del usuario al abrir el chat
  useEffect(() => {
    if (isOpen && token) {
      cargarListaConversaciones();
    }
  }, [isOpen, token]);

  const cargarListaConversaciones = async () => {
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      if (response && response.conversaciones) {
        setHistorialChats(response.conversaciones);
      }
    } catch (error) {
      console.error("Error al cargar lista de chats:", error);
    }
  };

  // Cargar una conversación específica al seleccionarla de la lista
  const seleccionarConversacion = async (id) => {
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones/${id}`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      if (response && response.conversacion) {
        setCurrentChatId(id);
        
        // Mapeamos los mensajes del backend al formato que entiende tu componente
        const mensajesMapeados = response.conversacion.mensajes.map(m => ({
          sender: m.rol === "usuario" ? "user" : "bot",
          text: m.contenido
        }));
        
        setMessages(mensajesMapeados);
        if (window.innerWidth < 640) setShowHistory(false); // Cierra el panel en móvil al elegir
      }
    } catch (error) {
      toast.error("No se pudo cargar la conversación");
    }
  };

  // Eliminar una conversación de la base de datos
  const eliminarConversacion = async (e, id) => {
    e.stopPropagation(); // Evita que se dispare la selección del chat al dar clic en el tacho
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones/${id}`, null, "DELETE", {
        Authorization: `Bearer ${token}`
      });
      if (response) {
        toast.success("Conversación eliminada correctamente");
        setHistorialChats(prev => prev.filter(chat => chat._id !== id));
        if (currentChatId === id) {
          iniciarNuevoChat();
        }
      }
    } catch (error) {
      toast.error("Error al eliminar la conversación");
    }
  };

  const iniciarNuevoChat = () => {
    setCurrentChatId(null);
    setMessages([
      { sender: "bot", text: "¡Hola de nuevo! Iniciamos una nueva conversación. ¿En qué te ayudo?" }
    ]);
    if (window.innerWidth < 640) setShowHistory(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);

    try {
      const url = `${baseUrl}api/chatbot`;
      const bodyData = { mensaje: userMsg };
      if (currentChatId) bodyData.conversacionId = currentChatId;

      const response = await fetchDataBackend(url, bodyData, "POST", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        if (response.conversacionId && !currentChatId) {
          setCurrentChatId(response.conversacionId);
        }
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: response.respuesta || "Procesado correctamente.",
          proyectos: response.proyectos || []
        }]);
        cargarListaConversaciones(); // Refresca la lista para capturar el nuevo título creado
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Lo siento, tuve un problema al conectar con el servidor." 
      }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      <ToastContainer />
      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#17243D] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all duration-300 active:scale-90"
      >
        {isOpen ? <MdClose size={24} className="sm:w-7 sm:h-7" /> : <MdChat size={24} className="sm:w-7 sm:h-7" />}
      </button>

      {/* Ventana de Chat Multi-panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[600px] md:w-[750px] h-[75vh] sm:h-[550px] md:h-[600px] max-h-[700px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-gray-200 flex overflow-hidden animate-slideUp">
          
          {/* PANEL IZQUIERDO: Historial de Conversaciones */}
          <div className={`
            ${showHistory ? "flex" : "hidden sm:flex"} 
            w-full sm:w-[240px] md:w-[280px] bg-[#17243D] text-white flex-col flex-shrink-0 border-r border-[#17243D]/20 z-10 absolute sm:relative h-full inset-0 sm:inset-auto
          `}>
            {/* Header del historial */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#F5BD45]">Historial de Chats</h4>
              <button 
                onClick={iniciarNuevoChat}
                className="p-1.5 bg-gray-800 rounded-lg hover:bg-[#F5BD45] hover:text-[#17243D] transition-colors"
                title="Nuevo chat"
              >
                <MdAddChat size={18} />
              </button>
              <button onClick={() => setShowHistory(false)} className="sm:hidden text-white">
                <MdClose size={20} />
              </button>
            </div>
            
            {/* Lista de chats scrollable */}
            <div className="flex-grow p-2 overflow-y-auto space-y-1 custom-scrollbar">
              {historialChats.length === 0 ? (
                <p className="text-[11px] text-gray-400 text-center p-4 italic">No hay chats previos</p>
              ) : (
                historialChats.map((chat) => (
                  <div 
                    key={chat._id}
                    onClick={() => seleccionarConversacion(chat._id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-left ${
                      currentChatId === chat._id ? "bg-[#F5BD45] text-[#17243D] font-bold" : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <p className="text-xs truncate max-w-[80%] uppercase tracking-tight">{chat.titulo || "Consulta sin título"}</p>
                    <button 
                      onClick={(e) => eliminarConversacion(e, chat._id)}
                      className={`hover:text-red-500 transition-colors p-1 ${currentChatId === chat._id ? "text-[#17243D]" : "text-gray-500"}`}
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PANEL DERECHO: Conversación Activa */}
          <div className="flex-grow flex flex-col bg-gray-50 h-full relative">
            {/* Header principal */}
            <div className="bg-[#17243D] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowHistory(!showHistory)} 
                  className="sm:hidden bg-gray-800 text-white p-2 rounded-xl"
                >
                  <MdHistory size={18} />
                </button>
                <div className="bg-[#F5BD45] p-2 rounded-xl">
                  <MdSmartToy className="text-[#17243D]" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-black text-xs uppercase tracking-tight">Asistente Virtual PIC</h3>
                  <p className="text-[8px] text-green-400 font-black uppercase tracking-wider">Soporte Inteligente</p>
                </div>
              </div>
              <button 
                onClick={iniciarNuevoChat} 
                className="hidden sm:block text-xs font-black bg-[#F5BD45] text-[#17243D] px-3 py-1.5 rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Nuevo Chat
              </button>
            </div>

            {/* Área de Mensajes */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Haz una consulta sobre proyectos..."
                className="flex-grow bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl px-4 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17243D]/10 focus:border-[#17243D] transition-all"
              />
              <button 
                type="submit"
                className="bg-[#17243D] text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg"
              >
                <MdSend size={18} />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatbotFloating;