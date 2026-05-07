import FormularioPerfil from "../components/profile/FormularioPerfil";
import CardPassword from "../components/profile/CardPassword";
import { CardProfile } from "../components/profile/CardProfile";

import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";

const Profile = () => {
    const fetchDataBackend = useFetch();
    const { token } = storeAuth();

    const [perfil, setPerfil] = useState(null);

    // 🔥 cargar perfil
    const obtenerPerfil = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}api/administradores/perfil`;

        try {
            const response = await fetchDataBackend(url, null, "GET", {
                Authorization: `Bearer ${token}`
            });

            if (response) {
                setPerfil(response);
            }
        } catch (error) {
            console.log("Error perfil:", error);
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, []);

    return (
        <div className="p-6 lg:p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#17243D]">
                    MI <span className="text-[#F5BD45]">PERFIL</span>
                </h1>
                <p className="text-gray-500">
                    Gestiona tu información personal y seguridad de la cuenta
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda */}
                <div className="lg:col-span-1">
                    <CardProfile perfil={perfil} />
                </div>

                {/* Columna Derecha */}
                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold text-[#17243D] mb-6 flex items-center gap-2">
                            <span>👤</span> Datos Personales
                        </h2>

                        {/* 🔥 SOLO LE PASAMOS PERFIL */}
                        <FormularioPerfil perfil={perfil} />
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold text-[#17243D] mb-6 flex items-center gap-2">
                            <span>🔐</span> Seguridad
                        </h2>

                        <CardPassword />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;