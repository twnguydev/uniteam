import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import fetchApi from '../../api/fetch';
import type { Event } from '../../types/Event';
import type { ListEventsAdminProps } from '../../types/admin';
import { EventItem } from '../eventItem';
import { findGroupId } from '../../utils/group';
import { getStatusId } from '../../utils/status';

export const ListEventsAdmin: React.FC<ListEventsAdminProps> = ({ selectedGroup, selectedStatus }) => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async (): Promise<void> => {
            try {
                const groupId: number | undefined = selectedGroup ? await findGroupId(selectedGroup, user) : undefined;
                const statusId: number | undefined = selectedStatus ? await getStatusId(selectedStatus, user) : undefined;

                const response = await fetchApi<Event[]>('GET', 'events/', undefined, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (response.success && response.data) {
                    let filteredEvents: any = response.data;
                    if (groupId) {
                        filteredEvents = filteredEvents.filter((event: Event): boolean => event.groupId === groupId);
                    }
                    if (statusId) {
                        filteredEvents = filteredEvents.filter((event: Event): boolean => event.statusId === statusId);
                    }
                    setEvents(filteredEvents);
                    setEvents(filteredEvents);
                }
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchEvents();
    }, [selectedGroup, selectedStatus, user]);  

    return (
        <section>
            <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {events.map(event => (
                        <EventItem key={event.id} {...event} />
                    ))}
                </div>
            </div>
        </section>
    );
}