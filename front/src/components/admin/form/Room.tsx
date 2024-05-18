import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import fetchApi, { ApiResponse } from "../../../api/fetch";
import type { Room } from "../../../types/Room";
import { findLastRoomId } from "../../../utils/room";

export const FormRoom: React.FC<any> = (): JSX.Element => {
    const { user } = useAuth();
    const [error, setError] = React.useState<string>('');
    const [roomName, setRoomName] = React.useState<string>('');
    const [redirect, setRedirect] = React.useState<boolean>(false);

    const handleRoomForm = async (e: any): Promise<void> => {
        e.preventDefault();
        if (!roomName) {
            setError('Veuillez saisir un nom de salle');
            return;
        }
        setError('');
        try {
            const lastRoomId: number | undefined = await findLastRoomId(user);

            const newRoom: Room = {
                id: lastRoomId ? lastRoomId + 1 : 1,
                name: roomName,
            }

            const response: ApiResponse<Room> = await fetchApi<Room>('POST', 'rooms/', JSON.stringify(newRoom), {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                setRedirect(true);
            } else {
                setError('Erreur lors de la création de la salle');
            }
        } catch (e) {
            setError('Erreur lors de la création de la salle');
            console.error("Une erreur s'est produite lors de l'ajout de l'élément :", e);
        }
    }

    if (redirect) {
        return <Navigate to={`/admin/schedule?success=true&type=room&message=La salle ${roomName} a été créée !`} />;
    }

    return (
        <section>
            <div className="flow-root">
                <div className="divide-gray-200 mt-10 dark:divide-gray-700">
                    <form className="space-y-4 max-w-xl mx-auto md:space-y-6" onSubmit={handleRoomForm}>
                        <div>
                            <label htmlFor="username" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                            <input
                                value={roomName}
                                onChange={(e): any => setRoomName(e.target.value)}
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Nom de la salle"
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}