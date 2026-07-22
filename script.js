/* ============================================================
   PORTOFOLIO MUHAMMAD HAIKAL — script.js (vanilla JS)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. INTRO LOADER (typewriter) ---------- */
  const loader = document.getElementById("loader");
  const loaderName = document.getElementById("loaderName");
  const text = "Muhammad Haikal";
  let i = 0;

  function typeWriter() {
    if (i <= text.length) {
      loaderName.textContent = text.slice(0, i);
      i++;
      setTimeout(typeWriter, 90);
    } else {
      setTimeout(() => {
        loader.classList.add("done");
        document.body.style.overflow = "";
      }, 500);
    }
  }
  document.body.style.overflow = "hidden";
  typeWriter();

  /* ---------- 2. NAVBAR: mobile toggle + scrolled shadow ---------- */
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open);
  });

  // tutup menu setelah klik link (mobile)
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
    toTop.classList.toggle("show", window.scrollY > 400);
  });

  /* ---------- 3. SCROLL-SPY (active nav link) ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- 4. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObs.observe(el));

  /* ---------- 5. COUNT-UP STATS ---------- */
  const stats = document.querySelectorAll(".stat-num");
  const statObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          statObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((s) => statObs.observe(s));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- 6. LANYARD DRAG + SWING ---------- */
  const lanyard = document.getElementById("lanyardWrap");
  if (lanyard) {
    let dragging = false;
    let startX = 0;
    let centerX = 0;

    function getX(ev) {
      return ev.touches ? ev.touches[0].clientX : ev.clientX;
    }

    function dragStart(ev) {
      dragging = true;
      lanyard.classList.add("dragging");
      lanyard.classList.remove("snap");
      const rect = lanyard.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      startX = getX(ev);
    }

    function dragMove(ev) {
      if (!dragging) return;
      const x = getX(ev);
      // sudut berdasarkan jarak horizontal dari titik gantung, dibatasi
      let angle = (x - centerX) / 6;
      angle = Math.max(-45, Math.min(45, angle));
      lanyard.style.transform = `rotate(${angle}deg)`;
      if (ev.cancelable) ev.preventDefault();
    }

    function dragEnd() {
      if (!dragging) return;
      dragging = false;
      lanyard.classList.remove("dragging");
      // memantul balik ke posisi gantung
      lanyard.classList.add("snap");
      lanyard.style.transform = "rotate(0deg)";
      // kembalikan idle swing setelah animasi snap selesai
      setTimeout(() => {
        lanyard.classList.remove("snap");
        lanyard.style.transform = "";
      }, 750);
    }

    lanyard.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", dragMove);
    window.addEventListener("mouseup", dragEnd);

    lanyard.addEventListener("touchstart", dragStart, { passive: true });
    window.addEventListener("touchmove", dragMove, { passive: false });
    window.addEventListener("touchend", dragEnd);
  }

  /* ---------- 7. MUSIK PLAY/PAUSE ---------- */
  const audio = document.getElementById("bg-music");
  const musicFab = document.getElementById("musicBtn");
  const musicIcon = document.getElementById("musicIcon");
  const musicNav = document.getElementById("musicBtnNav");

  function syncMusicUI(playing) {
    musicFab.classList.toggle("playing", playing);
    musicNav.classList.toggle("playing", playing);
    musicIcon.className = playing ? "fa-solid fa-pause" : "fa-solid fa-play";
    musicNav.querySelector("i").className = playing
      ? "fa-solid fa-pause"
      : "fa-solid fa-play";
  }

  function toggleMusic() {
    if (audio.paused) {
      audio.play().then(() => syncMusicUI(true)).catch(() => {
        // file musik belum ada / diblokir browser
        syncMusicUI(false);
        console.log("[v0] Musik belum bisa diputar — pastikan assets/audio/bg-music.mp3 sudah ada.");
      });
    } else {
      audio.pause();
      syncMusicUI(false);
    }
  }

  musicFab.addEventListener("click", toggleMusic);
  musicNav.addEventListener("click", toggleMusic);
  audio.addEventListener("play", () => syncMusicUI(true));
  audio.addEventListener("pause", () => syncMusicUI(false));

  /* ---------- 8. FORM KONTAK -> WHATSAPP ---------- */
  // GANTI_ASET: ganti nomor WhatsApp di bawah (format internasional tanpa "+")
  const WA_NUMBER = "6280000000000";
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cName").value.trim();
    const topic = document.getElementById("cTopic").value.trim();
    const msg = document.getElementById("cMsg").value.trim();

    if (!name || !topic || !msg) {
      alert("Mohon lengkapi semua kolom terlebih dahulu.");
      return;
    }

    const teks =
      `Halo Haikal! 👋%0A%0A` +
      `*Nama:* ${encodeURIComponent(name)}%0A` +
      `*Topik:* ${encodeURIComponent(topic)}%0A` +
      `*Pesan:* ${encodeURIComponent(msg)}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${teks}`;
    window.open(url, "_blank");
  });

  /* ---------- 9. SCROLL TO TOP ---------- */
  const toTop = document.getElementById("toTop");
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
// ============================================================
// LIGHTBOX SERTIFIKAT
// ============================================================
(function () {
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <div class="lightbox-box">
      <button class="lightbox-close" aria-label="Tutup">✕</button>
      <img src="" alt="" />
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lightbox-caption");
  const closeBtn = overlay.querySelector(".lightbox-close");

  function openLightbox(src, caption) {
    imgEl.src = src;
    imgEl.alt = caption;
    captionEl.textContent = caption;
    overlay.classList.add("active");
  }
  function closeLightbox() {
    overlay.classList.remove("active");
    imgEl.src = "";
  }

  document.querySelectorAll(".cert-card img").forEach((img) => {
    img.addEventListener("click", () => {
      const caption = img.closest(".cert-card").querySelector("figcaption")?.textContent || "";
      openLightbox(img.src, caption);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();
