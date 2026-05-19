import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend 
} from 'recharts';

const GraficosEstadisticos = ({ datosCarrera, datosTutor, carreraSeleccionada, setCarreraSeleccionada, carrerasOriginales }) => {
  const COLORS = ['#17243D', '#F5BD45', '#3B82F6', '#10B981', '#F43F5E', '#8B5CF6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* 📊 GRÁFICO DE BARRAS: Se mantiene perfecto como estaba */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-[#17243D] mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#F5BD45] rounded-full"></span>
          Proyectos por Carrera
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosCarrera} margin={{ bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                interval={0} 
                angle={-30} 
                textAnchor="end" 
                tick={{fill: '#6b7280', fontSize: 11, fontWeight: 'bold'}} 
                height={80} 
              />
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

      {/* 🍰 GRÁFICO CIRCULAR: Con selector de carrera */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-[#17243D] flex items-center gap-2">
            <span className="w-2 h-8 bg-[#17243D] rounded-full"></span>
            Carga por Tutores
          </h3>
          
          <select 
            value={carreraSeleccionada}
            onChange={(e) => setCarreraSeleccionada(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-gray-50 text-[10px] font-black text-[#17243D] uppercase outline-none focus:ring-2 focus:ring-[#F5BD45] cursor-pointer"
          >
            <option value="Todas">Todas las Carreras</option>
            {carrerasOriginales.map((c, i) => (
              <option key={i} value={c.fullName}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosTutor}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="cantidad"
                nameKey="name"
                label={({percent}) => `${(percent * 100).toFixed(0)}%`}
              >
                {datosTutor.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficosEstadisticos;