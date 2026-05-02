import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import {storeAuth} from "../../context/storeAuth"
import { useFetch } from "../../hooks/useFetch"

const CardPassword = () => {
    const { user, token, clearToken } = storeAuth()
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const inputClass = "block w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 px-4 text-gray-700 focus:bg-white focus:border-[#17243D] outline-none transition-all"

    const updatePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`
        const response = await fetchDataBackend(url, dataForm, "PUT", {
            Authorization: `Bearer ${token}`
        })
        if (response) {
            toast.info("Contraseña cambiada. Por seguridad, inicia sesión nuevamente.")
            setTimeout(() => clearToken(), 2000)
        }
    }

    return (
        <form onSubmit={handleSubmit(updatePassword)} className="space-y-4">
            <div>
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Contraseña Actual</label>
                <input type="password" placeholder="••••••••" className={inputClass} {...register("passwordactual", { required: "Campo obligatorio" })} />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-bold text-[#17243D]">Nueva Contraseña</label>
                <input type="password" placeholder="Mínimo 6 caracteres" className={inputClass} {...register("passwordnuevo", { required: "Campo obligatorio", minLength: 6 })} />
            </div>
            <button type="submit" className="w-full bg-gray-100 text-[#17243D] py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-md">
                CAMBIAR CONTRASEÑA
            </button>
        </form>
    )
}

export default CardPassword