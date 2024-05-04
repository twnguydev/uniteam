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

export async function findLastUserId(userData: User): Promise<number | undefined> {
    const users: User[] = await findAllUsers(userData);
    let maxId: number | undefined = undefined;

    users.forEach((user) => {
        if (maxId === undefined || user.id > maxId) {
            maxId = user.id;
        }
    });

    return maxId;
}

export async function findUserLastname(userId: number, userData: User): Promise<string | undefined> {
    const users: User[] = await findAllUsers(userData);
    const user: User | undefined = users.find((user: User): boolean => user.id === userId);
    return user ? user.lastName : undefined;
}

export async function findUserId(userLastname: string, userData: User): Promise<number> {
    const users: User[] = await findAllUsers(userData);
    const user: User | undefined = users.find((user: User): boolean => user.lastName === userLastname);
    return user ? user.id : 0;
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