import type { Badge } from '../types/Badge';

export const badges: Badge[] = [
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
        text: 'En cours',
        classNames: 'bg-gray-100 text-gray-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
    },
];

export const groupBadges: Badge[] = [
    {
        text: "MSc",
        color: "blue",
        classNames: "bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
    },
    {
        text: "Web@cademie",
        color: "red",
        classNames: "bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
    },
    {
        text: "PGE",
        color: "yellow",
        classNames: "bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"
    },
    {
        text: "Peda",
        color: "green",
        classNames: "bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
    },
];