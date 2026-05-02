import { MdSchool, MdPeople, MdBarChart } from "react-icons/md";

const TarjetasResumen = ({ data }) => {
  const tarjetas = [
    { 
      id: 1, 
      titulo: "Total Proyectos", 
      valor: data.totalProyectos || 0, 
      icono: <MdSchool />, 
      color: "bg-blue-600" 
    },
    { 
      id: 2, 
      titulo: "Usuarios Activos", 
      valor: data.totalUsuarios || 0, 
      icono: <MdPeople />, 
      color: "bg-emerald-500" 
    },
    { 
      id: 3, 
      titulo: "Carreras Registradas", 
      valor: data.totalCarreras || 0, 
      icono: <MdBarChart />, 
      color: "bg-[#F5BD45]" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {tarjetas.map((t) => (
        <div key={t.id} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-5 hover:scale-105 transition-transform">
          <div className={`${t.color} p-4 rounded-2xl text-white text-3xl shadow-lg`}>
            {t.icono}
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{t.titulo}</p>
            <p className="text-3xl font-black text-[#17243D]">{t.valor}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TarjetasResumen;