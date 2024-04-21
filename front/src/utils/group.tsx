import React, { useEffect } from "react";

import { useAuth } from "../auth/AuthContext";

import { groupBadges } from "../data/badges";
import type { Badge } from "../types/Badge";

import fetchApi from "../api/fetch";

export async function findAllGroups<User>(userData: User): Promise<any> {
    const groupsData = await fetchApi('GET', 'groups/', undefined, {
        headers: {
            Authorization: `Bearer ${(userData as any).token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (groupsData.success && groupsData.data) {
        return groupsData.data;
    }
}

export const Group: React.FC<{ groupId: number }> = ({ groupId }) => {
    const [groupName, setGroupName] = React.useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchGroupName = async () => {
            const groups = await findAllGroups(user);
            const groupName = groups.find((group: any) => group.id === groupId)?.name;
            setGroupName(groupName || '');
        };

        fetchGroupName();
    }, [groupId, user]);

    return <span>{groupName}</span>;
}

export async function findGroupId(groupName: string, userData: any): Promise<number | undefined> {
    const groups = await findAllGroups(userData);
    const group = groups.find((group: any) => group.name === groupName);
    return group ? group.id : undefined;
}

export async function findGroupName(groupId: number, userData: any): Promise<string | undefined> {
    const groups = await findAllGroups(userData);
    const group = groups.find((group: any) => group.id === groupId);
    return group ? group.name : undefined;
}

export const getGroupBadgeClassNames: (groupText: any) => string = (groupText: any): string => {
    const badge: Badge | undefined = groupBadges.find(badge => badge.text === groupText);
    return badge ? badge.classNames : '';
};