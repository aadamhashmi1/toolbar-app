import React from 'react';

const ImageGrid = ({ images, onImageClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
                <img
                    key={image.id}
                    src={image.src.medium}
                    alt={image.alt}
                    className="cursor-pointer object-cover rounded-lg shadow-md hover:opacity-80 transition-opacity"
                    onClick={() => onImageClick(image)}
                />
            ))}
        </div>
    );
};

export default ImageGrid;
