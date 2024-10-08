import React, { useState } from 'react';
import { FaBold, FaItalic, FaPalette, FaComment, FaAlignLeft, FaIndent, FaSuperscript, FaRedo } from 'react-icons/fa';
import { SketchPicker } from 'react-color';

const Toolbar = ({ onBold, onItalic, onTextColor, onComment, onAlignLeft, onIndent, onEquation, onRedo, onFontChange }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState('#000');

    const handleColorChange = (color) => {
        setColor(color.hex);
        onTextColor(color.hex);
    };

    const fonts = [
        'Arial', 'Verdana', 'Courier New', 'Georgia', 'Times New Roman', 'Comic Sans MS', 'Trebuchet MS', 'Helvetica',
        'Impact', 'Lucida Console', 'Tahoma', 'Palatino', 'Garamond', 'Bookman', 'Arial Black', 'Avant Garde', 'Calibri',
        'Candara', 'Century Gothic', 'Consolas', 'Franklin Gothic', 'Futura', 'Gill Sans', 'Goudy Old Style', 'Harrington',
        'Lucida Bright', 'Lucida Sans', 'Optima', 'Perpetua', 'Rockwell', 'Segoe UI', 'Sylfaen', 'Tahoma', 'Trebuchet MS',
        'Verdana', 'Zapfino'
    ];

    return (
        <div className="fixed top-0 right-0 h-full bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out w-64 z-20">
            <div className="p-4">
                <select onChange={(e) => onFontChange(e.target.value)} className="p-1 border border-gray-300 rounded mb-4 w-full">
                    {fonts.map((font, index) => (
                        <option key={index} value={font}>{font}</option>
                    ))}
                </select>
                <button onClick={onBold} className="block mb-2"><FaBold /></button>
                <button onClick={onItalic} className="block mb-2"><FaItalic /></button>
                <button onClick={() => setShowColorPicker(!showColorPicker)} className="block mb-2"><FaPalette /></button>
                {showColorPicker && (
                    <div className="absolute z-50 mt-2">
                        <SketchPicker color={color} onChangeComplete={handleColorChange} />
                    </div>
                )}
                <button onClick={onComment} className="block mb-2"><FaComment /></button>
                <button onClick={onAlignLeft} className="block mb-2"><FaAlignLeft /></button>
                <button onClick={onIndent} className="block mb-2"><FaIndent /></button>
                <button onClick={onEquation} className="block mb-2"><FaSuperscript /></button>
                <button onClick={onRedo} className="block mb-2"><FaRedo /></button>
            </div>
        </div>
    );
};

export default Toolbar;
