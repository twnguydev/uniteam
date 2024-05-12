import type { User, UserParticipant } from '../types/user';
import type { Event } from '../types/Event';
import fetchApi, { ApiResponse } from "../api/fetch";

export async function findAllParticipants(userData: User): Promise<UserParticipant[]> {
    const participants: ApiResponse<UserParticipant[]> = await fetchApi<UserParticipant[]>('GET', 'participants/', undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (participants.success && participants.data) {
        return participants.data;
    } else {
        return [];
    }
}

export async function getEvents(userData: User, participantId: number): Promise<any> {
    const eventsData: ApiResponse<Event[]> = await fetchApi('GET', `participants/${participantId}/events`, undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (eventsData.success && eventsData.data) {
        return eventsData.data;
    } else {
        return [];
    }
}

export async function getParticipantsFromEventId(userData: User, eventId: number): Promise<UserParticipant[]> {
    const participantsData: ApiResponse<UserParticipant[]> = await fetchApi('GET', `participants/${eventId}`, undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (participantsData.success && participantsData.data) {
        return participantsData.data;
    } else {
        return [];
    }
}

export async function findLastParticipantId(userData: User): Promise<number> {
    const participants: UserParticipant[] = await findAllParticipants(userData);

    if (participants.length === 0) {
        return 0;
    }

    const maxId: number = Math.max(...participants.map(participant => participant.id));
    return maxId;
}