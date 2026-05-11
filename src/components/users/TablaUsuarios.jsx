import { MdDeleteForever, MdEdit, MdCheckCircle, MdRemoveCircle } from "react-icons/md";

const TablaUsuarios = ({ usuarios, handleEliminar, handleEditar, handleCambiarEstado }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#17243D] text-white">
              <th className="px-6 py-4 font-bold uppercase text-xs">Nombre Completo</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Correo Electrónico</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Rol</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">Estado</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <tr key={user._id} className={`transition-colors ${user.estado === 'inactivo' ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {user.nombre} {user.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-700 uppercase">
                      {user.rol || 'Administrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                      user.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      {/* ACCIÓN: CAMBIAR ESTADO (Botón dinámico) */}
                      <button 
                        onClick={() => handleCambiarEstado(user._id, user.estado === 'activo' ? 'inactivo' : 'activo')}
                        title={user.estado === 'activo' ? "Desactivar" : "Activar"}
                      >
                        {user.estado === 'activo' ? 
                          <MdRemoveCircle className="h-6 w-6 text-orange-400 hover:text-orange-600" /> : 
                          <MdCheckCircle className="h-6 w-6 text-green-500 hover:text-green-700" />
                        }
                      </button>

                      <MdEdit 
                        onClick={() => handleEditar(user._id)}
                        className="h-6 w-6 text-gray-400 cursor-pointer hover:text-[#F5BD45]" 
                        title="Editar Usuario"
                      />
                      
                      <MdDeleteForever 
                        onClick={() => handleEliminar(user._id)}
                        className="h-6 w-6 text-red-400 cursor-pointer hover:text-red-600" 
                        title="Eliminar Permanente"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUsuarios;