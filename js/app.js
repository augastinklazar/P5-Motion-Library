import { examples } from './examples.js';
import { loadSketch, startRecording, updateCanvasSize } from './sketch.js';
import { initFFmpeg, encodeVideo, downloadBlob } from './video_exporter.js';

const exampleSelect = document.getElementById('example-select');
const aspectRatioSelect = document.getElementById('aspect-ratio');
const durationInput = document.getElementById('duration');
const renderBtn = document.getElementById('render-btn');
const statusBox = document.getElementById('status');
const p5Container = document.getElementById('p5-container');
const canvasContainer = document.getElementById('canvas-container');

// Settings
let currentWidth = 1920;
let currentHeight = 1080;
const FPS = 30; // standard recording FPS

// Initialize UI
function init() {
    // Populate Examples
    for (const name in examples) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        exampleSelect.appendChild(option);
    }

    // Event Listeners
    exampleSelect.addEventListener('change', reloadCurrentSketch);
    aspectRatioSelect.addEventListener('change', handleAspectRatioChange);
    window.addEventListener('resize', scaleCanvasPreview);

    renderBtn.addEventListener('click', handleRender);

    // Initial Load
    handleAspectRatioChange(); // Sets dimensions and loads sketch
    scaleCanvasPreview();
}

function reloadCurrentSketch() {
    const exampleName = exampleSelect.value;
    loadSketch(exampleName, currentWidth, currentHeight, 'p5-container');
    setTimeout(scaleCanvasPreview, 100); // give it a moment to attach canvas
}

function handleAspectRatioChange() {
    if (aspectRatioSelect.value === '16:9') {
        currentWidth = 1920;
        currentHeight = 1080;
    } else {
        currentWidth = 1080;
        currentHeight = 1920;
    }

    // We recreate the sketch entirely on aspect ratio change to ensure setup runs correctly
    reloadCurrentSketch();
}

// Scale the CSS transform so the 1080p canvas fits in the view pane
function scaleCanvasPreview() {
    const viewWidth = canvasContainer.clientWidth - 40; // 40px padding
    const viewHeight = canvasContainer.clientHeight - 40;

    const scaleX = viewWidth / currentWidth;
    const scaleY = viewHeight / currentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up past 1

    p5Container.style.transform = `scale(${scale})`;
    p5Container.style.width = `${currentWidth}px`;
    p5Container.style.height = `${currentHeight}px`;
}

async function handleRender() {
    renderBtn.disabled = true;
    exampleSelect.disabled = true;
    aspectRatioSelect.disabled = true;

    try {
        await initFFmpeg(updateStatus);

        const duration = parseInt(durationInput.value, 10);
        updateStatus(`Recording ${duration} frames...`);

        // Start capture process in sketch
        startRecording(duration, async (framesCaptured) => {
            updateStatus(`Recording complete. Encoding MP4...`);

            // Encode the captured frames
            const mp4Blob = await encodeVideo(framesCaptured, FPS, updateStatus);

            if (mp4Blob) {
                const safeName = exampleSelect.value.replace(/\s+/g, '_').toLowerCase();
                downloadBlob(mp4Blob, `${safeName}_${currentWidth}x${currentHeight}.mp4`);
                updateStatus("Finished! Video downloaded.");
            } else {
                updateStatus("Error: Encoding failed.");
            }

            // Reset UI
            resetUI();
        });

    } catch(err) {
        console.error(err);
        updateStatus("An error occurred. Check console.");
        resetUI();
    }
}

function updateStatus(msg) {
    statusBox.textContent = msg;
}

function resetUI() {
    renderBtn.disabled = false;
    exampleSelect.disabled = false;
    aspectRatioSelect.disabled = false;
}

// Boot up
window.onload = init;
