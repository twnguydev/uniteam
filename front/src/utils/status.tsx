import React, { useEffect, useState } from 'react';

import { useAuth } from '../auth/AuthContext';
import fetchApi from '../api/fetch';

export async function findAllStatus<User>(userData: User): Promise<any> {
    const statusData = await fetchApi('GET', 'rooms/', undefined, {
        headers: {
            Authorization: `Bearer ${(userData as any).token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (statusData.success && statusData.data) {
        return statusData.data;
    }
}

export const Status: React.FC<{ statusId: number }> = ({ statusId }) => {
    const [statusName, setStatusName] = useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchStatusName = async () => {
            const statuses = await findAllStatus(user);
            const status = statuses.find((status: any): boolean => status.id === statusId);
            if (status) {
                setStatusName(status.name);
            }
        };

        fetchStatusName();
    }, [statusId, user]);

    return <span>{statusName}</span>;
}

export async function getStatusId(statusName: string, userData: any): Promise<number | undefined> {
    const statuses = await findAllStatus(userData);
    const status = statuses.find((status: any): boolean => status.name === statusName);
    return status ? status.id : undefined;
}

export async function getStatusName(statusId: number, userData: any): Promise<string | undefined> {
    const statuses = await findAllStatus(userData);
    const status = statuses.find((status: any): boolean => status.id === statusId);
    return status ? status.name : undefined;
}