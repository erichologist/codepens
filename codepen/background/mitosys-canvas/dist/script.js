/*--------------------
Settings
--------------------*/
let canvas = document.getElementById('mitosys'),
ctx = canvas.getContext('2d'),
winW = canvas.width = window.innerWidth,
winH = canvas.height = window.innerHeight,
ticker = 0,
Balls = [],
maxBalls = 10,
easing = 1 / 10;


/*--------------------
Balls
--------------------*/
class Ball {
  constructor(options) {

    Object.assign(this, options);

    this.r = 100 + Math.random() * 100;
    this.pos = {
      x: Math.random() * winW,
      y: Math.random() * winH };

    this.direction = {
      x: -1 + Math.random() * 2,
      y: -1 + Math.random() * 2 };

    this.activePos = {
      x: this.pos.x,
      y: this.pos.y };

  }

  draw() {
    this.color = gradientBg(this.activePos.x, this.activePos.y, this.r);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.activePos.x, this.activePos.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.activePos.x,
    dy = mouse.y - this.activePos.y;

    this.activePos.x += this.direction.x;
    this.activePos.y += this.direction.y;

    if (this.activePos.x < 0 || this.activePos.x > winW) {
      this.direction.x *= -1;
    }
    if (this.activePos.y < 0 || this.activePos.y > winH) {
      this.direction.y *= -1;
    }
  }}



/*--------------------
Gradient BG
--------------------*/
const gradientBg = (x, y, r) => {
  bg = ctx.createRadialGradient(x - r / 3, y - r / 7, 0, x, y, r);
  bg.addColorStop(0, '#999');
  bg.addColorStop(.95, '#333');
  ctx.globalCompositeOperation = "lighten screen blur(10px)";
  return bg;
};


/*--------------------
Distance
--------------------*/
const dist = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};


/*--------------------
Get Mouse
--------------------*/
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, dir: '' };
const getMouse = e => {
  mouse = {
    x: e.clientX || e.pageX || e.touches[0].pageX || 0,
    y: e.clientY || e.pageX || e.touches[0].pageY || 0,
    dir: getMouse.x > e.clientX ? 'left' : 'right' };

};
['mousemove', 'touchstart', 'touchmove'].forEach(e => {
  window.addEventListener(e, getMouse);
});


/*--------------------
Init
--------------------*/
const init = () => {
  console.clear();
  winW = canvas.width = window.innerWidth;
  winH = canvas.height = window.innerHeight;
  ctx.globalCompositeOperation = "lighten";

  Balls = [];
  for (let i = 0; i < maxBalls; i++) {
    Balls.push(new Ball());
  }
};
init();


/*--------------------
Animate
--------------------*/
const animate = () => {
  ticker += .1;
  ctx.clearRect(0, 0, winW, winH);
  window.requestAnimationFrame(animate);
  Balls.forEach(ball => {
    ball.update();
    ball.draw();
  });
};
animate();


/*--------------------
Resize
--------------------*/
window.addEventListener('resize', () => {
  init();
});