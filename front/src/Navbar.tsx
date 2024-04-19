import React from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

interface NavbarProps {
    counter: number;
}

export const Navbar: React.FC<NavbarProps> = ({ counter }) => {
    return (
        <nav className="navbar">
            <div className="container">
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                    {counter}
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
        </nav>
    );
};