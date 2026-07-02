// Ubicación: src/pages/InicioAdmin.jsx
import { Link } from 'react-router-dom';

export default function InicioAdmin() {
  
  const acciones = [
    {
      id: 1,
      titulo: "Gestionar Proyectos (PIC)",
      descripcion: "Revisa, edita o elimina los proyectos de titulación subidos al repositorio institucional.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "bg-blue-600",
      ruta: "/dashboard/list" // Coincide con path="list"
    },
    {
      id: 2,
      titulo: "Subir Nuevo Proyecto",
      descripcion: "Añade un nuevo trabajo de titulación, asigna autores y carga los documentos PDF.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      color: "bg-emerald-500",
      ruta: "/dashboard/create" // Coincide con path="create"
    },
    {
      id: 3,
      titulo: "Gestión de Usuarios",
      descripcion: "Administra los accesos de estudiantes, docentes y otros administradores del sistema.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-purple-600",
      ruta: "/dashboard/users" // Coincide con path="users"
    },
    {
      id: 4,
      titulo: "Reportes y Estadísticas",
      descripcion: "Visualiza métricas sobre las carreras con más proyectos y tendencias de búsqueda académica.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-[#F5BD45]",
      ruta: "/dashboard/stats"
    },
    {
      id: 5,
      titulo: "Auditoría (Logs)",
      descripcion: "Monitorea el historial de acciones y registros de seguridad de la plataforma en tiempo real.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "bg-slate-700",
      ruta: "/dashboard/logs"
    },
    {
      id: 6,
      titulo: "Asistente IA (Chatbot)",
      descripcion: "Resuelve dudas académicas y localiza proyectos rápidamente mediante el asistente conversacional con inteligencia artificial.",
      icono: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: "bg-indigo-600",
      ruta: "/dashboard/chatbot"
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">¡Bienvenido al sistema!</h2>
        <p className="text-gray-600 mt-2">¿Qué acción administrativa deseas realizar el día de hoy?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {acciones.map((accion) => (
          <Link 
            key={accion.id} 
            to={accion.ruta}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
          >
            <div className={`${accion.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {accion.icono}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#17243D] transition-colors">
              {accion.titulo}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed flex-grow">
              {accion.descripcion}
            </p>
            
            <div className="mt-6 flex items-center text-sm font-bold text-[#F5BD45]">
              Acceder al módulo
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}