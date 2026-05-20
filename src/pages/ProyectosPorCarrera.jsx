import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { MdArrowBack, MdSearchOff, MdSearch } from "react-icons/md";
import ProyectoRow from "../components/public/ProyectoRow";
import DetalleModal from "../components/public/DetalleModal";

const ProyectosPorCarrera = () => {
    const { carreraNombre } = useParams();
    const fetchDataBackend = useFetch();
    
    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    // ✅ Estados para filtrar dentro de la carrera seleccionada
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("titulo"); 

    const obtenerProyectos = async () => {
        setCargando(true);
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
        const valor = busqueda.trim();

        // Mapeo para el backend (periodo -> periodoAcademico)
        const nombreFiltroBackend = filtro === "periodo" ? "periodoAcademico" : filtro;

        // ✅ La carrera se mantiene fija según la URL, solo añadimos el filtro de búsqueda
        let query = `?carrera=${encodeURIComponent(carreraNombre)}`;
        
        if (valor) {
            query += `&${nombreFiltroBackend}=${encodeURIComponent(valor)}`;
        }

        const url = `${baseUrl}api/proyectos${query}`;

        try {
            const response = await fetchDataBackend(url, null, "GET");
            if (response?.resultados) {
                setProyectos(response.resultados);
            } else {
                setProyectos([]);
            }
        } catch (error) {
            console.error("Error al filtrar:", error);
            setProyectos([]);
        } finally {
            setCargando(false);
        }
    };

    // Limpia el input cuando el usuario cambia el tipo de filtro (Autor, Tutor, etc.)
    useEffect(() => {
        setBusqueda("");
    }, [filtro]);

    // Se dispara cuando cambia la carrera en la URL o cuando el usuario escribe en la búsqueda
    useEffect(() => {
        obtenerProyectos();
    }, [carreraNombre, busqueda, filtro]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-[#17243D] font-black hover:text-[#F5BD45] transition uppercase text-sm">
                        <MdArrowBack size={20} /> Volver al Inicio
                    </Link>

                    {/* ✅ BARRA DE BÚSQUEDA DINÁMICA */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                            <MdSearch className="text-gray-400" size={18} />
                            <select 
                                value={filtro} 
                                onChange={(e) => setFiltro(e.target.value)} 
                                className="bg-transparent font-bold text-[10px] sm:text-xs text-[#17243D] uppercase outline-none cursor-pointer"
                            >
                                <option value="titulo">Título</option>
                                <option value="autor">Autor</option>
                                <option value="tutor">Tutor</option>
                                <option value="periodo">Periodo</option>
                            </select>
                        </div>

                        <input 
                            type="text" 
                            placeholder={`Buscar en esta carrera por ${filtro}...`} 
                            className="px-4 py-1.5 w-full md:w-64 text-sm outline-none bg-transparent" 
                            value={busqueda} 
                            onChange={(e) => setBusqueda(e.target.value)} 
                        />
                    </div>
                </div>

                <header className="mb-10 border-b-4 border-[#F5BD45] pb-4">
                    <h1 className="text-3xl md:text-4xl font-black text-[#17243D] uppercase leading-tight">
                        Proyectos de <span className="text-[#F5BD45]">{decodeURIComponent(carreraNombre)}</span>
                    </h1>
                </header>

                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17243D]"></div>
                        <p className="mt-4 font-black text-[#17243D] uppercase text-[10px] tracking-widest">Filtrando Carrera...</p>
                    </div>
                ) : proyectos.length > 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#17243D] text-white">
                                        <th className="px-6 py-4 font-bold uppercase text-[10px]">N°</th>
                                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-left">Título</th>
                                        <th className="px-6 py-4 font-bold uppercase text-[10px]">Autor(es)</th>
                                        <th className="px-6 py-4 font-bold uppercase text-[10px]">Tutor</th>
                                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-center">Periodo</th>
                                        <th className="px-6 py-4 font-bold uppercase text-[10px] text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proyectos.map((p, index) => (
                                        <ProyectoRow 
                                            key={p._id} 
                                            index={index}
                                            proyecto={p} 
                                            onVerDetalles={setProyectoSeleccionado} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-dashed border-gray-200">
                        <MdSearchOff size={60} className="text-gray-200 mb-4" />
                        <h2 className="text-xl font-black text-gray-400 uppercase">Sin resultados</h2>
                        <p className="text-gray-400 mt-1 text-sm font-medium">No hay coincidencias para "{busqueda}" en esta carrera.</p>
                        {busqueda && (
                            <button 
                                onClick={() => setBusqueda("")}
                                className="mt-6 px-6 py-2 bg-[#17243D] text-white text-[10px] font-black rounded-xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all uppercase"
                            >
                                Ver todos los proyectos
                            </button>
                        )}
                    </div>
                )}
            </main>

            <Footer />

            {proyectoSeleccionado && (
              <DetalleModal 
                proyecto={proyectoSeleccionado} 
                onClose={() => setProyectoSeleccionado(null)} 
              />
            )}
        </div>
    );
};

export default ProyectosPorCarrera;