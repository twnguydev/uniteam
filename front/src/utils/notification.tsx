import React from 'react';
import { Notification } from '../types/Notification';
import fetchApi from '../api/fetch';

export async function findAllNotifications(UserData: any): Promise<Notification[]> {
    const notifications = await fetchApi('GET', 'notifications/', undefined, {
        headers: {
            Authorization: `Bearer ${UserData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (notifications.success && notifications.data) {
        const notificationsForUser = (notifications.data as Notification[])
            .filter((notification: Notification): boolean => notification.userId === UserData.id);
        return notificationsForUser;
    } else {
        return [];
    }
}

export async function findMaxNotificationId(userData: any): Promise<number | undefined> {
    const notifications: Notification[] = await findAllNotifications(userData);
    return notifications.length > 0 ? Math.max(...notifications.map((notification: Notification) => notification.id)) : undefined;
}

export async function createNotification(userData: any, notification: Notification): Promise<boolean | unknown> {
    const response = await fetchApi('POST', 'notifications/', notification, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    return response.success ? response.data : false;
}