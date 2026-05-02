import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Variables temporales (Mocks)
  const nombreUsuario = "Admin ESFOT"; 
  const rolUsuario = "Coordinación PIC"; 
  
  const iniciales = nombreUsuario
    .split(" ")
    .map(palabra => palabra[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    navigate('/login');
  };

  // Función para manejar la clase activa de los links de forma limpia
  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors 
    ${location.pathname === path || (path !== '/dashboard' && location.pathname.includes(path)) 
      ? 'bg-[#1F3059] text-[#F5BD45] font-bold border-l-4 border-[#F5BD45]' 
      : 'text-gray-300 hover:bg-[#1F3059] hover:text-white'}
  `;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#17243D] text-white hidden md:flex flex-col shadow-xl z-20">
        <div className="h-20 flex items-center justify-center border-b border-gray-700/50">
          <img src="/logoPIC.png" alt="Logo Portal PIC" className="h-12 w-auto object-contain bg-white/10 p-1 rounded-md" />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menú Principal</p>
          
          {/* INICIO */}
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Inicio
          </Link>
          
          {/* PROYECTOS (Gestionar) */}
          <Link to="/dashboard/list" className={linkClass('/dashboard/list')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Proyectos
          </Link>
          
          {/* CREAR NUEVO */}
          <Link to="/dashboard/create" className={linkClass('/dashboard/create')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Crear Nuevo
          </Link>

          {/* USUARIOS - ¡NUEVO! */}
          <Link to="/dashboard/users" className={linkClass('/dashboard/users')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Usuarios
          </Link>

          {/* ESTADÍSTICAS - ¡NUEVO! */}
          <Link to="/dashboard/stats" className={linkClass('/dashboard/stats')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Estadísticas
          </Link>

          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider pt-4 mb-4">Cuenta</p>

          <Link to="/dashboard/profile" className={linkClass('/dashboard/profile')}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Perfil
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-10 z-10">
          <h1 className="text-2xl font-extrabold text-[#17243D]">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{nombreUsuario}</p>
              <p className="text-xs text-gray-500 capitalize">{rolUsuario}</p>
            </div>
            <div className="h-11 w-11 rounded-full bg-[#17243D] border-2 border-[#F5BD45] flex items-center justify-center text-white font-bold shadow-md">
              {iniciales}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50">
            <Outlet />
        </div>
      </main>
    </div>
  );
}