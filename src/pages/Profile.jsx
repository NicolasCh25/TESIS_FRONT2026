import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { CardProfile } from "../components/profile/CardProfile";
import { MdBadge, MdEmail, MdCalendarMonth, MdVerifiedUser, MdSave } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
    const fetchDataBackend = useFetch();
    const { token, rol } = storeAuth(); 
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // ✅ Estado para edición
    const [nombreEditado, setNombreEditado] = useState("");
    const [editando, setEditando] = useState(false);

    const obtenerPerfil = async () => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
        
        // ✅ URL DINÁMICA: Si es admin usa una ruta, si es estudiante (usuario) usa la otra
        const endpoint = rol === "admin" 
            ? "api/administradores/perfil" 
            : "api/usuarios/perfil";
            
        const url = `${baseUrl}/${endpoint}`;

        try {
            const response = await fetchDataBackend(url, null, "GET", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                setPerfil(response);
                setNombreEditado(response.nombre);
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        } finally {
            setCargando(false);
        }
    };

    // ✅ FUNCIÓN PARA ACTUALIZAR EL PERFIL (Solo nombre según tu petición)
    const handleActualizar = async () => {
        if (!nombreEditado.trim()) return toast.warn("El nombre no puede estar vacío");

        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
        const url = `${baseUrl}api/usuarios/perfil`; 

        try {
            const response = await fetchDataBackend(url, { nombre: nombreEditado }, "PUT", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                toast.success(response.msg || "Perfil actualizado correctamente");
                setPerfil({ ...perfil, nombre: nombreEditado });
                setEditando(false);
                // Opcional: podrías recargar la página o actualizar el storeAuth si el nombre sale en el sidebar
            }
        } catch (error) {
            toast.error("Error al actualizar el perfil");
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, [token, rol]);

    if (cargando) return <div className="p-10 text-center font-bold text-[#17243D] animate-pulse">Cargando información...</div>;

    return (
        <div className="p-6 lg:p-10 animate-fadeIn">
            <ToastContainer />
            <div className="mb-8 border-b-2 border-[#F5BD45] pb-4 inline-block">
                <h1 className="text-3xl font-black text-[#17243D]">
                    MI <span className="text-[#F5BD45]">PERFIL</span>
                </h1>
                <p className="text-gray-500 font-medium italic">Información de cuenta {rol}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <CardProfile user={perfil} />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-[#17243D] flex items-center gap-2 uppercase tracking-tighter">
                                Detalles de la Cuenta
                            </h2>
                            {/* Botón para activar edición */}
                            <button 
                                onClick={() => setEditando(!editando)}
                                className="text-xs font-bold text-[#17243D] hover:text-[#F5BD45] uppercase transition-colors"
                            >
                                {editando ? "Cancelar" : "Editar Nombre"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Campo de Nombre con opción de edición */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="text-2xl text-[#F5BD45] bg-[#17243D] p-3 rounded-xl shadow-md">
                                    <MdBadge />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Nombre</p>
                                    {editando ? (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                value={nombreEditado}
                                                onChange={(e) => setNombreEditado(e.target.value)}
                                                className="border-b-2 border-[#F5BD45] bg-transparent outline-none font-bold text-[#17243D] w-full"
                                            />
                                            <button onClick={handleActualizar} className="text-[#17243D] hover:text-green-600">
                                                <MdSave size={24} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-[#17243D] font-bold">{perfil?.nombre} {perfil?.apellido}</p>
                                    )}
                                </div>
                            </div>

                            <InfoField 
                                icon={<MdEmail />} 
                                label="Correo Electrónico" 
                                value={perfil?.email} 
                            />
                            <InfoField 
                                icon={<MdVerifiedUser />} 
                                label="Estado de Cuenta" 
                                value={perfil?.confirmEmail ? "Verificada" : "Pendiente"} 
                                isBadge
                            />
                            <InfoField 
                                icon={<MdCalendarMonth />} 
                                label="Miembro desde" 
                                value={perfil?.createdAt ? new Date(perfil.createdAt).toLocaleDateString() : "N/A"} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ icon, label, value, isBadge }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="text-2xl text-[#F5BD45] bg-[#17243D] p-3 rounded-xl shadow-md">
            {icon}
        </div>
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            {isBadge ? (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {value}
                </span>
            ) : (
                <p className="text-[#17243D] font-bold">{value || "No disponible"}</p>
            )}
        </div>
    </div>
);

export default Profile;