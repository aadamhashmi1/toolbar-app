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
    const [fontIndex] = useState(0);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

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
            saveCanvasState(); // Save initial state
        };

        imgElement.onerror = (err) => {
            console.error('Failed to load image:', err);
            spinner.style.display = 'none';
        };

        return () => {
            fabricCanvas.dispose();
        };
    }, [imageUrl, quote, fonts, fontIndex]);

    const saveCanvasState = () => {
        const canvasState = canvas.toJSON();
        setUndoStack([...undoStack, canvasState]);
        setRedoStack([]); // Clear the redo stack whenever a new action is performed
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const newUndoStack = [...undoStack, canvas.toJSON()];
            const newCanvasState = redoStack.pop();
            setUndoStack(newUndoStack);
            setRedoStack([...redoStack]);
            canvas.loadFromJSON(newCanvasState, () => {
                canvas.renderAll();
            });
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

    

    const handleChangeColor = (color) => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            activeObject.set({ fill: color });
            canvas.renderAll();
        }
    };

    const handleChangeFont = (font) => {
        if (textObject && canvas) {
            textObject.set('fontFamily', font);
            canvas.renderAll();
            saveCanvasState(); // Save state after font change
        }
    };

    const handleBold = () => {
        if (textObject && canvas) {
            const isBold = textObject.fontWeight === 'bold';
            textObject.set('fontWeight', isBold ? 'normal' : 'bold');
            canvas.renderAll();
            saveCanvasState(); // Save state after bold change
        }
    };

    const handleItalic = () => {
        if (textObject && canvas) {
            const isItalic = textObject.fontStyle === 'italic';
            textObject.set('fontStyle', isItalic ? 'normal' : 'italic');
            canvas.renderAll();
            saveCanvasState(); // Save state after italic change
        }
    };

    const handleUnderline = () => {
        if (textObject && canvas) {
            const isUnderline = textObject.textDecoration === 'underline';
            textObject.set('textDecoration', isUnderline ? '' : 'underline');
            canvas.renderAll();
            saveCanvasState(); // Save state after underline change
        }
    };

    const handleStrikethrough = () => {
        if (textObject && canvas) {
            const isStrikethrough = textObject.textDecoration === 'line-through';
            textObject.set('textDecoration', isStrikethrough ? '' : 'line-through');
            canvas.renderAll();
            saveCanvasState(); // Save state after strikethrough change
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
            saveCanvasState(); // Save state after adding comment
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
        const element = JSON.parse(e.dataTransfer.getData('element'));
        const imgElement = new Image();
        imgElement.crossOrigin = 'anonymous';
        imgElement.src = element.src.medium;

        imgElement.onload = () => {
            const fabricImg = new fabric.Image(imgElement, {
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center',
                selectable: true,
                evented: true,
            });

            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
            saveCanvasState(); // Save state after adding image
        };
    };

    useEffect(() => {
        const canvasElement = canvasRef.current;
        canvasElement.addEventListener('dragover', (e) => e.preventDefault());
        canvasElement.addEventListener('drop', handleDrop);

        return () => {
            canvasElement.removeEventListener('dragover', (e) => e.preventDefault());
            canvasElement.removeEventListener('drop', handleDrop);
        };
    }, [canvas]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 flex">
            <Sidebar onElementDrag={handleElementDrag} />
            <div className="flex-1 flex justify-center items-center bg-gray-800">
                <div
                    className="canvas-container relative flex justify-center items-center bg-gray-700 border-4 border-gray-600 shadow-lg"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <canvas ref={canvasRef} className="border-2 border-gray-500"></canvas>
                </div>
            </div>
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
                onRedo={handleRedo}
                onFontChange={handleChangeFont}
            />
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 cursor-pointer z-30 rounded"
            >
                Close
            </button>
            <div className="absolute bottom-4 flex gap-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 cursor-pointer z-30 rounded"
                    onClick={handleDownload}
                >
                    Download
                </button>
            </div>
            <div className="spinner" id="spinner">Loading...</div>
        </div>
    );
};
export default ImageModal;
