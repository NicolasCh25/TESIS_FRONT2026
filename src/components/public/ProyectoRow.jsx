import { MdOutlineLaunch, MdPersonOutline, MdHistoryEdu } from "react-icons/md";

const ProyectoRow = ({ proyecto, onVerDetalles }) => {
  return (
    <tr className="group hover:bg-gray-50/80 transition-all border-b border-gray-100">
      {/* COLUMNA 1: TÍTULO Y DATOS SECUNDARIOS */}
      <td className="p-6 cursor-pointer" onClick={() => onVerDetalles(proyecto)}>
        <p className="text-[#17243D] font-black text-sm uppercase leading-tight group-hover:text-[#F5BD45] transition-colors">
          {proyecto.titulo}
        </p>
        {/* En móviles estos datos aparecen aquí debajo para no romper la tabla */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><MdPersonOutline size={12}/> {proyecto.autor}</span>
          <span className="hidden sm:inline text-gray-200">|</span>
          <span className="flex items-center gap-1"><MdHistoryEdu size={12}/> {proyecto.tutor}</span>
        </div>
      </td>
      
      {/* COLUMNAS VACÍAS PARA ALINEACIÓN (Como en tu imagen) */}
      <td className="p-6 hidden lg:table-cell text-center">
         <span className="text-gray-300 italic text-[10px]">-</span>
      </td>

      <td className="p-6 hidden lg:table-cell text-center">
         <span className="text-gray-300 italic text-[10px]">-</span>
      </td>

      {/* COLUMNA: PERIODO */}
      <td className="p-6 text-center">
        <span className="bg-gray-100 text-[#17243D] px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-gray-200 whitespace-nowrap">
          {proyecto.periodoAcademico}
        </span>
      </td>

      {/* COLUMNA: ACCIÓN (El botón azul de tu imagen) */}
      <td className="p-6 text-center">
        <button 
          onClick={() => onVerDetalles(proyecto)}
          className="bg-[#17243D] text-[#F5BD45] p-3 rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-md active:scale-90"
        >
          <MdOutlineLaunch size={20} />
        </button>
      </td>
    </tr>
  );
};

export default ProyectoRow;