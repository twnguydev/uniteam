import React, { useState, useEffect } from 'react';

import type { Event } from '../../types/Event';
import { formatDate } from '../../utils/date';
import { findUserLastname } from '../../utils/user';
import { findGroupName } from '../../utils/group';
import { findRoomName } from '../../utils/room';
import { findAllEvents } from '../../utils/event';

export const ListEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        setEvents(findAllEvents());
    }, []);

    return (
        <section>
            <div className="flex items-center justify-between pb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Liste des événements</h4>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Titre</th>
                            <th scope="col" className="px-6 py-3">Date début</th>
                            <th scope="col" className="px-6 py-3">Date fin</th>
                            <th scope="col" className="px-6 py-3">Salle</th>
                            <th scope="col" className="px-6 py-3">Créateur</th>
                            <th scope="col" className="px-6 py-3">Groupe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {event.name}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {formatDate(event.dateStart.toString())}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {formatDate(event.dateEnd.toString())}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {findRoomName(event.roomId) || "Indéfinie"}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {findUserLastname(event.hostId)}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {findGroupName(event.groupId) || 'Non spécifié'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
