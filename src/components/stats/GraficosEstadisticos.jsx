import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend 
} from 'recharts';

const GraficosEstadisticos = ({ datosCarrera, datosTutor }) => {
  const COLORS = ['#17243D', '#F5BD45', '#3B82F6', '#10B981', '#F43F5E', '#8B5CF6'];

  // Personalización del Tooltip para mostrar el nombre completo
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-2xl rounded-2xl border-none">
          <p className="text-xs font-black text-gray-400 uppercase mb-1">
            {payload[0].payload.fullName || payload[0].payload.name}
          </p>
          <p className="text-lg font-black text-[#17243D]">
            {payload[0].value} Proyectos
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Gráfico 1: Barras - Proyectos por Carrera */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
        <h3 className="text-xl font-bold text-[#17243D] mb-8 flex items-center gap-3">
          <span className="flex h-8 w-1.5 bg-[#F5BD45] rounded-full"></span>
          Proyectos por Carrera
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosCarrera} margin={{ bottom: 60, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                interval={0}
                angle={-25}
                textAnchor="end"
                tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="cantidad" barSize={45}>
                {datosCarrera.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    radius={[8, 8, 0, 0]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Pastel - Distribución por Tutores */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-[#17243D] mb-8 flex items-center gap-3">
          <span className="flex h-8 w-1.5 bg-[#17243D] rounded-full"></span>
          Carga por Tutores
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosTutor}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={8}
                dataKey="cantidad"
                nameKey="name"
                stroke="none"
              >
                {datosTutor.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                iconType="circle" 
                formatter={(value) => <span className="text-gray-600 font-bold text-xs uppercase">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default GraficosEstadisticos;