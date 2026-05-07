import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmarCuenta = () => {
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const [cargando, setCargando] = useState(true);
  const params = useParams();
  const { id } = params;
  const fetchDataBackend = useFetch();

  useEffect(() => {
    const confirmar = async () => {
      try {
        // ✅ CAMBIO REAL (ruta correcta del backend)
        const url = `${import.meta.env.VITE_BACKEND_URL}api/confirmar-email/${id}`;
        
        const response = await fetchDataBackend(url, null, "GET");

        if (response) {
          setCuentaConfirmada(true);
          toast.success(response.msg || "¡Cuenta confirmada correctamente!");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Error al confirmar la cuenta");
      } finally {
        setCargando(false);
      }
    };

    if (id) confirmar();
  }, [id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
        <h1 className="text-3xl font-black text-[#17243D] mb-4 uppercase">
          Confirmar <span className="text-[#F5BD45]">Cuenta</span>
        </h1>

        {cargando ? (
          <p className="text-gray-500 font-medium animate-pulse">Verificando token...</p>
        ) : (
          <>
            <div className={`p-4 rounded-xl mb-6 font-bold ${
              cuentaConfirmada 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {cuentaConfirmada 
                ? "Tu cuenta ha sido activada con éxito" 
                : "El enlace es inválido o ya expiró"}
            </div>

            {cuentaConfirmada && (
              <Link
                to="/login"
                className="inline-block bg-[#17243D] text-white px-8 py-3 rounded-full font-bold hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-lg"
              >
                INICIAR SESIÓN
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmarCuenta;