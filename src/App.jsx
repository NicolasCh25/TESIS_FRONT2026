import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de tus archivos de protección
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Páginas
import Home from './pages/Home'; 
import Login from './pages/Login';
import RegistroPublico from './pages/RegistroPublico';
import Forgot from './pages/Forgot';
import NuevoPassword from './pages/NuevoPassword';
import ConfirmarCuenta from './pages/ConfirmarCuenta'; 
import CrearProyecto from './pages/CrearProyecto';
import ListarProyectos from './pages/ListarProyectos';
import GestionUsuarios from './pages/GestionUsuarios'; 
import RegistrarUsuario from './pages/RegistrarUsuario';
import Estadisticas from './pages/Estadisticas';
import Logs from './pages/Logs'; // ✅ AGREGADO: Importación de la página modular de Logs
import Profile from './pages/Profile';
import ActualizarProyecto from './pages/ActualizarProyecto';
import ActualizarUsuario from './pages/ActualizarUsuario';
import DetalleProyecto from './pages/DetalleProyecto';
import ProyectosPorCarrera from './pages/ProyectosPorCarrera';
import Estudiante from './pages/Estudiante';
import Favoritos from './pages/Favoritos'; 
import ChatbotPage from './pages/ChatbotPage'; 

// Layouts e Inicio
import Dashboard from './layout/Dashboard';
import InicioAdmin from './pages/InicioAdmin'; 

import { storeAuth } from './context/storeAuth';

function App() {
  const { rol, clearToken } = storeAuth(); 
  const rolLimpio = rol?.toLowerCase().trim();
  const esAdmin = rolLimpio === 'admin' || rolLimpio === 'administrador';

  // ✅ SEGURIDAD: Limpiar sesión al estar en la Landing (/)
  useEffect(() => {
    if (window.location.pathname === '/') {
      clearToken();
    }
  }, [clearToken]);

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/proyectos/carrera/:carreraNombre" element={<ProyectosPorCarrera />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroPublico />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/recuperarpassword/:token" element={<NuevoPassword />} />
          <Route path="/confirmar/:id" element={<ConfirmarCuenta />} />
        </Route>

        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            
            <Route 
              index 
              element={esAdmin ? <InicioAdmin /> : <Estudiante />} 
            />

            <Route path="favoritos" element={<Favoritos />} />

            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="create" element={<CrearProyecto />} />
            <Route path="list" element={<ListarProyectos />} />
            <Route path="detalle/:id" element={<DetalleProyecto />} />
            <Route path="actualizar/:id" element={<ActualizarProyecto />} />
            <Route path="users" element={<GestionUsuarios />} />
            <Route path="usuarios/registrar" element={<RegistrarUsuario />} />
            <Route path="usuarios/actualizar/:id" element={<ActualizarUsuario />} />
            <Route path="stats" element={<Estadisticas />} />
            {/* ✅ AGREGADO: Ruta protegida para visualizar la bitácora de auditoría */}
            {esAdmin && <Route path="logs" element={<Logs />} />}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element = {
          <div className="flex h-screen items-center justify-center bg-gray-50 flex-col text-center p-4">
            <h1 className="text-9xl font-black text-[#17243D] opacity-20">404</h1>
            <div className="absolute">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Página no encontrada</h2>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;