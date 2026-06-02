import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import FormularioProyecto from "../components/projects/FormularioProyecto"; 
import "react-toastify/dist/ReactToastify.css";

const CrearProyecto = () => {
  const fetchDataBackend = useFetch();
  const [archivo, setArchivo] = useState(null);
  const navigate = useNavigate();
  const { token, rol } = storeAuth();
  const [cargando, setCargando] = useState(false);

  const registrarProyecto = async (dataForm) => {
    if (rol === "invitado") {
      toast.warning("Modo invitado: no puedes crear proyectos");
      return;
    }

    setCargando(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
      const url = `${baseUrl}api/proyectos`;

      const formData = new FormData();
      
      formData.append("titulo", dataForm.titulo);
      formData.append("descripcion", dataForm.descripcion);
      formData.append("autor", dataForm.autor);
      formData.append("tutor", dataForm.tutor);
      formData.append("palabrasClave", dataForm.palabrasClave);
      formData.append("tecnologias", dataForm.tecnologias);
      formData.append("carrera", dataForm.carrera);
      formData.append("repositorio", dataForm.repositorio || "");
      formData.append("video", dataForm.video || "");
      
      // ✅ Volvemos a enviar el periodoAcademico ingresado por teclado
      formData.append("periodoAcademico", dataForm.periodoAcademico);

      if (archivo) {
        formData.append("archivoPDF", archivo);
      }

      const response = await fetchDataBackend(url, formData, "POST", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success(response.msg || "¡Proyecto registrado exitosamente!");
        setTimeout(() => navigate('/dashboard/list'), 2000);
      }

    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.msg || "Error interno al registrar";
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex justify-center items-center py-10 px-4 bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#17243D] uppercase tracking-tighter">
            Registrar <span className="text-[#F5BD45]">Proyecto PIC</span>
          </h1>
        </div>
        <FormularioProyecto 
          onSubmit={registrarProyecto} 
          setArchivo={setArchivo} 
          rol={rol} 
          cargando={cargando}
        />
      </div>
    </div>
  );
};

export default CrearProyecto;