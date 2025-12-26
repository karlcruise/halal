import React, { useEffect, useRef, useState } from "react";

// Single-file React app broken into multiple components
// Default export is App. Keep your original HTML classes/IDs so CSS won't break.

/*
  Notes:
  - This mirrors your original JS logic but uses refs and effects so React won't
    interfere with animations.
  - Keep your existing CSS files and assets. Class names and IDs are preserved.
*/

// -------------------- Utility functions --------------------
function randomDirection() {
  const angle = Math.random() * 2 * Math.PI;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

// Creates a bubble element and appends to body (keeps original behavior)
function createBubbleFromFish(element, pos) {
  if (!element) return;
  const bubble = document.getElementById("bubles");
  if (!bubble) return;

  const rect = element.getBoundingClientRect();
  const absX = rect.left + window.scrollX;
  const absY = rect.top + window.scrollY;
  const startX = absX + rect.width / 3;
  const startY = absY + rect.height * 0.4;

  const bubbleClone = bubble.cloneNode(true);
  bubbleClone.removeAttribute("id");
  // style safety
  bubbleClone.style.width = "120px";
  bubbleClone.style.height = "120px";
  bubbleClone.style.position = "absolute";
  bubbleClone.style.left = startX + "px";
  bubbleClone.style.top = startY + "px";
  bubbleClone.style.opacity = "1";
  bubbleClone.style.display = "block";
  bubbleClone.style.pointerEvents = "none";
  bubbleClone.style.background = "transparent";
  bubbleClone.style.zIndex = (parseInt(getComputedStyle(element).zIndex) || 1) - 1;

  document.body.appendChild(bubbleClone);

  // Reset and play if it's a video element
  try {
    bubbleClone.currentTime = 0;
    bubbleClone.load?.();
    bubbleClone.playbackRate = 4.0;
    bubbleClone.play?.().catch(() => {});
  } catch (e) {
    // not a video
  }

  requestAnimationFrame(() => {
    const driftX = (Math.random() - 0.5) * 40;
    bubbleClone.style.transition = "transform 1.6s ease-out, opacity 1.6s ease-out";
    bubbleClone.style.transform = `translate(${driftX}px, -100px)`;
  });

  setTimeout(() => bubbleClone.remove(), 2000);
}

// posFish logic as a hook for a single element
function useFishMotion(ref, initialPos, initialVector, facing = "yes", expand = 1) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let vector = { ...initialVector };
    let pos = { ...initialPos };
    let mode = "idle";
    let slow = 1;
    let lastTime = performance.now();
    let raf = null;

    function transform() {
      let flip = vector.x < 0 ? 1 : -1;
      if (facing === "left") flip *= -1;
      element.style.transform = `translate(${pos.x}px, ${pos.y}px) scaleX(${flip}) scale(${expand})`;
    }

    function animate(timestamp) {
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const baseSpeedX = mode === "poke" ? 160 : 80;
      const baseSpeedY = mode === "poke" ? 120 : 70;

      pos.x += vector.x * baseSpeedX * slow * dt;
      pos.y += vector.y * baseSpeedY * slow * dt;

      if (pos.x <= 10) { pos.x = 10; vector.x *= -1; slow = 0.02; }
      if (pos.x >= 500) { pos.x = 500; vector.x *= -1; slow = 0.02; }
      if (pos.y <= -100) { pos.y = -100; vector.y *= -1; slow = 0.02; }
      if (pos.y >= 100) { pos.y = 100; vector.y *= -1; slow = 0.02; }

      slow += (1 - slow) * dt;

      transform();
      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    const onClick = () => {
      mode = "poke";
      vector = randomDirection();
      slow = 1.2;
      createBubbleFromFish(element, pos);
      setTimeout(() => { mode = "idle"; }, 3000);
    };

    element.addEventListener("click", onClick);

    return () => {
      element.removeEventListener("click", onClick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, initialPos.x, initialPos.y, initialVector.x, initialVector.y, facing, expand]);
}

// -------------------- Components --------------------

function VideoControls({ videoRef, btnRef }) {
  useEffect(() => {
    const btn = btnRef.current;
    const video = videoRef.current;
    if (!btn || !video) return;

    function toggle() {
      if (video.paused) {
        video.play();
        btn.innerHTML = "Pause";
      } else {
        video.pause();
        btn.innerHTML = "Play";
      }
    }

    btn.addEventListener("click", toggle);

    return () => btn.removeEventListener("click", toggle);
  }, [videoRef, btnRef]);

  return null;
}

function ScrollFade({ containerRef, layersSelector }) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onScroll() {
      const viewportHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const layers = container.querySelectorAll(layersSelector);

      layers.forEach((layer) => {
        const zone = parseInt(layer.dataset.fade) || 420;
        const layerTop = layer.offsetTop;
        const layerHeight = layer.offsetHeight;
        const layerCenter = layerTop + layerHeight / 2;
        const viewportCenter = scrollTop + viewportHeight / 2;
        const distance = Math.abs(layerCenter - viewportCenter);
        const fade = Math.max(0, Math.min(1 - distance / zone, 1));
        layer.style.opacity = fade;
      });
    }

    container.addEventListener("scroll", onScroll);
    // initial
    onScroll();

    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef, layersSelector]);

  return null;
}

