import { MdDeleteForever, MdEdit } from "react-icons/md";

const TablaUsuarios = ({ usuarios, handleEliminar, handleEditar }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#17243D] text-white">
              <th className="px-6 py-4 font-bold uppercase text-xs">Nombre Completo</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Correo Electrónico</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Rol</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <tr key={user._id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{user.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      user.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.rol.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      {/* ACCIÓN: EDITAR */}
                      <MdEdit 
                        onClick={() => handleEditar(user._id)}
                        className="h-7 w-7 text-gray-400 cursor-pointer hover:text-[#F5BD45] transition-colors" 
                        title="Editar Usuario"
                      />
                      {/* ACCIÓN: ELIMINAR */}
                      <MdDeleteForever 
                        onClick={() => handleEliminar(user._id)}
                        className="h-7 w-7 text-red-400 cursor-pointer hover:text-red-600 transition-colors" 
                        title="Eliminar Usuario"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-medium">
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