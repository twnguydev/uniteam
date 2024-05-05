import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { findAllEvents } from './event';
import fetchApi, { ApiResponse } from "../api/fetch";
import type { Room } from '../types/Room';

export async function findAllRooms<User>(userData: User): Promise<any> {
    const roomsData: ApiResponse<Room[]> = await fetchApi('GET', 'rooms/', undefined, {
        headers: {
            Authorization: `Bearer ${(userData as any).token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (roomsData.success && roomsData.data) {
        return roomsData.data;
    }
}

export const RoomElement: React.FC<{ roomId: number }> = ({ roomId }) => {
    const [roomName, setRoomName] = useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchRoomName = async () => {
            const rooms = await findAllRooms(user);
            const room = rooms.find((room: any) => room.id === roomId);
            if (room) {
                setRoomName(room.name);
            }
        };

        fetchRoomName();
    }, [roomId, user]);

    return <span>{roomName}</span>;
}

export async function findRoomId(roomName: string, userData: any): Promise<number | undefined> {
    const rooms = await findAllRooms(userData);
    const room = rooms.find((room: any) => room.name === roomName);
    return room ? room.id : undefined;
}

export async function findRoomName(roomId: number, userData: any): Promise<string | undefined> {
    const rooms = await findAllRooms(userData);
    const room = rooms.find((room: any) => room.id === roomId);
    return room ? room.name : undefined;
}

export async function countEventsInRoom(roomId: number, userData: any): Promise<number> {
    const events: any = await findAllEvents(userData);
    return events.filter((event: any): boolean => event.roomId === roomId).length;
}

export async function findLastRoomId(userData: any): Promise<number | undefined> {
    const rooms = await findAllRooms(userData);
    return rooms.length > 0 ? rooms[rooms.length - 1].id : undefined;
}