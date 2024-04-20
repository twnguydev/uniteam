import userData from '../data/users.json';

export function findUserLastname(userId: number): string | undefined {
    const user = userData.users.find(user => user.id === userId);
    return user ? user.lastname : undefined;
}