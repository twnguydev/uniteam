import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Notification } from '../types/notification';
import { findNotificationsForUser, deleteNotifications } from '../utils/notification';

export const NotificationNavbar = (): JSX.Element => {
    const { user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const clearNotifications = async (): Promise<void> => {
        const response: boolean = await deleteNotifications(user);
        if (response) {
            setNotifications([]);
        } else {
            console.error('Une erreur est survenue lors de la suppression des notifications.');
        }
    };

    useEffect((): (() => void) | undefined => {
        if (!user) return;

        const fetchNotifications = async (): Promise<void> => {
            const response: Notification[] = await findNotificationsForUser(user);
            if (response) {
                setNotifications(response);
            } else {
                console.error('Une erreur est survenue lors de la récupération des notifications.' + response)
            }
        };

        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 15000);

        return (): void => clearInterval(intervalId);
    }, [user])

    return (
        <>
            <div className="relative group inline-block" onClick={(): void => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="text-white cursor-pointer hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition duration-200 relative" aria-haspopup="true">
                    Notifications
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-block bg-red-500 text-white text-xs font-semibold px-1 rounded-full">{notifications.length}</span>
                    )}
                </div>
                {isDropdownOpen && notifications.length > 0 && (
                    <div className="absolute z-50 right-50 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-md">
                        {notifications.map((notification: any, index: number): JSX.Element => (
                            <Link to="/member/schedule" key={index} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                                {notification.message}
                            </Link>
                        ))}
                        <button onClick={clearNotifications} className="block text-sm w-full px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700">Effacer les notifications</button>
                    </div>
                )}
            </div>
        </>
    );
};