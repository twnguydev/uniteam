import React, { useState, useEffect } from 'react';

import { findAllUsers } from '../../utils/user';
import { findGroupName } from '../../utils/group';
import type { User } from '../../types/user';

export const ListUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchedUsers = findAllUsers();
        setUsers(fetchedUsers);
    }, []);

    return (
        <section>
            <div className="flex items-center justify-between pb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Liste des utilisateurs</h4>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Prénom</th>
                            <th scope="col" className="px-6 py-3">Nom</th>
                            <th scope="col" className="px-6 py-3">Mail</th>
                            <th scope="col" className="px-6 py-3">Groupe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
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
        </section>
    );
}
