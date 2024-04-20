const badges = [
    {
        color: 'green',
        text: 'Validé',
        classNames: 'bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
    },
    {
        color: 'yellow',
        text: 'En cours',
        classNames: 'bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300',
    },
    {
        color: 'red',
        text: 'Annulé',
        classNames: 'bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300',
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
    return (
        <section className="bg-white dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                        Agenda
                    </h2>

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
