const btn = document.getElementById('dang');
const vid = document.getElementById('dragon');
const video = document.getElementById('sea');
const video1 = document.getElementById('dive');
const video2 = document.getElementById('burb');
const h1 = document.querySelector('.starter');
const h2 = document.querySelector('h2')
const text = ['Welc', 'o', 'm', 'e'];
const text1 = ['0'];
const angler = document.getElementById('angler')
const messages = [
  'Nice to see ya mate!',
  'May the journey never ends....',]

const sardine = document.querySelectorAll('.sardine');
const bubble = document.getElementById('bubles');
const images = document.querySelectorAll('.images');
const animborders = document.querySelectorAll('.animborder');
const circle = document.getElementById('circle');
const layers = document.querySelectorAll('.layers1');
const scrollbox = document.querySelector('.D2D');
const layersed = document.querySelectorAll('.layers2');
const scrollboxed = document.querySelector('.D3D');
const title = document.querySelectorAll('.gallery-title');
const chapterButton = document.querySelector('.chapter');
const curtain = document.querySelector('.curtain');

// D2D
scrollbox.addEventListener("scroll", () => {

  const viewportHeight = scrollbox.clientHeight;
  const scrollTop = scrollbox.scrollTop;

  layers.forEach(layer => {

    const zone = parseInt(layer.dataset.fade) || 420;

    const layerTop = layer.offsetTop;
    const layerHeight = layer.offsetHeight;

    const layerCenter = layerTop + layerHeight / 2;
    const viewportCenter = scrollTop + viewportHeight / 2;

    const distance = Math.abs(layerCenter - viewportCenter);
    const fade = Math.max(0, Math.min(1 - distance / zone, 1));

    layer.style.opacity = fade;
  });
});
// D3D
scrollboxed.addEventListener("scroll", () => {

  const viewportHeight = scrollboxed.clientHeight;
  const scrollTop = scrollboxed.scrollTop;

  layersed.forEach(layer => {

    const zone = parseInt(layer.dataset.fade) || 420;

    const layerTop = layer.offsetTop;
    const layerHeight = layer.offsetHeight;

    const layerCenter = layerTop + layerHeight / 2;
    const viewportCenter = scrollTop + viewportHeight / 2;

    const distance = Math.abs(layerCenter - viewportCenter);
    const fade = Math.max(0, Math.min(1 - distance / zone, 1));

    layer.style.opacity = fade;
  });
});
// mouse effect
document.addEventListener('mousemove', (a) => {
  circle.style.left = a.clientX + 'px';
  circle.style.top = a.clientY + 'px';
})
// gallery 1
animborders.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    // Only trigger once
    if (![...animborders].some((b) => b.classList.contains('played'))) {

      // Animate all animborders
      animborders.forEach((b) => b.classList.add('play', 'played'));

      // Animate all images
      images.forEach((b) => b.classList.add('play', 'played'));

      // Animate all title elements
      title.forEach((b) => b.classList.add('play', 'played'));
    }
  });
});
// beginning
setInterval(() => {
  text[1] = '4oNSD,'[Math.floor(Math.random() * 6)]
  text[3] = '3eE,'[Math.floor(Math.random() * 4)]
  h1.innerHTML = text.join('');
}, 1000)
let currentIndex = 0;

let Index = 0;

function updateText() {

  h2.textContent = messages[Index];


  h2.style.animation = 'none';


  void h2.offsetWidth;


  h2.style.animation = 'fadeIn 1.5s ease forwards';


  Index = (Index + 1) % messages.length;

  const randomInterval = Math.floor(Math.random() * 10000) + 5000;
  setTimeout(updateText, randomInterval);
}

updateText();
// button pause
function myFunction() {
  if (video.paused) {
    console.log('ldsadfas');
    vid.play();
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    vid.play();
    btn.innerHTML = "Play";
  }
}

// diving
let hasPlayed = true;
video2.addEventListener('mouseenter', () => {
  if (hasPlayed) {
    window.scrollTo(0, 800);
    video1.currentTime = 0;
    video1.play();
    hasPlayed = false;
    console.log('kjhgvfdx');
  }
});
video1.addEventListener('pause', () => {
  if (!video1.ended) {
    video1.play();

  }
});
function lockScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.body.style.overflow = '';
}

video1.addEventListener('play', lockScroll);
video1.addEventListener('ended', unlockScroll);





function randomDirection() {
  const angle = Math.random() * 2 * Math.PI;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}
function createBubbleFromFish(element, pos) {
  console.log("createBubbleFromFish called");
  const rect = element.getBoundingClientRect();
  const absX = rect.left + window.scrollX;
  const absY = rect.top + window.scrollY;
  const startX = absX + rect.width / 3;
  const startY = absY + rect.height * 0.4;
  const bubbleClone = bubble.cloneNode(true);
  bubbleClone.removeAttribute("id");
  bubbleClone.muted = true;
  bubbleClone.playsInline = true;

  bubbleClone.style.width = "120px";
  bubbleClone.style.height = "120px";
  bubbleClone.style.position = "absolute";
  bubbleClone.style.left = startX + "px";
  bubbleClone.style.top = startY + "px";
  bubbleClone.style.opacity = 1;
  bubbleClone.style.display = "block";
  bubbleClone.style.pointerEvents = "none";
  bubbleClone.style.background = "transparent";
  bubbleClone.style.display = "block";

  bubbleClone.style.zIndex = (parseInt(getComputedStyle(element).zIndex) || 1) - 1;

  document.body.appendChild(bubbleClone);

  // Reset and force load
  bubbleClone.currentTime = 0;
  bubbleClone.load();
  bubbleClone.playbackRate = 4.0;
  bubbleClone.play()
    .then(() => console.log("Bubble is playing"))
    .catch(err => console.error("Bubble play error:", err));

  // Animate upwards
  bubbleClone.style.transition = "transform 1.6s ease-out, opacity 1.6s ease-out";
  bubbleClone.style.transform = "translate(0px, 0px)";

  const driftX = (Math.random() - 0.5) * 40;
  requestAnimationFrame(() => {
    bubbleClone.style.transform = `translate(${driftX}px, -100px)`;
  });

  // Cleanup
  setTimeout(() => {
    bubbleClone.remove();
    console.log("Bubble removed");
  }, 2000);
}


