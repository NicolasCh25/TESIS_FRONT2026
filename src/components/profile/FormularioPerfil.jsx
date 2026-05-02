import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify'
import {storeAuth} from "../../context/storeAuth"
import { useFetch } from "../../hooks/useFetch"

const FormularioPerfil = () => {
    const { user, token } = storeAuth()
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 px-4 text-gray-700 focus:bg-white focus:border-[#17243D] outline-none transition-all"

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre,
                apellido: user?.apellido,
                email: user?.email,
            })
        }
    }, [user, reset])

    const updateUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarperfil/${user._id}`
        const response = await fetchDataBackend(url, dataForm, "PUT", {
            Authorization: `Bearer ${token}`
        })
        if (response) toast.success("Perfil actualizado correctamente")
    }

    return (
        <form onSubmit={handleSubmit(updateUser)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToastContainer />
            <div>
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Nombre</label>
                <input type="text" className={inputClass} {...register("nombre", { required: "Campo obligatorio" })} />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Apellido</label>
                <input type="text" className={inputClass} {...register("apellido", { required: "Campo obligatorio" })} />
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
            </div>
            <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Correo electrónico</label>
                <input type="email" className={inputClass} {...register("email", { required: "Campo obligatorio" })} />
            </div>

            <button type="submit" className="md:col-span-2 bg-[#17243D] text-white py-3 rounded-xl font-bold hover:bg-[#F5BD45] hover:text-[#17243D] transition-all mt-4 shadow-lg">
                ACTUALIZAR DATOS
            </button>
        </form>
    )
}

export default FormularioPerfil