import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import CardActualizar from "../components/projects/CardActualizar";

const ActualizarProyecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fetchDataBackend = useFetch();
  const { token, rol } = storeAuth();

  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  // NUEVO: Inicializamos con el objeto del proyecto si ya viene en el state de navegación
  const [datosIniciales, setDatosIniciales] = useState(() => {
    if (location.state && (location.state._id || location.state.id)) {
      return location.state;
    }
    return null;
  });

  // OBTENER PROYECTO
  useEffect(() => {
    // Si ya tenemos los datos iniciales, no hacemos la petición
    if (datosIniciales) return;

    const obtenerProyecto = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

        let encontrado = null;
        let paginaActual = 1;
        let totalPaginas = 1;

        // BÚSQUEDA PAGINADA: Buscamos página por página hasta encontrar el proyecto por ID
        do {
          const url = `${baseUrl}api/proyectos?limit=50&page=${paginaActual}`;
          const response = await fetchDataBackend(url, null, "GET", {
            Authorization: `Bearer ${token}`
          });

          if (response) {
            const listaProyectos = response.resultados || response.proyectos || (Array.isArray(response) ? response : []);
            const proyectoEncontrado = listaProyectos.find((p) => p._id === id || p.id === id);
            
            if (proyectoEncontrado) {
              encontrado = proyectoEncontrado;
              break;
            }
            
            totalPaginas = response.totalPaginas || 1;
            paginaActual++;
          } else {
            break;
          }
        } while (paginaActual <= totalPaginas);

        if (encontrado) {
          setDatosIniciales(encontrado);
        } else {
          toast.error("Proyecto no encontrado");
        }

      } catch (error) {
        console.error(error);
        toast.error("Error al cargar proyecto");
      }
    };

    obtenerProyecto();
  }, [id, token, datosIniciales]);

  const handleActualizar = async (dataForm) => {

    if (rol === "invitado") {
      toast.warning("Modo invitado: no puedes editar proyectos");
      return;
    }

    setCargando(true);

    try {

      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

      // ENDPOINT REAL
      const url = `${baseUrl}api/proyectos/${id}`;

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