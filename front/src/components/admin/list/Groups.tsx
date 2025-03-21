import React, { useEffect } from "react";
import { useAuth } from '../../../auth/AuthContext';
import type { Group } from '../../../types/Group';
import { GroupItem } from '../../item/GroupItem';
import fetchApi, { ApiResponse } from "../../../api/fetch";
import { Pagination } from '../../Pagination';
import type { ListGroupsAdminProps } from "../../../types/admin";

export const ListGroups: React.FC<ListGroupsAdminProps> = ({ selectedLimit }): JSX.Element => {
    const [groups, setGroups] = React.useState<Group[]>([]);
    const { user } = useAuth();
    const [page, setPage] = React.useState<number>(1);
    const [currentPageGroups, setCurrentPageGroups] = React.useState<Group[]>([]);

    useEffect(() => {
        const fetchGroups = async (): Promise<void> => {
            const response: ApiResponse<Group[]> = await fetchApi('GET', 'groups/', undefined, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success && response.data) {
                setGroups(response.data);
            }
        };

        fetchGroups();
    }, [user]);

    useEffect((): void => {
        const start: number = (page - 1) * selectedLimit;
        const end: number = start + selectedLimit;
        
        const totalPages: number = Math.ceil(groups.length / selectedLimit);

        if (page < 1 || page > totalPages) {
            setPage(prevPage => Math.max(1, Math.min(totalPages, prevPage)));
            return;
        }
    
        setCurrentPageGroups(groups.slice(start, end));
    }, [page, groups, selectedLimit]);

    return (
        <>
            <section>
                <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentPageGroups.map(group => (
                            <GroupItem key={group.id} group={group} />
                        ))}
                    </div>
                </div>
            </section>
            <div className="max-w-3xl mx-auto mt-4">
                <Pagination page={page} setPage={setPage} total={groups.length} limit={selectedLimit} />
            </div>
        </>
    );
}
