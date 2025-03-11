/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Routes that require authentication
export const ProtectedRoute = ({ children }) => {
    const { isAuth, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login but save the current location
    if (!isAuth) {
        return (
            <Navigate to="/login" state={{ from: location.pathname }} replace />
        );
    }

    return children;
};

// Routes for non authenticated users
export const AuthRoute = ({ children }) => {
    const { isAuth, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuth) {
        const from = location.state?.from || '/';
        return <Navigate to={from} replace />;
    }

    return children;
};
