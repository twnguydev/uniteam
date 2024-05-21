import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import fetchApi, { ApiResponse } from "../../../api/fetch";
import type { Event } from '../../../types/Event';
import type { ListEventsAdminProps } from '../../../types/admin';
import { EventItem } from '../../item/EventItem';
import { findGroupId } from '../../../utils/group';
import { getStatusId } from '../../../utils/status';
import { Pagination } from '../../Pagination';

export const ListEvents: React.FC<ListEventsAdminProps> = ({ selectedGroup, selectedStatus, selectedLimit, selectedDate }): JSX.Element => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [page, setPage] = useState<number>(1);
    const [currentPageEvents, setCurrentPageEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async (): Promise<void> => {
            try {
                const groupId: number | undefined = selectedGroup ? await findGroupId(selectedGroup, user) : undefined;
                const statusId: number | undefined = selectedStatus ? await getStatusId(selectedStatus, user) : undefined;

                const response: ApiResponse<Event[]> = await fetchApi<Event[]>('GET', 'events/', undefined, {
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
                    if (selectedDate) {
                        let startDate: Date;
                        let endDate: Date;
                        const currentDate: Date = new Date();
                    
                        if (selectedDate === 'last_day') {
                            startDate = new Date(currentDate);
                            startDate.setHours(0, 0, 0, 0);
                            endDate = new Date(currentDate);
                            endDate.setHours(23, 59, 59, 999);
                        } else if (selectedDate === 'last_week') {
                            const oneDayMilliseconds: number = 24 * 60 * 60 * 1000;
                            startDate = new Date(currentDate.getTime() - (7 * oneDayMilliseconds));
                            startDate.setHours(0, 0, 0, 0);
                            endDate = new Date(currentDate);
                            endDate.setHours(23, 59, 59, 999);
                        } else if (selectedDate === 'last_month') {
                            const oneDayMilliseconds: number = 24 * 60 * 60 * 1000;
                            startDate = new Date(currentDate.getTime() - (30 * oneDayMilliseconds));
                            startDate.setHours(0, 0, 0, 0);
                            endDate = new Date(currentDate);
                            endDate.setHours(23, 59, 59, 999);
                        }
                    
                        filteredEvents = filteredEvents.filter((event: any): boolean => {
                            const groupMatch: boolean = groupId ? event.groupId === groupId : true;
                            const statusMatch: boolean = statusId ? event.statusId === statusId : true;
                            const eventDate: Date = new Date(event.dateStart);
                            const dateMatch: boolean = selectedDate ? eventDate >= startDate && eventDate <= endDate : true;
                            return groupMatch && statusMatch && dateMatch;
                        });
                    }
                    console.log(filteredEvents);
                    setEvents(filteredEvents);
                }
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchEvents();
    }, [selectedGroup, selectedStatus, selectedDate, user]);

    useEffect((): void => {
        const start: number = (page - 1) * selectedLimit;
        const end: number = start + selectedLimit;
        
        const totalPages: number = Math.ceil(events.length / selectedLimit);

        if (page < 1 || page > totalPages) {
            setPage(prevPage => Math.max(1, Math.min(totalPages, prevPage)));
            return;
        }
    
        setCurrentPageEvents(events.slice(start, end));
    }, [page, events, selectedLimit, selectedDate]);

    return (
        <>
            <section>
                <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {events.length === 0 ? (
                            <div className="p-4 text-center">
                                <p className="text-gray-500 dark:text-gray-400">Aucun événement trouvé</p>
                            </div>
                        ) : (
                            currentPageEvents.map(event => (
                                <EventItem key={event.id} {...event} />
                            ))
                        )}
                    </div>
                </div>
            </section>
            <div className="max-w-3xl mx-auto mt-4">
                <Pagination page={page} setPage={setPage} total={events.length} limit={selectedLimit} />
            </div>
        </>
    );
}