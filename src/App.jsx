import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas del Portal PIC
import Home from './pages/Home';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import CrearProyecto from './pages/CrearProyecto';
import ListarProyectos from './pages/ListarProyectos';
import GestionUsuarios from './pages/GestionUsuarios'; 
import Estadisticas from './pages/Estadisticas';
import Profile from './pages/Profile';
import ActualizarProyecto from './pages/ActualizarProyecto';
import ActualizarUsuario from './pages/ActualizarUsuario';

// Importaciones del Dashboard
import Dashboard from './layout/Dashboard';
import InicioAdmin from './pages/InicioAdmin'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =======================
            Rutas Públicas 
            ======================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* =======================
            Rutas Privadas (Dashboard Layout) 
            ======================= */}
        <Route path="/dashboard" element={<Dashboard />}>
          
          {/* Inicio del Panel: Muestra los 4 cuadros */}
          <Route index element={<InicioAdmin />} />
          
          {/* Módulo: Subir Nuevo Proyecto */}
          <Route path="create" element={<CrearProyecto />} /> 
          
          {/* Módulo: Gestionar Proyectos (PIC) */}
          <Route path="list" element={<ListarProyectos />} />
          
          {/* Módulo: Gestión de Usuarios */}
          <Route path="users" element={<GestionUsuarios />} />  
          
          {/* Módulo: Informes y Estadísticas */}
          <Route path="stats" element={<Estadisticas />} />  

            {/* Módulo: Perfil de Usuario */}
          <Route path="profile" element={<Profile />} />

          {/* Ruta para actualizar proyecto */}
          <Route path="actualizar/:id" element={<ActualizarProyecto />} />

          {/* Ruta para actualizar usuario*/}
          <Route path="usuarios/actualizar/:id" element={<ActualizarUsuario />} />

        </Route>

        {/* =======================
            Manejo de errores 404 
            ======================= */}
        <Route 
          path="*" 
          element={
            <div className="flex h-screen items-center justify-center bg-gray-50 flex-col text-center p-4">
              <h1 className="text-9xl font-black text-[#17243D] opacity-20">404</h1>
              <div className="absolute">
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Página no encontrada</h2>
                <p className="text-gray-500 mt-2">El recurso que buscas no existe en el Portal PIC.</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;