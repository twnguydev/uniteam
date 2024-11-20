import React, { useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import fetchApi, { ApiResponse } from "../../../api/fetch";
import type { User } from "../../../types/user";
import { findLastUserId } from "../../../utils/user";
import { findAllGroups, findGroupId } from "../../../utils/group";

export const FormUser: React.FC<any> = (): JSX.Element => {
    const { user } = useAuth();
    const [error, setError] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [groupName, setGroupName] = React.useState<string>('');
    const [admin, setAdmin] = React.useState<boolean>(false);
    const [redirect, setRedirect] = React.useState<boolean>(false);
    const [groups, setGroups] = React.useState<any[]>([]);

    useEffect(() => {
        const fetchGroups = async (): Promise<void> => {
            const response = await findAllGroups(user);
            setGroups(response);
        }

        fetchGroups();
    }, [user]);

    const handleUserForm = async (e: any): Promise<void> => {
        e.preventDefault();

        if (!lastName || !firstName || !email || !groupName) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setError('');

        try {
            const lastUserId: number | undefined = await findLastUserId(user as User);
            const groupId: number | undefined = await findGroupId(groupName, user);

            const newUser: User = {
                id: lastUserId ? lastUserId + 1 : 1,
                lastName: lastName,
                firstName: firstName,
                email: email,
                password: '',
                isAdmin: admin,
                groupId: groupId ? groupId : 1,
            }

            const response: ApiResponse<User> = await fetchApi<User>('POST', 'users/', JSON.stringify(newUser), {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                setRedirect(true);
            } else {
                setError('Erreur lors de la création de l\'utilisateur');
            }
        } catch (e) {
            setError('Erreur lors de la création de l\'utilisateur');
            console.error("Une erreur s'est produite lors de l'ajout de l'élément :", e);
        }
    }

    if (redirect) {
        return <Navigate to={`/admin/schedule?success=true&type=user&message=L'utilisateur ${firstName} ${lastName} a été créé !`} />;
    }

    return (
        <section>
            <div className="flow-root">
                <div className="divide-gray-200 mt-10 dark:divide-gray-700">
                    <form className="space-y-8 max-w-xl mx-auto" onSubmit={handleUserForm}>
                        <div>
                            <label htmlFor="lastName" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">
                                Prénom
                                {error && (
                                    <span className="text-red-500 text-sm font-medium"> *</span>
                                )}
                            </label>
                            <input
                                value={firstName}
                                onChange={(e): any => setFirstName(e.target.value)}
                                type="text"
                                name="firstName"
                                id="firstName"
                                className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                placeholder="Prénom de l'utilisateur"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">
                                Nom
                                {error && (
                                    <span className="text-red-500 text-sm font-medium"> *</span>
                                )}

                            </label>
                            <input
                                value={lastName}
                                onChange={(e): any => setLastName(e.target.value)}
                                type="text"
                                name="lastName"
                                id="lastName"
                                className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                placeholder="Nom de l'utilisateur"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">
                                Email
                                {error && (
                                    <span className="text-red-500 text-sm font-medium"> *</span>
                                )}

                            </label>
                            <input
                                value={email}
                                onChange={(e): any => setEmail(e.target.value)}
                                type="email"
                                name="email"
                                id="email"
                                className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                placeholder="Email de l'utilisateur"
                            />
                        </div>
                        <div>
                            <label htmlFor="group" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">
                                Groupe de travail
                                {error && (
                                    <span className="text-red-500 text-sm font-medium"> *</span>
                                )}

                            </label>
                            <select
                                name="group"
                                id="group"
                                value={groupName}
                                onChange={(e): any => setGroupName(e.target.value)}
                                className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                            >
                                <option value="">Assigner un groupe de travail</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.name}>{group.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 uppercase text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                            <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">Le mot de passe est généré automatiquement et envoyé par email à l'utilisateur.</p>
                        </div>
                        <div className="flex items-center mt-12">
                            <input
                                type="checkbox"
                                name="isAdmin"
                                id="isAdmin"
                                checked={admin}
                                onChange={(e): any => setAdmin(e.target.checked)}
                            />
                            <label htmlFor="isAdmin" className="block uppercase text-sm ml-10 font-medium text-gray-900 dark:text-white">
                                Cet utilisateur est un administrateur
                            </label>
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