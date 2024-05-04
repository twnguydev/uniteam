import { Notification } from '../types/Notification';
import fetchApi from '../api/fetch';

export async function findAllNotifications(userData: any): Promise<Notification[]> {
    const notifications = await fetchApi('GET', 'notifications/', undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (notifications.success && notifications.data) {
        return notifications.data as Notification[];
    } else {
        return [];
    }
}

export async function findNotificationsForUser(userData: any): Promise<Notification[]> {
    const notifications = await fetchApi('GET', `notifications/user/${userData.id}`, undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (notifications.success && notifications.data) {
        return notifications.data as Notification[];
    } else {
        return [];
    }
}

export async function findMaxNotificationId(userData: any): Promise<number | undefined> {
    const notifications: Notification[] = await findAllNotifications(userData);
    return notifications.length > 0 ? Math.max(...notifications.map((notification: Notification): number => notification.id)) : undefined;
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

export async function deleteNotifications(userData: any): Promise<boolean> {
    const response = await fetchApi('DELETE', `notifications/user/${userData.id}`, undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    return response.success;
}