import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas del Portal PIC
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta Privada Temporal (Panel de Administración) */}
        <Route 
          path="/dashboard/list" 
          element={
            <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
              <h1 className="text-4xl font-bold text-[#17243D] mb-4">Dashboard en Construcción 🚧</h1>
              <p className="text-xl text-gray-700">Aquí irá el panel de administración del Portal PIC.</p>
              <a href="/login" className="mt-6 text-blue-600 hover:underline font-bold">
                Cerrar sesión y volver al Login
              </a>
            </div>
          } 
        />

        {/* Manejo de errores 404 */}
        <Route 
          path="*" 
          element={
            <div className="flex h-screen items-center justify-center bg-gray-50">
              <h1 className="text-3xl font-bold text-[#17243D]">Error 404: Página no encontrada</h1>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;