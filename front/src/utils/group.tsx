import React, { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import fetchApi from "../api/fetch";
import { groupBadges } from "../data/badges";
import type { Badge } from "../types/Badge";

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

export const getGroupBadgeClassNames = async (groupId: number, userData: any): Promise<string> => {
    const convertedGroupName: string = (await findGroupName(groupId, userData)) ?? '';
    const badge: Badge | undefined = groupBadges.find(badge => badge.text === convertedGroupName);
    return badge ? badge.classNames : '';
};

export async function countEventsInGroup(groupId: number, userData: any): Promise<number> {
    const events: any = await fetchApi('GET', 'events/', undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return events.data.filter((event: any): boolean => event.groupId === groupId).length;
}

export async function countUsersInGroup(groupId: number, userData: any): Promise<number> {
    const users: any = await fetchApi('GET', 'users/', undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return users.data.filter((user: any): boolean => user.groupId === groupId).length;
}