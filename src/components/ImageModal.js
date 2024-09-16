import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';

const ImageModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { imageUrl, quote } = location.state || {};
    
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [textObject, setTextObject] = useState(null);
    const [fontIndex, setFontIndex] = useState(0);

    const fonts = useMemo(() => [
        'Arial', 'Verdana', 'Courier New', 'Georgia', 'Times New Roman', 'Comic Sans MS', 'Trebuchet MS', 'Helvetica',
        'Impact', 'Lucida Console', 'Tahoma', 'Palatino', 'Garamond', 'Bookman', 'Arial Black', 'Avant Garde', 'Calibri',
        'Candara', 'Century Gothic', 'Consolas', 'Franklin Gothic', 'Futura', 'Gill Sans', 'Goudy Old Style', 'Harrington',
        'Lucida Bright', 'Lucida Sans', 'Optima', 'Perpetua', 'Rockwell', 'Segoe UI', 'Sylfaen', 'Tahoma', 'Trebuchet MS',
        'Verdana', 'Zapfino'
    ], []);

    useEffect(() => {
        console.log('Initializing canvas...');

        const fabricCanvas = new fabric.Canvas(canvasRef.current);
        setCanvas(fabricCanvas);
        
        const spinner = document.getElementById('spinner');
        spinner.style.display = 'block';

        const imgElement = new Image();
        imgElement.crossOrigin = 'anonymous';
        imgElement.src = imageUrl;

        imgElement.onload = () => {
            const fabricImg = new fabric.Image(imgElement, {
                left: 0,
                top: 0,
                originX: 'left',
                originY: 'top',
                selectable: false,
                evented: false,
            });

            const imgWidth = imgElement.width;
            const imgHeight = imgElement.height;

            spinner.style.display = 'none';

            if (imgWidth && imgHeight) {
                fabricCanvas.setDimensions({
                    width: imgWidth,
                    height: imgHeight,
                });
                fabricCanvas.add(fabricImg);
            }
        
            const context = fabricCanvas.getContext('2d');
            context.drawImage(imgElement, 0, 0, imgWidth, imgHeight);
            const imageData = context.getImageData(0, 0, imgWidth, imgHeight);
            const data = imageData.data;

            let r, g, b, avg;
            let colorSum = 0;

            for (let x = 0, len = data.length; x < len; x += 4) {
                r = data[x];
                g = data[x + 1];
                b = data[x + 2];

                avg = Math.floor((r + g + b) / 3);
                colorSum += avg;
            }

            const brightness = Math.floor(colorSum / (imgWidth * imgHeight));
            const textColor = brightness > 128 ? '#000000' : '#FFFFFF';
            const text = new fabric.Textbox(quote?.toUpperCase() || '', {
                left: imgWidth / 2,
                top: imgHeight / 2,
                width: imgWidth * 0.9,
                fontSize: 40,
                fill: textColor,
                originX: 'center',
                originY: 'center',
                textAlign: 'center',
                editable: true,
                hasControls: true,
                hasBorders: true,
                wordWrap: true,
                padding: 10,
                cornerSize: 20,
                fontFamily: fonts[fontIndex]
            });

            fabricCanvas.add(text);
            fabricCanvas.setActiveObject(text);
            fabricCanvas.renderAll();
            
            if (typeof text.bringToFront === 'function') {
                text.bringToFront();
            }
            
            setTextObject(text);
        };

        imgElement.onerror = (err) => {
            console.error('Failed to load image:', err);
            spinner.style.display = 'none';
        };

        return () => {
            fabricCanvas.dispose();
        };
    }, [imageUrl, quote, fonts, fontIndex]);

    const handleFontChange = () => {
        if (textObject) {
            const newFontIndex = (fontIndex + 1) % fonts.length;
            textObject.set('fontFamily', fonts[newFontIndex]);
            setFontIndex(newFontIndex);
            canvas.renderAll();
        }
    };

    const handleSave = () => {
        if (canvas) {
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1.0,
            });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'canvas-image.png';
            link.click();
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    const handleDownload = () => {
        if (canvas) {
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1,
            });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'image-with-text.png';
            link.click();
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleChangeColor = () => {
        if (textObject && canvas) {
            const newColor = getRandomColor();
            textObject.set('fill', newColor);
            canvas.renderAll();
        }
    };

    const handleChangeFont = (font) => {
        if (textObject && canvas) {
            textObject.set('fontFamily', font);
            canvas.renderAll();
        }
    };

    const handleBold = () => {
        if (textObject && canvas) {
            const isBold = textObject.fontWeight === 'bold';
            textObject.set('fontWeight', isBold ? 'normal' : 'bold');
            canvas.renderAll();
        }
    };

    const handleItalic = () => {
        if (textObject && canvas) {
            const isItalic = textObject.fontStyle === 'italic';
            textObject.set('fontStyle', isItalic ? 'normal' : 'italic');
            canvas.renderAll();
        }
    };

    const handleUnderline = () => {
        if (textObject && canvas) {
            const isUnderline = textObject.textDecoration === 'underline';
            textObject.set('textDecoration', isUnderline ? '' : 'underline');
            canvas.renderAll();
        }
    };

    const handleStrikethrough = () => {
        if (textObject && canvas) {
            const isStrikethrough = textObject.textDecoration === 'line-through';
            textObject.set('textDecoration', isStrikethrough ? '' : 'line-through');
            canvas.renderAll();
        }
    };

    const handleAddComment = () => {
        if (canvas) {
            const commentText = new fabric.Textbox('New Comment', {
                left: canvas.width / 2,
                top: canvas.height / 2,
                width: canvas.width * 0.5,
                fontSize: 20,
                fill: '#000000',
                originX: 'center',
                originY: 'center',
                textAlign: 'center',
                editable: true,
                hasControls: true,
                hasBorders: true,
                wordWrap: true,
                padding: 10,
                cornerSize: 20,
                fontFamily: fonts[fontIndex]
            });

            canvas.add(commentText);
            canvas.setActiveObject(commentText);
            canvas.renderAll();
            
            if (typeof commentText.bringToFront === 'function') {
                commentText.bringToFront();
            }
            
            setTextObject(commentText);
        }
    };

    const handleAlignLeft = () => {
        if (textObject && canvas) {
            const isLeftAligned = textObject.textAlign === 'left';
            textObject.set('textAlign', isLeftAligned ? 'center' : 'left');
            canvas.renderAll();
        }
    };

    const handleElementDrag = (e, element) => {
        e.dataTransfer.setData('element', JSON.stringify(element));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('element');
        if (!data) {
            console.error('No data found in dataTransfer');
            return;
        }
    
        let element;
        try {
            element = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return;
        }
    
        if (canvas && element) {
            fabric.Image.fromURL(element.src.medium, (img) => {
                img.set({
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: 'center',
                    originY: 'center',
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                img.bringToFront();
                canvas.renderAll();
            });
        }
    };
    
    

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center overflow-auto">
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-white border-none px-4 py-2 cursor-pointer z-30 rounded"
            >
                Close
            </button>
            <Toolbar
                onBold={handleBold}
                onItalic={handleItalic}
                onUnderline={handleUnderline}
                onStrikethrough={handleStrikethrough}
                onTextColor={handleChangeColor}
                onHighlightColor={handleChangeColor}
                onLink={() => {}}
                onComment={handleAddComment}
                onAlignLeft={handleAlignLeft}
                onNumberedList={() => {}}
                onBulletedList={() => {}}
                onIndent={() => {}}
                onEquation={() => {}}
                onOptimize={() => {}}
                onRedo={() => {}}
                onFontChange={handleChangeFont}
            />
            <div className="flex w-full h-full mt-4">
                <Sidebar onElementDrag={handleElementDrag} />
                <div
                    className="canvas-container flex-1 relative flex justify-center items-center"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <canvas ref={canvasRef} className="border-2 border-white"></canvas>
                </div>
            </div>
            <div className="spinner" id="spinner">Loading...</div>
            <div className="absolute bottom-4 flex gap-4">
                <button
                    className="bg-white border-none px-4 py-2 cursor-pointer z-30 rounded"
                    onClick={handleDownload}
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default ImageModal;
