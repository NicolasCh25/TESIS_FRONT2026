import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import { toast } from "react-toastify";

const DetalleProyecto = () => {

  const { id } = useParams();

  const fetchDataBackend = useFetch();

  const { token } = storeAuth();

  const [proyecto, setProyecto] = useState(null);

  useEffect(() => {

    const obtenerProyecto = async () => {

      try {

        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

        const url = `${baseUrl}api/proyectos`;

        const response = await fetchDataBackend(
          url,
          null,
          "GET",
          {
            Authorization: `Bearer ${token}`
          }
        );

        if (response?.resultados) {

          const encontrado = response.resultados.find(
            (p) => p._id === id
          );

          if (encontrado) {
            setProyecto(encontrado);
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

  if (!proyecto) {
    return (
      <div className="p-10 text-center font-bold">
        Cargando proyecto...
      </div>
    );
  }

  return (

    <div className="p-6">

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

        <h1 className="text-3xl font-black text-[#17243D] mb-6">
          {proyecto.titulo}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {/* AUTOR */}
          <div>
            <p className="font-bold text-[#17243D]">
              Autor
            </p>

            <p>{proyecto.autor}</p>
          </div>

          {/* TUTOR */}
          <div>
            <p className="font-bold text-[#17243D]">
              Tutor
            </p>

            <p>{proyecto.tutor}</p>
          </div>

          {/* CARRERA */}
          <div>
            <p className="font-bold text-[#17243D]">
              Carrera
            </p>

            <p>{proyecto.carrera}</p>
          </div>

          {/* PERIODO */}
          <div>
            <p className="font-bold text-[#17243D]">
              Periodo
            </p>

            <p>{proyecto.periodoAcademico}</p>
          </div>

          {/* PALABRAS CLAVE */}
          <div className="md:col-span-2">

            <p className="font-bold text-[#17243D]">
              Palabras Clave
            </p>

            <p>{proyecto.palabrasClave}</p>

          </div>

          {/* TECNOLOGIAS */}
          <div className="md:col-span-2">

            <p className="font-bold text-[#17243D]">
              Tecnologías
            </p>

            <p>{proyecto.tecnologias}</p>

          </div>

          {/* DESCRIPCION */}
          <div className="md:col-span-2">

            <p className="font-bold text-[#17243D]">
              Descripción
            </p>

            <p>{proyecto.descripcion}</p>

          </div>

          {/* PDF */}
          <div className="md:col-span-2">

            <p className="font-bold text-[#17243D] mb-3">
              Documento PDF
            </p>

            {
              proyecto.archivoPDF ? (

                <a
                  href={proyecto.archivoPDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#17243D] text-white px-5 py-3 rounded-xl hover:bg-[#2c3e50] transition-all font-bold"
                >
                  Ver PDF del Proyecto
                </a>

              ) : (

                <p className="text-gray-500">
                  No existe archivo PDF
                </p>

              )
            }

          </div>

        </div>

      </div>

    </div>
  );
};

export default DetalleProyecto;