import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Event } from '../types/Event';
import { EventItem } from './item/EventItem';
import { findAllEvents } from '../utils/event';
import { getEvents } from '../utils/participant';
import { Pagination } from './Pagination';

export const Schedule: React.FC = (): JSX.Element => {
    const { user } = useAuth();
    const [events, setEvents] = React.useState<Event[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const [currentPageEvents, setCurrentPageEvents] = React.useState<Event[]>([]);
    const [selectedLimit, setSelectedLimit] = React.useState<string>('5');

    useEffect((): void => {
        const fetchEvents = async (): Promise<void> => {
            try {
                if (user && user.lastName) {
                    const response: Event[] = await findAllEvents(user);
                    const eventsWithHost: Event[] = response.filter((event: Event): boolean => event.hostName === user.lastName);
                    const eventsInvitedTo: Event[] = await getEvents(user, user.id);
                    
                    if (eventsWithHost && eventsInvitedTo) {
                        const allEvents: Event[] = [...eventsWithHost, ...eventsInvitedTo];
                        allEvents.sort((a: Event, b: Event): number => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
                        setEvents(allEvents);
                    } else if (eventsWithHost) {
                        eventsWithHost.sort((a: Event, b: Event): number => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
                        setEvents(eventsWithHost);
                    } else if (eventsInvitedTo) {
                        eventsInvitedTo.sort((a: Event, b: Event): number => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
                        setEvents(eventsInvitedTo);
                    } else {
                        setEvents([]);
                    }
                }
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchEvents();
    }, [user]);

    useEffect((): void => {
        const start: number = (page - 1) * parseInt(selectedLimit);
        const end: number = start + parseInt(selectedLimit);
        
        const totalPages: number = Math.ceil(events.length / parseInt(selectedLimit));

        if (page < 1 || page > totalPages) {
            setPage(prevPage => Math.max(1, Math.min(totalPages, prevPage)));
            return;
        }
    
        setCurrentPageEvents(events.slice(start, end));
    }, [page, events, selectedLimit]);

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedLimit(event.target.value);
    };

    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                {user ? (
                    <div className="flex flex-col items-center gap-4 mb-20 sm:mt-8 lg:mt-0">
                        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col items-center pb-10 mt-10">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Groupe {user.groupName}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Connectez-vous pour accéder à votre compte.</p>
                )}
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                        Événements à venir
                    </h2>

                    <div className="mt-4">
                        <div className="inline-flex items-center text-lg font-medium text-primary-600 text-blue-500">
                            Il s'agit des événements à venir que vous avez planifiés ou auxquels vous participez.
                        </div>
                    </div>
                </div>
                {events.length > 0 && (
                    <div className="flex items-end justify-end w-3xl mt-6">
                        <div className="flex">
                            <form className="mt-6">
                                <label htmlFor="underline_select" className="sr-only">Limite</label>
                                <select
                                    id="underline_select"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                    value={selectedLimit}
                                    onChange={handleLimitChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
                            </form>
                        </div>
                    </div>
                )}
                <div className="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentPageEvents.map(event => (
                            <EventItem key={event.id} {...event} />
                        ))}
                        {events.length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                Aucun événement à venir.
                            </div>
                        )}
                    </div>
                </div>
                {events.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-4">
                        <Pagination page={page} setPage={setPage} total={events.length} limit={parseInt(selectedLimit)} />
                    </div>
                )}
            </div>
        </section>
    );
};