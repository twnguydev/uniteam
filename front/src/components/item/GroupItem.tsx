import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import fetchApi, { ApiResponse } from '../../api/fetch';
import { useAuth } from '../../auth/AuthContext';
import type { Group } from '../../types/Group';
import { countUsersInGroup, countEventsInGroup } from '../../utils/group';

export const GroupItem: React.FC<{ group: Group }> = ({ group }): JSX.Element => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [numMembers, setNumMembers] = useState<number | null>(null);
    const [numEvents, setNumEvents] = useState<number | null>(null);
    const [redirect, setRedirect] = useState<boolean>(false);

    const deleteGroup = async (): Promise<void> => {
        const response: ApiResponse<Group> = await fetchApi('DELETE', `groups/${group.id}`, undefined, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log(response);

        if (response.success) {
            setRedirect(true);
        } else {
            console.error('An error occurred while deleting the group.');
        }
    }

    useEffect((): void => {
        const fetchNumMembers = async (): Promise<void> => {
            if (user) {
                const count: number = await countUsersInGroup(group.id, user);
                setNumMembers(count);
            }
        };

        const fetchNumEvents = async (): Promise<void> => {
            if (user) {
                const count: number = await countEventsInGroup(group.id, user);
                setNumEvents(count);
            }
        }

        fetchNumMembers();
        fetchNumEvents();
    }, [user, group.id]);

    const toggleAccordion = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    if (redirect) {
        return <Navigate to={`/admin/schedule?success=true&type=group&message=Le groupe de travail ${group.name} a été supprimé.`} />;
    }

    return (
        <div className="relative">
            <div className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row cursor-pointer sm:items-center justify-between" onClick={toggleAccordion}>
                <div className="flex items-center cursor-pointer">
                    <h3 className="text-lg ml-10 font-semibold text-gray-900 dark:text-white">
                        {group.name}
                    </h3>
                </div>
                <div>
                    {numMembers !== null && numMembers > 0 ? (
                        <p className="text-lg mr-10 font-semibold text-gray-900 dark:text-gray-300">{numMembers} membre{numMembers > 1 ? 's' : ''}</p>
                    ) : (
                        <p className="text-lg mr-10 font-semibold text-gray-900 dark:text-gray-300">Aucun membre</p>
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
                                        Nombre de membres
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nombre d'événements
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {numMembers !== null ? numMembers : 'Chargement...'}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {numEvents !== null ? numEvents : 'Chargement...'}
                                    </th>
                                    <td className="px-6 py-4">
                                        <button
                                            className="text-sm text-red-500 underline ml-5"
                                            onClick={deleteGroup}
                                        >
                                            Supprimer
                                        </button>
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