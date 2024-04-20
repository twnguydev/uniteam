import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

import fetchApi from '../api/fetch';

export const Login: React.FC = () => {
    const { login,  } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
    
        try {
            const response = await fetchApi('POST', 'token', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
    
            if (response.access_token) {
                const accessToken = response.access_token;

                const userData = await fetchApi('GET', 'me', null, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log('userData', userData);

                // login(userData);

                // navigate(`/member/${user.id}/schedule`);
            } else {
                setError('Erreur lors de la récupération du jeton d\'accès.');
                console.log('test erreur', response.error);
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de la connexion.');
            console.error('Erreur lors de la connexion au serveur', error);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    Hackaton App
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Connectez-vous à votre compte
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adresse e-mail</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    name="username"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="john.doe@mail.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                Vous n'avez pas encore de compte ?<br /><a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Contactez l'administrateur</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};