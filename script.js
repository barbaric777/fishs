const ocean = document.getElementById("ocean");
const line = document.getElementById("line");
const moneyEl = document.getElementById("money");

let balance = 0;
let isCasting = false;
let hookY = 0;
let currentX = window.innerWidth / 2;

const fishData = [
  { price: 10, speed: 1.5, img: "fish.png" },
  { price: 50, speed: 3, img: "fish2.png" },
  { price: 150, speed: 8, img: "fish3.png" },
  { price: -500, speed: 5, img: "danger.png" } 
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

window.addEventListener("touchstart", startAction, { passive: false });
window.addEventListener("touchend", endAction);
window.addEventListener("touchmove", updatePosition, { passive: false });
window.addEventListener("mousedown", startAction);
window.addEventListener("mouseup", endAction);
window.addEventListener("mousemove", updatePosition);

function spawnFish() {
  const type = fishData[Math.floor(Math.random() * fishData.length)];
  const el = document.createElement("div");
  el.className = "fish";
  const fish = {
    el,
    x: Math.random() * (window.innerWidth - 100),
    y: 150 + Math.random() * (window.innerHeight - 300),
    dx: (Math.random() > 0.5 ? 1 : -1) * type.speed,
    price: type.price,
  };
  activeFishes.push(fish);
}

function update() {
  
  if (isCasting) {
    hookY = Math.min(hookY + 8, window.innerHeight - 80);
  } else {
    hookY = Math.max(hookY - 12, 0);
  }
  
  line.style.height = hookY + "px";
  line.style.left = currentX + "px";

  const hRect = document.getElementById("hook").getBoundingClientRect();

  
  for (let i = activeFishes.length - 1; i >= 0; i--) {
    const fish = activeFishes[i];
    
    fish.x += fish.dx;
    if (fish.x < -150 || fish.x > window.innerWidth + 150) fish.dx *= -1;

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
  const size = Math.random() * 20 + 10 + "px";
  bubble.style.width = size;
  bubble.style.height = size;
  bubble.style.left = Math.random() * 100 + "vw";
  
  const duration = Math.random() * 3 + 4;
  bubble.style.animationDuration = duration + "s";
  
  ocean.appendChild(bubble);
  setTimeout(() => bubble.remove(), duration * 1000);
}


for (let i = 0; i < 8; i++) spawnFish();
setInterval(() => { if (activeFishes.length < 15) spawnFish(); }, 1500);
setInterval(createBubble, 400);
update();

