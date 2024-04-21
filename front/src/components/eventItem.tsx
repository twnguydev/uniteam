import React, { useEffect, useState } from 'react';

import { useAuth } from '../auth/AuthContext';

import type { Event } from '../types/Event';
import fetchApi from '../api/fetch';

import { formatDate, formatDateHour } from '../utils/date';

import { Badge } from '../utils/badge';
import { Group } from '../utils/group';
import { Room } from '../utils/room';

import statusData from '../data/status.json';

export const EventItem: React.FC<Event> = ({ id, statusId, dateStart, dateEnd, name, roomId, groupId, hostName, description }) => {
    const { user } = useAuth();
    const [selectedStatusId, setSelectedStatusId] = useState(statusId);
    const [isOpen, setIsOpen] = useState(false);

    const updateStatusData = async () => {
        try {
            const response = await fetchApi('PUT', `events/${id}`, {
                id: id,
                name: name,
                dateStart: dateStart,
                dateEnd: dateEnd,
                roomId: roomId,
                groupId: groupId,
                hostName: hostName,
                description: description,
                statusId: selectedStatusId,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                console.log('Statut de l\'événement mis à jour avec succès !');
            } else {
                console.error('Échec de la mise à jour du statut de l\'événement.');
            }
        } catch (error) {
            console.error('Une erreur est survenue lors de la mise à jour du statut de l\'événement :', error);
        }
    };

    useEffect(() => {
        updateStatusData();
    }, [selectedStatusId]);

    const toggleAccordion = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const formattedStartDate: string = formatDate(dateStart.toString());
    const formattedEndDate: string = formatDateHour(dateEnd.toString());

    return (
        <div className="relative">
            <div className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={toggleAccordion}>
                    <p className="w-55 text-lg font-normal text-gray-500 dark:text-gray-400 text-left">
                        {formattedStartDate} - {formattedEndDate}
                    </p>
                    <h3 className="text-lg ml-10 font-semibold text-gray-900 dark:text-white">
                        <a href="#" className="hover:underline">
                            {name}
                        </a>
                    </h3>
                </div>
                <div>
                {user && user.is_admin && (
                    <select
                        className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                        value={selectedStatusId}
                        onChange={(e) => setSelectedStatusId(parseInt(e.target.value))}
                    >
                        {statusData.status.map(({ id, name }) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </select>
                )}
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
                                        <Badge Id={statusId} Name={'status'} UserData={user} />
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