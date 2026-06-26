import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { storeAuth } from "../../context/storeAuth";
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { toast } from "react-toastify";

export const CardPassword = () => {
  const fetchDataBackend = useFetch();
  const { token } = storeAuth();

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [mostrarPass, setMostrarPass] = useState({ actual: false, nueva: false, confirmar: false });
  const [cargando, setCargando] = useState(false);

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (!passwordActual || !passwordNueva || !confirmarPassword) {
      return toast.warn("Todos los campos son obligatorios");
    }

    if (passwordNueva !== confirmarPassword) {
      return toast.error("La nueva contraseña y su confirmación no coinciden");
    }

    if (passwordNueva.length < 6) {
      return toast.warn("La nueva contraseña debe tener al menos 6 caracteres");
    }

    setCargando(true);

    const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    const url = `${baseUrl}api/perfil/cambiar-password`;

    const data = { passwordActual, passwordNueva, confirmarPassword };

    try {
      const response = await fetchDataBackend(url, data, "PUT", {
        Authorization: `Bearer ${token}`,
      });

      if (response) {
        toast.success(response.msg || "Contraseña actualizada correctamente");
        // Limpiamos los campos del formulario tras el éxito
        setPasswordActual("");
        setPasswordNueva("");
        setConfirmarPassword("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.msg || "Error al cambiar la contraseña");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-xl font-black text-[#17243D] flex items-center gap-2 uppercase tracking-tighter mb-6">
        <MdLock className="text-[#F5BD45]" size={24} /> Seguridad de la Cuenta
      </h2>

      <form onSubmit={handleCambiarPassword} className="space-y-5">
        {/* Contraseña Actual */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Contraseña Actual</label>
          <div className="relative">
            <input
              type={mostrarPass.actual ? "text" : "password"}
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none font-medium text-[#17243D] text-sm pr-12 focus:border-[#F5BD45] transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setMostrarPass({ ...mostrarPass, actual: !mostrarPass.actual })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17243D]"
            >
              {mostrarPass.actual ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
        </div>

        {/* Nueva Contraseña */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Nueva Contraseña</label>
          <div className="relative">
            <input
              type={mostrarPass.nueva ? "text" : "password"}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none font-medium text-[#17243D] text-sm pr-12 focus:border-[#F5BD45] transition-all"
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setMostrarPass({ ...mostrarPass, nueva: !mostrarPass.nueva })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17243D]"
            >
              {mostrarPass.nueva ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Confirmar Nueva Contraseña</label>
          <div className="relative">
            <input
              type={mostrarPass.confirmar ? "text" : "password"}
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none font-medium text-[#17243D] text-sm pr-12 focus:border-[#F5BD45] transition-all"
              placeholder="Repite tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setMostrarPass({ ...mostrarPass, confirmar: !mostrarPass.confirmar })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17243D]"
            >
              {mostrarPass.confirmar ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
        </div>

        {/* Botón de Envió */}
        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-[#17243D] text-white py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-md disabled:opacity-50"
        >
          {cargando ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </form>
    </div>
  );
};