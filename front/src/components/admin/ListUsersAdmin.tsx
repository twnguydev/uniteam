import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { UserItem } from '../userItem';
import fetchApi from '../../api/fetch';
import { findGroupId } from '../../utils/group';
import type { User } from '../../types/user';
import type { ListUsersAdminProps } from '../../types/admin';

export const ListUsersAdmin: React.FC<ListUsersAdminProps> = ({ selectedGroup })  => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async (): Promise<void> => {
            try {
                const groupId: number | undefined = selectedGroup ? await findGroupId(selectedGroup, user) : undefined;
                const response = await fetchApi<User[]>('GET', 'users/', undefined, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (response.success && response.data) {
                    const filteredUsers: User[] = groupId
                        ? response.data.filter(user => user.groupId === groupId)
                        : response.data;
                        // console.log("Filtered Users:", filteredUsers);
                    setUsers(filteredUsers);
                }
            } catch (error) {
                console.error('An error occurred while fetching users:', error);
            }
        };

        fetchUsers();
    }, [selectedGroup, user]);

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
