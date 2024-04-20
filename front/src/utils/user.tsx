import React from 'react';
import userData from '../data/users.json';

export function findAllUsers(): typeof userData.users {
    return userData.users;
}

export function findUserLastname(userId: number): string | undefined {
    const user = userData.users.find(user => user.id === userId);
    return user ? user.lastname : undefined;
}

export const User: React.FC<{ userId: number }> = ({ userId }) => {
    const userLastname: string | undefined = findUserLastname(userId);

    return <span>{userLastname}</span>;
}