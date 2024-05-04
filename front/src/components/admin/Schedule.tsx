import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { ListUsers } from './read/ListUsers';
import { ListEvents } from './read/ListEvents';
import { ListRooms } from './read/ListRooms';
import { findAllEvents } from '../../utils/event';
import { findAllGroups, findGroupId } from '../../utils/group';
import { findAllStatus, getStatusId } from '../../utils/status';
import type { Group } from '../../types/group';
import type { User } from '../../types/user';
import type { Status } from '../../types/status';
import { set } from 'date-fns';

export const ScheduleAdmin: React.FC = () => {
    const { user, logout } = useAuth();

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [loadedStatus, setLoadedStatus] = useState<Status[]>([]);

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroup(event.target.value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            if (!user) {
                return;
            }

            const fetchedGroups = await findAllGroups(user);
            setLoadedGroups(fetchedGroups || []);

            const fetchedStatus = await findAllStatus(user);
            setLoadedStatus(fetchedStatus || []);

            const selectedGroupId: number | undefined = await findGroupId(selectedGroup, user);
            const selectedStatusId: number | undefined = await getStatusId(selectedStatus, user);

            const allEvents: any = await findAllEvents(user);
            let filteredEvents: any = allEvents.filter((event: any): boolean => {
                const groupMatch: boolean = selectedGroupId ? event.groupId === selectedGroupId : true;
                const statusMatch: boolean = selectedStatusId ? event.statusId === selectedStatusId : true;
                return groupMatch && statusMatch;
            });
            setEvents(filteredEvents || []);
            setUsers(filteredEvents || []);
        };

        fetchData();
    }, [user, selectedGroup, selectedStatus]);

    const toggleUserModal = (): void => {
        setIsUserModalOpen(!isUserModalOpen);
        setIsEventModalOpen(false);
        setIsGroupModalOpen(false);
        setIsRoomModalOpen(false);
    };

    const toggleEventModal = (): void => {
        setIsEventModalOpen(!isEventModalOpen);
        setIsUserModalOpen(false);
        setIsGroupModalOpen(false);
        setIsRoomModalOpen(false);
    };

    const toggleGroupModal = (): void => {
        setIsGroupModalOpen(!isGroupModalOpen);
        setIsRoomModalOpen(false);
        setIsUserModalOpen(false);
        setIsEventModalOpen(false);
    };

    const toggleRoomModal = (): void => {
        setIsRoomModalOpen(!isRoomModalOpen);
        setIsGroupModalOpen(false);
        setIsUserModalOpen(false);
        setIsEventModalOpen(false);
    };

    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 gap-6 mt-8 mb-20 sm:grid-cols-2 place-content-center">
                    <div className="w-3xl mx-auto my-auto text-center">
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                            Espace administrateur
                        </h2>
                        <div className="mt-4">
                            <div className="inline-flex items-center text-lg font-medium text-primary-600 text-blue-500">
                                Il vous permet de gérer toute l'architecture de votre infrastructure UniTeam.
                            </div>
                        </div>
                    </div>
                    {user ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex flex-col items-center py-10 px-10">
                                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h5>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Groupe {user.groupName}</span>
                                    {user.is_admin && (
                                        <span className="text-sm mt-8 text-gray-500 dark:text-gray-400">Administrateur</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Connectez-vous pour accéder à votre compte.</p>
                    )}
                </div>
                <div className="flex items-center justify-center gap-4 mt-8">
                    <ul className="flex text-sm font-medium cursor-pointer text-center text-gray-500 rounded-lg shadow dark:divide-gray-700 dark:text-gray-400">
                        <li className="focus-within:z-10" onClick={toggleEventModal}>
                            <div className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 rounded-l-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Gestion des événements</div>
                        </li>
                        <li className="focus-within:z-10" onClick={toggleUserModal}>
                            <div className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Gestion des utilisateurs</div>
                        </li>
                        <li className="focus-within:z-10" onClick={toggleGroupModal}>
                            <div className="inline-block w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Gestion des groupes</div>
                        </li>
                        <li className="focus-within:z-10" onClick={toggleRoomModal}>
                            <div className="inline-block w-full p-4 bg-white border-s-0 border-gray-200 dark:border-gray-700 rounded-r-lg hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">Gestion des salles</div>
                        </li>
                    </ul>
                </div>
                {isEventModalOpen && (
                    <div className="flex items-end justify-between w-3xl mt-6">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4">
                            Ajouter un événement
                        </button>
                        <div className="flex">
                            <form className="mt-6">
                                <label htmlFor="underline_select" className="sr-only">Statut</label>
                                <select
                                    id="underline_select"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                >
                                    <option value="">Filtrer par status</option>
                                    {loadedStatus.map(status => (
                                        <option key={status.id} value={status.name}>{status.name}</option>
                                    ))}
                                </select>
                            </form>
                            <form className="mt-6">
                                <label htmlFor="underline_select" className="sr-only">Groupe</label>
                                <select
                                    id="underline_select"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                    value={selectedGroup}
                                    onChange={handleGroupChange}
                                >
                                    <option value="">Filtrer par groupe de travail</option>
                                    {loadedGroups.map(group => (
                                        <option key={group.id} value={group.name}>{group.name}</option>
                                    ))}
                                </select>
                            </form>
                        </div>
                    </div>
                )}
                {isUserModalOpen && (
                    <div className="flex items-end justify-between w-3xl mt-6">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4">
                            Ajouter un utilisateur
                        </button>
                        <div className="flex">
                            <form className="mt-6">
                                <label htmlFor="underline_select" className="sr-only">Statut</label>
                                <select
                                    id="underline_select"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                >
                                    <option value="">Filtrer par status</option>
                                    <option value="true">Administrateur</option>
                                    <option value="false">Membre</option>
                                </select>
                            </form>
                            <form className="mt-6">
                                <label htmlFor="underline_select" className="sr-only">Groupe</label>
                                <select
                                    id="underline_select"
                                    className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight text-gray-200"
                                    value={selectedGroup}
                                    onChange={handleGroupChange}
                                >
                                    <option value="">Filtrer par groupe de travail</option>
                                    {loadedGroups.map(group => (
                                        <option key={group.id} value={group.name}>{group.name}</option>
                                    ))}
                                </select>
                            </form>
                        </div>
                    </div>
                )}
                {isRoomModalOpen && (
                    <div className="flex items-end justify-between w-3xl mt-6">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4">
                            Ajouter une salle
                        </button>
                    </div>
                )}
                {isUserModalOpen && <ListUsers selectedGroup={selectedGroup} selectedStatus={selectedStatus} />}
                {isEventModalOpen && <ListEvents selectedGroup={selectedGroup} selectedStatus={selectedStatus} />}
                {/* {isGroupModalOpen && <ListGroups />} */}
                {isRoomModalOpen && <ListRooms />}
            </div>
        </section>
    );
};
