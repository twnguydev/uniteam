import React from "react";
import groupData from "../data/groups.json";

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