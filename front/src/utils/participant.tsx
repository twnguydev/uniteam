import type { User, UserParticipant } from '../types/user';
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

export async function findLastParticipantId(userData: User): Promise<number> {
    const participants: UserParticipant[] = await findAllParticipants(userData);

    if (participants.length === 0) {
        return 0;
    }

    const maxId: number = Math.max(...participants.map(participant => participant.id));
    return maxId;
}