import { useState } from "react";

const FiltroLogs = ({ onFiltrar }) => {
  const [accion, setAccion] = useState("");
  const [resultado, setResultado] = useState("");

  const handleBuscar = (e) => {
    e.preventDefault();
    onFiltrar({ accion, resultado });
  };

  return (
    <form onSubmit={handleBuscar} className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {/* Selector de Acciones */}
        <select
          value={accion}
          onChange={(e) => setAccion(e.target.value)}
          className="px-3 py-2 rounded-xl border outline-none bg-gray-50 font-bold text-xs text-[#17243D] uppercase cursor-pointer focus:ring-2 focus:ring-[#F5BD45]"
        >
          <option value="">Todas las Acciones</option>
          <option value="login_exitoso">Login Exitoso</option>
          <option value="login_fallido">Login Fallido</option>
          <option value="crear_proyecto">Crear Proyecto</option>
          <option value="actualizar_proyecto">Actualizar Proyecto</option>
          <option value="eliminar_proyecto">Eliminar Proyecto</option>
          <option value="cambiar_estado_usuario">Estado Usuario</option>
          <option value="registro_usuario">Registro Usuario</option>
        </select>

        {/* Selector de Resultados */}
        <select
          value={resultado}
          onChange={(e) => setResultado(e.target.value)}
          className="px-3 py-2 rounded-xl border outline-none bg-gray-50 font-bold text-xs text-[#17243D] uppercase cursor-pointer focus:ring-2 focus:ring-[#F5BD45]"
        >
          <option value="">Todos los Resultados</option>
          <option value="exito">Éxito</option>
          <option value="fallo">Fallo</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto bg-[#17243D] text-white px-5 py-2 rounded-xl font-black text-xs tracking-wider uppercase hover:bg-[#F5BD45] hover:text-[#17243D] transition-all shadow-md"
      >
        Filtrar Historial
      </button>
    </form>
  );
};

export default FiltroLogs;