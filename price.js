const lefty = document.getElementById('leftscale');
const liftleft = document.getElementById('leftscale1');
const righty = document.getElementById('rightscale');
const liftright = document.getElementById('rightscale1');
const D2 = document.querySelector('.D2');
const D3 = document.querySelector('.D3');
document.body.classList.add("lock-scroll");
const lift = document.querySelectorAll('.press')

const scaleContainer = document.querySelector('.scale');

-righty.remove();
-liftright.remove();
if (D2) {
  D2.addEventListener('click', () => {
    const board = document.querySelector('.board');
    if (board) {
      board.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
if (D3) {
  D3.addEventListener('click', () => {
    const board1 = document.querySelector('.board1');
    if (board1) {
      board1.scrollIntoView({ behavior: 'smooth' });
    }
  });
}


// arg
lefty.addEventListener('click', () => {
  if (lefty.ended) {
    lefty.style.opacity = 0;
    liftleft.style.opacity = 1;
    liftleft.play();
  } else {
    lefty.play();
    if (D2) {
      D2.style.opacity = 1;
      D2.style.pointerEvents = "auto";
    }
  }
});


liftleft.addEventListener('ended', () => {
  lefty.remove();
  liftleft.remove();
  liftleft.currentTime = 0;
  liftleft.pause();
  D2.style.opacity = 0;
  D2.style.pointerEvents = "none";
  if (scaleContainer) {
    scaleContainer.appendChild(righty);
    scaleContainer.appendChild(liftright);
    righty.currentTime = 0;
    righty.pause();
    liftright.currentTime = 0;
    liftright.pause();

    righty.style.opacity = 1;
    liftright.style.opacity = 0;
  }
});

righty.addEventListener('click', () => {
  if (righty.ended) {
    righty.style.opacity = 0;
    liftright.style.opacity = 1;
    liftright.play();
  } else {
    righty.play();
    if (D3) {
      D3.style.opacity = 1;
      D3.style.pointerEvents = "auto";
    }
  }
});


liftright.addEventListener('ended', () => {
  righty.remove();
  liftright.remove();
  liftright.currentTime = 0;
  liftright.pause();
  D3.style.opacity = 0;
  D3.style.pointerEvents = "none";
  if (scaleContainer) {
    scaleContainer.appendChild(lefty);
    scaleContainer.appendChild(liftleft);
    lefty.currentTime = 0;
    lefty.pause();
    liftleft.currentTime = 0;
    liftleft.pause();

    lefty.style.opacity = 1;
    liftleft.style.opacity = 0;
  }
});



lift.forEach(item => {
  item.addEventListener('click', ()=>{
    window.scrollTo(0,0);
  });
})
