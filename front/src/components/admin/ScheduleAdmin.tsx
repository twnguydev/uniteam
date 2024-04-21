import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

import { ListUsersAdmin } from './ListUsersAdmin';
import { ListEventsAdmin } from './ListEventsAdmin';

export const ScheduleAdmin: React.FC = () => {
    const { user, logout } = useAuth();

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

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
                    {isUserModalOpen && <ListUsersAdmin />}
                    {isEventModalOpen && <ListEventsAdmin />}
                </div>
            </div>
        </section>
    );
};
