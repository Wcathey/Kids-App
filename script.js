const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const imagePicker = document.getElementById('imagePicker');

let painting = false;
let backgroundImage = new Image();

// Resize canvas dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    loadImage(); // Reload image after resize
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
loadImage(); // Load the first image by default

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

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
}

// Mouse Events
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Touch Events
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPosition(e);
});
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
});

// Clear Canvas (Redraws the Image)
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
});
