import React, { useState, useEffect } from 'react';

import { useAuth } from '../../auth/AuthContext';

import type { Event } from '../../types/Event';

import { EventItem } from '../eventItem';
import fetchApi from '../../api/fetch';

export const ListEventsAdmin: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetchApi<Event[]>('GET', 'events/', undefined, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (response.success && response.data) {
                    setEvents(response.data);
                }
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchEvents();
    });

    return (
        <section>
            <div className="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {events.map(event => (
                        <EventItem key={event.id} {...event} />
                    ))}
                </div>
            </div>
        </section>
    );
}
