// default
const canvas = document.querySelector("canvas");
canvas.style.background = "#0D0D0D";
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    // automatic numbering for the objects
    var maxObjects = (canvas.width / 40) * (canvas.height / 40);
    totalObjects = maxObjects / 2;
    init();
});

// variables
var maxObjects = (canvas.width / 40) * (canvas.height / 40);
let totalObjects = maxObjects / 2;
const colors = ["#F2E2CE", "#D9AB82", "#A65221", "#591E08"];
let mouse = {
    x: undefined,
    y: undefined,
};
let objectArray = [];
// event listeners
canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// utility functions
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function randomValFrom(x, y) {
    return Math.random() * (y - x) + x;
}
function randomIntFrom(x, y) {
    return Math.round(Math.random() * (y - x) + x);
}
function randomColorFrom(array) {
    return array[randomIntFrom(0, array.length - 1)];
}

// object
class Object {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.opacity = 0.01;
        this.velocity = {
            x: randomValFrom(-2, 2),
            y: randomValFrom(-2, 2),
        };
        this.mass = 0.05 * this.radius;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        // c.strokeStyle = this.color;
        // c.stroke();
    }
    update(objectArray) {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        BounceOfTheEdgesOfTheScreen(this);
        // if they are colliding
        for (let i = 0; i < objectArray.length; i++) {
            if (this == objectArray[i]) {
                continue;
            }

            if (
                getDistance(
                    this.x,
                    this.y,
                    objectArray[i].x,
                    objectArray[i].y
                ) <
                this.radius + objectArray[i].radius
            ) {
                resolveCollision(this, objectArray[i]);
            }
        }
        // mouse thingy
        if (getDistance(mouse.x, mouse.y, this.x, this.y) < 120) {
            if (this.opacity < 1) {
                this.opacity += 0.07;
            }
        } else if (this.opacity > 0) {
            this.opacity -= 0.02;
            this.opacity = Math.max(0.01, this.opacity);
        }
    }
}
// canvas functions
function BounceOfTheEdgesOfTheScreen(object) {
    if (
        object.x - object.radius < 0 ||
        object.x + object.radius > canvas.width
    ) {
        object.velocity.x *= -1;
        console.log;
    } else if (
        object.y - object.radius < 0 ||
        object.y + object.radius > canvas.height
    ) {
        object.velocity.y *= -1;
    }
}
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding particles
        const angle = -Math.atan2(
            otherParticle.y - particle.y,
            otherParticle.x - particle.x
        );

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle); //vector rotation
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = {
            x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
            // y: (u1.y * (m1 - m2)) / (m1 + m2) + (u2.y * 2 * m2) / (m1 + m2),
            y: u1.y, //^-- is not required as y does not affect after rotation
        };
        const v2 = {
            x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m1) / (m1 + m2),
            // y: (u2.y * (m1 - m2)) / (m1 + m2) + (u1.y * 2 * m1) / (m1 + m2),
            y: u2.y,
        };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

//initiation
function init() {
    objectArray = [];
    for (let i = 0; i < totalObjects; i++) {
        let radius = randomValFrom(10, 20);
        let x = randomValFrom(radius, canvas.width - radius);
        let y = randomValFrom(radius, canvas.height - radius);
        let color = randomColorFrom(colors);
        // check if the balls are overlapping
        if (i !== 0) {
            for (let j = 0; j < objectArray.length; j++) {
                if (
                    getDistance(x, y, objectArray[j].x, objectArray[j].y) <
                    radius + objectArray[j].radius
                ) {
                    x = randomValFrom(radius, canvas.width - radius);
                    y = randomValFrom(radius, canvas.height - radius);
                    j = -1;
                }
            }
        }

        objectArray.push(new Object(x, y, radius, color));
    }
    return;
}
// animation
function animate() {
    requestAnimationFrame(animate);
    clear();
    for (let i = 0; i < objectArray.length; i++) {
        objectArray[i].update(objectArray);
    }
}
init();
animate();
