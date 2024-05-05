import type { Notification } from '../types/notification';
import type { User } from '../types/user';
import fetchApi, { ApiResponse } from "../api/fetch";

export async function findAllNotifications(userData: any): Promise<Notification[]> {
    const notifications: ApiResponse<Notification[]> = await fetchApi('GET', 'notifications/', undefined, {
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
    const notifications: ApiResponse<Notification[]> = await fetchApi('GET', `notifications/user/${userData.id}`, undefined, {
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

export async function findLastNotificationId(userData: User): Promise<number | undefined> {
    const notifications: Notification[] = await findAllNotifications(userData);

    if (notifications.length === 0) {
        return undefined;
    }

    const maxId: number = Math.max(...notifications.map(notification => notification.id));
    return maxId;
}

export async function createNotification(userData: any, notification: Notification): Promise<any> {
    const response: ApiResponse<Notification> = await fetchApi('POST', 'notifications/', JSON.stringify(notification), {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    return response;
}

export async function deleteNotifications(userData: any): Promise<boolean> {
    const response: ApiResponse<unknown> = await fetchApi('DELETE', `notifications/user/${userData.id}`, undefined, {
        headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    return response.success;
}