function posFish(element, initialpos, initialvector, facing = "yes", expand = 1) {
  let vector = { ...initialvector };
  let pos = { ...initialpos };
  let mode = 'idle';
  let slow = 1;
  let lastTime = performance.now();

  function transform() {
    let flip = vector.x < 0 ? 1 : -1;
    if (facing === "left") flip *= -1;
    element.style.transform = `translate(${pos.x}px, ${pos.y}px) scaleX(${flip}) scale(${expand})`;
  }

  function animate(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    const baseSpeedX = mode === 'poke' ? 160 : 80;
    const baseSpeedY = mode === 'poke' ? 120 : 70;

    pos.x += vector.x * baseSpeedX * slow * dt;
    pos.y += vector.y * baseSpeedY * slow * dt;

    if (pos.x <= 10) { pos.x = 10; vector.x *= -1; slow = 0.02; }
    if (pos.x >= 500) { pos.x = 500; vector.x *= -1; slow = 0.02; }
    if (pos.y <= -100) { pos.y = -100; vector.y *= -1; slow = 0.02; }
    if (pos.y >= 100) { pos.y = 100; vector.y *= -1; slow = 0.02; }

    slow += (1 - slow) * dt;

    transform();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  element.addEventListener('click', () => {
    mode = 'poke';
    vector = randomDirection();
    slow = 1.2;
    createBubbleFromFish(element, pos);
    console.log('Ineedhelp');
    setTimeout(() => { mode = 'idle'; }, 3000);
  });
}

sardine.forEach((s, i) => {
  const expand = 0.5 + Math.random() * 0.7;
  posFish(
    s,
    { x: 100 + i * 30, y: 50 + (i % 3) * 20 },
    { x: 1, y: (Math.random() - 0.5) * 0.8 },
    "left",
    expand
  );
});

posFish(angler, { x: 450, y: 0 }, { x: 1, y: 0.5 }, "yes", 2);



// Curtain opening functionality
chapterButton.addEventListener('click', () => {
  curtain.classList.toggle('open');
});

// menu

const menu1 = document.getElementById('menu1');
const menu2 = document.getElementById('menu2');

const exitMenu1Btn = document.querySelectorAll('.exit-menu');
exitMenu1Btn.forEach(btn => {
  btn.addEventListener('click', () => {
    const menu = btn.closest('.menun');
    menu.style.display = 'none';
    menu.classList.remove('play');
  });
});

animborders.forEach((border) => {
  border.addEventListener('click', () => {
    // Determine associated image or menu
    const classList = border.classList;
    let imageId = '';
    if (border.id === 'perfect') {
      // Toggle menu1
      menu1.classList.add('play');
      menu1.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    } else if (border.id === 'lilith') {
      // Toggle menu2
      menu2.classList.add('play');
      menu2.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    } else if (border.id === 'gun') {
      // Toggle menu3
      menu3.classList.add('play');
      menu3.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }
    else if (border.id === 'space') {
      // Toggle menu4
      menu4.classList.add('play');
      menu4.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }
    else if (border.id === 'stars') {
      // Toggle menu5
      menu5.classList.add('play');
      menu5.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }else if (border.id === 'desert') {
      // Toggle menu7(layers2)
      menu7.classList.add('play');
      menu7.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }else if (border.id === 'mount') {
      // Toggle menu8(layers2)
      menu8.classList.add('play');
      menu8.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }else if (border.id === 'galaxy') {
      // Toggle menu9(layers2)
      menu9.classList.add('play');
      menu9.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }else if (border.id === 'beach') {
      // Toggle menu9(layers2)
      menu10.classList.add('play');
      menu10.style.display = 'flex';
      document.documentElement.style.setProperty('--op', '1');
    }
  });
});

const leftBtn = document.querySelectorAll('.leftside');
const rightBtn = document.querySelectorAll('.rightside');
leftBtn.forEach((lefty) => {
  lefty.addEventListener('click', () => {
    console.log('image sucks')
    const menu = lefty.closest('.menun');
    const scrollBox = menu.querySelector('.img-scroll');
    scrollBox.scrollBy({ left: -300, behavior: 'smooth' });
  });
})


rightBtn.forEach((righty) => {
  righty.addEventListener('click', () => {
    console.log('image sucks')
    const menu = righty.closest('.menun');
    const scrollBox = menu.querySelector('.img-scroll');
    scrollBox.scrollBy({ left: 300, behavior: 'smooth' });
  });
})



// converse
const howSpan = document.querySelector('.how span');
let currentStep = 0;
const totalSteps = 4;

howSpan.addEventListener('click', () => {
  if (currentStep < totalSteps) {
    currentStep++;
    const translateY = - (currentStep * 70);
    howSpan.style.transform = `translateY(${translateY}px)`;
  }
});

video1.addEventListener('ended', () => {
  video2.play();
});

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

