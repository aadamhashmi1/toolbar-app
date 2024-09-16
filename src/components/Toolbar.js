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
        <div className="flex gap-2 p-2 bg-gray-100 border-b border-gray-300 fixed top-0 left-0 w-full z-10">
            <select onChange={(e) => onFontChange(e.target.value)} className="p-1 border border-gray-300 rounded">
                {fonts.map((font, index) => (
                    <option key={index} value={font}>{font}</option>
                ))}
            </select>
            <button onClick={onBold}><FaBold /></button>
            <button onClick={onItalic}><FaItalic /></button>
            <button onClick={onUnderline}><FaUnderline /></button>
            <button onClick={onStrikethrough}><FaStrikethrough /></button>
            <button onClick={onTextColor}><FaPalette /></button>
            <button onClick={onComment}><FaComment /></button>
            <button onClick={onAlignLeft}><FaAlignLeft /></button>
            <button onClick={onNumberedList}><FaListOl /></button>
            <button onClick={onBulletedList}><FaListUl /></button>
            <button onClick={onIndent}><FaIndent /></button>
            <button onClick={onEquation}><FaSuperscript /></button>
            <button onClick={onOptimize}><FaMagic /></button>
            <button onClick={onRedo}><FaRedo /></button>
        </div>
    );
};

export default Toolbar;
