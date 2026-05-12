import React from "react";

export const CardProfile = ({ user }) => {
    
    // 🛡️ Generador de iniciales (Primer Nombre + Primer Apellido)
    const obtenerIniciales = () => {
        if (!user?.nombre) return "U";
        
        // Dividimos por espacios y tomamos el primer elemento de cada uno
        const primerNombre = user.nombre.trim().split(" ")[0] || "";
        const primerApellido = user.apellido?.trim().split(" ")[0] || "";

        if (primerNombre && primerApellido) {
            return `${primerNombre[0]}${primerApellido[0]}`.toUpperCase();
        }
        // Fallback en caso de que solo haya un nombre
        return primerNombre.substring(0, 2).toUpperCase();
    };

    const iniciales = obtenerIniciales();

    return (
        <div className="bg-[#17243D] text-white p-10 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:shadow-yellow-500/10">
            
            {/* 🎨 Elemento decorativo de fondo (Círculo difuminado) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5BD45] opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 opacity-5 rounded-full -ml-12 -mb-12"></div>
            
            {/* 📸 SECCIÓN DE AVATAR CON INICIALES */}
            <div className="relative mb-8 group">
                {/* Círculo con iniciales dinámicas */}
                <div className="h-40 w-40 rounded-full bg-white/5 border-4 border-[#F5BD45] flex items-center justify-center text-5xl font-black text-[#F5BD45] shadow-2xl uppercase tracking-tighter transition-transform duration-500 group-hover:scale-105">
                    {iniciales}
                </div>

                {/* Badge de estado online/activo */}
                <div className="absolute bottom-4 right-4 h-6 w-6 bg-green-500 border-4 border-[#17243D] rounded-full shadow-lg"></div>
            </div>

            {/* 📝 INFORMACIÓN DEL USUARIO */}
            <div className="text-center w-full relative z-10">
                {/* Nombre y Apellido */}
                <h3 className="text-2xl font-black mb-1 uppercase tracking-tight leading-tight">
                    {user?.nombre} <br />
                    <span className="text-gray-300">{user?.apellido}</span>
                </h3>
                
                {/* Rol Institucional */}
                <p className="text-[#F5BD45] font-black text-sm tracking-[0.2em] uppercase mb-8">
                    {user?.rol || "Usuario"}
                </p>
                
                {/* Detalles secundarios */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                            Correo de Contacto
                        </span>
                        <span className="text-sm opacity-80 truncate px-2 italic">
                            {user?.email || "Sin correo registrado"}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                            ID de Sistema
                        </span>
                        <span className="text-[9px] opacity-30 font-mono select-all">
                            {user?._id || "---"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Pie de tarjeta con branding sutil */}
            <div className="mt-8 pt-4">
                <img 
                    src="/logoPIC.png" 
                    alt="Portal PIC" 
                    className="h-8 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                />
            </div>
        </div>
    );
};

export default CardProfile;