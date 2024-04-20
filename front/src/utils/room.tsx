import React from 'react';
import roomData from '../data/rooms.json';

export const Room: React.FC<{ roomId: number }> = ({ roomId }) => {
    const roomName = roomData.rooms.find((room) => room.id === roomId)?.name;

    return <span>{roomName}</span>;
}