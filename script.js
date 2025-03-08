// Get elements
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("coloringImage");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");

let painting = false;
let erasing = false;

// Resize canvas to match image
function resizeCanvas() {
    const container = document.querySelector(".canvas-container");
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// Ensure canvas is always correct size
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
    resizeCanvas();
    ctx.lineCap = "round";
});

// Start drawing
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", stopPosition);
canvas.addEventListener("mousemove", draw);

// Touch support for mobile
canvas.addEventListener("touchstart", (e) => startPosition(e.touches[0]));
canvas.addEventListener("touchend", stopPosition);
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Prevents screen from moving
    draw(e.touches[0]);
});

// Start drawing
function startPosition(e) {
    painting = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Stop drawing
function stopPosition() {
    painting = false;
    ctx.beginPath();
}

// Drawing function
function draw(e) {
    if (!painting) return;
    
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";

    if (erasing) {
        ctx.globalCompositeOperation = "destination-out"; // Makes strokes transparent
    } else {
        ctx.globalCompositeOperation = "source-over"; // Normal drawing
        ctx.strokeStyle = colorPicker.value;
    }

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
}

// Toggle eraser mode
eraserBtn.addEventListener("click", () => {
    erasing = !erasing;
    eraserBtn.style.backgroundColor = erasing ? "#d43f3f" : "#ff4444";
});

// Clear canvas
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});