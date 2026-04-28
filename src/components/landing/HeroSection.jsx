export default function HeroSection() {
  return (
    <section className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        
        <div className="flex justify-center md:justify-end">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Escudo_ESFOT.svg" 
            alt="Logo ESFOT" 
            className="max-w-[200px] sm:max-w-xs md:max-w-md w-full h-auto p-4" 
          />
        </div>

        <div className="bg-gray-100 p-6 sm:p-10 rounded-2xl shadow-inner space-y-4 sm:space-y-6 text-gray-800 border border-gray-200">
          <p className="text-base sm:text-lg leading-relaxed">
            Bienvenido al centro de recursos académicos de la Escuela de Formación de Tecnólogos (ESFOT). Esta plataforma ha sido diseñada para centralizar, gestionar y difundir los Proyectos de Integración Curricular (PIC), facilitando a estudiantes y docentes el acceso a trabajos de titulación de alta calidad.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Optimiza tu proceso de investigación utilizando nuestro buscador avanzado, consulta las tendencias académicas de tu carrera y recibe asistencia inteligente a través de nuestro chatbot experto. El Portal PIC es tu puerta de entrada a la innovación y el desarrollo tecnológico institucional.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-8 md:mt-12 pt-6">
        <button className="rounded-full bg-yellow-400 px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold text-blue-950 shadow-2xl hover:bg-yellow-500 transition-all hover:scale-105">
          Explorar Proyectos
        </button>
      </div>
    </section>
  );
}