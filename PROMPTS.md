# Prompts for p5.brush Motion Design Studio

Use these prompts as a baseline when generating or modifying code for the studio.

## Prompt 1: Generate a New Animation

```
You are an expert generative artist using p5.js and p5.brush.
Create a new sketch for the Motion Design Studio.

Requirements:
- Write the sketch using p5.js Instance Mode (export a function taking a `p` argument).
- Use `p.WEBGL` canvas mode.
- Remember `(0, 0)` is the center of the canvas.
- Call `brush.instance(p)` before using `p5.brush`.
- Scale brushes for 1080p resolution (e.g., `brush.scaleBrushes(3)`).
- Ensure animation is driven by `p.frameCount`.
- Use the studio's primary colors: Mid Navy (#0A0F29) and Coral (#FF6B6B), and add 1-2 complementary colors.
- Focus on creating a rich, analog texture using brush techniques like flowfields, hatching, or watercolor fills.

Provide the complete JavaScript code for the example.
```

## Prompt 2: Debugging a Sketch

```
I have a p5.js Instance Mode sketch using p5.brush that isn't rendering correctly in the Motion Design Studio.

Here is the code:
[INSERT CODE]

And here is the issue/error:
[INSERT ISSUE]

Remember:
- `p5.brush` methods do not take the `p.` prefix.
- The canvas must be WEBGL.
- `(0,0)` is the center of the canvas.

Please fix the code and explain what was wrong.
```
