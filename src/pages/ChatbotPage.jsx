import { useState, useEffect, useRef } from "react";
import { MdSend, MdSmartToy, MdHistory, MdDelete, MdAddComment, MdClose } from "react-icons/md";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import ChatMessage from "../components/chatbot/ChatMessage"; // Mantenemos tu componente de mensajes
import { toast, ToastContainer } from "react-toastify";

const ChatbotPage = () => {
  const [showHistory, setShowHistory] = useState(false); // Controla el panel lateral en móviles
  const [inputValue, setInputValue] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [historialChats, setHistorialChats] = useState([]);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! Soy el asistente del Portal PIC. ¿En qué puedo ayudarte hoy?" }
  ]);

  const fetchDataBackend = useFetch();
  const { token, rol } = storeAuth();
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

  // Cargar el historial cuando el token esté disponible
  useEffect(() => {
    if (token) cargarListaConversaciones();
  }, [token]);

  const cargarListaConversaciones = async () => {
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      if (response && response.conversaciones) {
        setHistorialChats(response.conversaciones);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  const seleccionarConversacion = async (id) => {
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones/${id}`, null, "GET", {
        Authorization: `Bearer ${token}`
      });
      if (response && response.conversacion) {
        setCurrentChatId(id);
        setMessages(response.conversacion.mensajes.map(m => ({
          sender: m.rol === "usuario" ? "user" : "bot",
          text: m.contenido
        })));
        if (window.innerWidth < 640) setShowHistory(false);
      }
    } catch (error) {
      toast.error("No se pudo cargar la conversación");
    }
  };

  const eliminarConversacion = async (e, id) => {
    e.stopPropagation(); // Evita que se seleccione el chat al dar clic en eliminar
    try {
      const response = await fetchDataBackend(`${baseUrl}api/conversaciones/${id}`, null, "DELETE", {
        Authorization: `Bearer ${token}`
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
        if (response.conversacionId && !currentChatId) setCurrentChatId(response.conversacionId);
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: response.respuesta || "Procesado correctamente.",
          proyectos: response.proyectos || []
        }]);
        cargarListaConversaciones(); // Recarga la lista para pintar el nuevo título generado por el back
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: "bot", text: "Error de conexión con el servidor." }]);
    }
  };

  return (
    <div className="p-4 lg:p-6 h-[calc(100vh-110px)] flex flex-col animate-fadeIn">
      <ToastContainer />
      
      {/* Título superior de la sección */}
      <div className="mb-4 border-b-2 border-[#F5BD45] pb-2 inline-block self-start">
        <h1 className="text-xl lg:text-2xl font-black text-[#17243D]">
          ASISTENTE <span className="text-[#F5BD45]">VIRTUAL PIC</span>
        </h1>
        <p className="text-gray-500 font-medium italic uppercase text-[9px]">Consulta inteligente de proyectos ({rol})</p>
      </div>

      {/* Workspace del Chatbot */}
      <div className="flex-grow bg-white rounded-3xl shadow-xl border border-gray-100 flex overflow-hidden h-full relative">
        
        {/* PANEL IZQUIERDO: Historial de Chats */}
        <div className={`
          ${showHistory ? "flex" : "hidden sm:flex"} 
          w-full sm:w-[260px] md:w-[290px] bg-[#17243D] text-white flex-col flex-shrink-0 border-r border-gray-200 z-20 absolute sm:relative h-full inset-0 sm:inset-auto
        `}>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#F5BD45]">Historial de Chats</h4>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={iniciarNuevoChat}
                className="p-2 bg-gray-800 rounded-xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all active:scale-95"
                title="Nuevo chat"
              >
                <MdAddComment size={16} />
              </button>
              <button onClick={() => setShowHistory(false)} className="sm:hidden p-2 bg-gray-800 rounded-xl text-white">
                <MdClose size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-grow p-2 overflow-y-auto space-y-1.5 custom-scrollbar">
            {historialChats.length === 0 ? (
              <p className="text-[11px] text-gray-400 text-center p-4 italic">No hay chats previos</p>
            ) : (
              historialChats.map((chat) => (
                <div 
                  key={chat._id}
                  onClick={() => seleccionarConversacion(chat._id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border text-left ${
                    currentChatId === chat._id 
                      ? "bg-[#F5BD45] text-[#17243D] font-bold border-transparent shadow-md" 
                      : "hover:bg-gray-800/50 text-gray-300 border-transparent"
                  }`}
                >
                  <p className="text-xs truncate max-w-[82%] uppercase tracking-tight">
                    {chat.titulo || "Consulta sin título"}
                  </p>
                  <button 
                    onClick={(e) => eliminarConversacion(e, chat._id)}
                    className={`transition-colors p-1 rounded-lg hover:bg-black/10 ${
                      currentChatId === chat._id ? "text-[#17243D] hover:text-red-700" : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <MdDelete size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Sala de Chat */}
        <div className="flex-grow flex flex-col bg-gray-50 h-full relative">
          
          {/* Header del chat */}
          <div className="bg-[#17243D] p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                className="sm:hidden bg-gray-800 text-white p-2 rounded-xl transition-colors hover:bg-gray-700"
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

          {/* Área del chat scrollable */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </div>

          {/* Caja del input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
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