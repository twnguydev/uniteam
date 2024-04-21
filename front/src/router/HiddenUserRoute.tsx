import React, { useEffect, ReactElement } from "react";
import { Navigate, Outlet, useNavigate, NavigateFunction } from "react-router-dom";

import { useAuth } from '../auth/AuthContext';

const HiddenUserRoute: React.FC<any> = (props): ReactElement => {
    const user: any = JSON.parse(localStorage.getItem("user") as string);
    const navigate: NavigateFunction = useNavigate();

    const userContext = useAuth();

    useEffect(() => {
        if (user) {
            navigate(1);
        }
    }, [user])

    if (!user && !userContext.user) {
        return <Outlet {...props} />;
    } else {
        return <Navigate to="/" />;
    }
};

export default HiddenUserRoute;