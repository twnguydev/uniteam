import React, { ReactNode, createContext, Context, useContext, useEffect, useState } from 'react';
import userData from '../data/users.json';
import groupData from '../data/groups.json';

import type { AuthContextType } from '../types/Auth';
import type { User } from '../types/user';
import type { Group } from '../types/group';

const AuthContext: Context<AuthContextType | null> = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: ReactNode }): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);

    useEffect((): void => {
        const storedUser: string | null = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login: (email: string, password: string) => void = (email: string, password: string): void => {
        const foundUser: { id: number; token: string; email: string; firstname: string; lastname: string; groupId: number; admin: boolean; } | undefined = userData.users.find(
            (user: any): boolean => user.email === email && user.password === password
        ) ?? undefined;

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

    const logout: () => void = (): void => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const getUserGroupName: (groupId: number) => string | null = (groupId: number): string | null => {
        const foundGroup: { id: number; name: string } | undefined = groupData.groups.find((group: Group): boolean => group.id === groupId);
        return foundGroup ? foundGroup.name : null;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth: () => AuthContextType = (): AuthContextType => {
    const context: AuthContextType | null = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};