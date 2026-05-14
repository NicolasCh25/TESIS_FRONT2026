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

  // Auto-scroll al último mensaje
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#17243D] text-white p-4 rounded-full shadow-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all duration-300 active:scale-90"
      >
        {isOpen ? <MdClose size={28} /> : <MdChat size={28} />}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-gray-100 rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-[#17243D] p-4 flex items-center gap-3">
            <div className="bg-[#F5BD45] p-2 rounded-full">
              <MdSmartToy className="text-[#17243D]" size={20} />
            </div>
            <div>
              <h3 className="text-white font-black text-sm uppercase">Asistente PIC</h3>
              <p className="text-[10px] text-green-400 font-bold uppercase">En línea</p>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar">
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
              placeholder="Escribe tu consulta..."
              className="flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#17243D]"
            />
            <button 
              type="submit"
              className="bg-[#17243D] text-white p-2 rounded-full hover:bg-[#F5BD45] hover:text-[#17243D] transition-colors"
            >
              <MdSend size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotFloating;