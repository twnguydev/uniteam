import React, { createContext, useContext, useEffect, useState } from 'react';
import userData from '../data/users.json';
import groupData from '../data/groups.json';

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token: string;
    admin: boolean;
    groupId: number;
    groupName: string | null;
}

interface Group {
    id: number;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string, password: string) => {
        const foundUser = userData.users.find(
            (user: any) => user.email === email && user.password === password
        );

        if (foundUser) {
            const newUser: User = {
                id: foundUser.id,
                firstname: foundUser.firstname,
                lastname: foundUser.lastname,
                email: foundUser.email,
                token: foundUser.token,
                admin: foundUser.admin,
                groupId: foundUser.groupId,
                groupName: getUserGroupName(foundUser.groupId),
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            console.log('Adresse e-mail ou mot de passe incorrect.');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const getUserGroupName = (groupId: number): string | null => {
        const foundGroup = groupData.groups.find((group: Group) => group.id === groupId);
        return foundGroup ? foundGroup.name : null;
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