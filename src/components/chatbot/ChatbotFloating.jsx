import { useState, useEffect, useRef } from "react";
import { MdChat, MdClose, MdSend, MdSmartToy } from "react-icons/md";
import { useFetch } from "../../hooks/useFetch";
import { storeAuth } from "../../context/storeAuth";
import ChatMessage from "./ChatMessage";

const ChatbotFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! Soy el asistente del Portal PIC. ¿En qué puedo ayudarte hoy?" }
  ]);

  const fetchDataBackend = useFetch();
  const { token } = storeAuth();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}api/chatbot`;
      const response = await fetchDataBackend(url, { mensaje: userMsg }, "POST", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: response.respuesta,
          proyectos: response.proyectos 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Lo siento, tuve un problema al conectar con el servidor. Inténtalo de nuevo." 
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#17243D] text-white p-4 rounded-full shadow-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all duration-300 active:scale-90"
      >
        {isOpen ? <MdClose size={28} /> : <MdChat size={28} />}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[420px] h-[550px] bg-gray-50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="bg-[#17243D] p-5 flex items-center gap-3">
            <div className="bg-[#F5BD45] p-2.5 rounded-2xl">
              <MdSmartToy className="text-[#17243D]" size={22} />
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-tight">Asistente Virtual PIC</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[9px] text-green-400 font-black uppercase">Soporte ESFOT Activo</p>
              </div>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div 
            ref={scrollRef} 
            className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2"
          >
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregunta sobre proyectos o carreras..."
              className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#17243D]/10 focus:border-[#17243D] transition-all"
            />
            <button 
              type="submit"
              className="bg-[#17243D] text-white p-3 rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg active:scale-95"
            >
              <MdSend size={22} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotFloating;