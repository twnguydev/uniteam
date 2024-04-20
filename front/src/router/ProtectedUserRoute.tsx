import React, { useEffect, ReactElement } from "react";
import { Navigate, Outlet, useNavigate, NavigateFunction } from "react-router-dom";

const ProtectedUserRoute: React.FC<any> = (props): ReactElement => {
    const user: any = JSON.parse(localStorage.getItem("user") as string);
    const navigate: NavigateFunction = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(-1);
        }
    }, [user])

    if (user) {
        return <Outlet {...props} />;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedUserRoute;