import React, { useEffect, useState, ReactElement } from "react";
import { Navigate, Outlet, useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth } from '../auth/AuthContext';

const ProtectedUserRoute: React.FC<any> = (props): ReactElement => {
    const [shouldNavigate, setShouldNavigate] = useState<boolean>(false);
    const user: any = JSON.parse(localStorage.getItem("user") as string);
    const navigate: NavigateFunction = useNavigate();

    const userContext = useAuth();

    useEffect(() => {
        if (!user || !userContext.user) {
            setShouldNavigate(true);
        }
    }, [user, userContext.user]);

    useEffect(() => {
        if (shouldNavigate) {
            navigate(-1);
        }
    }, [shouldNavigate, navigate]);

    if (user && userContext.user) {
        return <Outlet {...props} />;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedUserRoute;