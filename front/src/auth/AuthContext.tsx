import React, { createContext, Context, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findGroupName } from '../utils/group';
import type { AuthContextType } from '../types/Auth';
import type { User } from '../types/user';

const AuthContext: Context<AuthContextType | null> = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect((): () => void => {
        const storedUser: string | null = localStorage.getItem('user');
        const storedToken: string | null = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        const tokenTimeout = setTimeout((): void => {
            logout();
        }, 30 * 60 * 1000);

        return (): void => {
            clearTimeout(tokenTimeout);
        };
    }, []);

    const login = async (userData: any, accessToken: string): Promise<void> => {
        userData = JSON.parse(userData);
        if (userData && userData.id && userData.firstName && userData.lastName && userData.email && userData.groupId) {
            const groupName: string | null = await findGroupName(userData.groupId, userData) ?? null;
            const newUser: User = {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                token: accessToken,
                isAdmin: userData.isAdmin,
                groupId: userData.groupId,
                groupName: groupName
            };
            setUser(newUser);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            alert('Erreur lors de la connexion.');
        }
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context: AuthContextType | null = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};