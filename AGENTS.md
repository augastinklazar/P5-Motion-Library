# Agent Context for p5.brush Motion Design Studio

This repository is a motion design studio focused on creating stunning, hand-drawn-like animations using `p5.brush`. It integrates a client-side video rendering pipeline using `ffmpeg.wasm` to produce production-ready MP4 outputs.

As an AI agent, your goal is to help users generate and perfect `p5.js` sketches that leverage the `p5.brush` library within this specific studio environment.

## The Architecture

The studio uses the following architecture:
- **`p5.js` in Instance Mode:** All sketches must be written for p5.js Instance Mode. The p5 instance is injected into the sketching functions.
- **`p5.brush` Library:** We use `p5.brush` to achieve organic, analog drawing styles.
- **Recording Pipeline:** The studio records frame-by-frame by hooking into the `draw()` loop. The sketch needs to handle a `frameCount` or `t` value appropriately and inform the main app when the animation is complete (if it's a fixed duration).

## Writing Code for this Studio

When asked to generate a new animation or modify an existing one, follow these rules:

1. **Instance Mode is Mandatory**:
   Your code will be exported as a function that takes a p5 instance (`p`).
   ```javascript
   export function myExample(p) {
       p.setup = () => {
           // Always use WEBGL for p5.brush
           p.createCanvas(1920, 1080, p.WEBGL);
           brush.instance(p);
           // ...
       };
       p.draw = () => {
           // ...
       };
   }
   ```
   **Important:** `p5.brush` methods (like `brush.set`, `brush.line`, etc.) do *not* need the `p.` prefix once `brush.instance(p)` has been called.

2. **Resolution & Aspect Ratio**:
   The canvas size is dynamically set by the UI (1080p in either 16:9 or 9:16). Do not hardcode canvas sizes in `setup()`. Use `p.width` and `p.height` for positioning and scaling elements.

3. **Animation Loop for Recording**:
   To ensure smooth recordings, avoid logic that depends on realtime `millis()`. Instead, use `p.frameCount` or a normalized time variable `t`.
   If the animation has a specific end time (e.g., 300 frames), the sketch should provide a way for the app to know it's done, or the app will record for a default duration. In this studio, we typically record a fixed number of frames set by the user or the example configuration.

4. **Using p5.brush**:
   - Always call `brush.instance(p)` before using brush functions in instance mode.
   - You must use `p.WEBGL` mode.
   - Because `p5.brush` draws in WebGL, remember that the origin `(0, 0)` is at the **center** of the canvas, not the top-left!
   - Make sure to call `brush.scaleBrushes(...)` if using default brushes on a large 1080p canvas. `brush.scaleBrushes(3)` is a good starting point.

## Production-Ready Standards

A "production-ready" video output in this studio means:
- **High Resolution**: We target 1080p (1920x1080 or 1080x1920).
- **Smooth Framerates**: Motion should be continuous and mathematically sound (e.g., using sine waves or noise for movement).
- **Rich Texture**: Use the capabilities of `p5.brush` (hatching, washes, bleeds) rather than flat p5 geometries.
- **Color Palettes**: Stick to cohesive, well-planned color palettes. The default studio colors are Mid Navy (`#0A0F29`) and Coral (`#FF6B6B`), but you can introduce complementary palettes.

## Working with Examples

New examples should be added to `js/examples.js`. Each example must export a setup function that initializes the p5 sketch with the appropriate logic.
