var canvas = document.querySelector("canvas");
canvas.width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
canvas.height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

var clickCount = 0;
var clicked = false;
var gravity = 1;
var friction = 0.3;
var circleArray = [];
var c = canvas.getContext("2d");
var colors = [
    "rgb(226, 125, 96)",
    "rgb(133, 205, 202)",
    "#e8a87c",
    "#41b3a3",
    "#c38d9e",
];

canvas.addEventListener("mousedown", () => {
    clicked = true;
});

canvas.addEventListener("mouseup", () => {
    clicked = false;
});

class Circle {
    constructor(x, y, radius, dx, dy, color) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fill();
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;

        // gravity and collision detection
        if (this.y + this.dy + this.radius > canvas.height) {
            this.dy *= -1 * (1 - friction);
            this.dx *= 1 - friction / 4;
        } else {
            this.dy += gravity;
        }
        // if (this.y + this.dy - this.radius < 0) {
        //     this.dy *= -1;
        // }
        if (
            this.x + this.dx + this.radius > canvas.width ||
            this.x + this.dx - this.radius < 0
        ) {
            this.dx *= -1;
            this.dy *= 1 - friction / 1.02;
        }

        // clicked stuff
        if (clicked && clickCount == 0) {
            if (this.y > canvas.height / 2) {
                this.dy -= Math.random() * 2 + 2;
                this.dx += (Math.random() - 0.5) * 3;
            }
        }
    }
}
function init() {
    circleArray = [];
    for (var i = 0; i < 100; i++) {
        var radius = Math.random() * 10 + 10;
        var x = Math.random() * (canvas.width - 2 * radius) + radius;
        var y = Math.random() * (canvas.height - 2 * radius) + radius;
        var dy = (Math.random() - 0.5) * 5;
        var dx = (Math.random() - 0.5) * 18;
        var color = colors[randIntBtwn(0, colors.length)];
        var circle = new Circle(x, y, radius, dx, dy, color);
        circleArray.push(circle);
    }
}
var ran;
function randIntBtwn(x, y) {
    ran = Math.round(Math.random() * (y - x) + x);
    return ran;
}
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}
init();

function animate() {
    requestAnimationFrame(animate);
    clear();
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].draw();
        circleArray[i].update();
    }
}
animate();
