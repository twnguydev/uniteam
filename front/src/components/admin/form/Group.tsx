import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import fetchApi, { ApiResponse } from "../../../api/fetch";
import type { Group } from "../../../types/Group";
import { findLastGroupId } from "../../../utils/group";

export const FormGroup: React.FC<any> = (): JSX.Element => {
    const { user } = useAuth();
    const [error, setError] = React.useState<string>('');
    const [groupName, setGroupName] = React.useState<string>('');
    const [redirect, setRedirect] = React.useState<boolean>(false);

    const handleGroupForm = async (e: any): Promise<void> => {
        e.preventDefault();
        if (!groupName) {
            setError('Veuillez spécifier un nom de groupe de travail');
            return;
        }
        setError('');
        try {
            const lastGroupId: number | undefined = await findLastGroupId(user);

            const newGroup: Group = {
                id: lastGroupId ? lastGroupId + 1 : 1,
                name: groupName,
            }

            const response: ApiResponse<Group> = await fetchApi<Group>('POST', 'groups/', JSON.stringify(newGroup), {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                setRedirect(true);
            } else {
                setError('Erreur lors de la création du groupe de travail');
            }
        } catch (e) {
            setError('Erreur lors de la création du groupe de travail');
            console.error("Une erreur s'est produite lors de l'ajout de l'élément :", e);
        }
    }

    if (redirect) {
        return <Navigate to={`/admin/schedule?success=true&type=group&message=Le groupe ${groupName} a été créé !`} />;
    }

    return (
        <section>
            <div className="flow-root">
                <div className="divide-gray-200 mt-10 dark:divide-gray-700">
                    <form className="space-y-4 max-w-xl mx-auto md:space-y-6" onSubmit={handleGroupForm}>
                        <div>
                            <label htmlFor="username" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">
                                Nom
                                {error && (
                                    <span className="text-red-500 text-sm font-medium"> *</span>
                                )}
                            </label>
                            <input
                                value={groupName}
                                onChange={(e): any => setGroupName(e.target.value)}
                                type="text"
                                name="name"
                                id="name"
                                className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                placeholder="Nom du groupe de travail"
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