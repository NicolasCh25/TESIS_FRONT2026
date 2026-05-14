import { MdInfo, MdPerson, MdHistoryEdu } from "react-icons/md";

const ProyectoRow = ({ proyecto, index, onVerDetalles }) => {
  return (
    <tr className="hover:bg-purple-50/30 transition-colors">
      <td className="px-6 py-4 text-gray-500 font-medium">
        {index + 1}
      </td>

      <td className="px-6 py-4">
        <button
          onClick={() => onVerDetalles(proyecto)}
          className="font-bold text-[#17243D] hover:text-[#F5BD45] transition-colors text-left uppercase text-sm leading-tight"
        >
          {proyecto.titulo}
        </button>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600 italic">
        <div className="flex items-center gap-2">
          <MdPerson className="text-gray-400" />
          {proyecto.autor}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MdHistoryEdu className="text-gray-400" />
          {proyecto.tutor}
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-gray-100 text-[#17243D] rounded-full text-[10px] font-black uppercase border border-gray-100">
          {proyecto.periodoAcademico}
        </span>
      </td>

      {/* ✅ Icono de información alineado al nuevo título */}
      <td className="px-6 py-4 text-center">
        <button 
          onClick={() => onVerDetalles(proyecto)}
          className="inline-flex items-center justify-center transition-transform hover:scale-110"
        >
          <MdInfo 
            className="h-8 w-8 text-[#17243D] cursor-pointer hover:text-[#F5BD45] transition-colors"
            title="Consultar expediente completo"
          />
        </button>
      </td>
    </tr>
  );
};

export default ProyectoRow;