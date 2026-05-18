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

  const { clearToken, rol, nombre, apellido } = storeAuth();
  const rolLimpio = rol?.toLowerCase().trim();
  const esAdmin = rolLimpio === 'admin' || rolLimpio === 'administrador';

  const nombreCompleto = `${nombre || ""} ${apellido || ""}`.trim() || "Usuario ESFOT";
  const rolVisual = esAdmin ? "Administrador" : "Estudiante"; 

  const handleLogout = () => {
    clearToken(); 
    navigate('/login', { replace: true }); 
  };

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
    ${location.pathname === path ? 'bg-[#1F3059] text-[#F5BD45] font-bold border-l-4 border-[#F5BD45] shadow-lg' : 'text-gray-300 hover:bg-[#1F3059] hover:text-white'}
  `;

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#17243D] text-white flex flex-col shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-700/50">
          <span className="font-black text-xl text-[#F5BD45]">PORTAL PIC</span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-300"><MdClose size={28}/></button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {esAdmin ? (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}><MdDashboard size={22}/> Inicio</Link>
              <Link to="/dashboard/list" className={linkClass('/dashboard/list')}><MdFolder size={22}/> Proyectos</Link>
              <Link to="/dashboard/create" className={linkClass('/dashboard/create')}><MdAddCircle size={22}/> Crear Nuevo</Link>
              <Link to="/dashboard/users" className={linkClass('/dashboard/users')}><MdGroup size={22}/> Usuarios</Link>
              <Link to="/dashboard/stats" className={linkClass('/dashboard/stats')}><MdBarChart size={22}/> Estadísticas</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}><MdSearch size={22}/> Explorar</Link>
              {/* ✅ LINK A FAVORITOS */}
              <Link to="/dashboard/favoritos" className={linkClass('/dashboard/favoritos')}><MdStar size={22}/> Favoritos</Link>
            </>
          )}
          <Link to="/dashboard/profile" className={linkClass('/dashboard/profile')}><MdPerson size={22}/> Mi Perfil</Link>
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl font-bold uppercase text-xs transition-all">
            <MdLogout size={20}/> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600"><MdMenu size={28}/></button>
          <h1 className="text-xl font-black text-[#17243D] uppercase tracking-tight">
            {esAdmin ? 'Gestión' : 'Consulta'} <span className="text-[#F5BD45]">| ESFOT</span>
          </h1>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-black text-gray-800 leading-none mb-1">{nombreCompleto}</p>
               <p className="text-[10px] text-gray-500 font-bold uppercase">{rolVisual}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-[#17243D] border-2 border-[#F5BD45] flex items-center justify-center text-white font-black">
               {nombre?.[0]}{apellido?.[0]}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <Outlet />
        </div>
        <ChatbotFloating />
      </main>
    </div>
  );
}