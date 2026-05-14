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
            
            <main className="flex-grow container mx-auto px-4 py-12">
                
                <Link to="/" className="inline-flex items-center gap-2 text-[#17243D] font-black hover:text-[#F5BD45] transition mb-8 uppercase text-sm">
                    <MdArrowBack size={20} /> Volver al Inicio
                </Link>

                <header className="mb-10 border-b-4 border-[#F5BD45] pb-4">
                    <h1 className="text-3xl md:text-4xl font-black text-[#17243D] uppercase">
                        Proyectos de <span className="text-[#F5BD45]">{decodeURIComponent(carreraNombre)}</span>
                    </h1>
                </header>

                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17243D]"></div>
                        <p className="mt-4 font-black text-[#17243D] uppercase text-xs tracking-widest">Consultando Repositorio...</p>
                    </div>
                ) : proyectos.length > 0 ? (
                    /* ✅ ESTRUCTURA IDÉNTICA A TU DASHBOARD */
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#17243D] text-white">
                                        <th className="px-6 py-4 font-bold uppercase text-xs">N°</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs text-left">Título del Proyecto</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs">Autor(es)</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs">Tutor</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs text-center">Periodo</th>
                                        <th className="px-6 py-4 font-bold uppercase text-xs text-center">Acciones</th>
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
                    <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <MdSearchOff size={80} className="text-gray-200 mb-4" />
                        <h2 className="text-2xl font-black text-gray-400 uppercase">Sin registros</h2>
                        <p className="text-gray-400 mt-2">No se encontraron proyectos para esta carrera.</p>
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