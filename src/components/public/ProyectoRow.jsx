import { MdOutlineLaunch, MdPersonOutline, MdHistoryEdu } from "react-icons/md";

const ProyectoRow = ({ proyecto, onVerDetalles }) => {
  return (
    <tr className="group hover:bg-gray-50/80 transition-all border-b border-gray-100">
      <td 
        className="p-6 cursor-pointer group-hover:pl-8 transition-all"
        onClick={() => onVerDetalles(proyecto)}
      >
        <p className="text-[#17243D] font-black text-sm uppercase leading-tight hover:text-[#F5BD45] transition-colors">
          {proyecto.titulo}
        </p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><MdPersonOutline size={12}/> {proyecto.autor}</span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1"><MdHistoryEdu size={12}/> {proyecto.tutor}</span>
        </div>
      </td>
      
      <td className="p-6 hidden lg:table-cell">
        <span className="text-gray-500 text-[11px] font-bold italic">{proyecto.autor}</span>
      </td>

      <td className="p-6 hidden lg:table-cell">
        <span className="text-gray-500 text-[11px] font-medium">{proyecto.tutor}</span>
      </td>

      <td className="p-6">
        <span className="bg-gray-100 text-[#17243D] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-gray-200">
          {proyecto.periodoAcademico}
        </span>
      </td>

      <td className="p-6 text-right">
        <button 
          onClick={() => onVerDetalles(proyecto)}
          className="bg-[#17243D] text-[#F5BD45] p-3 rounded-2xl hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-md active:scale-90 group-hover:rotate-6"
          title="Ver detalles completos"
        >
          <MdOutlineLaunch size={18} />
        </button>
      </td>
    </tr>
  );
};

export default ProyectoRow;