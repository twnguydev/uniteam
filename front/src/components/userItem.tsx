import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { User } from '../types/user';

import { Badge } from '../utils/badge';

export const UserItem: React.FC<User> = ({ firstName, lastName, email, is_admin, groupId }: User) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const adminText: 'Admin' | 'Membre' = is_admin ? 'Admin' : 'Membre';

    return (
        <div className="relative">
            <div className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center justify-between" onClick={toggleAccordion}>
                <div className="flex items-center cursor-pointer">
                    <h3 className="text-lg ml-10 font-semibold text-gray-900 dark:text-white">
                        {firstName} {lastName}
                    </h3>
                </div>
                <div>
                    <Badge Id={groupId} Name={'group'} UserData={user} />
                </div>
            </div>
            <div style={{ height: isOpen ? 'auto' : '0', overflow: 'hidden', transition: 'height 0.3s ease-in-out' }}>
                {isOpen && (
                    <div className="relative overflow-x-auto">
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
                                        E-mail
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Groupe
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {firstName}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {lastName}
                                    </th>
                                    <td className="px-6 py-4">
                                        <a href={`mailto:${email}`} className="hover:underline">
                                            {email}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        {adminText}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge Id={groupId} Name={'group'} UserData={user} />
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