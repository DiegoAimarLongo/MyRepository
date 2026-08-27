/* ══════════════════════════════════════════════════════════
   PORTFOLIO — Diego Longo · GameDev
   Efectos interactivos + demo SQL (sql.js / SQLite en WASM)
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     0. SONIDO 8-BIT (WebAudio, bajo demanda)
     ──────────────────────────────────────── */
  let audioCtx = null;
  let soundOn = false;
  const soundBtn = document.getElementById('soundToggle');

  function beep(freq = 440, duration = 0.06, type = 'square', vol = 0.05) {
    if (!soundOn) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      if (soundOn && !audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      soundBtn.textContent = soundOn ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      if (soundOn) beep(660, 0.08);
    });
  }

  /* ────────────────────────────────────────
     1. CURSOR RETRO PIXELADO
     ──────────────────────────────────────── */
  const cursor = document.getElementById('pxCursor');
  const ring = document.getElementById('pxRing');
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch && cursor && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));

    document.querySelectorAll('a, button, .project-card, .skill-card, .contact-item').forEach(el => {
      el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
      el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* ────────────────────────────────────────
     2. NAV: scroll suave + resaltado activo
     ──────────────────────────────────────── */
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(n => n.classList.remove('active'));
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => navObserver.observe(s));

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      beep(500, 0.05);
      const target = document.querySelector(item.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.btn-primary, .btn-outline, .project-link').forEach(el => {
    el.addEventListener('click', () => beep(720, 0.05, 'square', 0.04));
  });

  /* ────────────────────────────────────────
     3. BARRA DE XP (progreso de scroll)
     ──────────────────────────────────────── */
  const xpBar = document.getElementById('xpBar');
  function updateXp() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (xpBar) xpBar.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateXp);
  updateXp();

  /* ────────────────────────────────────────
     4. LOGROS (achievements) por sección
     ──────────────────────────────────────── */
  const achvContainer = document.getElementById('achv-container');
  const achvData = {
    'sobre-mi':   { icon: '◉', label: 'Logro desbloqueado', title: 'Conociste al desarrollador' },
    'proyectos':  { icon: '⬡', label: 'Logro desbloqueado', title: 'Explorador de proyectos' },
    'habilidades':{ icon: '⚔', label: 'Logro desbloqueado', title: 'Stack Tecnológico revisado' },
    'arcade':     { icon: '🕹', label: 'Logro desbloqueado', title: 'Insert Coin: SQL en vivo' },
    'formacion':  { icon: '🎓', label: 'Logro desbloqueado', title: 'Ruta académica completada' },
    'contacto':   { icon: '✉', label: 'Logro desbloqueado', title: '¡Listo para conectar!' },
  };
  const unlocked = new Set();

  function showAchievement({ icon, label, title }) {
    if (!achvContainer) return;
    const toast = document.createElement('div');
    toast.className = 'achv-toast';
    toast.innerHTML = `
      <div class="achv-icon">${icon}</div>
      <div class="achv-text">
        <div class="achv-label">${label}</div>
        <div class="achv-title">${title}</div>
      </div>`;
    achvContainer.appendChild(toast);
    beep(880, 0.05, 'square', 0.05);
    setTimeout(() => beep(1046, 0.08, 'square', 0.05), 90);
    setTimeout(() => toast.remove(), 4000);
  }

  const achvObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (entry.isIntersecting && achvData[id] && !unlocked.has(id)) {
        unlocked.add(id);
        showAchievement(achvData[id]);
      }
    });
  }, { threshold: 0.4 });

  Object.keys(achvData).forEach(id => {
    const el = document.getElementById(id);
    if (el) achvObserver.observe(el);
  });

  /* ────────────────────────────────────────
     5. GLITCH EN EL NOMBRE + TYPEWRITER
     ──────────────────────────────────────── */
  const heroName = document.getElementById('heroName');
  if (heroName) {
    let glitchTimeout;
    const triggerGlitch = () => {
      heroName.classList.add('glitching');
      clearTimeout(glitchTimeout);
      glitchTimeout = setTimeout(() => heroName.classList.remove('glitching'), 500);
    };
    heroName.addEventListener('mouseenter', triggerGlitch);
    // Glitch aleatorio ambiental cada tanto para dar vida a la página
    setInterval(triggerGlitch, 6000);
  }

  const typeTitleEl = document.getElementById('heroTypeTitle');
  if (typeTitleEl) {
    const fullText = 'Desarrollador de Software Junior';
    let i = 0;
    (function typeChar() {
      if (i <= fullText.length) {
        typeTitleEl.textContent = fullText.slice(0, i);
        i++;
        setTimeout(typeChar, 45);
      }
    })();
  }

  /* ────────────────────────────────────────
     6. PARTÍCULAS EN EL HERO (canvas)
     ──────────────────────────────────────── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const heroEl = document.querySelector('.hero');
    let particles = [];
    let mouseX = -9999, mouseY = -9999;

    function resize() {
      canvas.width = heroEl.offsetWidth;
      canvas.height = heroEl.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    heroEl.addEventListener('mousemove', e => {
      const rect = heroEl.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    heroEl.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

    const COLORS = ['#7b5cf0', '#00d4ff', '#00ff88'];
    function makeParticle() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 40,
        r: Math.random() * 2 + 1,
        speed: Math.random() * 0.6 + 0.2,
        drift: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.3,
      };
    }
    const COUNT = 70;
    for (let i = 0; i < COUNT; i++) {
      const p = makeParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        // repulsión suave del cursor (efecto "polvo de píxeles" tipo videojuego)
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }

        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) Object.assign(p, makeParticle(), { y: canvas.height + 10 });
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2); // cuadrados = estética pixel-art
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ────────────────────────────────────────
     7. TILT 3D EN TARJETAS DE PROYECTOS
     ──────────────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -10;
      const rotateY = ((x - rect.width / 2) / rect.width) * 10;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ────────────────────────────────────────
     8. BARRAS DE HABILIDAD ANIMADAS AL SCROLL
     ──────────────────────────────────────── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

  /* ────────────────────────────────────────
     9. CÓDIGO KONAMI (easter egg)
     ──────────────────────────────────────── */
  const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiPos = 0;
  const konamiOverlay = document.getElementById('konami-overlay');
  const konamiClose = document.getElementById('konamiClose');

  document.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konamiSeq[konamiPos]) {
      konamiPos++;
      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        activateKonami();
      }
    } else {
      konamiPos = (key === konamiSeq[0]) ? 1 : 0;
    }
    if (e.key === 'Escape' && konamiOverlay) konamiOverlay.classList.remove('show');
  });

  function activateKonami() {
    if (!konamiOverlay) return;
    konamiOverlay.classList.add('show');
    [523, 659, 784, 1046].forEach((f, idx) => setTimeout(() => beep(f, 0.12, 'square', 0.06), idx * 120));
    if (!unlocked.has('konami')) {
      unlocked.add('konami');
      showAchievement({ icon: '🎮', label: 'Logro secreto', title: 'Jugador Nº2 detectado' });
    }
  }
  if (konamiClose) konamiClose.addEventListener('click', () => konamiOverlay.classList.remove('show'));

  /* ────────────────────────────────────────
     10. ARCADE HIGH SCORES — SQLite en WASM (sql.js)
     ──────────────────────────────────────── */
  const dbStatus = document.getElementById('dbStatus');
  const leaderboardList = document.getElementById('leaderboardList');
  const sqlConsole = document.getElementById('sqlConsole');
  const submitBtn = document.getElementById('submitScore');
  const nameInput = document.getElementById('playerName');
  const scoreInput = document.getElementById('playerScore');

  let db = null;

  function logSql(query) {
    if (!sqlConsole) return;
    const line = document.createElement('div');
    line.textContent = '› ' + query;
    sqlConsole.appendChild(line);
    sqlConsole.scrollTop = sqlConsole.scrollHeight;
  }

  function refreshLeaderboard() {
    if (!db || !leaderboardList) return;
    const query = 'SELECT name, score FROM high_scores ORDER BY score DESC LIMIT 5;';
    logSql(query);
    const res = db.exec(query);
    leaderboardList.innerHTML = '';
    if (!res.length) {
      leaderboardList.innerHTML = '<li>Sin registros aún.</li>';
      return;
    }
    res[0].values.forEach((row, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span><span class="rank">#${i + 1}</span>${row[0]}</span><span>${row[1]}</span>`;
      leaderboardList.appendChild(li);
    });
  }

  function insertScore(name, score) {
    if (!db) return;
    const safeName = name.replace(/'/g, "''").slice(0, 14) || 'PLAYER';
    const query = `INSERT INTO high_scores (name, score) VALUES ('${safeName}', ${score});`;
    db.run(query);
    logSql(query);
    beep(950, 0.08, 'square', 0.06);
    refreshLeaderboard();
  }

  async function initDb() {
    try {
      if (dbStatus) dbStatus.textContent = 'Inicializando SQLite (WASM)…';
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
      });
      db = new SQL.Database();

      const createQuery = `CREATE TABLE high_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL
);`;
      db.run(createQuery);
      logSql(createQuery.replace(/\s+/g, ' '));

      const seed = [
        ['TRAIL_OF_BONES', 9800],
        ['ORBITAL_ARO', 8750],
        ['MATE_E_MITOS', 7600],
        ['DIEGO_L', 6400],
        ['RALLY_2DO', 9990],
      ];
      const insertSeed = db.prepare('INSERT INTO high_scores (name, score) VALUES (?, ?)');
      seed.forEach(([n, s]) => insertSeed.run([n, s]));
      insertSeed.free();
      logSql(`-- se insertaron ${seed.length} registros iniciales`);

      if (dbStatus) dbStatus.textContent = '● SQLite (WASM) en vivo · sql.js';
      if (submitBtn) submitBtn.disabled = false;
      refreshLeaderboard();
    } catch (err) {
      console.error('No se pudo inicializar sql.js:', err);
      if (dbStatus) dbStatus.textContent = '⚠ No se pudo cargar el motor SQL';
      if (leaderboardList) leaderboardList.innerHTML = '<li>Error al cargar la base de datos.</li>';
    }
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = (nameInput.value || 'PLAYER').trim().toUpperCase();
      const score = parseInt(scoreInput.value, 10);
      if (!score && score !== 0) {
        scoreInput.focus();
        return;
      }
      insertScore(name, score);
      nameInput.value = '';
      scoreInput.value = '';
      nameInput.focus();
    });
    [nameInput, scoreInput].forEach(input => {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') submitBtn.click();
      });
    });
  }

  if (typeof initSqlJs !== 'undefined') {
    initDb();
  } else if (dbStatus) {
    dbStatus.textContent = '⚠ Motor SQL no disponible (revisá tu conexión)';
  }

});
