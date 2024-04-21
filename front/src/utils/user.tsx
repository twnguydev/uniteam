import React, { useState, useEffect } from 'react';
import type { User, UserProps } from '../types/user';
import fetchApi from '../api/fetch';

export async function findAllUsers(userData: User): Promise<User[]> {
    const usersData = await fetchApi<User[]>('GET', 'users/', undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (usersData.success && usersData.data) {
        return usersData.data;
    } else {
        return [];
    }
}

export async function findUserLastname(userId: number, userData: User): Promise<string | undefined> {
    const users = await findAllUsers(userData);
    const user = users.find((user: User) => user.id === userId);
    return user ? user.lastName : undefined;
}

const User: React.FC<UserProps> = ({ userId, userData }) => {
    const [userLastname, setUserLastname] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUserLastname = async (): Promise<void> => {
            const lastname = await findUserLastname(userId, userData);
            setUserLastname(lastname);
        };

        fetchUserLastname();
    }, [userId, userData]);

    return <span>{userLastname}</span>;
};

export default User;