import React, { useEffect, ReactElement } from "react";
import { Navigate, Outlet, useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';

const ProtectedAdminRoute: React.FC<any> = (props): ReactElement => {
    const user: any = JSON.parse(localStorage.getItem("user") as string);
    const navigate: NavigateFunction = useNavigate();

    const userContext = useAuth();

    useEffect(() => {
        if (!user || !user.isAdmin || !userContext.user || !userContext.user.isAdmin) {
            navigate('/');
        }
    }, [user])

    if (user && user.isAdmin && userContext.user && userContext.user.isAdmin) {
        return <Outlet {...props} />;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedAdminRoute;