
import React, { useEffect, useState } from 'react';
import fetchApi, { ApiResponse } from '../api/fetch';
import { useAuth } from '../auth/AuthContext';

export const Contact: React.FC = (): JSX.Element => {
    const { user } = useAuth();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect((): void => {
        if (user) {
            setName(user.lastName);
            setEmail(user.email);
        }
    }, [user]);

    const handleContact = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            if (!name || !email || !message) return setError('Veuillez remplir les champs : Nom, Adresse e-mail, Message.');

            const response: ApiResponse<unknown> = await fetchApi('POST', 'contact/', {
                name: name,
                email: email,
                subject: subject,
                message: message,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                setSuccess('Votre message a bien été envoyé. L\'administrateur vous répondra dans les plus brefs délais.');
                setError('');
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
            } else {
                setError('Une erreur est survenue lors de l\'envoi de votre message.');
            }
        } catch (error) {
            setError('Une erreur s\'est produite lors de l\'envoi de votre message.');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-10 mx-auto min-h-screen">
                <a href="#" className="flex items-center mb-12 text-4xl font-semibold text-gray-900 text-center dark:text-white">
                    Rejoignez la puissance de la gestion<br />d'infrastructures avec UniTeam
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Contactez votre administrateur d'infrastructure
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleContact}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Nom
                                    {error && (
                                        <span className="text-red-500 text-sm font-medium"> *</span>
                                    )}
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    name="name"
                                    id="name"
                                    className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                    ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                    placeholder="John Doe"
                                    disabled={user ? true : false}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Adresse e-mail
                                    {error && (
                                        <span className="text-red-500 text-sm font-medium"> *</span>
                                    )}
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    name="email"
                                    id="email"
                                    className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                    ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                    placeholder="john.doe@mail.com"
                                    disabled={user ? true : false}
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Sujet
                                </label>
                                <input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="e.g. Demande d'accès, Fonctionnalité manquante..."
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Message
                                    {error && (
                                        <span className="text-red-500 text-sm font-medium"> *</span>
                                    )}
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    name="message"
                                    id="message"
                                    rows={5}
                                    className={`bg-gray-50 w-full text-gray-900 sm:text-sm rounded-lg p-2.5 resize-none
                                    dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                                    ${error ? 'border border-red-500 focus:ring-red-600 focus:border-red-600' : 'border border-gray-600 focus:ring-blue-600 focus:border-blue-600'}`}
                                    placeholder="Votre message"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="text-green-500 text-sm font-medium">
                                    {success}
                                </div>
                            )}
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Envoyer la demande
                            </button>
                            {!user && (
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Vous avez déjà un compte ?<br /><a href="/auth" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Connectez-vous</a>
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}