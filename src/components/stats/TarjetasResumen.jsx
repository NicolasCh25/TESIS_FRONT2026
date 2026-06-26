import { MdSchool, MdAssignment, MdDateRange, MdAdminPanelSettings, MdPeople } from "react-icons/md";

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
      titulo: "Tutores", 
      valor: data.totalTutores, 
      icono: <MdSchool />, 
      color: "bg-blue-600" 
    },
    { 
      id: 3, 
      titulo: "Periodos Académicos", 
      valor: data.totalPeriodos, 
      icono: <MdDateRange />, 
      color: "bg-[#F5BD45]" 
    },
    { 
      id: 4, 
      titulo: "Administradores", 
      valor: data.totalAdministradores, 
      icono: <MdAdminPanelSettings />, 
      color: "bg-red-500" 
    },
    { 
      id: 5, 
      titulo: "Usuarios Alumnos", 
      valor: data.totalUsuarios, 
      icono: <MdPeople />, 
      color: "bg-emerald-600" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
      {tarjetas.map((t) => (
        <div key={t.id} className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 hover:translate-y-[-4px] transition-all duration-300">
          <div className={`${t.color} p-3 rounded-xl text-white text-2xl shadow-md`}>
            {t.icono}
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider leading-tight">{t.titulo}</p>
            <p className="text-2xl font-black text-[#17243D] mt-0.5">{t.valor}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TarjetasResumen;