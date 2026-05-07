import { useEffect } from "react";
import { storeAuth } from "../../context/storeAuth"; 
import storeProfile from "../../context/storeProfile"; 

export const CardProfile = () => {
    const { token } = storeAuth();
    const { user, profile } = storeProfile();

    // Cargamos la info del perfil al montar el componente si no existe
    useEffect(() => {
        if (token && !user) {
            profile(token);
        }
    }, [token, user, profile]);

    // 🛡️ Generador de iniciales (Nombre + Apellido)
    const obtenerIniciales = () => {
        if (!user?.nombre) return "U";
        
        const primerNombre = user.nombre.trim().split(" ")[0] || "";
        const primerApellido = user.apellido?.trim().split(" ")[0] || "";

        if (primerNombre && primerApellido) {
            return `${primerNombre[0]}${primerApellido[0]}`.toUpperCase();
        }
        return primerNombre.substring(0, 2).toUpperCase();
    };

    const iniciales = obtenerIniciales();

    return (
        <div className="bg-[#17243D] text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
            
            {/* 📸 SECCIÓN DE FOTO / INICIALES */}
            <div className="relative mb-6">
                {/* Círculo con iniciales dinámicas */}
                <div className="h-32 w-32 rounded-full bg-white/10 border-4 border-[#F5BD45] flex items-center justify-center text-4xl font-black text-[#F5BD45] shadow-inner uppercase tracking-tighter">
                    {iniciales}
                </div>

                <label className="absolute bottom-0 right-0 bg-[#F5BD45] text-[#17243D] rounded-full p-2 cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-[#17243D]">
                    📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            {/* 📝 Información del Usuario */}
            <div className="w-full space-y-4 pt-4 border-t border-white/10">
                <div className="text-center">
                    <p className="text-[#F5BD45] text-xs font-bold uppercase tracking-widest">
                        Nombre Completo
                    </p>
                    <p className="text-lg font-medium">
                        {user ? `${user.nombre} ${user.apellido || ""}` : "Cargando..."}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-[#F5BD45] text-xs font-bold uppercase tracking-widest">
                        Correo Electrónico
                    </p>
                    <p className="text-sm opacity-80">
                        {user?.email || "Cargando correo..."}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-[#F5BD45] text-xs font-bold uppercase tracking-widest">
                        Rol de Usuario
                    </p>
                    <span className="inline-block mt-1 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase">
                        {user?.rol || "Estudiante"}
                    </span>
                </div>
            </div>
        </div>
    );
};