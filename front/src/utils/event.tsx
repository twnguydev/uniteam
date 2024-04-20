import eventData from '../data/events.json';

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