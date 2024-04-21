import type { User } from './user';

export interface Event {
    id: number;
    hostName: string | null;
    name: string;
    dateStart: Date | string;
    dateEnd: Date | string;
    roomId: number;
    groupId: number;
    description: string;
    statusId: number;
}

export interface DisplayInputsProps {
    selectedEvent: Event;
    userData: User | null;
}