import { useState, useEffect } from "react";

export default function HeroSection() {
  
  // --- LÓGICA DEL CARRUSEL ---
  const images = [
    "/esfot.jpg",
    "/logoEsfot.png", 
    "/favicon.png", 
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, [images.length]);
  // ------------------------------

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Fila Principal: Imagen (Izquierda) y Tarjeta de Texto (Derecha) */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">

          {/* LADO IZQUIERDO: Carrusel de Imágenes */}
          <div className="w-full md:w-1/2 flex justify-center">
            {/* Contenedor del carrusel con formato rectangular estricto */}
            <div className="relative w-full max-w-[500px] aspect-[16/10] overflow-hidden shadow-md">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Diapositiva ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-contain bg-white p-4 transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* LADO DERECHO: Tarjeta de Texto con fondo gris claro */}
          <div className="w-full md:w-1/2">
            <div className="bg-[#F8F9FA] border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 text-justify">
                Bienvenido al centro de recursos académicos de la Escuela de Formación de Tecnólogos (ESFOT). Esta plataforma ha sido diseñada con el propósito fundamental de centralizar, gestionar y difundir de manera eficiente los Proyectos de Integración Curricular (PIC), constituyéndose como el repositorio oficial de la memoria técnica y científica de nuestra institución.
              </p>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                El Portal PIC busca fortalecer la excelencia académica al facilitar a estudiantes y docentes el acceso a trabajos de titulación de alta calidad, promoviendo la transparencia y la consulta de antecedentes investigativos. Esta iniciativa impulsa la innovación y el desarrollo tecnológico, asegurando que el conocimiento generado en las aulas trascienda y sirva como base sólida para futuras investigaciones dentro del ámbito institucional.
              </p>
            </div>
          </div>

        </div>

        {/* BOTÓN CENTRADO INFERIOR */}
        <div className="flex justify-center mt-8 md:mt-12 pt-6">
        <button className="rounded-full bg-yellow-400 px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold text-blue-950 shadow-2xl hover:bg-yellow-500 transition-all hover:scale-105">
          Explorar Proyectos
        </button>
      </div>

      </div>
    </section>
  );
}