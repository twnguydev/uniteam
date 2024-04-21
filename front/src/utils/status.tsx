import React from 'react';
import statusData from '../data/status.json';

import fetchApi from '../api/fetch';

// export const statusData = async (): Promise<unknown> => {
//     const statusData = await fetchApi('GET', 'status');
//     return statusData.data;
// }

export const Status: React.FC<{ statusId: number }> = ({ statusId }) => {
    const statusName = statusData.status.find((status) => status.id === statusId)?.name;

    return <span>{statusName}</span>;
}

export function getStatusId(statusName: string): number | undefined {
    const status: { id: number; name: string } | undefined = statusData.status.find(status => status.name === statusName);
    return status ? status.id : undefined;
}

export function getStatusName(statusId: number): string | undefined {
    const status: { id: number; name: string } | undefined = statusData.status.find(status => status.id === statusId);
    return status ? status.name : undefined;
}