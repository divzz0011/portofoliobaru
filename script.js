(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const introPanel = $("#introPanel");
  const gamePanel = $("#gamePanel");
  const stage = $("#gameStage");
  const world = $("#roomWorld");
  const player = $("#player");
  const prompt = $("#proximityPrompt");
  const promptText = $("#promptText");
  const objectiveText = $("#objectiveText");
  const stageMessage = $("#stageMessage");
  const objectModal = $("#objectModal");
  const modalContent = $("#modalContent");
  const foundCount = $("#foundCount");
  const keys = new Set();
  const found = new Set();
  let pos = { x: 52, y: 73 };
  let lastTime = 0;
  let rafId = 0;
  let nearbyObject = null;
  let isPlaying = false;
  let messageTimer = 0;
  let currentFacing = "down";

  const objects = {
    contact: {
      icon: "📱", name: "Handphone", eyebrow: "CONTACT / SIGNAL READY",
      title: "Hubungi Saya.",
      html: `<p>Handphone ini adalah jalur komunikasi utama, jika anda memiliki ide, ingin bekerja sama, atau mau membahas project, anda dapat mengirim pesan melalui salah satu kanal berikut.</p>
        <a class="contact-link" href="mailto:divzzxxx@gmail.com">✉ EMAIL</a>
        <a class="contact-link" href="https://github.com/divzz0011" target="_blank" rel="noreferrer">⌘ GITHUB</a>
        <a class="contact-link" href="https://instagram.com/divzz_capture" target="_blank" rel="noreferrer">◎ INSTAGRAM</a>
        <p></p>`,
      prompt: "BUKA CONTACT"
    },
    computer: {
      icon: "🖥️", name: "Computer", eyebrow: "PLAYER PROFILE / 001",
      title: "Hai, saya Divo Jeanny Marvello.",
      html: `<div class="about-profile-layout"><div class="about-photo-column"><figure class="about-photo-card about-formal-photo"><img src="assets/foto-formal.png" alt="Tempat foto formal Divzz"><figcaption><span>01 / PROFILE PHOTO</span><strong>Its Me</strong></figcaption></figure></div><div class="about-profile-copy"><p class="about-kicker">HELLO, I'M DIVO</p><h3>Developer yang suka membangun sesuatu dari ide.</h3><p>Saya developer yang suka mengubah ide menjadi produk digital yang fungsional dan punya karakter. Saya mengeksplorasi web development, database, UI, serta eksperimen kreatif.</p><p>Portfolio ini sengaja dibuat sebagai ruangan yang dapat dijelajahi oleh orang orang bukan sekedar halaman biasa. Anda dapat dekati benda lain untuk menemukan bagian portfolio saya berikutnya.</p><div class="info-chips"><span>WEB DEVELOPER</span><span>PROBLEM SOLVER</span><span>CREATOR</span></div><div class="about-photo-note">Anda dapat jelajahi ruangan dan menemukan potongan portofolio saya yang lainnya.</div></div></div>`, 
      prompt: "LIHAT PROFILE"
    },
    skills: {
      icon: "📚", name: "Bookshelf", eyebrow: "SKILL INVENTORY / 002",
      title: "Skill yang sedang diasah.",
      html: `<p><strong>Frontend</strong> — HTML, CSS, JavaScript untuk membangun interface responsif dan interaktif.</p><p><strong>Backend & database</strong> — PHP, MySQL, serta konsep API dan pengelolaan data aplikasi.</p><p><strong>Creative development</strong> — UI layout, prototyping, animasi, dan pengalaman pengguna.</p><div class="info-chips"><span>HTML / CSS</span><span>JAVASCRIPT</span><span>PHP</span><span>MYSQL</span><span>UI / UX</span></div><p>Bagian ini adalah gambaran area yang saya pelajari dan kembangkan.</p>`,
      prompt: "BUKA SKILLS"
    },
    projects: {
      icon: "📦", name: "Project Box", eyebrow: "SELECTED WORK / 003",
      title: "Dibuat untuk menyelesaikan masalah.",
      html: `<p class="gallery-intro">Saya mengubah ide menjadi sesuatu hal yang kreatif dan berguna, berikut adalah sedikit dari berbagai ide yang sudah saya kembangkan.</p><div class="showcase-grid">
        <article class="showcase-card"><img src="assets/klikorder.png" alt="Preview antarmuka KlikOrder"><div class="showcase-copy"><div class="showcase-meta"><span>01 / WEB APP</span><span class="status-pill">CONCEPT</span></div><h3>KlikOrder</h3><p>Konsep pemesanan kantin sekolah untuk membantu mengurangi antrean dan membuat alur pre-order lebih rapi.</p><div class="tag-row"><span>UI DESIGN</span><span>ORDER FLOW</span></div></div></article>
        <article class="showcase-card"><img src="assets/kelasseru.png" alt="Preview antarmuka Kelas Seru"><div class="showcase-copy"><div class="showcase-meta"><span>02 / EDUCATION</span><span class="status-pill">IN PROGRESS</span></div><h3>Kelas Seru</h3><p>Platform kuis kelas dengan mode standar dan live, ruang tunggu siswa, serta pengelolaan sesi oleh guru.</p><div class="tag-row"><span>PHP / MYSQL</span><span>LIVE QUIZ</span></div></div></article>
        <article class="showcase-card"><img src="assets/room-explorer.svg" alt="Preview game DIVZZ Room Explorer"><div class="showcase-copy"><div class="showcase-meta"><span>03 / CREATIVE CODE</span><span class="status-pill">PLAYABLE</span></div><h3>Room Explorer</h3><p>Portfolio berbentuk game 2D: jelajahi ruangan, temukan objek, dan buka cerita di balik setiap karya.</p><div class="tag-row"><span>JAVASCRIPT</span><span>GAME UI</span></div></div></article>
      </div><div class="gallery-cta"><span>Anda dapat melihat ide lainnya di Github.</span><a class="contact-link" href="https://github.com/divzz0011" target="_blank" rel="noreferrer">⌘ JELAJAHI GITHUB ↗</a></div>`,
      prompt: "BUKA PROJECT"
    },
    photography: {
      icon: "📷", name: "Camera", eyebrow: "VISUAL JOURNAL / 004",
      title: "Cerita yang ditangkap, bukan sekadar dilihat.",
      html: `<p class="gallery-intro">Fotografi menjadi ruang untuk melatih kepekaan pada cahaya, komposisi, momen, dan cerita. Berikut tiga arah visual yang mewakili karakter galeri ini—gunakan foto milik sendiri untuk mengganti preview saat siap dipublikasikan.</p><div class="photo-grid">
        <figure class="photo-card"><img src="assets/photo-street.png" alt="Ilustrasi preview street photography"><figcaption><span>FRAME 001</span><strong>Street / Everyday Stories</strong><small>Momen spontan · cahaya natural</small></figcaption></figure>
        <figure class="photo-card"><img src="assets/photo-portrait.png" alt="Ilustrasi preview portrait photography"><figcaption><span>FRAME 002</span><strong>Portrait / Human Stories</strong><small>Ekspresi · karakter · kedekatan</small></figcaption></figure>
        <figure class="photo-card"><img src="assets/photo-travel.png" alt="Ilustrasi preview travel photography"><figcaption><span>FRAME 003</span><strong>Travel / Places & Light</strong><small>Perjalanan · lanskap · suasana</small></figcaption></figure>
      </div><div class="info-chips"><span>PHOTOGRAPHY</span><span>VISUAL STORYTELLING</span><span>STREET</span><span>TRAVEL</span></div><p class="gallery-note">Lihat hasil foto lainnya melalui instagram @divzz_capture atau kunjungi Handphone.</p>`,
      prompt: "LIHAT GALERI"
    },
    achievements: {
      icon: "🏆", name: "Trophy", eyebrow: "ACHIEVEMENT LOG / 005",
      title: "Progress, bukan garis akhir.",
      html: `<p>Pengalaman terbaik lahir dari keberanian bereksperimen dan memperbaiki apa yang kurang.</p><div class="info-chips"><span>BUILD PROJECTS</span><span>LEARN BY DOING</span><span>ITERATE</span><span>KEEP EXPLORING</span></div><p>Temukan kepingan karya lainnya untuk melihat gambaran utuh dari apa yang bisa saya bangun.</p>`,
      prompt: "LIHAT ACHIEVEMENTS"
    },
    guestbook: {
      icon: "🚪", name: "Exit / Guestbook", eyebrow: "GUESTBOOK / 006",
      title: "Tinggalkan jejak.",
      html: `<p>Terima kasih sudah menjelajahi ruangan ini. Kalau kamu ingin meninggalkan pesan, pertanyaan, atau ide kolaborasi, gunakan email di bawah.</p><a class="contact-link" href="mailto:divzzxxx@gmail.com?subject=Pesan%20dari%20Portfolio%20DIVZZ">✉ KIRIM PESAN</a><p>Atau kembali ke menu awal dan jelajahi ruangan sekali lagi.</p>`,
      prompt: "BUKA GUESTBOOK"
    }
  };

  // Titik objek menggunakan persentase dari ukuran stage. Collision sederhana menjaga karakter tidak menembus benda besar.
  const solidZones = [
    { x: [6, 28], y: [68, 91] },   // bed
    { x: [72, 91], y: [43, 61] },  // desk / shelf edge
    { x: [85, 94], y: [23, 36] }   // door wall
  ];
  const objectPoints = {
    contact: { x: 67, y: 52 }, computer: { x: 52, y: 47 },
    skills: { x: 81, y: 29 }, projects: { x: 43, y: 68 },
    photography: { x: 24, y: 57 }, achievements: { x: 77, y: 67 },
    guestbook: { x: 89, y: 38 }
  };

  function setMessage(text, duration = 2400) {
    stageMessage.textContent = text;
    stageMessage.classList.remove("hidden");
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
      if (!nearbyObject) stageMessage.classList.add("hidden");
    }, duration);
  }
  function isMobileCamera() {
    return window.matchMedia("(max-width: 700px) and (pointer: coarse)").matches;
  }
  function updateCamera() {
    if (!world) return;
    if (!isMobileCamera()) {
      world.style.transform = "translate3d(0,0,0) scale(1)";
      return;
    }
    const stageRect = stage.getBoundingClientRect();
    const worldWidth = world.offsetWidth;
    const worldHeight = world.offsetHeight;
    // Zoom in on a landscape-shaped room; the viewport follows the player instead of squeezing the whole room.
    const zoom = Math.min(1.28, Math.max(1.16, stageRect.height / worldHeight * 1.12));
    const playerX = pos.x / 100 * worldWidth;
    const playerY = pos.y / 100 * worldHeight;
    let tx = stageRect.width / 2 - playerX * zoom;
    let ty = stageRect.height / 2 - playerY * zoom;
    const scaledWidth = worldWidth * zoom;
    const scaledHeight = worldHeight * zoom;
    tx = Math.min(0, Math.max(stageRect.width - scaledWidth, tx));
    ty = Math.min(0, Math.max(stageRect.height - scaledHeight, ty));
    world.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${zoom})`;
  }
  function updatePlayer() {
    player.style.left = `${pos.x}%`;
    player.style.top = `${pos.y}%`;
    player.classList.toggle("facing-left", currentFacing === "left");
    player.classList.toggle("facing-up", currentFacing === "up");
    player.classList.toggle("walking", keys.size > 0);
    updateCamera();
  }
  function distanceTo(point) {
    const rect = world.getBoundingClientRect();
    return Math.hypot((pos.x - point.x) * world.offsetWidth / 100, (pos.y - point.y) * world.offsetHeight / 100);
  }
  function updateProximity() {
    let closest = null;
    let closestDistance = Infinity;
    Object.entries(objectPoints).forEach(([id, point]) => {
      const d = distanceTo(point);
      if (d < closestDistance) { closestDistance = d; closest = id; }
    });
    const range = Math.min(world.offsetWidth, world.offsetHeight) * 0.105;
    if (closest && closestDistance <= range) {
      nearbyObject = closest;
      promptText.textContent = objects[closest].prompt;
      prompt.classList.remove("hidden");
      const mobileInteract = $("#mobileInteract");
      if (mobileInteract) { mobileInteract.classList.add("is-ready"); mobileInteract.disabled = false; }
      $$(".interactable").forEach(button => button.classList.toggle("nearby", button.dataset.object === closest));
      objectiveText.textContent = `Dekat dengan ${objects[closest].name.toLowerCase()} — tekan E untuk interaksi.`;
      stageMessage.classList.add("hidden");
    } else {
      nearbyObject = null;
      prompt.classList.add("hidden");
      const mobileInteract = $("#mobileInteract");
      if (mobileInteract) { mobileInteract.classList.remove("is-ready"); mobileInteract.disabled = true; }
      $$(".interactable").forEach(button => button.classList.remove("nearby"));
      objectiveText.textContent = "Cari benda yang bisa diinteraksi.";
    }
  }
  function collides(x, y) {
    // Keep player inside room; object props are mostly decorative and can be walked around.
    if (x < 5 || x > 95 || y < 17 || y > 88) return true;
    return solidZones.some(zone => x > zone.x[0] && x < zone.x[1] && y > zone.y[0] && y < zone.y[1]);
  }
  function frame(time) {
    if (!isPlaying) return;
    if (!lastTime) lastTime = time;
    const dt = Math.min((time - lastTime) / 1000, 0.035);
    lastTime = time;
    let dx = 0, dy = 0;
    if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
    if (keys.has("arrowright") || keys.has("d")) dx += 1;
    if (keys.has("arrowup") || keys.has("w")) dy -= 1;
    if (keys.has("arrowdown") || keys.has("s")) dy += 1;
    if (dx || dy) {
      const length = Math.hypot(dx, dy);
      dx /= length; dy /= length;
      const speed = isMobileCamera() ? 190 : 205;
      const nx = pos.x + dx * speed * dt / world.offsetWidth * 100;
      const ny = pos.y + dy * speed * dt / world.offsetHeight * 100;
      if (!collides(nx, pos.y)) pos.x = nx;
      if (!collides(pos.x, ny)) pos.y = ny;
      if (Math.abs(dx) > Math.abs(dy)) currentFacing = dx < 0 ? "left" : "right";
      else currentFacing = dy < 0 ? "up" : "down";
      updatePlayer();
      updateProximity();
    }
    rafId = requestAnimationFrame(frame);
  }
  function startGame() {
    introPanel.classList.add("hidden");
    gamePanel.classList.remove("hidden");
    isPlaying = true;
    if (window.matchMedia("(max-width: 900px)").matches) {
      window.setTimeout(() => gamePanel.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
    pos = { x: 52, y: 73 };
    updatePlayer();
    stage.focus({ preventScroll: true });
    lastTime = 0;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(frame);
    setMessage("Room loaded. Jelajahi benda-benda di ruangan!", 3500);
    updateProximity();
  }
  function exitGame() {
    isPlaying = false;
    keys.clear();
    cancelAnimationFrame(rafId);
    gamePanel.classList.add("hidden");
    introPanel.classList.remove("hidden");
    prompt.classList.add("hidden");
    closeObjectModal();
  }
  function openObject(id) {
    const data = objects[id];
    if (!data) return;
    $("#modalIcon").textContent = data.icon;
    $("#modalEyebrow").textContent = data.eyebrow;
    $("#modalTitle").textContent = data.title;
    modalContent.innerHTML = data.html;
    objectModal.classList.remove("hidden");
    found.add(id);
    foundCount.textContent = `${found.size} / ${Object.keys(objects).length}`;
    const target = $(`.interactable[data-object="${id}"]`);
    if (target) target.classList.add("discovered");
    objectiveText.textContent = `Ditemukan: ${data.name}. Lanjutkan eksplorasi!`;
    setMessage(`${data.name.toUpperCase()} DISCOVERED`, 1800);
    $("#modalClose").focus();
  }
  function closeObjectModal() {
    objectModal.classList.add("hidden");
    if (isPlaying) stage.focus({ preventScroll: true });
  }
  function interact() {
    if (objectModal.classList.contains("hidden") === false) return;
    if (nearbyObject) openObject(nearbyObject);
    else setMessage("Belum ada benda di dekatmu. Dekati objek sampai prompt muncul.");
  }

  $("#startBtn").addEventListener("click", startGame);
  $("#exitBtn").addEventListener("click", exitGame);
  $("#modalClose").addEventListener("click", closeObjectModal);
  $("#modalDone").addEventListener("click", closeObjectModal);
  objectModal.addEventListener("click", e => { if (e.target === objectModal) closeObjectModal(); });
  $$(".interactable").forEach(button => button.addEventListener("click", () => {
    // Clicking an object is a useful accessibility fallback; keyboard proximity remains the main game mechanic.
    openObject(button.dataset.object);
  }));
  $("#helpBtn").addEventListener("click", () => $("#helpModal").classList.remove("hidden"));
  $("#helpClose").addEventListener("click", () => $("#helpModal").classList.add("hidden"));
  $("#helpOkay").addEventListener("click", () => {
    $("#helpModal").classList.add("hidden");
    if (introPanel.classList.contains("hidden")) stage.focus({ preventScroll: true });
    else startGame();
  });
  $("#helpModal").addEventListener("click", e => { if (e.target.id === "helpModal") $("#helpModal").classList.add("hidden"); });

  document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();
    if (["arrowup","arrowdown","arrowleft","arrowright"," ","enter"].includes(key) && isPlaying && objectModal.classList.contains("hidden")) event.preventDefault();
    if (key === "escape") {
      if (!objectModal.classList.contains("hidden")) closeObjectModal();
      else if (!$("#helpModal").classList.contains("hidden")) $("#helpModal").classList.add("hidden");
      return;
    }
    if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key) && isPlaying && objectModal.classList.contains("hidden")) keys.add(key);
    if ((key === "e" || key === "enter" || key === " ") && isPlaying && objectModal.classList.contains("hidden")) interact();
  });
  document.addEventListener("keyup", event => keys.delete(event.key.toLowerCase()));
  window.addEventListener("blur", () => keys.clear());
  document.addEventListener("visibilitychange", () => { if (document.hidden) keys.clear(); });
  window.addEventListener("resize", () => { updateCamera(); updateProximity(); });
  $$(".mobile-controls button").forEach(button => {
    const directionMap = { up: "arrowup", down: "arrowdown", left: "arrowleft", right: "arrowright" };
    const down = event => { event.preventDefault(); keys.add(directionMap[button.dataset.dir]); };
    const up = event => { event.preventDefault(); keys.delete(directionMap[button.dataset.dir]); };
    button.addEventListener("pointerdown", event => { down(event); try { button.setPointerCapture(event.pointerId); } catch (_) {} });
    button.addEventListener("pointerup", up);
    button.addEventListener("pointercancel", up);
    button.addEventListener("lostpointercapture", up);
    button.addEventListener("pointerleave", event => { if (event.buttons === 0) up(event); });
    button.addEventListener("contextmenu", event => event.preventDefault());
  });
  $("#proximityPrompt").addEventListener("click", interact);
  $("#mobileInteract")?.addEventListener("click", interact);
  updatePlayer();
})();
