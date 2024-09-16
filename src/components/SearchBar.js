// SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, onGenerateRandomQuote }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query) {
            onSearch(query);
        }
    };

    return (
        <div className="flex gap-4 items-center mb-6">
            <input
                type="text"
                placeholder="Search for a quote..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
                Search
            </button>
            <button
                onClick={onGenerateRandomQuote}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
            >
                Generate Random Quote
            </button>
        </div>
    );
};

export default SearchBar;
