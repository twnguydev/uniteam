import React from 'react';
import statusData from '../data/status.json';
import groupData from '../data/groups.json';
import { badges, groupBadges } from '../data/badges';

export const Badge: React.FC<{ Id: number, Name: string }> = ({ Id, Name }) => {
    if (Name === 'status') {
        const badgeName = statusData.status.find((status) => status.id === Id)?.name;
        const badge = badges.find(badge => badge.text === badgeName);
        if (!badge) {
            return null;
        }
    
        return (
            <span className={badge.classNames}>
                {badgeName}
            </span>
        );
    } else if (Name === 'group') {
        const badgeName = groupData.groups.find((group) => group.id === Id)?.name;
        const badge = groupBadges.find(badge => badge.text === badgeName);
        if (!badge) {
            return null;
        }
    
        return (
            <span className={badge.classNames}>
                {badgeName}
            </span>
        );
    }
};