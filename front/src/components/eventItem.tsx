import React, { useState } from 'react';

import type { Event } from '../types/Event';

import { Badge } from '../utils/badge';
import { Room } from '../utils/room';
import { Group } from '../utils/group';
import { formatDate, formatDateHour } from '../utils/date';

export const EventItem: React.FC<Event> = ({ statusId, hostName, dateStart, dateEnd, name, description, roomId, groupId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const formattedStartDate: string = formatDate(dateStart.toString());
    const formattedEndDate: string = formatDateHour(dateEnd.toString());

    return (
        <div className="relative">
            <div className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center cursor-pointer" onClick={toggleAccordion}>
                    <Badge statusId={statusId} />
                    <p className="w-55 text-lg font-normal text-gray-500 dark:text-gray-400 text-left">
                        {formattedStartDate} - {formattedEndDate}
                    </p>
                    <h3 className="text-lg ml-10 font-semibold text-gray-900 dark:text-white">
                        <a href="#" className="hover:underline">
                            {name}
                        </a>
                    </h3>
                </div>
            </div>
            <div style={{ height: isOpen ? 'auto' : '0', overflow: 'hidden', transition: 'height 0.3s ease-in-out' }}>
                {isOpen && (
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Initiateur
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Salle
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Groupe
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {hostName ? `${hostName}` : 'Inconnu'}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Room roomId={roomId} />
                                    </th>
                                    <td className="px-6 py-4">
                                        {description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Group groupId={groupId} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge statusId={statusId} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};