export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-20 py-8 text-center text-gray-600">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Información Institucional Original */}
        <p className="font-semibold text-blue-950">Escuela de Formación de Tecnólogos - ESFOT</p>
        <p className="text-sm mt-1">Escuela Politécnica Nacional | Quito - Ecuador</p>
        
        {/* Enlaces Legales Funcionales a PDFs */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs mt-5 mb-3 text-gray-500 font-medium">
          <a 
            href="/politica-privacidad.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-yellow-500 transition-colors duration-300"
          >
            Política de privacidad
          </a>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a 
            href="/terminos-condiciones.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-yellow-500 transition-colors duration-300"
          >
            Términos y condiciones
          </a>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a 
            href="/aviso-legal.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-yellow-500 transition-colors duration-300"
          >
            Aviso legal
          </a>
        </div>

        {/* Copyright Original */}
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Portal PIC. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  );
}