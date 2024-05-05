export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string | null;
    token?: string | null;
    is_admin: boolean;
    groupId: number;
    groupName?: string | null;
}

export interface UserProps {
    userId: number;
    userData: User;
}

export interface UserParticipant {
    id: number;
    userId: number;
    eventId: number;
}