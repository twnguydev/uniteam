export interface Event {
    id: number;
    creatorId: number;
    name: string;
    date_start: Date | string;
    date_end: Date | string;
    roomId: number;
    groupId: number;
    description: string;
    statusId: number;
}