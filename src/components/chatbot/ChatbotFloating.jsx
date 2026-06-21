import { useState, useEffect, useRef } from "react";
import { MdChat, MdClose, MdSend, MdSmartToy, MdOpenInNew } from "react-icons/md"; 
import { useNavigate } from "react-router-dom"; 
import { useFetch } from "../../hooks/useFetch";
import { storeAuth } from "../../context/storeAuth";
import ChatMessage from "./ChatMessage";

const ChatbotFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! Soy el asistente del Portal PIC. ¿En qué puedo ayudarte hoy?" }
  ]);

  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const scrollRef = useRef(null);
  const navigate = useNavigate(); 

  const baseUrl = import.meta.env.VITE_BACKEND_URL.endsWith('/') 
    ? import.meta.env.VITE_BACKEND_URL 
    : `${import.meta.env.VITE_BACKEND_URL}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const msgAEnviar = inputValue.trim();
    if (!msgAEnviar) return;

    setInputValue("");
    setMessages(prev => [...prev, { sender: "user", text: msgAEnviar }]);

    try {
      const url = `${baseUrl}api/chatbot`;
      const bodyData = { mensaje: msgAEnviar }; // Constante inmutable para el body
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
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Lo siento, tuve un problema al conectar con el servidor." 
      }]);
    }
  };

  const irAVistaCompleta = () => {
    setIsOpen(false); 
    navigate("/dashboard/chatbot"); 
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#17243D] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all duration-300 active:scale-90"
      >
        {isOpen ? <MdClose size={24} className="sm:w-7 sm:h-7" /> : <MdChat size={24} className="sm:w-7 sm:h-7" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] h-[65vh] sm:h-[480px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          
          <div className="bg-[#17243D] p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#F5BD45] p-2 rounded-xl">
                <MdSmartToy className="text-[#17243D]" size={18} />
              </div>
              <div>
                <h3 className="text-white font-black text-xs uppercase tracking-tight">Preguntas Rápidas</h3>
                <p className="text-[7px] text-green-400 font-black uppercase tracking-wider">Soporte PIC</p>
              </div>
            </div>
            
            <button 
              onClick={irAVistaCompleta}
              className="text-white bg-gray-800 hover:bg-[#F5BD45] hover:text-[#17243D] p-2 rounded-xl flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all"
              title="Ver todas las conversaciones"
            >
              <MdOpenInNew size={14} />
              <span className="hidden xs:inline">Historial</span>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2 bg-gray-50">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Haz una consulta rápida..."
              className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#17243D]/10 focus:border-[#17243D] transition-all"
            />
            <button 
              type="submit"
              className="bg-[#17243D] text-white p-2.5 rounded-xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg flex-shrink-0"
            >
              <MdSend size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotFloating;