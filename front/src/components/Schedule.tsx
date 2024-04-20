import React from 'react';
import { useAuth } from '../auth/AuthContext';

interface Badge {
    color: string;
    text: string;
    classNames: string;
}

const badges: Badge[] = [
    {
        color: 'green',
        text: 'Validé',
        classNames: 'bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
    },
    {
        color: 'red',
        text: 'Refusé',
        classNames: 'bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300',
    },
    {
        color: 'yellow',
        text: 'Annulé',
        classNames: 'bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300',
    },
    {
        color: 'gray',
        text: 'En attente',
        classNames: 'bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
    },
];

const Badge: React.FC<{ status: string }> = ({ status }) => {
    const badge = badges.find(badge => badge.text === status);

    if (!badge) {
        return null;
    }

    return (
        <span className={badge.classNames}>
            {badge.text}
        </span>
    );
};

export const Schedule: React.FC = () => {
    const { user } = useAuth();

    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                        Agenda
                    </h2>

                    {user ? (
                        <div className="flex flex-col items-center gap-4 mt-8 sm:mt-12 lg:mt-16">
                            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex justify-end px-4 pt-4">
                                    <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                                        <span className="sr-only">Open dropdown</span>
                                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                        </svg>
                                    </button>
                                    {/* Dropdown menu */}
                                    <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2" aria-labelledby="dropdownButton">
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                                            </li>
                                            <li>
                                                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center pb-10">
                                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image" />
                                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bonnie Green</h5>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Visual Designer</span>
                                    <div className="flex mt-4 md:mt-6">
                                        <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add friend</a>
                                        <a href="#" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Connectez-vous pour accéder à votre compte.</p>
                    )}

                    <div className="mt-4">
                        <a href="#" title=""
                            className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline text-blue-500">
                            Découvrez-en plus à propos de l'agenda
                            <svg aria-hidden="true" className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
                    <div className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                            <Badge status="Validé" />
                            <p className="w-32 text-lg font-normal text-gray-500 sm:text-right dark:text-gray-400 shrink-0">
                                20/04/2024 08:00 - 09:00
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                <a href="#" className="hover:underline">Opening remarks</a>
                            </h3>
                        </div>

                        <div className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center">
                            <Badge status="En attente" />
                            <p className="w-32 text-lg font-normal text-gray-500 sm:text-right dark:text-gray-400 shrink-0">
                                20/04/2024 17:00 - 18:00
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                <a href="#" className="hover:underline">Drinks & networking</a>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
