import { MdDeleteForever, MdInfo, MdEdit } from "react-icons/md";

// Se añade handleEditar a las props
const TablaProyectos = ({ proyectos, handleEliminar, handleDetalle, handleEditar }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#17243D] text-white">
              <th className="px-6 py-4 font-bold uppercase text-xs">N°</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-left">Título del Proyecto</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Carrera</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Estado</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {proyectos.length > 0 ? (
              proyectos.map((proyecto, index) => (
                <tr key={proyecto._id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{proyecto.titulo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">{proyecto.carrera}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      Publicado
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <MdInfo 
                        onClick={() => handleDetalle(proyecto._id)}
                        className="h-7 w-7 text-[#17243D] cursor-pointer hover:text-blue-600 transition-colors" 
                        title="Ver Detalle"
                      />
                      
                      {/* Se añade el evento onClick para llamar a handleEditar */}
                      <MdEdit 
                        onClick={() => handleEditar(proyecto._id)}
                        className="h-7 w-7 text-gray-400 cursor-pointer hover:text-amber-500 transition-colors" 
                        title="Editar"
                      />
                      
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
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium">
                  No se encontraron proyectos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaProyectos;