import {storeAuth} from "../../context/storeAuth"

export const CardProfile = () => {
    const { user } = storeAuth() 

    const iniciales = user?.nombre?.split(" ").map(p => p[0]).join("").toUpperCase().substring(0, 2);

    return (
        <div className="bg-[#17243D] text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="relative mb-6">
                <div className="h-32 w-32 rounded-full bg-white/10 border-4 border-[#F5BD45] flex items-center justify-center text-4xl font-black text-[#F5BD45] shadow-inner">
                    {iniciales || "U"}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#F5BD45] text-[#17243D] rounded-full p-2 cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            <div className="w-full space-y-4 pt-4 border-t border-white/10">
                <div className="text-center">
                    <p className="text-[#F5BD45] text-xs font-bold uppercase tracking-widest">Nombre Completo</p>
                    <p className="text-lg font-medium">{user?.nombre} {user?.apellido}</p>
                </div>
                <div className="text-center">
                    <p className="text-[#F5BD45] text-xs font-bold uppercase tracking-widest">Correo Electrónico</p>
                    <p className="text-sm opacity-80">{user?.email}</p>
                </div>
                <div className="text-center">
                    <p className="text-[#F5BD45] text-xs font-bold uppercase tracking-widest">Rol de Usuario</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
                        {user?.rol?.toUpperCase() || 'ESTUDIANTE'}
                    </span>
                </div>
            </div>
        </div>
    )
}