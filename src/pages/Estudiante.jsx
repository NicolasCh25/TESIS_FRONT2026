import { useEffect, useState, useMemo } from "react";
import { useFetch } from "../hooks/useFetch";
import { storeAuth } from "../context/storeAuth";
import TablaEstudiante from "../components/list/TablaEstudiante";
import DetalleModal from "../components/public/DetalleModal";
import { MdStar, MdStarBorder } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const Estudiante = () => {

  const fetchDataBackend = useFetch();

  const { token } = storeAuth();

  const [proyectos, setProyectos] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtro, setFiltro] = useState("titulo");

  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const [verFavoritos, setVerFavoritos] = useState(false);

  const [favoritos, setFavoritos] = useState([]);

  const carrerasDisponibles = [
    "Tecnología Superior en Desarrollo de Software",
    "Tecnología Superior en Electromecánica",
    "Tecnología Superior en Agua y Saniamiento Ambiental",
    "Tecnología Superior en Procesamiento Industrial de la Madera",
    "Tecnología Superior en Procesamiento de Alimentos",
    "Tecnología Superior en Redes y Telecomunicaciones"
  ];

  // =========================
  // OBTENER PROYECTOS
  // =========================

  const obtenerProyectos = async () => {

    try {

      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

      const valor = busqueda.trim();

      const campoBackend =
        filtro === "periodo"
          ? "periodoAcademico"
          : filtro;

      const query = valor
        ? `?${campoBackend}=${encodeURIComponent(valor)}`
        : "";

      const url = `${baseUrl}/api/proyectos${query}`;

      const response = await fetchDataBackend(
        url,
        null,
        "GET",
        {
          Authorization: `Bearer ${token}`
        }
      );

      const resultados = Array.isArray(response?.resultados)
        ? response.resultados.filter(
            (p) => p && p._id
          )
        : [];

      setProyectos(resultados);

    } catch (error) {

      console.error(error);

      setProyectos([]);

    }
  };

  // =========================
  // OBTENER FAVORITOS
  // =========================

  const obtenerFavoritos = async () => {

    try {

      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

      const url = `${baseUrl}/api/favoritos`;

      const response = await fetchDataBackend(
        url,
        null,
        "GET",
        {
          Authorization: `Bearer ${token}`
        }
      );

      const listaFavs = Array.isArray(response)
        ? response
        : response?.favoritos || [];

      const favoritosValidos = listaFavs.filter(
        (f) => f && f._id
      );

      setFavoritos(favoritosValidos);

    } catch (error) {

      console.error(error);

      setFavoritos([]);

    }
  };

  // =========================
  // EFFECT
  // =========================

  useEffect(() => {

    obtenerProyectos();

    obtenerFavoritos();

  }, [busqueda, filtro, token]);

  // =========================
  // TOGGLE FAVORITOS
  // =========================

  const toggleFav = async (proyecto) => {

    if (!proyecto || !proyecto._id) return;

    try {

      const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

      const url = `${baseUrl}/api/favoritos/${proyecto._id}`;

      const esFavorito = favoritos.some(
        (f) => f && f._id === proyecto._id
      );

      if (esFavorito) {

        await fetchDataBackend(
          url,
          null,
          "DELETE",
          {
            Authorization: `Bearer ${token}`
          }
        );

        setFavoritos((prev) =>
          prev.filter(
            (f) => f && f._id !== proyecto._id
          )
        );

        // SI EL MODAL ESTÁ ABIERTO Y ELIMINAS
        // EL FAVORITO, CERRAMOS EL MODAL

        if (
          proyectoSeleccionado &&
          proyectoSeleccionado._id === proyecto._id
        ) {
          setProyectoSeleccionado(null);
        }

        toast.info("Eliminado de favoritos");

      } else {

        await fetchDataBackend(
          url,
          null,
          "POST",
          {
            Authorization: `Bearer ${token}`
          }
        );

        setFavoritos((prev) => {

          const existe = prev.some(
            (f) => f && f._id === proyecto._id
          );

          if (existe) return prev;

          return [...prev, proyecto];

        });

        toast.success("Agregado a favoritos");

      }

    } catch (error) {

      console.error(error);

      toast.error("Error en favoritos");

    }
  };

  // =========================
  // LISTA FINAL
  // =========================

  const listaAMostrar = useMemo(() => {

    const lista = verFavoritos
      ? favoritos
      : proyectos;

    if (!Array.isArray(lista)) return [];

    return lista.filter(
      (p) => p && p._id
    );

  }, [verFavoritos, favoritos, proyectos]);

  // =========================
  // CAMBIAR ENTRE FAVORITOS
  // =========================

  const cambiarVista = () => {

    // IMPORTANTE:
    // CERRAMOS MODAL ANTES DE CAMBIAR TABLA

    setProyectoSeleccionado(null);

    setBusqueda("");

    setVerFavoritos((prev) => !prev);

  };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="p-6 min-h-screen bg-gray-50">

      <ToastContainer />

      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">

        <h1 className="text-3xl font-black text-[#17243D] uppercase">
          Repositorio <span className="text-[#F5BD45]">PIC</span>
        </h1>

        <div className="flex flex-wrap gap-2">

          {/* BOTON FAVORITOS */}

          <button
            onClick={cambiarVista}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
              verFavoritos
                ? "bg-[#F5BD45] text-[#17243D]"
                : "bg-white text-gray-400 border"
            }`}
          >

            {
              verFavoritos
                ? <MdStar size={18} />
                : <MdStarBorder size={18} />
            }

            {
              verFavoritos
                ? "Mis Favoritos"
                : "Todos los Proyectos"
            }

          </button>

          {/* FILTRO */}

          <select
            value={filtro}
            onChange={(e) => {

              setFiltro(e.target.value);

              setBusqueda("");

            }}
            className="px-3 py-2 rounded-xl border bg-white font-bold text-xs text-[#17243D] uppercase"
          >

            <option value="titulo">
              Título
            </option>

            <option value="autor">
              Autor
            </option>

            <option value="carrera">
              Carrera
            </option>

            <option value="periodo">
              Periodo
            </option>

          </select>

          {/* BUSCADOR */}

          {
            filtro === "carrera" ? (

              <select
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="px-4 py-2 w-full md:w-72 rounded-xl border bg-white text-sm"
              >

                <option value="">
                  Selecciona carrera...
                </option>

                {
                  carrerasDisponibles.map((c, i) => (

                    <option
                      key={i}
                      value={c}
                    >
                      {c}
                    </option>

                  ))
                }

              </select>

            ) : (

              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={`Buscar por ${filtro}...`}
                className="px-4 py-2 w-full md:w-72 rounded-xl border text-sm"
              />

            )
          }

        </div>

      </div>

      {/* TABLA */}

      <TablaEstudiante
        proyectos={listaAMostrar}
        onVer={setProyectoSeleccionado}
        favoritos={favoritos}
        onToggleFav={toggleFav}
      />

      {/* MODAL */}

      {
        proyectoSeleccionado && (

          <DetalleModal
            key={proyectoSeleccionado._id}
            proyecto={proyectoSeleccionado}
            onClose={() => setProyectoSeleccionado(null)}
          />

        )
      }

    </div>
  );
};

export default Estudiante;