import React, { useEffect, ReactElement } from "react";
import { useAuth } from '../../../auth/AuthContext';
import type { Room } from '../../../types/Room';
import { RoomItem } from '../../item/RoomItem';
import fetchApi, { ApiResponse } from "../../../api/fetch";
import { Pagination } from '../../Pagination';
import type { ListRoomsAdminProps } from "../../../types/admin";

export const ListRooms: React.FC<ListRoomsAdminProps> = ({ selectedLimit }): ReactElement => {
    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [currentPageRooms, setCurrentPageRooms] = React.useState<Room[]>([]);
    const [page, setPage] = React.useState<number>(1);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRooms = async (): Promise<void> => {
            const response: ApiResponse<Room[]> = await fetchApi('GET', 'rooms/', undefined, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success && response.data) {
                setRooms(response.data);
            }
        };

        fetchRooms();
    }, [user]);

    useEffect((): void => {
        const start: number = (page - 1) * selectedLimit;
        const end: number = start + selectedLimit;

        const totalPages: number = Math.ceil(rooms.length / selectedLimit);

        if (page < 1 || page > totalPages) {
            setPage(prevPage => Math.max(1, Math.min(totalPages, prevPage)));
            return;
        }

        setCurrentPageRooms(rooms.slice(start, end));
    }, [page, rooms, selectedLimit]);

    return (
        <>
            <section>
                <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentPageRooms.map(room => (
                            <RoomItem key={room.id} room={room} />
                        ))}
                    </div>
                </div>
            </section>
            <div className="max-w-3xl mx-auto mt-4">
                <Pagination page={page} setPage={setPage} total={rooms.length} limit={selectedLimit} />
            </div>
        </>
    );
}
