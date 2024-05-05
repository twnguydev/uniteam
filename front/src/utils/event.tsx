import fetchApi, { ApiResponse } from "../api/fetch";
import type { Event } from '../types/Event';

export async function findLastEventId(userData: any): Promise<number> {
    const events = await findAllEvents(userData);

    if (events) {
        const eventIds = events.map((event: any) => event.id);
        return Math.max(...eventIds);
    } else {
        return -1;
    }
}

export async function findAllEvents<User>(userData: User): Promise<any> {
    const eventsData: ApiResponse<Event[]> = await fetchApi('GET', 'events/', undefined, {
        headers: {
            Authorization: `Bearer ${(userData as any).token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (eventsData.success && eventsData.data) {
        return eventsData.data;
    }
}