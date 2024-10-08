import React from 'react';

const LayerControls = ({ layers, onToggleVisibility, onChangeOpacity, onRemoveLayer }) => {
    return (
        <div className="fixed top-0 right-0 h-full bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out w-64 z-20">
            <div className="p-4">
                <h2 className="text-white text-lg mb-4">Layers</h2>
                {layers.map(layer => (
                    <div key={layer.id} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white">{layer.id}</span>
                            <button
                                className="bg-red-600 text-white px-2 py-1 rounded"
                                onClick={() => onRemoveLayer(layer.id)}
                            >
                                Remove
                            </button>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-white">Visible</label>
                            <input
                                type="checkbox"
                                checked={layer.visible}
                                onChange={() => onToggleVisibility(layer.id)}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-white">Opacity</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={layer.opacity}
                                onChange={(e) => onChangeOpacity(layer.id, parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LayerControls;
