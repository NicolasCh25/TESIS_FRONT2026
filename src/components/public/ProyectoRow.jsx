import { MdInfoOutline } from "react-icons/md";

const ProyectoRow = ({ proyecto, onVerDetalles }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      <td 
        className="p-5 text-[#17243D] font-bold text-sm uppercase leading-tight cursor-pointer hover:text-[#F5BD45] transition-colors"
        onClick={() => onVerDetalles(proyecto)}
      >
        {proyecto.titulo}
      </td>
      <td className="p-5 text-gray-600 text-sm italic">{proyecto.autor}</td>
      <td className="p-5 text-gray-600 text-sm">{proyecto.tutor}</td>
      <td className="p-5">
        <span className="bg-gray-100 text-[#17243D] px-3 py-1 rounded-full text-[10px] font-black uppercase">
          {proyecto.periodoAcademico}
        </span>
      </td>
      <td className="p-5 text-right">
        <button 
          className="inline-flex items-center gap-2 bg-[#F5BD45] text-[#17243D] px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-yellow-500 transition-all active:scale-95 shadow-sm"
          onClick={() => onVerDetalles(proyecto)}
        >
          <MdInfoOutline size={16} /> Ver Todo
        </button>
      </td>
    </tr>
  );
};

export default ProyectoRow;