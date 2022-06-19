var canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});
var twnkl_count = 0;
var gcd = function (a, b) {
    if (!b) return a;

    return gcd(b, a % b);
};
colors = ["#355070", "#6D597A", "#B56576", "#E56B6F", "#EAAC8B"];
colors2 = [
    "rgba(255,255,255,1)",
    "rgba(255,255,255,0.5)",
    "rgba(255,255,255,0.25)",
    "rgba(255,255,255,0.75)",
    "rgba(255,255,255,0.1)",
];
var c = canvas.getContext("2d");
var circleArray = [];
var clicked = false;
var clickCount = 1;
// Mouse thingy!
var mouse = {
    x: undefined,
    y: undefined,
};

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
canvas.addEventListener("mousedown", (e) => {
    if (!clicked) {
        clicked = true;
    } else {
        clicked = false;
    }
});
// canvas.addEventListener("mouseup", (e) => {
//     clicked = false;
// });

// Circle Object
class Circle {
    constructor(x, y, dx, dy, radius, coloRand) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.orGicolor = colors[coloRand];
        this.color = colors[coloRand];
        this.color2 = colors2[coloRand];
        // this.twinkle = Math.random();
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, Math.abs(this.radius), 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        // if (twnkl_count % 10 == 0) {
        // this.twinkle = Math.random() * 0.5 + 0.5;
        // }

        if (this.x > innerWidth - this.radius || this.x < this.radius) {
            this.dx *= -1;
        }

        if (this.y > innerHeight - this.radius || this.y < this.radius) {
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;
        // mouse things
        if (
            Math.abs(mouse.x - this.x) < 50 &&
            Math.abs(mouse.y - this.y) < 50
        ) {
            if (this.radius < 50) {
                this.radius += 3;
            }
        } else {
            if (this.radius > this.minRadius) {
                this.radius -= 1;
            }
        }

        // clicked thingy!
        if (clicked) {
            var grd = c.createRadialGradient(
                this.x,
                this.y,
                this.radius / 2,
                this.x,
                this.y,
                this.radius
            );
            grd.addColorStop(0, `${this.color2}`);
            grd.addColorStop(1, `rgb(255, 255, 255, 0)`);
            this.color = grd;
            canvas.style.background = "linear-gradient(#A5A6A1, #BBBFBA)";
            // canvas.style.background = "linear-gradient(#F0433A, #C9283E)";
        } else {
            this.color = this.orGicolor;
            canvas.style.background = "#2b2d42";
        }
    }
}
function init() {
    c.clearRect(0, 0, innerWidth, innerHeight);
    circleArray = []
    for (var i = 0; i < 900; i++) {
        var radius = Math.random() * 8 + 2;
        var x = Math.random() * (innerWidth - 2 * radius) + radius;
        var y = Math.random() * (innerHeight - 2 * radius) + radius;
        var dx = (Math.random() - 0.5) * 5;
        var dy = (Math.random() - 0.5) * 5;
        var coloRand = Math.abs(Math.floor(Math.random() * colors.length));
        circleArray.push(new Circle(x, y, dx, dy, radius, coloRand));
    }
}
init();
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].draw();
        circleArray[i].update();
    }
}
animate();
