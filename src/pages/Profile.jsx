import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { CardProfile } from "../components/profile/CardProfile";
import { MdBadge, MdEmail, MdCalendarMonth, MdVerifiedUser } from "react-icons/md";

const Profile = () => {
    const fetchDataBackend = useFetch();
    const { token } = storeAuth();
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);

    const obtenerPerfil = async () => {
        // ✅ CORRECCIÓN DE URL: Aseguramos la ruta exacta del Postman
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
        const url = `${baseUrl}api/administradores/perfil`;

        try {
            const response = await fetchDataBackend(url, null, "GET", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                setPerfil(response);
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, [token]);

    if (cargando) return <div className="p-10 text-center font-bold text-[#17243D] animate-pulse">Cargando información...</div>;

    return (
        <div className="p-6 lg:p-10 animate-fadeIn">
            <div className="mb-8 border-b-2 border-[#F5BD45] pb-4 inline-block">
                <h1 className="text-3xl font-black text-[#17243D]">
                    MI <span className="text-[#F5BD45]">PERFIL</span>
                </h1>
                <p className="text-gray-500 font-medium italic">Información de cuenta institucional</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: La tarjeta visual */}
                <div className="lg:col-span-1">
                    <CardProfile user={perfil} />
                </div>

                {/* Columna Derecha: Detalles informativos (Sin formularios) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-xl font-black text-[#17243D] mb-8 flex items-center gap-2 uppercase tracking-tighter">
                            Detalles de la Cuenta
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoField 
                                icon={<MdBadge />} 
                                label="Nombre Completo" 
                                value={`${perfil?.nombre} ${perfil?.apellido}`} 
                            />
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
                                value={new Date(perfil?.createdAt).toLocaleDateString()} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para mostrar datos estáticos
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