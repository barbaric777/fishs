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
  { price: -500, speed: 5, img: "danger.png" }, 
];

const activeFishes = [];

const startAction = (e) => {
  isCasting = true;
  updatePosition(e);
};

const endAction = () => (isCasting = false);

const updatePosition = (e) => {
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  currentX = clientX;
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
    x: Math.random() * (window.innerWidth - 60),
    y: 100 + Math.random() * (window.innerHeight - 200),
    dx: (Math.random() > 0.5 ? 1 : -1) * type.speed,
    price: type.price,
  };
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

  activeFishes.forEach((fish, index) => {
    fish.x += fish.dx;
    if (fish.x < -70 || fish.x > window.innerWidth + 70) fish.dx *= -1;

    fish.el.style.transform = `translate(${fish.x}px, ${fish.y}px) scaleX(${fish.dx > 0 ? -1 : 1})`;

    const fRect = fish.el.getBoundingClientRect();
    

    if (
      hookY > 50 &&
      hRect.left < fRect.right &&
      hRect.right > fRect.left &&
      hRect.top < fRect.bottom &&
      hRect.bottom > fRect.top
    ) {
      // Обновляем баланс
      balance += fish.price;
      moneyEl.innerText = balance;

      
      if (fish.price < 0) {
        moneyEl.style.color = "#ff4757"; 
      } else {
        moneyEl.style.color = "#2ecc71"; 
      }

      
      fish.el.remove();
      activeFishes.splice(index, 1);

      
      setTimeout(() => (moneyEl.style.color = "white"), 300);
    }
  });

  requestAnimationFrame(update);
}


for (let i = 0; i < 10; i++) spawnFish();
setInterval(() => {
  if (activeFishes.length < 12) spawnFish(); 
}, 2000);

update();

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

setInterval(createBubble, 300);
