import { MdSchool, MdAssignment, MdCode } from "react-icons/md";

const TarjetasResumen = ({ data }) => {
  const tarjetas = [
    { 
      id: 1, 
      titulo: "Total Proyectos", 
      valor: data.totalProyectos, 
      icono: <MdAssignment />, 
      color: "bg-[#17243D]" 
    },
    { 
      id: 2, 
      titulo: "Tutores Activos", 
      valor: data.totalTutores, 
      icono: <MdSchool />, 
      color: "bg-blue-600" 
    },
    { 
      id: 3, 
      titulo: "Tecnologías Usadas", 
      valor: data.totalTecnologias, 
      icono: <MdCode />, 
      color: "bg-[#F5BD45]" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {tarjetas.map((t) => (
        <div key={t.id} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-5 hover:translate-y-[-5px] transition-all duration-300">
          <div className={`${t.color} p-4 rounded-2xl text-white text-3xl shadow-lg`}>
            {t.icono}
          </div>
          <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{t.titulo}</p>
            <p className="text-3xl font-black text-[#17243D]">{t.valor}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TarjetasResumen;