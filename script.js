const ocean = document.getElementById("ocean");
const line = document.getElementById("line");
const moneyEl = document.getElementById("money");

let balance = 0;
let isCasting = false;
let hookY = 0;
let currentX = window.innerWidth / 2;

const fishData = [
  { price: 10, speed: 1.5, img: "fish.png", type: "good" },
  { price: 50, speed: 3, img: "fish2.png", type: "good" },
  { price: 150, speed: 8, img: "fish3.png", type: "good" },
  { price: -500, speed: 5, img: "danger.png", type: "bad" } 
];

const activeFishes = [];

const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

const startAction = (e) => {
  isCasting = true;
  currentX = getX(e);
};

const endAction = () => (isCasting = false);
const updatePosition = (e) => {
  currentX = getX(e);
  if (!isCasting) line.style.left = currentX + "px";
};

window.addEventListener("touchstart", startAction);
window.addEventListener("touchend", endAction);
window.addEventListener("touchmove", updatePosition);
window.addEventListener("mousedown", startAction);
window.addEventListener("mouseup", endAction);
window.addEventListener("mousemove", updatePosition);

function spawnFish() {
  const type = fishData[Math.floor(Math.random() * fishData.length)];
  const el = document.createElement("div");
  el.className = "fish";
  el.style.backgroundImage = `url('${type.img}')`;
  ocean.appendChild(el);

  const fish = {
    el,
    x: Math.random() * (window.innerWidth - 100),
    y: 100 + Math.random() * (window.innerHeight - 250),
    dx: (Math.random() > 0.5 ? 1 : -1) * type.speed,
    price: type.price,
    isBad: type.type === "bad"
  };

  
  if (fish.isBad) {
    setTimeout(() => {
      const index = activeFishes.indexOf(fish);
      if (index > -1) {
        fish.el.style.opacity = "0"; 
        setTimeout(() => {
          fish.el.remove();
          activeFishes.splice(index, 1);
        }, 500);
      }
    }, 10000);
  }

  activeFishes.push(fish);
}

function update() {
  if (isCasting) {
    hookY = Math.min(hookY + 7, window.innerHeight - 60);
  } else {
    hookY = Math.max(hookY - 10, 0);
  }
  line.style.height = hookY + "px";
  line.style.left = currentX + "px";

  const hRect = document.getElementById("hook").getBoundingClientRect();

  for (let i = activeFishes.length - 1; i >= 0; i--) {
    const fish = activeFishes[i];
    fish.x += fish.dx;
    if (fish.x < -100 || fish.x > window.innerWidth + 100) fish.dx *= -1;

    fish.el.style.transform = `translate(${fish.x}px, ${fish.y}px) scaleX(${fish.dx > 0 ? -1 : 1})`;

    const fRect = fish.el.getBoundingClientRect();
    if (
      hookY > 50 &&
      hRect.left < fRect.right &&
      hRect.right > fRect.left &&
      hRect.top < fRect.bottom &&
      hRect.bottom > fRect.top
    ) {
      balance += fish.price;
      moneyEl.innerText = balance;
      
      
      moneyEl.style.color = fish.price < 0 ? "#ff4757" : "#2ecc71";
      setTimeout(() => (moneyEl.style.color = "white"), 400);

      fish.el.remove();
      activeFishes.splice(i, 1);
    }
  }

  requestAnimationFrame(update);
}

function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  
  
  const size = Math.random() * 40 + 100 + "px"; 
  bubble.style.width = size;
  bubble.style.height = size;
  bubble.style.left = Math.random() * 100 + "vw";
  const duration = Math.random() * 4 + 3;
  bubble.style.animationDuration = duration + "s";

  ocean.appendChild(bubble);
  setTimeout(() => bubble.remove(), duration * 1000);
}


for (let i = 0; i < 10; i++) spawnFish();
setInterval(() => {
  if (activeFishes.length < 10) spawnFish();
}, 2500);
setInterval(createBubble, 300);
update();
