// Collection of p5.brush examples for the Motion Studio

// Common Studio Colors
const NAVY = "#0A0F29";
const CORAL = "#FF6B6B";
const GOLD = "#FFC857";
const TEAL = "#119DA4";
const CREAM = "#F4F1DE";

export const examples = {
    "Flowfield Orbit": flowfieldOrbit,
    "Watercolor Geometries": watercolorGeometries,
    "Hatching Pulse": hatchingPulse
};

// --- Example 1: Flowfield Orbit ---
function flowfieldOrbit(p, width=1920, height=1080) {
    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        brush.instance(p);
        brush.scaleBrushes(3);
        p.background(NAVY);
    };

    p.draw = () => {
        // Clear background every frame for clean animation
        p.background(NAVY);

        let t = p.frameCount * 0.01;

        // Setup a custom rotating field
        brush.addField("orbit", (time, field) => {
            for (let col = 0; col < field.length; col++) {
                for (let row = 0; row < field[0].length; row++) {
                    // Center coordinates roughly
                    let nx = (col / field.length - 0.5) * 2;
                    let ny = (row / field[0].length - 0.5) * 2;

                    let angle = p.atan2(ny, nx) + p.PI / 2 + p.sin(time) * 0.5;
                    field[col][row] = p.degrees(angle);
                }
            }
            return field;
        });

        brush.field("orbit");
        brush.refreshField(t);

        // Draw flowing lines
        p.randomSeed(42); // stable randomness per frame
        brush.set("HB", CORAL, 1.5);
        for(let i = 0; i < 40; i++) {
            let r = p.random(100, 400);
            let theta = p.random(p.TWO_PI) + t;
            let x = p.cos(theta) * r;
            let y = p.sin(theta) * r;
            brush.flowLine(x, y, 150, p.degrees(theta));
        }

        brush.set("spray", GOLD, 2);
        for(let i = 0; i < 20; i++) {
            let r = p.random(50, 200);
            let theta = p.random(p.TWO_PI) - t * 2;
            let x = p.cos(theta) * r;
            let y = p.sin(theta) * r;
            brush.flowLine(x, y, 200, p.degrees(theta));
        }

        brush.noField();
    };
}


// --- Example 2: Watercolor Geometries ---
function watercolorGeometries(p, width=1920, height=1080) {
    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        brush.instance(p);
        brush.scaleBrushes(3.5);
    };

    p.draw = () => {
        p.background(CREAM);

        let t = p.frameCount * 0.02;

        brush.noStroke();

        // Pulsing background shape
        p.push();
        brush.fill(NAVY, 200);
        brush.fillBleed(0.4, "out");
        brush.fillTexture(0.55, 0.5);
        let s1 = 300 + p.sin(t) * 50;
        brush.circle(0, 0, s1, true);
        p.pop();

        // Orbiting coral shape
        p.push();
        let cx = p.cos(t * 1.5) * 200;
        let cy = p.sin(t * 1.5) * 200;
        brush.fill(CORAL, 220);
        brush.fillBleed(0.6, "in");
        brush.fillTexture(0.7, 0.4);
        brush.rect(cx, cy, 180, 180, "center");
        p.pop();

        // Orbiting teal shape
        p.push();
        let tx = p.cos(t * 1.5 + p.PI) * 200;
        let ty = p.sin(t * 1.5 + p.PI) * 200;
        brush.fill(TEAL, 180);
        brush.fillBleed(0.2, "out");
        brush.circle(tx, ty, 120, true);
        p.pop();
    };
}


// --- Example 3: Hatching Pulse ---
function hatchingPulse(p, width=1920, height=1080) {
    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL);
        brush.instance(p);
        brush.scaleBrushes(3);
    };

    p.draw = () => {
        p.background(NAVY);

        let t = p.frameCount * 0.05;

        // Define hatching style
        brush.hatchStyle("rotring", CORAL, 1.2);

        p.randomSeed(99);

        // Draw multiple nested/overlapping shapes with different hatch angles
        for (let i = 0; i < 5; i++) {
            let offsetPhase = i * 1.2;
            let s = 100 + i * 80 + p.sin(t + offsetPhase) * 40;

            brush.noStroke();
            brush.noFill();

            // Dynamic hatch angle and distance
            let hAngle = t * 10 + (i * 30);
            let hDist = 8 + p.sin(t) * 2;

            brush.hatch(hDist, hAngle, {rand: 0.1, continuous: false});

            p.push();
            // Wiggle movement
            p.translate(p.sin(t * 0.5 + i) * 30, p.cos(t * 0.7 + i) * 30);

            if (i % 2 === 0) {
                brush.circle(0, 0, s, true);
            } else {
                brush.rect(0, 0, s*1.5, s*1.5, "center");
            }
            p.pop();
        }

        brush.noHatch();
    };
}