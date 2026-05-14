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
import Profile from './pages/Profile';
import ActualizarProyecto from './pages/ActualizarProyecto';
import ActualizarUsuario from './pages/ActualizarUsuario';
import DetalleProyecto from './pages/DetalleProyecto';
import ProyectosPorCarrera from './pages/ProyectosPorCarrera';


// Layouts e Inicio
import Dashboard from './layout/Dashboard';
import InicioAdmin from './pages/InicioAdmin'; 

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =======================
            RUTAS PÚBLICAS
        ======================= */}

        <Route path="/" element={<Home />} />

        {/* ✅ Nuevas rutas de acceso libre */}
        <Route path="/proyectos/carrera/:carreraNombre" element={<ProyectosPorCarrera />} />

        <Route element={<PublicRoute />}>

          <Route path="/login" element={<Login />} />

          <Route path="/registro" element={<RegistroPublico />} />

          <Route path="/forgot" element={<Forgot />} />

          <Route path="/recuperarpassword/:token" element={<NuevoPassword />} />

          <Route path="/confirmar/:id" element={<ConfirmarCuenta />} />

        </Route>

        {/* =======================
            RUTAS PROTEGIDAS
        ======================= */}

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<Dashboard />}>

            <Route index element={<InicioAdmin />} />

            {/* =======================
                PROYECTOS
            ======================= */}

            <Route path="create" element={<CrearProyecto />} />

            <Route path="list" element={<ListarProyectos />} />

            <Route path="detalle/:id" element={<DetalleProyecto />} />

            <Route path="actualizar/:id" element={<ActualizarProyecto />} />

            {/* =======================
                USUARIOS
            ======================= */}

            <Route path="users" element={<GestionUsuarios />} />

            <Route path="usuarios/registrar" element={<RegistrarUsuario />} />

            <Route path="usuarios/actualizar/:id" element={<ActualizarUsuario />} />

            {/* =======================
                OTROS
            ======================= */}

            <Route path="stats" element={<Estadisticas />} />

            <Route path="profile" element={<Profile />} />

          </Route>

        </Route>

        {/* =======================
            MANEJO DE ERROR 404
        ======================= */}

        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center bg-gray-50 flex-col text-center p-4">

              <h1 className="text-9xl font-black text-[#17243D] opacity-20">
                404
              </h1>

              <div className="absolute">

                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">
                  Página no encontrada
                </h2>

                <p className="text-gray-500 mt-2">
                  El recurso que buscas no existe en el Portal PIC.
                </p>

              </div>

            </div>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;