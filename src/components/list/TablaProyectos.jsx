import { MdDeleteForever, MdInfo, MdEdit, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";

// ✅ Se mantiene todo tu diseño original adaptando la visibilidad dinámica con los estados "visible" y "oculto"
const TablaProyectos = ({
  proyectos,
  handleEliminar,
  handleDetalle,
  handleEditar,
  handleCambiarVisibilidad
}) => {

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#17243D] text-white">
              <th className="px-6 py-4 font-bold uppercase text-xs">
                N°
              </th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-left">
                Título del Proyecto
              </th>
              <th className="px-6 py-4 font-bold uppercase text-xs">
                Carrera
              </th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">
                Estado
              </th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {
              proyectos.length > 0 ? (
                proyectos.map((proyecto, index) => (
                  <tr
                    key={proyecto._id}
                    className={`transition-colors ${
                      proyecto.estado === 'oculto' ? 'bg-gray-50 opacity-60' : 'hover:bg-purple-50/30'
                    }`}
                  >
                    {/* NUMERO */}
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {index + 1}
                    </td>

                    {/* ✅ TITULO CLICKEABLE */}
                    <td className="px-6 py-4 font-bold text-gray-800">
                      <Link
                        to={`/dashboard/detalle/${proyecto._id}`}
                        state={proyecto}
                        className="hover:text-[#F5BD45] transition-colors"
                      >
                        {proyecto.titulo}
                      </Link>
                    </td>

                    {/* CARRERA */}
                    <td className="px-6 py-4 text-sm text-gray-600 uppercase">
                      {proyecto.carrera}
                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        proyecto.estado === 'visible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {proyecto.estado || 'visible'}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        {/* TOGGLE VISIBILIDAD */}
                        <button
                          onClick={() => handleCambiarVisibilidad(proyecto._id, proyecto.estado === 'visible' ? 'oculto' : 'visible')}
                          className="transition-transform active:scale-90 cursor-pointer"
                          title={proyecto.estado === 'visible' ? "Ocultar Proyecto" : "Mostrar Proyecto"}
                        >
                          {proyecto.estado === 'visible' ? (
                            <MdVisibilityOff className="h-7 w-7 text-orange-400 hover:text-orange-600 transition-colors" />
                          ) : (
                            <MdVisibility className="h-7 w-7 text-green-500 hover:text-green-700 transition-colors" />
                          )}
                        </button>

                        {/* DETALLE */}
                        <Link
                          to={`/dashboard/detalle/${proyecto._id}`}
                          state={proyecto}
                        >
                          <MdInfo
                            className="h-7 w-7 text-[#17243D] cursor-pointer hover:text-blue-600 transition-colors"
                            title="Ver Detalle"
                          />
                        </Link>

                        {/* EDITAR */}
                        <MdEdit
                          onClick={() => handleEditar(proyecto)}
                          className="h-7 w-7 text-gray-400 cursor-pointer hover:text-amber-500 transition-colors"
                          title="Editar"
                        />

                        {/* ELIMINAR */}
                        <MdDeleteForever
                          onClick={() => handleEliminar(proyecto._id)}
                          className="h-7 w-7 text-red-400 cursor-pointer hover:text-red-600 transition-colors"
                          title="Eliminar"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-20 text-center text-gray-400 font-medium"
                  >
                    No se encontraron proyectos registrados.
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaProyectos;