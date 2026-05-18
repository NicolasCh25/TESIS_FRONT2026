import FilaEstudiante from "./FilaEstudiante";
import { MdSearchOff } from "react-icons/md";

const TablaEstudiante = ({ proyectos, onVer, favoritos, onToggleFav }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#17243D] text-white uppercase text-[10px] tracking-widest">
              <th className="px-6 py-5 font-black">N°</th>
              <th className="px-6 py-5 font-black">Título del Proyecto</th>
              <th className="px-6 py-5 font-black">Carrera</th>
              <th className="px-6 py-5 font-black text-center">Periodo</th>
              <th className="px-6 py-5 font-black text-center">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {proyectos.length > 0 ? (
              proyectos.map((p, i) => (
                <FilaEstudiante 
                  key={p._id}
                  index={i}
                  proyecto={p}
                  onVer={onVer}
                  onToggleFav={onToggleFav}
                  esFavorito={favoritos.some(f => f._id === p._id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-20 text-center text-gray-400 font-bold uppercase italic opacity-50">
                   <div className="flex flex-col items-center gap-2">
                      <MdSearchOff size={50} />
                      No hay proyectos para mostrar
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaEstudiante;