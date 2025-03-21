import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import type { User } from '../types/user';
import fetchApi, { ApiResponse } from "../api/fetch";

export const Login: React.FC = (): JSX.Element => {
    const { login } = useAuth();
    const navigate: NavigateFunction = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!email || !password) return setError('Veuillez remplir les champs : Adresse e-mail, Mot de passe.');
    
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
    
        try {
            const response: ApiResponse<unknown> = await fetchApi('POST', 'token', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
    
            if (response.success) {
                const accessToken: string | undefined = (response.data as { access_token?: string })?.access_token;
    
                if (accessToken) {
                    try {
                        const userResponse: ApiResponse<User> = await fetchApi<User>('GET', 'me/', undefined, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                        });
    
                        if (userResponse.success) {
                            const user: User | undefined = userResponse.data;

                            if (user) {
                                login(JSON.stringify(user), accessToken);
                                navigate('/');
                            }
                        } else {
                            setError('Erreur lors de la récupération des informations utilisateur.');
                        }
                    } catch (error) {
                        setError('Une erreur s\'est produite lors de la récupération des informations utilisateur.');
                    }
                } else {
                    setError('Erreur lors de la récupération du jeton d\'accès.');
                }
            } else {
                setError('Erreur lors de la connexion.');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la connexion.');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    UniTeam
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Connectez-vous à votre compte
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Adresse e-mail
                                    {error && (
                                        <span className="text-red-500 text-sm font-medium"> *</span>
                                    )}
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    name="username"
                                    id="username"
                                    className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                    ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                    placeholder="john.doe@mail.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Mot de passe
                                    {error && (
                                        <span className="text-red-500 text-sm font-medium"> *</span>
                                    )}
                                </label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                    ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Connexion
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Vous n'avez pas encore de compte ?<br /><a href="/contact" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Contactez l'administrateur</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};