export const Home: React.FC = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
                <div className="text-foreground text-white m-8 mt-0 mb-4 font-semibold text-center text-4xl md:text-5xl lg:text-6xl tracking-tighter mx-auto flex items-center gap-2 w-full max-w-2xl">
                    Propulsez votre entreprise dans une autre dimension avec Hackaton App.
                </div>
                <a href="#" className="flex items-center mb-16 text-2xl font-semibold text-gray-600">
                    Hackaton App by Epitech
                </a>
                <div className="flex flex-col sm:flex-row justify-around gap-4 m-8">
                    <div className="block max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Planifiez vos réunions en toute simplicité</h5>
                        <p className="font-normal text-gray-700">Profitez d'une plateforme intuitive qui vous permet de gérer efficacement vos réservations de salles. Simplifiez votre processus de planification et assurez une utilisation optimale de vos espaces de réunion.</p>
                    </div>
                    <div className="block max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Optimisez l'utilisation de vos espaces</h5>
                        <p className="font-normal text-gray-700">Découvrez une solution flexible conçue pour répondre à vos besoins spécifiques. Grâce à <b>Hackaton App</b>, maximisez l'efficacité de vos infrastructures et assurez une gestion transparente de vos salles d'entreprise.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}