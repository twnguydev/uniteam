export interface Event {
    id: number;
    hostId: number;
    name: string;
    dateStart: Date | string;
    dateEnd: Date | string;
    roomId: number;
    groupId: number;
    description: string;
    statusId: number;
}