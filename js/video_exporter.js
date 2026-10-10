// This module handles capturing canvas frames and encoding them to MP4 using ffmpeg.wasm

const { FFmpeg } = FFmpegWASM;
const { fetchFile } = FFmpegUtil;

let ffmpeg = null;

export async function initFFmpeg(statusCallback) {
    if (ffmpeg) return;

    statusCallback("Loading FFmpeg...");
    ffmpeg = new FFmpeg();

    // Setup log listener for debugging and progress
    ffmpeg.on('log', ({ message }) => {
        console.log(message);
        if (message.includes("frame=")) {
             statusCallback(`Encoding: ${message}`);
        }
    });

    ffmpeg.on('progress', ({ progress, time }) => {
        statusCallback(`Encoding... ${(progress * 100).toFixed(1)}%`);
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';

    try {
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        statusCallback("FFmpeg ready.");
    } catch (e) {
        console.error(e);
        statusCallback("Error loading FFmpeg. Check console.");
    }
}

// Utility to fix cross-origin blob issues in some browsers
async function toBlobURL(url, mimeType) {
    const resp = await fetch(url);
    const buf = await resp.arrayBuffer();
    const blob = new Blob([buf], { type: mimeType });
    return URL.createObjectURL(blob);
}

export async function captureFrame(canvas, frameNum) {
    if (!ffmpeg) return;

    return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
            const buffer = await blob.arrayBuffer();
            const fileName = `frame_${frameNum.toString().padStart(5, '0')}.png`;
            await ffmpeg.writeFile(fileName, new Uint8Array(buffer));
            resolve();
        }, 'image/png');
    });
}

export async function encodeVideo(totalFrames, fps, statusCallback) {
    if (!ffmpeg) return null;

    statusCallback("Starting encoding...");

    try {
        // Run FFmpeg to stitch frames.
        // -framerate applies to input images
        // -c:v libx264 encodes to standard MP4 format
        // -pix_fmt yuv420p ensures maximum compatibility for standard players
        await ffmpeg.exec([
            '-framerate', fps.toString(),
            '-i', 'frame_%05d.png',
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-crf', '18', // High quality
            'output.mp4'
        ]);

        statusCallback("Encoding finished. Preparing download...");
        const fileData = await ffmpeg.readFile('output.mp4');
        const data = new Uint8Array(fileData);

        // Cleanup written frames to free memory
        for (let i = 0; i < totalFrames; i++) {
            const fileName = `frame_${i.toString().padStart(5, '0')}.png`;
            try {
                await ffmpeg.deleteFile(fileName);
            } catch(e) {}
        }

        return data;

    } catch (err) {
        console.error(err);
        statusCallback("Error during encoding!");
        return null;
    }
}

export function downloadBlob(data, filename) {
    const blob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
