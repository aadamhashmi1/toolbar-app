import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ onElementDrag }) => {
    const [elements, setElements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('https://api.pexels.com/v1/search', {
                    params: { query: searchTerm },
                    headers: {
                        Authorization: 'uVktvfZdjycLoNDU8HGlu633wvCVGRKJk7kfxqXrFtBwOpxGVAYNQsbg'
                    }
                });
                setElements(response.data.photos);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (searchTerm) {
            fetchImages();
        }
    }, [searchTerm]);

    const handleElementDrag = (e, element) => {
        e.dataTransfer.setData('element', JSON.stringify(element));
    };

    return (
        <div className="fixed top-0 left-0 h-full bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out w-64 z-20">
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search images"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="grid grid-cols-2 gap-4 overflow-y-auto h-[calc(100vh-100px)]">
                    {elements.map(element => (
                        <div
                            key={element.id}
                            className="element p-2 border border-gray-200 rounded cursor-pointer"
                            draggable
                            onDragStart={(e) => handleElementDrag(e, element)}
                        >
                            <img src={element.src.medium} alt={element.alt} className="w-full h-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
