import { MdInfo, MdFavorite, MdFavoriteBorder } from "react-icons/md";

const FilaEstudiante = ({ 
  proyecto, 
  index, 
  onVer, 
  esFavorito, 
  onToggleFav,
  seleccionable = false,
  checked = false,
  onSelectChange
}) => {
  return (
    <tr className={`hover:bg-blue-50/30 transition-colors border-b border-gray-100 ${checked ? 'bg-amber-50/20' : ''}`}>
      {seleccionable && (
        <td className="px-6 py-4 text-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={onSelectChange}
            className="h-4 w-4 rounded border-gray-300 text-[#F5BD45] focus:ring-[#F5BD45] cursor-pointer"
          />
        </td>
      )}
      
      <td className="px-6 py-4 text-gray-400 font-medium text-xs">{index + 1}</td>
      
      <td className="px-6 py-4">
        <button
          onClick={() => onVer(proyecto)}
          className="font-bold text-[#17243D] hover:text-[#F5BD45] transition-colors text-left uppercase text-sm leading-tight"
        >
          {proyecto.titulo}
        </button>
      </td>

      <td className="px-6 py-4 text-xs text-gray-500 uppercase font-medium">
        {proyecto.carrera}
      </td>

      <td className="px-6 py-4 text-center">
        <span className="px-3 py-1 bg-gray-100 text-[#17243D] rounded-full text-[10px] font-black uppercase">
          {proyecto.periodoAcademico}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-center gap-4">
          <button onClick={() => onToggleFav(proyecto)} className="transition-transform hover:scale-125 active:scale-90">
            {esFavorito ? (
              <MdFavorite className="h-7 w-7 text-red-500" title="Quitar de favoritos" />
            ) : (
              <MdFavoriteBorder className="h-7 w-7 text-gray-300 hover:text-red-400" title="Agregar a favoritos" />
            )}
          </button>

          <button onClick={() => onVer(proyecto)}>
            <MdInfo className="h-7 w-7 text-[#17243D] hover:text-blue-600 transition-colors" title="Detalles" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FilaEstudiante;