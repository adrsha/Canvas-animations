// default
const canvas = document.querySelector("canvas");
canvas.style.background = "#024850";
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// variables

const totalObjects = 10;
const colors = ["#FFB409", "#008080", "#E87409", "#FCDDCC"];
let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
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
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.strokeStyle = this.color;
        // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
        c.stroke();
    }
    update() {
        this.draw();
        // this.x += this.dx;
        // this.y += this.dy;
        BounceOfTheEdgesOfTheScreen(this);
    }
}
// canvas functions
function BounceOfTheEdgesOfTheScreen(object) {
    if (
        object.x - object.radius < 0 ||
        object.x + object.radius > canvas.width
    ) {
        object.dx *= -1;
    } else if (
        object.y - object.radius < 0 ||
        object.y + object.radius > canvas.height
    ) {
        object.dy *= -1;
    }
}
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}
//initiation
function init() {
    objectArray = [];
    for (let i = 0; i < totalObjects; i++) {
        var radius = randomValFrom(10, 20);
        var x = randomValFrom(radius, canvas.width - radius);
        var y = randomValFrom(radius, canvas.height - radius);
        var color = randomColorFrom(colors);
        objectArray.push(new Object(x, y, radius, color));
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
    // remove the below
    c.fillStyle = colors[1];
    c.font = "25px verdana, sans-serif ";
    c.fillText("Canvas Boilerplate", mouse.x, mouse.y);
    // -----------------------------------------------
}
init();
animate();
