// components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-lg font-bold">Quote App</Link>
                <Link to="/project">
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
