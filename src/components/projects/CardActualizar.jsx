import FormularioProyecto from "./FormularioProyecto";

const CardActualizar = ({ onSubmit, setArchivo, rol, cargando, datosIniciales }) => {
  return (
    <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#17243D] tracking-tight uppercase">
          Actualizar <span className="text-[#F5BD45]">Proyecto PIC</span>
        </h1>
        <div className="h-1.5 w-24 bg-[#F5BD45] mx-auto mt-2 rounded-full"></div>
        <p className="text-gray-500 mt-3 text-sm font-medium">
          Modifica la información técnica del trabajo de titulación
        </p>
      </div>

      {/* Reutilizamos el formulario que ya teníamos */}
      <FormularioProyecto 
        onSubmit={onSubmit} 
        setArchivo={setArchivo} 
        rol={rol} 
        cargando={cargando}
        defaultValues={datosIniciales} 
      />
    </div>
  );
};

export default CardActualizar;