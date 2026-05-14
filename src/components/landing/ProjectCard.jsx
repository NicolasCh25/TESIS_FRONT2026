import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  // Codificamos la carrera para que sea válida en una URL
  const carreraUrl = encodeURIComponent(project.title);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group transition-transform hover:-translate-y-2 flex flex-col h-full">
      
      {/* SECCIÓN SUPERIOR: IMAGEN Y TÍTULO */}
      <div className="relative h-64 sm:h-72 overflow-hidden flex-shrink-0">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* pointer-events-none evita que esta capa bloquee clics si algo se solapa */}
        <div className="absolute inset-0 bg-blue-950/70 pointer-events-none"></div>
        
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between text-white z-10 pointer-events-none">
          <div className="flex items-center justify-between">
            <img 
              src="/logoPIC.png" 
              alt="Logo EPN" 
              className="h-8 sm:h-10 w-auto opacity-90" 
            />
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-gray-200 uppercase p-1">
              ESFOT
            </span>
          </div>
          
          <div className="text-center bg-blue-900/60 p-3 sm:p-4 rounded-xl border border-white/10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight tracking-wide uppercase">
              {project.title}
            </h3>
          </div>
        </div>
      </div>
      
      {/* SECCIÓN INFERIOR: BOTÓN DE ACCIÓN */}
      <div className="p-4 sm:p-6 bg-white space-y-4 flex-grow flex flex-col justify-end relative z-20">
        <Link 
          to={`/proyectos/carrera/${carreraUrl}`}
          className="w-full rounded-full bg-yellow-400 py-2 sm:py-3 text-xs sm:text-sm font-black text-blue-950 shadow-md hover:bg-yellow-500 hover:shadow-lg transition-all text-center block uppercase tracking-wider active:scale-95"
        >
          Más Información
        </Link>
      </div>
    </div>
  );
}