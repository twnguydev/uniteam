export const Error: React.FC = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                <div className="text-foreground text-white m-8 mt-0 mb-4 font-semibold text-center text-4xl md:text-5xl lg:text-6xl tracking-tighter mx-auto flex items-center gap-2 w-full max-w-2xl">
                    Oh oh...<br />Il semblerait que vous ayez trouvé un glitch dans la matrix.
                </div>
                <a href="#" className="flex items-center mb-16 text-2xl font-semibold text-gray-600">
                    Uniteam by Epitech
                </a>

                <div className="mt-4">
                    <a href="#" title=""
                        className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline text-blue-500">
                        Retournez à l'accueil
                        <svg aria-hidden="true" className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}