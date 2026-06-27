import { MdDeleteForever, MdCheckCircle, MdRemoveCircle } from "react-icons/md";

const TablaUsuarios = ({ usuarios, handleEliminar, handleCambiarEstado }) => {
  const mostrarCarrera = usuarios.some(u => u.carrera);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#17243D] text-white">
              <th className="px-6 py-4 font-bold uppercase text-xs">Nombre Completo</th>
              <th className="px-6 py-4 font-bold uppercase text-xs">Correo Electrónico</th>
              {mostrarCarrera && <th className="px-6 py-4 font-bold uppercase text-xs">Carrera</th>}
              <th className="px-6 py-4 font-bold uppercase text-xs">Rol</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">Estado</th>
              <th className="px-6 py-4 font-bold uppercase text-xs text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length > 0 ? (
              usuarios.map((user) => (
                <tr key={user._id} className={`transition-all ${user.estado === 'inactivo' ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {user.nombre} {user.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  {mostrarCarrera && (
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                      {user.carrera || "N/A"}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-blue-100 text-blue-700 uppercase">
                      {user.rol || 'ADMINISTRADOR'}
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
                      {/* ACCIÓN: CAMBIAR ESTADO (No elimina de la tabla) */}
                      <button 
                        onClick={() => handleCambiarEstado(user._id, user.estado === 'activo' ? 'inactivo' : 'activo')}
                        className="transition-transform active:scale-90 cursor-pointer"
                        title={user.estado === 'activo' ? "Desactivar" : "Activar"}
                      >
                        {user.estado === 'activo' ? 
                          <MdRemoveCircle className="h-7 w-7 text-orange-400 hover:text-orange-600" /> : 
                          <MdCheckCircle className="h-7 w-7 text-green-500 hover:text-green-700" />
                        }
                      </button>
                      
                      <MdDeleteForever 
                        onClick={() => handleEliminar(user._id)}
                        className="h-7 w-7 text-red-400 cursor-pointer hover:text-red-600" 
                        title="Eliminar Permanente"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={mostrarCarrera ? "6" : "5"} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                  No hay usuarios en la base de datos.
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