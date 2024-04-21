import React, { createContext, Context, useContext, useEffect, useState } from 'react';
import groupData from '../data/groups.json';

import type { AuthContextType } from '../types/Auth';
import type { User } from '../types/user';
import type { Group } from '../types/group';

const AuthContext: Context<AuthContextType | null> = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser: string | null = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: any, accessToken: string): void => {
        if (userData && userData.id && userData.firstName && userData.lastName && userData.email && userData.is_admin && userData.groupId) {
            const newUser: User = {
                id: userData.id,
                firstname: userData.firstName,
                lastname: userData.lastName,
                email: userData.email,
                token: accessToken,
                admin: userData.is_admin,
                groupId: userData.groupId,
                groupName: getUserGroupName(userData.groupId),
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    };

    const logout = (): void => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const getUserGroupName = (groupId: number): string | null => {
        const foundGroup: Group | undefined = groupData.groups.find((group: Group) => group.id === groupId);
        return foundGroup ? foundGroup.name : null;
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