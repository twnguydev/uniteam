import React from 'react';

export const Footer: React.FC = (): JSX.Element => {
    return (
        <footer className="flex justify-between bg-gray-800 text-white p-4 text-center flex-col sm:flex-row">
            <p>&copy; <b>UniTeam</b> 2024</p>
            <p>Une demande ? Un problème ? <a href="/contact" className="text-blue-500 hover:underline">Contactez-nous</a></p>
        </footer>
    );
}