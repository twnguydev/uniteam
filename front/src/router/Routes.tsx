import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../auth/AuthContext';
import { Error } from '../components/Error';
import { Login } from '../components/Login';
import { Home } from '../components/Home';
import { Calendar } from '../components/Calendar';
import { Schedule } from '../components/Schedule';
import { ScheduleAdmin } from '../components/admin/Schedule';
import { Navbar } from '../components/Navbar';
import { Contact } from '../components/Contact';
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProtectedUserRoute from "./ProtectedUserRoute";
import HiddenUserRoute from "./HiddenUserRoute";

export const PageRouter = () => {
    return (
        <Router>
            <div>
                <AuthProvider>
                    <Navbar />
                    <Routes>
                        <Route path="/" Component={Home as React.ComponentType} />
                        <Route path="/contact" Component={Contact as React.ComponentType} />
                        <Route path="*" Component={Error as React.ComponentType} />

                        <Route element={<HiddenUserRoute />}>
                            <Route path="/auth" Component={Login as React.ComponentType} />
                        </Route>

                        <Route element={<ProtectedUserRoute />}>
                            <Route path="/calendar" Component={Calendar as React.ComponentType} />
                            <Route path="/schedule" Component={Schedule as React.ComponentType} />
                            <Route path="/member/schedule" Component={Schedule as React.ComponentType} />
                        </Route>

                        <Route element={<ProtectedAdminRoute />}>
                            <Route path="/admin/schedule" Component={ScheduleAdmin as React.ComponentType} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </div>
        </Router>
    )
}