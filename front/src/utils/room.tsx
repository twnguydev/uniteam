import React from 'react';
import roomData from '../data/rooms.json';

export const Room: React.FC<{ roomId: number }> = ({ roomId }) => {
    const roomName = roomData.rooms.find((room) => room.id === roomId)?.name;

    return <span>{roomName}</span>;
}

export function findRoomId(roomName: string): number | undefined {
    const room = roomData.rooms.find(room => room.name === roomName);
    return room ? room.id : undefined;
}

export function findRoomName(roomId: number): string | undefined {
    const room = roomData.rooms.find(room => room.id === roomId);
    return room ? room.name : undefined;
}