function TitleAnimator({ h2Ref, messages }) {
  useEffect(() => {
    const h2 = h2Ref.current;
    if (!h2) return;
    let Index = 0;
    let mounted = true;

    function updateText() {
      if (!mounted) return;
      h2.textContent = messages[Index];
      h2.style.animation = "none";
      // force reflow
      void h2.offsetWidth;
      h2.style.animation = "fadeIn 1.5s ease forwards";
      Index = (Index + 1) % messages.length;
      const randomInterval = Math.floor(Math.random() * 10000) + 5000;
      setTimeout(updateText, randomInterval);
    }

    updateText();

    return () => { mounted = false; };
  }, [h2Ref, messages]);

  return null;
}

function AnimBorderWatcher({ borderSelector, imageSelector, titleSelector }) {
  useEffect(() => {
    const borders = Array.from(document.querySelectorAll(borderSelector));
    if (!borders.length) return;

    borders.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (![...borders].some((b) => b.classList.contains("played"))) {
          borders.forEach((b) => b.classList.add("play", "played"));
          document.querySelectorAll(imageSelector).forEach((b) => b.classList.add("play", "played"));
          document.querySelectorAll(titleSelector).forEach((b) => b.classList.add("play", "played"));
        }
      });
    });

    return () => {
      borders.forEach((el) => el.removeEventListener("mouseenter", () => {}));
    };
  }, [borderSelector, imageSelector, titleSelector]);

  return null;
}

function Sardine({ initialPos, initialVector, expand, className = "sardine" }) {
  const ref = useRef(null);
  useFishMotion(ref, initialPos, initialVector, "left", expand);

  return <div ref={ref} className={className} />;
}

