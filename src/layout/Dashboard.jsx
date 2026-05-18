import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  MdMenu, MdClose, MdDashboard, MdFolder, MdAddCircle, 
  MdGroup, MdBarChart, MdPerson, MdLogout, MdSearch, MdStar 
} from "react-icons/md";
import { storeAuth } from "../context/storeAuth"; 
import ChatbotFloating from "../components/chatbot/ChatbotFloating";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Extraemos los datos del store global
  const { clearToken, rol, nombre, apellido } = storeAuth();
  
  // ✅ NORMALIZACIÓN DE ROL: Aceptamos 'admin' y 'administrador'
  const rolLimpio = rol?.toLowerCase().trim();
  const esAdmin = rolLimpio === 'admin' || rolLimpio === 'administrador';

  // 2. Construcción del nombre completo y texto del rol
  const nombreCompleto = (nombre || apellido) 
    ? `${nombre || ""} ${apellido || ""}`.trim() 
    : "Usuario ESFOT";

  // Texto visual para el encabezado
  const rolVisual = esAdmin ? "Administrador" : "Estudiante"; 
  
  // 3. Generador de iniciales
  const obtenerInicialesDashboard = () => {
    const n = nombre ? nombre.trim().split(" ")[0] : "";
    const a = apellido ? apellido.trim().split(" ")[0] : "";
    if (n && a) return `${n[0]}${a[0]}`.toUpperCase();
    if (n || a) return (n || a).substring(0, 2).toUpperCase();
    return "U";
  };

  const handleLogout = () => {
    clearToken(); 
    navigate('/login', { replace: true }); 
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
    ${location.pathname === path || (path !== '/dashboard' && location.pathname.includes(path)) 
      ? 'bg-[#1F3059] text-[#F5BD45] font-bold border-l-4 border-[#F5BD45] shadow-lg' 
      : 'text-gray-300 hover:bg-[#1F3059] hover:text-white'}
  `;

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      
      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* SIDEBAR DINÁMICO */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#17243D] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <img src="/logoPIC.png" alt="Logo" className="h-10 w-auto bg-white/10 p-1 rounded-md" />
            <span className="font-black text-xl tracking-tighter text-[#F5BD45]">PORTAL PIC</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-300 hover:text-white">
            <MdClose size={28} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 opacity-50">
            Menú {rolVisual}
          </p>

          {/* 🛠️ RUTAS PARA ADMINISTRADOR (Ahora validado con esAdmin) */}
          {esAdmin ? (
            <>
              
              <Link to="/dashboard/list" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/list')}>
                <MdFolder size={22} /> Proyectos
              </Link>
              <Link to="/dashboard/create" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/create')}>
                <MdAddCircle size={22} /> Crear Nuevo
              </Link>
              <Link to="/dashboard/users" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/users')}>
                <MdGroup size={22} /> Usuarios
              </Link>
              <Link to="/dashboard/stats" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/stats')}>
                <MdBarChart size={22} /> Estadísticas
              </Link>
            </>
          ) : (
            /* 🎓 RUTAS PARA ESTUDIANTE */
            <>
              <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard')}>
                <MdSearch size={22} /> Explorar Proyectos
              </Link>
            </>
          )}

          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-widest pt-6 mb-4 opacity-50">Cuenta</p>
          <Link to="/dashboard/profile" onClick={() => setIsSidebarOpen(false)} className={linkClass('/dashboard/profile')}>
            <MdPerson size={22} /> Mi Perfil
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 font-bold uppercase text-xs">
            <MdLogout size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-4 lg:px-10 z-10 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <MdMenu size={28} />
            </button>
            <h1 className="text-xl md:text-2xl font-black text-[#17243D] tracking-tight uppercase">
              {esAdmin ? 'Gestión' : 'Consulta'} <span className="text-[#F5BD45] hidden sm:inline">| ESFOT</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-800 leading-none mb-1">{nombreCompleto}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{rolVisual}</p>
            </div>
            
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#17243D] border-2 border-[#F5BD45] flex items-center justify-center text-white font-black shadow-md uppercase transition-transform hover:scale-105 cursor-pointer text-sm md:text-base">
              {obtenerInicialesDashboard()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
        </div>

        <ChatbotFloating />
      </main>
    </div>
  );
}