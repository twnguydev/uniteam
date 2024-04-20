import React, { useEffect, ReactElement } from "react";
import { Navigate, Outlet, useNavigate, NavigateFunction } from "react-router-dom";

const ProtectedAdminRoute: React.FC<any> = (props): ReactElement => {
    const user: any = JSON.parse(localStorage.getItem("user") as string);
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        if (!user || !user.admin) {
            navigate('/');
        }
    }, [user])

    if (user && user.admin) {
        return <Outlet {...props} />;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedAdminRoute;