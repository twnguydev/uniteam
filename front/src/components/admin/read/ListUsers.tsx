import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { UserItem } from '../../item/UserItem';
import fetchApi from '../../../api/fetch';
import { findGroupId } from '../../../utils/group';
import type { User } from '../../../types/user';
import type { ListUsersAdminProps } from '../../../types/admin';
import { Pagination } from '../../Pagination';

export const ListUsers: React.FC<ListUsersAdminProps> = ({ selectedGroup, selectedStatus, selectedLimit }) => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [currentPageUsers, setCurrentPageUsers] = useState<User[]>([]);

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
                    let filteredUsers = response.data;
                    if (groupId) {
                        filteredUsers = filteredUsers.filter((user: User): boolean => user.groupId === groupId);
                    }
                    if (selectedStatus) {
                        filteredUsers = filteredUsers.filter((user: User): boolean => user.is_admin.toString() === selectedStatus);
                    }
                    setUsers(filteredUsers);
                }
            } catch (error) {
                console.error('An error occurred while fetching users:', error);
            }
        };

        fetchUsers();
    }, [selectedGroup, selectedStatus, user]);

    useEffect((): void => {
        const start: number = (page - 1) * selectedLimit;
        const end: number = start + selectedLimit;
        setCurrentPageUsers(users.slice(start, end));
    }, [page, users, selectedLimit]);

    return (
        <>
            <section>
                <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentPageUsers.map(user => (
                            <UserItem key={user.id} {...user} />
                        ))}
                    </div>
                </div>
            </section>
            <div className="max-w-3xl mx-auto mt-4">
                <Pagination page={page} setPage={setPage} total={users.length} limit={selectedLimit} />
            </div>
        </>
    );
}
