import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import CardActualizar from "../components/projects/CardActualizar";

const ActualizarProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();
  const { token, rol } = storeAuth();

  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  // NUEVO
  const [datosIniciales, setDatosIniciales] = useState(null);

  // OBTENER PROYECTO
  useEffect(() => {
    const obtenerProyecto = async () => {
      try {

        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

        // BUSCAR TODOS LOS PROYECTOS
        const url = `${baseUrl}/api/proyectos`;

        const response = await fetchDataBackend(url, null, "GET", {
          Authorization: `Bearer ${token}`
        });

        if (response?.resultados) {

          // BUSCAR EL PROYECTO POR ID
          const proyecto = response.resultados.find(
            (p) => p._id === id
          );

          if (proyecto) {
            setDatosIniciales(proyecto);
          } else {
            toast.error("Proyecto no encontrado");
          }
        }

      } catch (error) {
        console.error(error);
        toast.error("Error al cargar proyecto");
      }
    };

    obtenerProyecto();
  }, [id]);

  const handleActualizar = async (dataForm) => {

    if (rol === "invitado") {
      toast.warning("Modo invitado: no puedes editar proyectos");
      return;
    }

    setCargando(true);

    try {

      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

      // ENDPOINT REAL
      const url = `${baseUrl}/api/proyectos/${id}`;

      const formData = new FormData();

      Object.entries(dataForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (archivo) {
        formData.append("archivoPDF", archivo);
      }

      const response = await fetchDataBackend(url, formData, "PUT", {
        Authorization: `Bearer ${token}`
      });

      if (response) {
        toast.success("¡Proyecto actualizado correctamente!");

        setTimeout(() => {
          navigate("/dashboard/list");
        }, 2000);
      }

    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el proyecto");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex justify-center items-center py-10 px-4 overflow-hidden bg-gray-50">
      
      <ToastContainer />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/images/esfot.jpg')" }}
      ></div>

      {
        datosIniciales && (
          <CardActualizar
            onSubmit={handleActualizar}
            setArchivo={setArchivo}
            rol={rol}
            cargando={cargando}
            datosIniciales={datosIniciales}
          />
        )
      }

    </div>
  );
};

export default ActualizarProyecto;