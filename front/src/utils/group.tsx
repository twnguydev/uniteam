import React from "react";
import groupData from "../data/groups.json";

export const Group: React.FC<{ groupId: number }> = ({ groupId }) => {
    const groupName = groupData.groups.find((group) => group.id === groupId)?.name;

    return <span>{groupName}</span>;
}