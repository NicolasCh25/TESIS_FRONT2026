import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { storeAuth } from "../../context/storeAuth";
import storeProfile from "../../context/storeProfile";
import { useFetch } from "../../hooks/useFetch";

const FormularioPerfil = () => {
    const { token, setToken, rol } = storeAuth();
    const { user, profile } = storeProfile(); 
    const fetchDataBackend = useFetch();
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 px-4 text-gray-700 focus:bg-white focus:border-[#17243D] outline-none transition-all";

    // Rellenar con los datos actuales
    useEffect(() => {
        if (user) {
            reset({
                nombre: user.nombre || "",
                apellido: user.apellido || "",
                email: user.email || "",
            });
        }
    }, [user, reset]);

    const updateUser = async (dataForm) => {
        // Usamos la URL de producción que tienes en Postman
        const url = "https://repositiorio-pic.onrender.com/api/usuarios/perfil";
        
        try {
            // Enviamos exactamente lo que probaste en Postman
            const dataToSend = {
                nombre: dataForm.nombre,
                apellido: dataForm.apellido
            };

            const response = await fetchDataBackend(url, dataToSend, "PUT", {
                "Authorization": `Bearer ${token}`
            });

            if (response) {
                // ✅ 1. Actualizamos el Store de Autenticación (Dashboard)
                setToken(token, rol, dataForm.nombre, dataForm.apellido);
                
                // ✅ 2. Refrescamos los datos del perfil (Tarjeta lateral)
                await profile(token);

                toast.success(response.msg || "Perfil actualizado correctamente");
            }
        } catch (error) {
            // Si sale 404 "Usuario no encontrado", imprimimos el error real del server
            const msgError = error.response?.data?.msg || "Error al actualizar";
            toast.error(msgError);
            console.error("Respuesta del servidor:", error.response?.data);
        }
    };

    return (
        <form onSubmit={handleSubmit(updateUser)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToastContainer />
            
            <div>
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Nombre</label>
                <input 
                    type="text" 
                    className={inputClass} 
                    {...register("nombre", { required: "El nombre es obligatorio" })} 
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1 font-bold">{errors.nombre.message}</p>}
            </div>

            <div>
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Apellido</label>
                <input 
                    type="text" 
                    className={inputClass} 
                    {...register("apellido", { required: "El apellido es obligatorio" })} 
                />
                {errors.apellido && <p className="text-red-500 text-xs mt-1 font-bold">{errors.apellido.message}</p>}
            </div>

            <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Correo Institucional</label>
                <input 
                    type="email" 
                    className={`${inputClass} opacity-60 bg-gray-100 cursor-not-allowed`} 
                    {...register("email")} 
                    readOnly 
                />
            </div>

            <button 
                type="submit" 
                className="md:col-span-2 bg-[#17243D] text-white py-4 rounded-xl font-black hover:bg-[#F5BD45] hover:text-[#17243D] transition-all mt-4 shadow-lg uppercase text-sm"
            >
                Guardar Cambios
            </button>
        </form>
    );
};

export default FormularioPerfil;