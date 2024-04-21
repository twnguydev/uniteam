import React, { useEffect, useState } from 'react';
import { findAllGroups } from './group';
import { findAllStatus } from './status';
import { badges, groupBadges } from '../data/badges';

import type { Group } from '../types/group';
import type { Status } from '../types/status';

export const Badge: React.FC<{ Id: number, Name: string, UserData: any }> = ({ Id, Name, UserData }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const fetchedGroups = await findAllGroups(UserData);
            setGroups(fetchedGroups);
        };

        const fetchStatuses = async () => {
            const fetchedStatus = await findAllStatus(UserData);
            setStatuses(fetchedStatus);
        };

        fetchGroups();
        fetchStatuses();
    }, []);

    if (Name === 'status') {
        const statusName = statuses.find((status) => status.id === Id)?.name;
        const badge = badges.find(badge => badge.text === statusName);
        if (!badge) {
            return null;
        }
    
        return (
            <span className={badge.classNames}>
                {statusName}
            </span>
        );
    } else if (Name === 'group') {
        const groupName = groups.find((group) => group.id === Id)?.name;
        const badge = groupBadges.find(badge => badge.text === groupName);
        if (!badge) {
            return null;
        }
    
        return (
            <span className={badge.classNames}>
                {groupName}
            </span>
        );
    }

    return null;
};