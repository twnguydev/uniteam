import React, { useEffect, ReactElement } from "react";
import { useAuth } from '../../../auth/AuthContext';
import type { Group } from '../../../types/group';
import { GroupItem } from '../../item/GroupItem';
import fetchApi from '../../../api/fetch';

export const ListGroups: React.FC = (): ReactElement => {
    const [groups, setGroups] = React.useState<Group[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetchApi('GET', 'groups/', undefined, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success && response.data) {
                setGroups(response.data as Group[]);
            }
        };

        fetchGroups();
    }, [user]);

    return (
        <section>
            <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {groups.map(group => (
                        <GroupItem key={group.id} group={group} />
                    ))}
                </div>
            </div>
        </section>
    );
}
