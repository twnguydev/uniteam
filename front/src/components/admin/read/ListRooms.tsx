import React, { useEffect, ReactElement } from "react";
import { useAuth } from '../../../auth/AuthContext';
import type { Room } from '../../../types/Room';
import { RoomItem } from '../../item/RoomItem';
import fetchApi from '../../../api/fetch';

export const ListRooms: React.FC = (): ReactElement => {
    const [rooms, setRooms] = React.useState<Room[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRooms = async (): Promise<void> => {
            const response = await fetchApi('GET', 'rooms/', undefined, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success && response.data) {
                setRooms(response.data as Room[]);
            }
        };

        fetchRooms();
    }, [user]);

    return (
        <section>
            <div className="flow-root mt-8 sm:mt-12 lg:mt-16">
                <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                    {rooms.map(room => (
                        <RoomItem room={room} />
                    ))}
                </div>
            </div>
        </section>
    );
}
