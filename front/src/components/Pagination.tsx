import React from 'react';

export const Pagination: React.FC<{ page: number, setPage: (page: number) => void, total: number, limit: number }> = ({ page, setPage, total, limit }) => {
    const totalPages: number = Math.ceil(total / limit);

    const handleClick = (newPage: number): void => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const renderPageButtons = (): JSX.Element[] => {
        const buttons: JSX.Element[] = [];

        for (let i: number = Math.max(1, page - 2); i < page; i++) {
            buttons.push(
                <li key={i}>
                    <button className={`flex items-center justify-center px-4 h-10 leading-tight ${page === i ? 'text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:border-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`} onClick={() => handleClick(i)}>{i}</button>
                </li>
            );
        }

        buttons.push(
            <li key={page}>
                <button className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white" onClick={() => handleClick(page)}>{page}</button>
            </li>
        );

        for (let i: number = page + 1; i <= Math.min(totalPages, page + 2); i++) {
            buttons.push(
                <li key={i}>
                    <button className={`flex items-center justify-center px-4 h-10 leading-tight ${page === i ? 'text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:border-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`} onClick={() => handleClick(i)}>{i}</button>
                </li>
            );
        }

        return buttons;
    };

    return (
        <nav aria-label="Page navigation example">
            <ul className="flex items-center justify-center mt-20 -space-x-px h-10 text-base">
                <li>
                    <button
                        className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${page === 1 ? 'disabled:opacity-50' : ''}`}
                        onClick={(): void => handleClick(page - 1)}
                        disabled={page <= 1}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                        </svg>
                    </button>
                </li>
                {renderPageButtons()}
                <li>
                    <button
                        className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${page === totalPages ? 'disabled:opacity-50' : ''}`}
                        onClick={(): void => handleClick(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};