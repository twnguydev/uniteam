import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import fetchApi from '../../api/fetch';
import type { Event } from '../../types/Event';
import type { ListEventsAdminProps } from '../../types/admin';
import { EventItem } from '../eventItem';
import { findGroupId } from '../../utils/group';

export const ListEventsAdmin: React.FC<ListEventsAdminProps> = ({ selectedGroup }) => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const groupId = selectedGroup ? await findGroupId(selectedGroup, user) : undefined;

                const response = await fetchApi<Event[]>('GET', 'events/', undefined, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (response.success && response.data) {
                    const filteredEvents = groupId
                        ? response.data.filter(event => event.groupId === groupId)
                        : response.data;
                    setEvents(filteredEvents);
                }
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchEvents();
    }, [selectedGroup, user]);  

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