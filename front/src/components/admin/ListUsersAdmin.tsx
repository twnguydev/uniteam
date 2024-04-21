import React, { useState, useEffect } from 'react';

import { useAuth } from '../../auth/AuthContext';

import { UserItem } from '../userItem';
import fetchApi from '../../api/fetch';

import type { User } from '../../types/user';

export const ListUsersAdmin: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetchApi<User[]>('GET', 'users', undefined, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (response.success && response.data) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('An error occurred while fetching events:', error);
            }
        };

        fetchUsers();
    });

    return (
        <section>
            <div className="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <UserItem key={user.id} {...user} />
                    ))}
                </div>
            </div>
        </section>
    );
}
