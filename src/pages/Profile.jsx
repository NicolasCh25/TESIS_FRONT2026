import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { CardProfile } from "../components/profile/CardProfile";
import { CardPassword } from "../components/profile/CardPassword"; 
import { MdBadge, MdEmail, MdCalendarMonth, MdVerifiedUser, MdSave } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
    const fetchDataBackend = useFetch();
    const { token, rol, clearToken } = storeAuth(); 
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // ✅ ESTADOS CORREGIDOS: Estados independientes para nombre y apellido
    const [nombreEditado, setNombreEditado] = useState("");
    const [apellidoEditado, setApellidoEditado] = useState("");
    const [editando, setEditando] = useState(false);

    const obtenerPerfil = async () => {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const url = `${baseUrl}api/perfil`;

        try {
            const response = await fetchDataBackend(url, null, "GET", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                setPerfil(response);
                setNombreEditado(response.nombre || "");
                setApellidoEditado(response.apellido || ""); // ✅ Seteo inicial del apellido
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
            toast.error("Error al obtener datos del servidor");
        } finally {
            setCargando(false);
        }
    };

    const handleActualizar = async () => {
        if (!nombreEditado.trim()) return toast.warn("El nombre no puede estar vacío");
        if (!apellidoEditado.trim()) return toast.warn("El apellido no puede estar vacío");

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const url = `${baseUrl}api/perfil`; 

        // ✅ ENVÍO CORREGIDO: Mandamos tanto 'nombre' como 'apellido' en la petición PUT
        const datosActualizados = { 
            nombre: nombreEditado, 
            apellido: apellidoEditado 
        };

        try {
            const response = await fetchDataBackend(url, datosActualizados, "PUT", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                toast.success(response.msg || "Perfil actualizado correctamente");
                
                // Actualizamos el estado local para reflejar los cambios en toda la pantalla
                setPerfil(prev => prev ? { 
                    ...prev, 
                    nombre: nombreEditado, 
                    apellido: apellidoEditado 
                } : null);
                
                setEditando(false);
            }
        } catch (error) {
            toast.error("Error al actualizar el perfil");
        }
    };

    const handleDesactivarCuentaPropia = async () => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas desactivar tu cuenta? Se cerrará tu sesión de forma inmediata."
        );
        if (!confirmar) return;

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const url = `${baseUrl}api/usuarios/desactivar`;

        try {
            const response = await fetchDataBackend(url, null, "PUT", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                alert("Cuenta desactivada correctamente. Si deseas volver a activar tu cuenta en el futuro, por favor contacta con un administrador.");
                clearToken();
            }
        } catch (error) {
            console.error("Error al desactivar cuenta propia:", error);
            toast.error("Error al intentar desactivar tu cuenta");
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, [token, rol]);

    if (cargando) return <div className="p-10 text-center font-bold text-[#17243D] animate-pulse">Cargando información...</div>;

    return (
        <div className="p-6 lg:p-10 animate-fadeIn" key={perfil?._id || 'profile'}>
            <ToastContainer />
            <div className="mb-8 border-b-2 border-[#F5BD45] pb-4 inline-block">
                <h1 className="text-3xl font-black text-[#17243D]">
                    MI <span className="text-[#F5BD45]">PERFIL</span>
                </h1>
                <p className="text-gray-500 font-medium italic uppercase text-xs">Información de cuenta {rol}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <CardProfile user={perfil} />
                    
                    {rol === "usuario" && (
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center animate-fadeIn">
                            <h3 className="text-xs font-black text-red-500 mb-2 uppercase tracking-wider">Zona de Peligro</h3>
                            <p className="text-[11px] text-gray-500 text-center mb-4 leading-relaxed font-medium">
                                ¿Deseas desactivar temporalmente tu cuenta? Perderás el acceso de inmediato y deberás contactar a un administrador para poder reactivarla.
                            </p>
                            <button
                                onClick={handleDesactivarCuentaPropia}
                                className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 px-6 rounded-2xl hover:bg-red-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer uppercase text-[10px] tracking-widest"
                            >
                                Desactivar mi cuenta
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-[#17243D] flex items-center gap-2 uppercase tracking-tighter">
                                Detalles de la Cuenta
                            </h2>
                            <button 
                                onClick={() => {
                                    if (editando) {
                                        // Si cancela, restauramos los valores originales del perfil
                                        setNombreEditado(perfil?.nombre || "");
                                        setApellidoEditado(perfil?.apellido || "");
                                    }
                                    setEditando(!editando);
                                }}
                                className="text-xs font-bold text-[#17243D] hover:text-[#F5BD45] uppercase transition-colors"
                            >
                                {editando ? "Cancelar" : "Editar Datos"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 md:col-span-2">
                                <div className="text-2xl text-[#F5BD45] bg-[#17243D] p-3 rounded-xl shadow-md">
                                    <MdBadge />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Nombre Completo</p>
                                    
                                    {editando ? (
                                        // ✅ FORMULARIO DE EDICIÓN: Inputs paralelos para Nombre y Apellido
                                        <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
                                            <div className="w-full">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Nombre</label>
                                                <input 
                                                    type="text"
                                                    value={nombreEditado}
                                                    onChange={(e) => setNombreEditado(e.target.value)}
                                                    className="border-b-2 border-[#F5BD45] bg-transparent outline-none font-bold text-[#17243D] w-full text-sm"
                                                />
                                            </div>
                                            <div className="w-full">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Apellido</label>
                                                <input 
                                                    type="text"
                                                    value={apellidoEditado}
                                                    onChange={(e) => setApellidoEditado(e.target.value)}
                                                    className="border-b-2 border-[#F5BD45] bg-transparent outline-none font-bold text-[#17243D] w-full text-sm"
                                                />
                                            </div>
                                            <button onClick={handleActualizar} className="text-[#17243D] hover:text-green-600 p-1 mb-0.5">
                                                <MdSave size={24} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-[#17243D] font-bold text-sm sm:text-base">
                                            {perfil?.nombre || "N/A"} {perfil?.apellido || ""}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <InfoField icon={<MdEmail />} label="Correo Electrónico" value={perfil?.email} />
                            <InfoField icon={<MdVerifiedUser />} label="Estado" value={perfil?.confirmEmail ? "Verificada" : "Pendiente"} isBadge />
                            <InfoField icon={<MdCalendarMonth />} label="Desde" value={perfil?.createdAt ? new Date(perfil.createdAt).toLocaleDateString() : "N/A"} />
                        </div>
                    </div>

                    <CardPassword />
                </div>
            </div>
        </div>
    );
};

const InfoField = ({ icon, label, value, isBadge }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="text-2xl text-[#F5BD45] bg-[#17243D] p-3 rounded-xl shadow-md">{icon}</div>
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            {isBadge ? (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">{value}</span>
            ) : (
                <p className="text-[#17243D] font-bold">{value || "No disponible"}</p>
            )}
        </div>
    </div>
);

export default Profile;