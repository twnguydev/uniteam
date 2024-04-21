export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    is_admin: boolean;
    groupId: number;
    groupName: string | null;
}

export interface UserProps {
    userId: number;
    userData: User;
}