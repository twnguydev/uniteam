import React from 'react';
import { useAuth } from '../auth/AuthContext';

import type { Event } from '../types/Event';
import { EventItem } from './eventItem';
import eventData from '../data/events.json';

export const Schedule: React.FC = () => {
    const { user } = useAuth();
    const events: Event[] = eventData.events.map(event => ({
        ...event,
        creatorId: user?.id || 0,
    }));

    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                {user ? (
                    <div className="flex flex-col items-center gap-4 mb-20 sm:mt-8 lg:mt-0">
                        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col items-center pb-10 mt-10">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstname} {user.lastname}</h5>
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
                            Il s'agit des événements à venir que vous avez planifiés.
                        </div>
                    </div>
                </div>

                <div className="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {events.map(event => (
                            <EventItem key={event.id} {...event} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};