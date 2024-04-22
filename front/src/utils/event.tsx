import eventData from '../data/events.json';
import fetchApi from '../api/fetch';

export function findEventId(eventName: string): number | undefined {
    const event = eventData.events.find(event => event.name === eventName);
    return event ? event.id : undefined;
}

export function findEventName(eventId: number): string | undefined {
    const event = eventData.events.find(event => event.id === eventId);
    return event ? event.name : undefined;
}

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
    const eventsData = await fetchApi('GET', 'events/', undefined, {
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