import React from 'react';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaPalette, FaLink, FaComment, FaAlignLeft, FaListOl, FaListUl, FaIndent, FaSuperscript, FaMagic, FaRedo } from 'react-icons/fa';

const Toolbar = ({ onBold, onItalic, onUnderline, onStrikethrough, onTextColor, onHighlightColor, onLink, onComment, onAlignLeft, onNumberedList, onBulletedList, onIndent, onEquation, onOptimize, onRedo, onFontChange }) => {
    const fonts = [
        'Arial', 'Verdana', 'Courier New', 'Georgia', 'Times New Roman', 'Comic Sans MS', 'Trebuchet MS', 'Helvetica',
        'Impact', 'Lucida Console', 'Tahoma', 'Palatino', 'Garamond', 'Bookman', 'Arial Black', 'Avant Garde', 'Calibri',
        'Candara', 'Century Gothic', 'Consolas', 'Franklin Gothic', 'Futura', 'Gill Sans', 'Goudy Old Style', 'Harrington',
        'Lucida Bright', 'Lucida Sans', 'Optima', 'Perpetua', 'Rockwell', 'Segoe UI', 'Sylfaen', 'Tahoma', 'Trebuchet MS',
        'Verdana', 'Zapfino'
    ];

    return (
        <div className="fixed top-0 left-0 w-full bg-gray-100 border-b border-gray-300 flex items-center p-4 z-10">
            <select onChange={(e) => onFontChange(e.target.value)} className="p-1 border border-gray-300 rounded mr-2">
                {fonts.map((font, index) => (
                    <option key={index} value={font}>{font}</option>
                ))}
            </select>
            <button onClick={onBold} className="mr-2"><FaBold /></button>
            <button onClick={onItalic} className="mr-2"><FaItalic /></button>
            <button onClick={onTextColor} className="mr-2"><FaPalette /></button>
            <button onClick={onComment} className="mr-2"><FaComment /></button>
            <button onClick={onAlignLeft} className="mr-2"><FaAlignLeft /></button>
            <button onClick={onIndent} className="mr-2"><FaIndent /></button>
            <button onClick={onEquation} className="mr-2"><FaSuperscript /></button>
            <button onClick={onRedo} className="mr-2"><FaRedo /></button>
        </div>
    );
};

export default Toolbar;
