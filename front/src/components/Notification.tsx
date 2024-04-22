import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import fetchApi from '../api/fetch';
import type { Event } from '../types/Event';

export const NotificationNavbar = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const eventsRef = useRef<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        if (user && user.lastName) {
          const response = await fetchApi<Event[]>('GET', 'events/', undefined, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (response.success && response.data) {
            const eventsWithHost: Event[] = response.data.filter(event => event.hostName === user.lastName);
            eventsRef.current = eventsWithHost;
          }
        }
      } catch (error) {
        console.error('An error occurred while fetching events:', error);
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    const detectStatusChangeOnEvents = async (): Promise<void> => {
      try {
        const response = await fetchApi('GET', 'events/', undefined, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.success && response.data) {
          const updatedEvents: Event[] = response.data as Event[];
          updatedEvents.forEach((event: Event) => {
            const existingEvent = eventsRef.current.find(e => e.id === event.id);
            if (existingEvent && existingEvent.statusId !== event.statusId) {
              setNotifications(prevNotifications => [
                { message: `Le statut de l'événement "${event.name}" a changé.` },
                ...prevNotifications,
              ]);
            }
          });
          eventsRef.current = updatedEvents;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications :', error);
      }
    };

    detectStatusChangeOnEvents();
  }, [user?.token, eventsRef.current]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <div className="relative group inline-block" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition duration-200 relative" aria-haspopup="true">
          Notifications
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-block bg-red-500 text-white text-xs font-semibold px-1 rounded-full">{notifications.length}</span>
          )}
        </div>
        {isDropdownOpen && notifications.length > 0 && (
          <div className="absolute z-50 right-50 w-96 bg-gray-800 border border-gray-700 rounded-md shadow-md">
            {notifications.map((notification: any, index: number) => (
              <Link to={`/member/${user?.id}/schedule`} key={index} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
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