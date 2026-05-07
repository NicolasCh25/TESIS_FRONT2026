import { Navigate, Outlet } from 'react-router-dom';
import { storeAuth } from '../context/storeAuth';

const ProtectedRoute = () => {
    const { token } = storeAuth();

    // Si NO hay token, lo mandamos al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, permitimos el acceso a las rutas hijas
    return <Outlet />;
};

export default ProtectedRoute;