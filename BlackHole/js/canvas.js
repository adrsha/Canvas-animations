// default
const canvas = document.querySelector("canvas");
const bgColor = "#0D0D0D";
canvas.style.background = bgColor;
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// variables
let blackHoleIncrease;
let blackHoleRadius = 15;
const totalObjects = 200;
const colors = ["#2E4159", "#777E8C", "#121926", "#5A37A6"];
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};
let objectArray = [];
let blackHoleColor = "rgba(0,0,0,0.7)";
let blackHoleOutline = "rgba(255,125,0,0.3)";
let blackHoleGlow = "rgba(255,0,0,0)";
// event listeners
canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
canvas.addEventListener("mousedown", () => {
    blackHoleIncrease = true;
});
canvas.addEventListener("mouseup", () => {
    blackHoleIncrease = false;
});
// utility functions
// function reduceOpacityOf(color){
//     color
// }
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
    constructor(radius, color, radians, cmRadius) {
        this.x = mouse.x;
        this.initX = this.x;
        this.initY = this.y;
        this.y = mouse.y;
        this.radius = radius;
        this.color = color;
        this.radians = radians;
        this.cmRadius = cmRadius;
        this.velocity = randomValFrom(0.01, 0.05);
        this.orgiV = this.velocity;
        this.center = { x: this.x, y: this.y };
        this.lastMouse = this.center;
    }
    draw() {
        c.beginPath();
        // c.strokeStyle = this.color;
        c.fillStyle = this.color;
        // c.lineWidth = this.radius;
        // c.moveTo(prevPos.x, prevPos.y);
        // c.lineTo(this.x, this.y);
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // c.stroke();
        c.fill();
    }
    update() {
        // drag effect
        this.center.x += (mouse.x - this.center.x) * this.velocity * 5;
        this.center.y += (mouse.y - this.center.y) * this.velocity * 5;
        // this.x += this.dx;
        // this.y += this.dy;
        this.x = this.center.x + Math.cos(this.radians) * this.cmRadius;
        this.y = this.center.y + Math.sin(this.radians) * this.cmRadius;

        this.radians += this.velocity;
        this.draw();
        if (blackHoleIncrease) {
            if (blackHoleRadius < 40) {
                blackHoleRadius += 0.05;
                if (this.velocity < 0.07) {
                    this.velocity *= 7 / 5;
                }
            }
        } else {
            if (blackHoleRadius > 15) {
                blackHoleRadius -= 0.01;
                if (this.velocity > this.orgiV) {
                    this.velocity /= 7 / 5;
                }
            }
        }
    }
}
// canvas functions
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}
//initiation
function init() {
    objectArray = [];
    for (let i = 0; i < totalObjects; i++) {
        // var radius = 3;
        var radius = randomValFrom(1, 4);
        var color = randomColorFrom(colors);
        var cmRadius = randomIntFrom(50, 250);
        var radians = randomValFrom(0, Math.PI * 2);
        objectArray.push(new Object(radius, color, radians, cmRadius));
    }

    return;
}
// animation
function animate() {
    requestAnimationFrame(animate);
    clear();
    for (let i = 0; i < objectArray.length; i++) {
        objectArray[i].update();
    }
    // remove dirty background
    var grd = c.createRadialGradient(
        mouse.x,
        mouse.y,
        blackHoleRadius / 2,
        mouse.x,
        mouse.y,
        blackHoleRadius
    );
    grd.addColorStop(0.4, blackHoleColor);
    grd.addColorStop(0.5, blackHoleOutline);
    grd.addColorStop(0.9, blackHoleGlow);

    c.fillStyle = grd;
    c.arc(mouse.x, mouse.y, blackHoleRadius, Math.PI * 2, false);
    c.fill();
}
init();
animate();
