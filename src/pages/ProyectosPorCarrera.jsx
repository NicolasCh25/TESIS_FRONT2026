import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { MdArrowBack, MdSearchOff, MdInfoOutline } from "react-icons/md";

const ProyectosPorCarrera = () => {
    const { carreraNombre } = useParams();
    const fetchDataBackend = useFetch();
    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerProyectos = async () => {
            // Se consume el endpoint usando el parámetro de carrera de la URL
            const url = `${import.meta.env.VITE_BACKEND_URL}api/proyectos?carrera=${carreraNombre}`;
            try {
                const response = await fetchDataBackend(url, null, "GET");
                if (response?.resultados) {
                    setProyectos(response.resultados);
                }
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
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
                <Link to="/" className="inline-flex items-center gap-2 text-[#17243D] font-black hover:text-[#F5BD45] transition mb-8 uppercase text-sm">
                    <MdArrowBack size={20} /> Volver al Inicio
                </Link>

                <header className="mb-10 border-b-4 border-[#F5BD45] pb-4">
                    <h1 className="text-3xl md:text-4xl font-black text-[#17243D] uppercase">
                        Proyectos de <span className="text-[#F5BD45]">{decodeURIComponent(carreraNombre)}</span>
                    </h1>
                </header>

                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#17243D]"></div>
                        <p className="mt-4 font-bold text-[#17243D] uppercase">Cargando información...</p>
                    </div>
                ) : proyectos.length > 0 ? (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#17243D] text-white uppercase text-xs tracking-widest">
                                        <th className="p-5 font-black">Título del Proyecto</th>
                                        <th className="p-5 font-black">Autor(es)</th>
                                        <th className="p-5 font-black">Tutor</th>
                                        <th className="p-5 font-black">Periodo</th>
                                        <th className="p-5 font-black">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {proyectos.map((p) => (
                                        <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-5 text-[#17243D] font-bold text-sm uppercase leading-tight">
                                                {p.titulo}
                                            </td>
                                            <td className="p-5 text-gray-600 text-sm italic">{p.autor}</td>
                                            <td className="p-5 text-gray-600 text-sm">{p.tutor}</td>
                                            <td className="p-5">
                                                <span className="bg-gray-100 text-[#17243D] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                    {p.periodoAcademico}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                {/* Botón informativo sin privilegios de edición */}
                                                <button 
                                                    className="flex items-center gap-2 bg-[#F5BD45] text-[#17243D] px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-yellow-500 transition-all active:scale-95 shadow-sm"
                                                    onClick={() => window.alert(`Descripción: ${p.descripcion}`)}
                                                >
                                                    <MdInfoOutline size={16} /> Detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-center shadow-inner">
                        <MdSearchOff size={80} className="text-gray-200 mb-4" />
                        <h2 className="text-2xl font-black text-gray-400 uppercase">No hay proyectos registrados</h2>
                        <p className="text-gray-400 mt-2">Esta carrera aún no cuenta con Proyectos de Integración Curricular (PIC).</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProyectosPorCarrera;