import React, { useState } from 'react';
import fetchApi, { ApiResponse } from '../../api/fetch';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import type { User } from '../../types/user';
import { Badge } from '../../utils/badge';
import { set } from 'date-fns';

export const UserItem: React.FC<User> = ({ id, firstName, lastName, email, isAdmin, groupId }: User): JSX.Element => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [redirect, setRedirect] = useState<boolean>(false);

    const deleteUser = async (): Promise<void> => {
        try {
            const response: ApiResponse<User> = await fetchApi<User>('DELETE', `users/${id}`, undefined, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                setRedirect(true);
            }
        } catch (error) {
            console.error('An error occurred while deleting user:', error);
        }
    }

    const toggleAccordion = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const adminText: 'Administrateur' | 'Membre' = isAdmin ? 'Administrateur' : 'Membre';

    if (redirect) {
        return <Navigate to={`/admin/schedule?success=true&type=user&message=L'utilisateur ${firstName} ${lastName} a été supprimé.`} />;
    }

    return (
        <div className="relative">
            <div className="flex flex-col gap-2 py-4 cursor-pointer sm:gap-6 sm:flex-row sm:items-center justify-between" onClick={toggleAccordion}>
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
                                    <th scope="col" className="px-6 py-3">
                                        Actions
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
                                    <td className="px-6 py-4">
                                        <button
                                            className="text-sm text-red-500 underline ml-5"
                                            onClick={deleteUser}
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