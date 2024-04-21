import React from "react";
import groupData from "../data/groups.json";

import { groupBadges } from "../data/badges";

import type { Badge } from "../types/Badge";

// import fetchApi from "../api/fetch";

// export const groupData = async (): Promise<unknown> => {
//     const groupData = await fetchApi('GET', 'groups');
//     return groupData.data;
// };

export const Group: React.FC<{ groupId: number }> = ({ groupId }) => {
    const groupName = groupData.groups.find((group) => group.id === groupId)?.name;

    return <span>{groupName}</span>;
}

export function findGroupId(groupName: string): number | undefined {
    const group = groupData.groups.find(group => group.name === groupName);
    return group ? group.id : undefined;
}

export function findGroupName(groupId: number): string | undefined {
    const group = groupData.groups.find(group => group.id === groupId);
    return group ? group.name : undefined;
}

export const getGroupBadgeClassNames: (groupText: any) => string = (groupText: any): string => {
    const badge: Badge | undefined = groupBadges.find(badge => badge.text === groupText);
    return badge ? badge.classNames : '';
};