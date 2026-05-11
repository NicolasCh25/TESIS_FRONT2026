import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend 
} from 'recharts';

const GraficosEstadisticos = ({ datosCarrera, datosTutor }) => {
  const COLORS = ['#17243D', '#F5BD45', '#3B82F6', '#10B981', '#F43F5E'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Gráfico 1: Barras - Proyectos por Carrera */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-[#17243D] mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#F5BD45] rounded-full"></span>
          Proyectos por Carrera
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosCarrera}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="cantidad" radius={[10, 10, 0, 0]}>
                {datosCarrera.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Pastel - Distribución por Tutores */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-[#17243D] mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#17243D] rounded-full"></span>
          Carga por Tutores
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosTutor}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="cantidad"
                nameKey="name"
              >
                {datosTutor.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default GraficosEstadisticos;