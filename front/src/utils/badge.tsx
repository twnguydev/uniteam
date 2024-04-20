import React from 'react';
import statusData from '../data/status.json';
import { badges } from '../data/badges';

export const Badge: React.FC<{ statusId: number }> = ({ statusId }) => {
    const statusName = statusData.status.find((status) => status.id === statusId)?.name;

    const badge = badges.find(badge => badge.text === statusName);

    if (!badge) {
        return null;
    }

    return (
        <span className={badge.classNames}>
            {statusName}
        </span>
    );
};