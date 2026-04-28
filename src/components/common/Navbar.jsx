import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-950 text-white shadow-md w-full z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        
        {/* Logo EPN */}
        <div className="flex items-center gap-3">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Escudo_EPN.svg" 
            alt="Logo EPN" 
            className="h-12 md:h-14 w-auto" 
          />
        </div>

        {/* Título central (se oculta en móviles muy pequeños) */}
        <div className="hidden sm:block absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Portal - PIC</h1>
        </div>

        {/* Botón Administrador */}
        <div>
          <Link 
            to="/login" 
            className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 md:px-7 py-2 md:py-3 text-xs md:text-sm font-extrabold text-blue-950 shadow-lg hover:bg-yellow-500 transition-colors"
          >
             Administrador
          </Link>
        </div>
      </div>
    </nav>
  );
}