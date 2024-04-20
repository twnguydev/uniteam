// AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';
import userData from '../data/users.json';

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string, password: string) => {
        const foundUser = userData.users.find(
            (user: any) => user.email === email && user.password === password
        );

        if (foundUser) {
            setUser({ id: foundUser.id, firstname: foundUser.firstname, lastname: foundUser.lastname, email: foundUser.email, token: foundUser.token });
        } else {
            console.log('Adresse e-mail ou mot de passe incorrect.');
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};