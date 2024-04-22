import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';

import { ListUsersAdmin } from './ListUsersAdmin';
import { ListEventsAdmin } from './ListEventsAdmin';

import { findAllEvents } from '../../utils/event';

import { findAllGroups, findGroupId } from '../../utils/group';

import type { Group } from '../../types/group';
import type { User } from '../../types/user';

export const ScheduleAdmin: React.FC = () => {
    const { user, logout } = useAuth();

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [events, setEvents ] = useState<Event[]>([]);

    const [selectedGroup, setSelectedGroup] = useState<string>('');

    const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGroup(event.target.value);
        console.log(event.target.value);
    };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            if (!user) {
                return;
            }

            const selectedGroupId: number | undefined = await findGroupId(selectedGroup, user);
            const allEvents: any = await findAllEvents<User>(user);
            let filteredEvents: any = allEvents;
    
            if (selectedGroup) {
                filteredEvents = allEvents.filter((event: any) => event.groupId === selectedGroupId);
            }
            setEvents(filteredEvents || []);
    
            const fetchedGroups: any = await findAllGroups<User>(user);
            setLoadedGroups(fetchedGroups || []);
        };
    
        fetchData();
    }, [user, selectedGroup]);


    const toggleUserModal = (): void => {
        setIsUserModalOpen(true);
        setIsEventModalOpen(false);
    };

    const toggleEventModal = (): void => {
        setIsEventModalOpen(true);
        setIsUserModalOpen(false);
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
                                {user.is_admin && (
                                    <span className="text-sm mt-8 text-gray-500 dark:text-gray-400">Administrateur</span>
                                )}
                                <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-10">
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Connectez-vous pour accéder à votre compte.</p>
                )}
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                        Espace administrateur
                    </h2>

                    <div className="mt-4">
                        <div className="inline-flex items-center text-lg font-medium text-primary-600 text-blue-500">
                            Il vous permet de gérer les événements et les utilisateurs.
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-10" onClick={toggleEventModal}>
                        Afficher les événements
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4 ml-4" onClick={toggleUserModal}>
                        Afficher les utilisateurs
                    </button>
                    <form className="max-w-sm mx-auto mt-6">
                        <label htmlFor="underline_select" className="sr-only">Groupe</label>
                        <select
                            id="underline_select"
                            className="block appearance-none w-full bg-gray-700 border-2 border-gray-900 hover:border-gray-500 px-2 py-1.5 pr-4 rounded-lg leading-tight text-gray-200"
                            value={selectedGroup}
                            onChange={handleGroupChange}
                        >
                        <option value="">Sans filtre</option>
                            {loadedGroups.map(group => (
                                <option key={group.id} value={group.name}>{group.name}</option>
                            ))}
                            </select>
                        </form>
                    {isUserModalOpen && <ListUsersAdmin />}
                    {isEventModalOpen && <ListEventsAdmin selectedGroup={selectedGroup} />}
                </div>
            </div>
        </section>
    );
};