export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string | null;
    token?: string | null;
    isAdmin: boolean;
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