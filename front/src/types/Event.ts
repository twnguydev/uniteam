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