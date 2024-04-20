export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    token: string;
    admin: boolean;
    groupId: number;
    groupName: string | null;
}