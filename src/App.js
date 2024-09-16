// App.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import NavBar from './components/NavBar'; // Import NavBar

const App = () => {
    const [images, setImages] = useState([]);
    const [quote, setQuote] = useState('');
    const [generatedQuote, setGeneratedQuote] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (query) => {
        setQuote(query);
        try {
            const response = await axios.get('https://api.pexels.com/v1/search', {
                params: { query, per_page: 15 },
                headers: {
                    Authorization: 'uVktvfZdjycLoNDU8HGlu633wvCVGRKJk7kfxqXrFtBwOpxGVAYNQsbg',
                },
            });
            setImages(response.data.photos);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleGenerateRandomQuote = async () => {
        try {
            const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
                headers: { 'X-Api-Key': 'WIDogwrp/Kfc3ELin0zpLg==uPeHtjJU6R6Z3X0Q' },
            });
            const randomQuote = response.data[0].quote;
            setGeneratedQuote(randomQuote);
            setQuote(randomQuote);
            handleSearch(randomQuote);
        } catch (error) {
            console.error('Error fetching random quote:', error);
        }
    };

    const handleImageClick = (image) => {
        navigate('/canvas', { state: { imageUrl: image.src.large, quote } });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar /> {/* Add NavBar here */}
            <div className="container mx-auto p-4">
                <SearchBar
                    onSearch={handleSearch}
                    onGenerateRandomQuote={handleGenerateRandomQuote}
                />
                {generatedQuote && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                        <strong className="text-lg">Generated Quote:</strong> {generatedQuote}
                    </div>
                )}
                <ImageGrid images={images} onImageClick={handleImageClick} />
            </div>
        </div>
    );
};

export default App;
