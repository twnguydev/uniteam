import React, { useEffect, useState } from 'react';
import { findAllGroups } from './group';
import { findAllStatus } from './status';
import { badges, groupBadges } from '../data/badges';
import type { Group } from '../types/group';
import type { Status } from '../types/status';

export const Badge: React.FC<{ Id: number, Name: string, UserData: any }> = ({ Id, Name, UserData }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [status, setStatus] = useState<Status[]>([]);

    useEffect(() => {
        const fetchGroups = async (): Promise<void> => {
            const fetchedGroups = await findAllGroups(UserData);
            setGroups(fetchedGroups);
        };

        const fetchStatuses = async (): Promise<void> => {
            const fetchedStatus = await findAllStatus(UserData);
            setStatus(fetchedStatus);
        };

        fetchGroups();
        fetchStatuses();
    }, []);

    if (Name === 'status') {
        const statusName = status.find((status) => status.id === Id)?.name;
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