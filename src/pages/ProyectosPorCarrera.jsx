import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { MdArrowBack, MdSearchOff } from "react-icons/md";

const ProyectosPorCarrera = () => {
  const { carreraNombre } = useParams();
  const fetchDataBackend = useFetch();
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProyectos = async () => {
      // ✅ Usamos el endpoint de búsqueda por carrera
      // Nota: El backend espera "Saniamiento" según tu Postman
      const url = `${import.meta.env.VITE_BACKEND_URL}api/proyectos?carrera=${carreraNombre}`;
      
      try {
        const response = await fetchDataBackend(url, null, "GET");
        if (response?.resultados) {
          setProyectos(response.resultados);
        }
      } catch (error) {
        console.error("Error al filtrar proyectos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerProyectos();
  }, [carreraNombre]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-950 font-bold hover:text-yellow-500 transition mb-8 uppercase text-sm">
          <MdArrowBack size={20} /> Volver al Inicio
        </Link>

        <header className="mb-12 border-b-4 border-yellow-400 pb-4">
          <h1 className="text-3xl md:text-4xl font-black text-blue-950 uppercase">
            Proyectos: <span className="text-yellow-500">{decodeURIComponent(carreraNombre)}</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Visualizando todos los Proyectos de Integración Curricular (PIC)</p>
        </header>

        {cargando ? (
          <div className="text-center py-20 animate-pulse font-bold text-blue-950">Cargando proyectos de la carrera...</div>
        ) : proyectos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proyectos.map((p) => (
              <div key={p._id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-shadow">
                <div>
                  <h2 className="text-xl font-black text-blue-950 mb-3 leading-tight uppercase">{p.titulo}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{p.descripcion}</p>
                  <div className="flex flex-col gap-1 mb-4 text-xs font-bold text-gray-400 uppercase">
                    <span>Autor: {p.autor}</span>
                    <span>Tutor: {p.tutor}</span>
                  </div>
                </div>
                {/* ✅ Link a un detalle público (si tienes esa ruta) */}
                <Link 
                  to={`/proyectos/detalle-publico/${p._id}`}
                  className="bg-blue-950 text-white text-center py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-blue-950 transition-all uppercase text-xs"
                >
                  Ver Documentación Completa
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MdSearchOff size={80} className="mb-4 opacity-20" />
            <p className="text-xl font-bold uppercase">No se encontraron proyectos para esta carrera</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProyectosPorCarrera;