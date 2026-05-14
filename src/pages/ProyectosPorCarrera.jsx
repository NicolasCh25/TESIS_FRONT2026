import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { MdArrowBack, MdSearchOff } from "react-icons/md";
import ProyectoRow from "../components/public/ProyectoRow";
import DetalleModal from "../components/public/DetalleModal";

const ProyectosPorCarrera = () => {
    const { carreraNombre } = useParams();
    const fetchDataBackend = useFetch();
    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

    useEffect(() => {
        const obtenerProyectos = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}api/proyectos?carrera=${carreraNombre}`;
            try {
                const response = await fetchDataBackend(url, null, "GET");
                if (response?.resultados) setProyectos(response.resultados);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerProyectos();
    }, [carreraNombre]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                
                <Link to="/" className="inline-flex items-center gap-2 text-[#17243D] font-black hover:text-[#F5BD45] transition-all mb-8 uppercase text-xs md:text-sm tracking-tight">
                    <MdArrowBack size={20} /> Volver al Inicio
                </Link>

                <header className="mb-10 border-b-4 border-[#F5BD45] pb-4">
                    <h1 className="text-2xl md:text-4xl font-black text-[#17243D] uppercase leading-tight">
                        Proyectos de <span className="text-[#F5BD45]">{decodeURIComponent(carreraNombre)}</span>
                    </h1>
                </header>

                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17243D]"></div>
                        <p className="mt-4 font-black text-[#17243D] uppercase text-xs tracking-widest">Consultando Repositorio...</p>
                    </div>
                ) : proyectos.length > 0 ? (
                    /* Contenedor con bordes redondeados y sombra */
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                        {/* El overflow-x-auto permite el scroll horizontal SOLO en móviles si es necesario */}
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left border-collapse table-auto md:table-fixed">
                                <thead>
                                    <tr className="bg-[#17243D] text-white uppercase text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em]">
                                        {/* Definimos anchos fijos en escritorio para evitar saltos de línea feos */}
                                        <th className="p-4 md:p-6 font-black md:w-2/5">Título del Proyecto</th>
                                        <th className="p-4 md:p-6 font-black hidden lg:table-cell">Autor(es)</th>
                                        <th className="p-4 md:p-6 font-black hidden lg:table-cell">Tutor</th>
                                        <th className="p-4 md:p-6 font-black text-center">Periodo</th>
                                        <th className="p-4 md:p-6 font-black text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {proyectos.map((p) => (
                                        <ProyectoRow 
                                            key={p._id} 
                                            proyecto={p} 
                                            onVerDetalles={setProyectoSeleccionado} 
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 md:p-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <MdSearchOff size={80} className="text-gray-200 mb-4" />
                        <h2 className="text-xl md:text-2xl font-black text-gray-400 uppercase tracking-tighter">Sin registros</h2>
                        <p className="text-gray-400 text-xs md:text-sm mt-2">Esta carrera aún no cuenta con Proyectos de Integración Curricular (PIC).</p>
                    </div>
                )}
            </main>

            <Footer />

            {/* Modal de Detalle */}
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