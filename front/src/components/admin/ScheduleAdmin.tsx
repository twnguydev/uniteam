import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';

import type { Event } from '../../types/Event';
import { EventItem } from '../eventItem';
import eventData from '../../data/events.json';

import { formatDate } from '../../utils/date';

import { findAllUsers, findUserLastname } from '../../utils/user';
import type { User } from '../../types/user';

import { findGroupName } from '../../utils/group';
import { findAllEvents } from '../../utils/event';
import { findRoomName } from '../../utils/room';

export const ScheduleAdmin: React.FC = () => {
    const { user } = useAuth();
    
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const event: Event[] = eventData.events.map(event => ({
        ...event,
        creatorId: user?.id || 0,
    }));

    useEffect(() => {
        setUsers(findAllUsers());
        setEvents(findAllEvents());
    }, []);

    const toggleUserModal = () => {
        setIsUserModalOpen(!isUserModalOpen);
    };

    const toggleEventModal = () => {
        setIsEventModalOpen(!isEventModalOpen);
    };

    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                {user ? (
                    <div className="flex flex-col items-center gap-4 mb-20 sm:mt-8 lg:mt-0">
                        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col items-center pb-10 mt-10">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstname} {user.lastname}</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Groupe {user.groupName}</span>
                                {user.admin && (
                                    <span className="text-sm mt-8 text-gray-500 dark:text-gray-400">Administrateur</span>
                                )}
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
                        {event.map(event => (
                            <EventItem key={event.id} {...event} />
                        ))}
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4" onClick={toggleEventModal}>
                        Afficher les événements
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4 ml-4" onClick={toggleUserModal}>
                        Afficher les utilisateurs
                    </button>
                </div>

                {/* Modal for Users */}
                {isUserModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <div className="relative w-full max-w-2xl p-6 overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
                                <div className="flex items-center justify-between pb-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Liste des utilisateurs</h4>
                                    <button onClick={toggleUserModal} className="text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Fermer</span>
                                        &#x2715;
                                    </button>
                                </div>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Prénom
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Nom
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Mail
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Groupe
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {user.firstname}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {user.lastname}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {findGroupName(user.groupId) || 'Non spécifié'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Events */}
                {isEventModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <div className="relative w-full max-w-4xl p-8 overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
                                <div className="flex items-center justify-between pb-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Liste des événements</h4>
                                    <button onClick={toggleEventModal} className="text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">Fermer</span>
                                        &#x2715;
                                    </button>
                                </div>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Titre
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Date début
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Date fin
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Salle
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Créateur
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Groupe
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map((event) => (
                                                <tr key={event.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {event.name}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {formatDate(event.date_start.toString())}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {formatDate(event.date_end.toString())}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {findRoomName(event.roomId) || "Indéfinie"}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {findUserLastname(event.creatorId)}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {findGroupName(event.groupId) || 'Non spécifié'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
