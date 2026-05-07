import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { storeAuth } from '../context/storeAuth';

const PublicRoute = () => {
    const { token } = storeAuth();
    const location = useLocation();

    // 🔥 PERMITIR /confirmar y /forgot aunque exista token
    if (
        token &&
        !location.pathname.includes("/confirmar") &&
        !location.pathname.includes("/forgot")
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;