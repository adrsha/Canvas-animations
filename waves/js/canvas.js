var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
canvas.width = innerWidth;
canvas.height = innerHeight;
// variables
let amplitude = 20;
let pos = 0;
let velocity = 5;
let wavelength = metersToPixels(0.15);

function metersToPixels(met) {
    return (met * 1) / 0.0002645833;
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "rgba(255,25,55,1)";
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.beginPath();
    c.moveTo(0, canvas.height / 2);
    for (let i = 0; i <= canvas.width; i++) {
        c.lineTo(
            i,
            canvas.height / 2 +
            amplitude * Math.sin(2 * Math.PI * (i - pos) / wavelength)
        );
    }
    c.lineTo(canvas.width, canvas.height);
    c.lineTo(0, canvas.height);
    c.fill();
    pos += velocity;
}
animate();
