document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clear-button');
    const predictionText = document.getElementById('prediction-text');
    const predictionBox = document.getElementById('prediction-box');
    const canvasContainer = document.getElementById('canvas-container');
    const confidenceBarsContainer = document.getElementById('confidence-bars');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // --- Setup ---
    function initialize() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        predictionText.textContent = '?';
        predictionText.classList.remove('visible');
        predictionBox.classList.remove('predicted');
        canvasContainer.classList.remove('analyzing');
        buildConfidenceBars();
    }

    function buildConfidenceBars() {
        confidenceBarsContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const item = document.createElement('div');
            item.classList.add('confidence-bar-item');
            item.innerHTML = `
                <span class="digit-label">${i}</span>
                <div class="bar-container">
                    <div class="bar" id="bar-${i}" style="width: 0%;"></div>
                </div>
            `;
            confidenceBarsContainer.appendChild(item);
        }
    }

    // --- Drawing Logic ---
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 22;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    // --- Prediction Logic ---
    async function predictDigit() {
        canvasContainer.classList.add('analyzing');
        const imageDataURL = canvas.toDataURL('image/png');
        
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageDataURL }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            
            // Display main prediction
            predictionText.textContent = data.prediction;
            predictionText.classList.add('visible');
            predictionBox.classList.add('predicted');

            // Display confidence scores if they exist
            if (data.confidence) {
                for (let i = 0; i < 10; i++) {
                    const bar = document.getElementById(`bar-${i}`);
                    if(bar) {
                        bar.style.width = `${data.confidence[i] * 100}%`;
                    }
                }
            }

        } catch (error) {
            console.error('Error predicting digit:', error);
            predictionText.textContent = 'E';
            predictionText.classList.add('visible');
        } finally {
            canvasContainer.classList.remove('analyzing');
        }
    }

    // --- Event Listeners ---
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', draw);
    
    canvas.addEventListener('mouseup', () => {
        if (isDrawing) {
            isDrawing = false;
            predictDigit();
        }
    });
    
    canvas.addEventListener('mouseout', () => {
         if (isDrawing) {
            isDrawing = false;
            predictDigit();
        }
    });

    clearButton.addEventListener('click', initialize);

    // Initialize the app
    initialize();
});
