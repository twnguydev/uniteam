import eventData from '../data/events.json';

import fetchApi from '../api/fetch';

// export function findAllEvents(): typeof eventData.events {
//     return eventData.events;
// }

export function findEventCreator() {

}

export function findEventId(eventName: string): number | undefined {
    const event = eventData.events.find(event => event.name === eventName);
    return event ? event.id : undefined;
}

export function findEventName(eventId: number): string | undefined {
    const event = eventData.events.find(event => event.id === eventId);
    return event ? event.name : undefined;
}

export function findLastEventId(): number {
    return Math.max(...eventData.events.map(event => event.id));
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