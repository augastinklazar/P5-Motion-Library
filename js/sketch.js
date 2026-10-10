import { captureFrame } from './video_exporter.js';
import { examples } from './examples.js';

let currentP5 = null;
let isRecording = false;
let recordDuration = 120; // frames
let renderCallback = null;

export function loadSketch(exampleName, width, height, canvasContainer) {
    if (currentP5) {
        currentP5.remove();
        currentP5 = null;
    }

    const sketchFn = examples[exampleName];
    if (!sketchFn) {
        console.error("Example not found:", exampleName);
        return;
    }

    const sketchWrapper = (p) => {
        // Pass width and height to the example so it can setup properly
        sketchFn(p, width, height);

        const originalDraw = p.draw;
        p.draw = () => {
            if (originalDraw) originalDraw();

            if (isRecording) {
                const canvas = document.querySelector('#p5-container canvas');
                if (canvas) {
                    captureFrame(canvas, p.frameCount).then(() => {
                        if (p.frameCount >= recordDuration) {
                            stopRecording(p);
                        }
                    });
                }
            }
        };
    };

    currentP5 = new p5(sketchWrapper, canvasContainer);
}

export function startRecording(duration, onFinish) {
    if (!currentP5) return;

    isRecording = true;
    recordDuration = duration;
    renderCallback = onFinish;

    currentP5.frameCount = 0;
}

function stopRecording(p) {
    isRecording = false;
    if (renderCallback) {
        renderCallback(p.frameCount);
    }
}
