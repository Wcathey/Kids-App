const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const toolPicker = document.getElementById('toolPicker');
const clearBtn = document.getElementById('clearBtn');
const eraserBtn = document.getElementById('eraserBtn');
const imagePicker = document.getElementById('imagePicker');

let painting = false;
let eraserMode = false;
let backgroundImage = new Image();

// Resize canvas dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    loadImage();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load and Draw Image on Canvas
function loadImage() {
    backgroundImage.src = imagePicker.value;
    backgroundImage.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };
}
imagePicker.addEventListener('change', loadImage);
loadImage();

// Define Brush Styles
function getBrushSettings() {
    if (eraserMode) {
        return { size: 20, erase: true };
    }

    const tool = toolPicker.value;
    switch (tool) {
        case "pencil":
            return { size: 2, opacity: 1.0, color: colorPicker.value, erase: false };
        case "marker":
            return { size: 10, opacity: 1.0, color: colorPicker.value, erase: false };
        case "pastel":
            return { size: 15, opacity: 0.3, color: colorPicker.value, erase: false };
        default:
            return { size: 5, opacity: 1.0, color: colorPicker.value, erase: false };
    }
}

// Start and Stop Painting
function startPosition(e) {
    painting = true;
    draw(e);
}
function endPosition() {
    painting = false;
    ctx.beginPath();
}
function draw(e) {
    if (!painting) return;

    let x = e.clientX || e.touches[0].clientX;
    let y = e.clientY || e.touches[0].clientY;
    const brush = getBrushSettings();

    ctx.lineWidth = brush.size;
    ctx.lineCap = 'round';

    if (brush.erase) {
        ctx.globalCompositeOperation = "destination-out"; // Erase mode
        ctx.strokeStyle = "rgba(0,0,0,1)"; // Doesn't matter, as it's erasing
    } else {
        ctx.globalCompositeOperation = "source-over"; // Normal drawing mode
        ctx.globalAlpha = brush.opacity;
        ctx.strokeStyle = brush.color;
    }

    ctx.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
}

// Mouse & Touch Events
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e); });
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

// Eraser Button Toggle
eraserBtn.addEventListener('click', () => {
    eraserMode = !eraserMode;
    eraserBtn.textContent = eraserMode ? "Drawing Mode" : "Eraser";
});

// Clear Button (Keeps Background Image)
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
});