// -------------------- Main App --------------------
export default function App() {
  // preserve ids so your CSS keeps working
  const btnRef = useRef(null); // #dang
  const videoRef = useRef(null); // #sea
  const video1Ref = useRef(null); // #dive
  const video2Ref = useRef(null); // #burb
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const anglerRef = useRef(null);
  const circleRef = useRef(null);
  const scrollboxRef = useRef(null); // .D2D container
  const scrollboxedRef = useRef(null); // .D3D container

  // local state for startup text animation
  const [welcomeText, setWelcomeText] = useState(["Welc", "o", "m", "e"]);

  // messages
  const messages = [
    "Nice to see ya mate!",
    "May the journey never ends....",
  ];

  // Has video1 played once
  const hasPlayedRef = useRef(true);

  useEffect(() => {
    // map refs to DOM ids (for backwards compatibility if other scripts expect them)
    if (btnRef.current) btnRef.current.id = "dang";
    if (videoRef.current) videoRef.current.id = "sea";
    if (video1Ref.current) video1Ref.current.id = "dive";
    if (video2Ref.current) video2Ref.current.id = "burb";
    if (anglerRef.current) anglerRef.current.id = "angler";
    if (circleRef.current) circleRef.current.id = "circle";

    // h1 changing characters interval
    const interval = setInterval(() => {
      setWelcomeText((prev) => {
        const t = [...prev];
        t[1] = "4oNSD"[Math.floor(Math.random() * 5)];
        t[3] = "3eE"[Math.floor(Math.random() * 3)];
        if (h1Ref.current) h1Ref.current.innerHTML = t.join("");
        return t;
      });
    }, 1000);

    // mouse move update for circle
    const onMouse = (a) => {
      if (!circleRef.current) return;
      circleRef.current.style.left = a.clientX + "px";
      circleRef.current.style.top = a.clientY + "px";
    };
    document.addEventListener("mousemove", onMouse);

    // diving hover logic (video2 triggers play of video1 once)
    const vid2 = video2Ref.current;
    const vid1 = video1Ref.current;
    if (vid2 && vid1) {
      const onEnter = () => {
        if (hasPlayedRef.current) {
          vid1.currentTime = 0;
          vid1.play();
          hasPlayedRef.current = false;
        }
      };
      vid2.addEventListener("mouseenter", onEnter);

      // ensure video1 loops when paused unintentionally
      const onPause = () => { if (!vid1.ended) vid1.play(); };
      vid1.addEventListener("pause", onPause);

      // cleanup
      return () => {
        vid2.removeEventListener("mouseenter", onEnter);
        vid1.removeEventListener("pause", onPause);
        clearInterval(interval);
        document.removeEventListener("mousemove", onMouse);
      };
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", onMouse);
    };
  }, []);

  // Title animator
  useEffect(() => {
    // call TitleAnimator manually for reliability inside this component
    const h2 = h2Ref.current;
    if (!h2) return;
    let Index = 0;
    let mounted = true;

    function updateText() {
      if (!mounted) return;
      h2.textContent = messages[Index];
      h2.style.animation = "none";
      void h2.offsetWidth;
      h2.style.animation = "fadeIn 1.5s ease forwards";
      Index = (Index + 1) % messages.length;
      const randomInterval = Math.floor(Math.random() * 10000) + 5000;
      setTimeout(updateText, randomInterval);
    }

    updateText();
    return () => { mounted = false; };
  }, []);

  // Anim border watcher
  useEffect(() => {
    const borders = Array.from(document.querySelectorAll('.animborder'));
    if (!borders.length) return;

    const handler = () => {
      if (![...borders].some((b) => b.classList.contains('played'))) {
        borders.forEach((b) => b.classList.add('play', 'played'));
        document.querySelectorAll('.images').forEach((b) => b.classList.add('play', 'played'));
        document.querySelectorAll('.gallery-title').forEach((b) => b.classList.add('play', 'played'));
      }
    };

    borders.forEach((b) => b.addEventListener('mouseenter', handler));
    return () => borders.forEach((b) => b.removeEventListener('mouseenter', handler));
  }, []);

  // Scroll fades for the two containers
  useEffect(() => {
    const box = document.querySelector('.D2D');
    const box2 = document.querySelector('.D3D');
    function onScrollFactory(container) {
      return function onScroll() {
        const viewportHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        const layers = container.querySelectorAll('.layers1');

        layers.forEach((layer) => {
          const zone = parseInt(layer.dataset.fade) || 420;
          const layerTop = layer.offsetTop;
          const layerHeight = layer.offsetHeight;
          const layerCenter = layerTop + layerHeight / 2;
          const viewportCenter = scrollTop + viewportHeight / 2;
          const distance = Math.abs(layerCenter - viewportCenter);
          const fade = Math.max(0, Math.min(1 - distance / zone, 1));
          layer.style.opacity = fade;
        });
      };
    }

    if (box) box.addEventListener('scroll', onScrollFactory(box));
    if (box2) box2.addEventListener('scroll', onScrollFactory(box2));

    return () => {
      if (box) box.removeEventListener('scroll', onScrollFactory(box));
      if (box2) box2.removeEventListener('scroll', onScrollFactory(box2));
    };
  }, []);

  // Render sardines programmatically to keep same initial positions
  const sardines = Array.from({ length: 9 }).map((_, i) => {
    const expand = 0.5 + Math.random() * 0.7;
    return (
      <Sardine
        key={i}
        initialPos={{ x: 100 + i * 30, y: 50 + (i % 3) * 20 }}
        initialVector={{ x: 1, y: (Math.random() - 0.5) * 0.8 }}
        expand={expand}
        className="sardine"
      />
    );
  });

  return (
    <div>
      {/* KEEP your IDs and classes so CSS continues to work */}

      <header>
        <h1 ref={h1Ref} className="your-h1">{welcomeText.join("")}</h1>
        <h2 ref={h2Ref} className="your-h2">{messages[0]}</h2>
      </header>

      <section className="video-section">
        <button ref={btnRef} id="dang">Play</button>
        <video ref={videoRef} id="sea" src="/path/to/sea.mp4" />

        <video ref={video1Ref} id="dive" src="/path/to/dive.mp4" />
        <video ref={video2Ref} id="burb" src="/path/to/burb.mp4" />
      </section>

      <div id="circle" ref={circleRef} className="circle" />

      <div className="D2D" ref={scrollboxRef} style={{ overflowY: 'auto', maxHeight: 400 }}>
        {/* replicate layered elements - still using .layers1 inside for the fade effect */}
        <div className="layers1" data-fade="420">Layer 1</div>
        <div className="layers1" data-fade="420">Layer 2</div>
        <div className="layers1" data-fade="420">Layer 3</div>
      </div>

      <div className="D3D" ref={scrollboxedRef} style={{ overflowY: 'auto', maxHeight: 400 }}>
        <div className="layers2" data-fade="420">Layer A</div>
        <div className="layers2" data-fade="420">Layer B</div>
      </div>

      {/* place sardines in the DOM where your original markup expected them */}
      <div className="sardine-container">{sardines}</div>

      {/* hidden bubble template (keep as in original) */}
      <div id="bubles" style={{ display: 'none' }} />

      {/* angler fish as a separate element */}
      <div id="angler" ref={anglerRef} className="angler" />

      {/* Anim borders / images / titles placeholders to maintain selectors */}
      <div className="animborder">border</div>
      <div className="images">img</div>
      <div className="gallery-title">title</div>

      {/* Hook-like components (they return null but run side effects) */}
      <VideoControls videoRef={videoRef} btnRef={btnRef} />
      <TitleAnimator h2Ref={h2Ref} messages={messages} />
      <AnimBorderWatcher borderSelector=".animborder" imageSelector=".images" titleSelector=".gallery-title" />
      {/* No explicit ScrollFade child needed since we used container listeners above */}
    </div>
  );
}
