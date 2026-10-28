import * as F from "./fb.js";
const $ = id => document.getElementById(id), root = document.documentElement;

/* ---------- Dark / Light mode (default: dark) ---------- */
const tb = $("themeBtn");
function setTheme(t) { t === "light" ? root.dataset.theme = "light" : delete root.dataset.theme;
  localStorage.setItem("ms_theme", t); if (tb) tb.textContent = t === "light" ? "☀️" : "🌙"; }
setTheme(localStorage.getItem("ms_theme") === "light" ? "light" : "dark");
if (tb) tb.onclick = () => setTheme(root.dataset.theme === "light" ? "dark" : "light");

/* ---------- Nav ---------- */
const here = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".ms-side a").forEach(a => { if (a.getAttribute("href") === here) a.classList.add("cur"); });
window.msToggleNav = () => { const b = document.body, mobile = innerWidth <= 900;
  if (mobile) b.classList.toggle("nav-open"); else { b.classList.toggle("nav-closed"); localStorage.ms_nav = b.classList.contains("nav-closed") ? "closed" : "open"; } };
if (localStorage.ms_nav === "closed" && innerWidth > 900) document.body.classList.add("nav-closed");
document.querySelectorAll(".ms-side a").forEach(a => a.addEventListener("click", () => innerWidth <= 900 && document.body.classList.remove("nav-open")));
window.handleLogout = async () => { await F.logout(); location.href = "login.html"; };
F.onUser(u => {
  const show = (id, on) => { const e = $(id); if (e) e.style.display = on ? "flex" : "none"; };
  show("nav-login", !u); show("nav-logout", !!u); show("nav-admin", u && u.role === "admin");
  const b = $("welcomeBanner"); if (b) { b.style.display = u ? "block" : "none"; const n = $("welcomeName"); if (n && u) n.textContent = u.name; }
  const s = $("gStatus"); if (s) s.textContent = u ? "Signed in as " + u.name : "";
});
const g = $("gBtn");
if (g) g.onclick = async () => { try { await F.login(); location.href = "index.html"; } catch (e) { alert("Login failed: " + (e.code || e.message)); } };

/* ---------- Contact form -> Firestore "messages" collection ---------- */
const cf = $("contactForm");
if (cf) cf.addEventListener("submit", async e => {
  e.preventDefault();
  const ok = $("contactSuccess"), er = $("contactError"), btn = cf.querySelector(".btn-auth");
  const name = $("contactName").value.trim(), email = $("contactEmail").value.trim(), message = $("contactMessage").value.trim();
  const fail = t => { ok.style.display = "none"; er.style.display = "block"; er.textContent = t; };
  if (!name || !email || !message) return fail("Please fill in all fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email address.");
  btn.disabled = true; btn.textContent = "SENDING..."; btn.style.opacity = ".7";
  try {
    await F.sendMessage(name, email, message);
    er.style.display = "none"; ok.style.display = "block"; cf.reset();
    setTimeout(() => ok.style.display = "none", 6000);
  } catch (err) { fail("Could not send your message. Please try again later."); console.warn(err); }
  btn.disabled = false; btn.textContent = "SEND MESSAGE"; btn.style.opacity = "1";
});

/* ---------- "Who are we" cards: tilt + glow + flip ---------- */
document.querySelectorAll(".wr-card").forEach(c => {
  c.addEventListener("mousemove", e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
    c.style.setProperty("--rx", (.5 - y) * 12 + "deg"); c.style.setProperty("--ry", (x - .5) * 14 + "deg"); });
  c.addEventListener("mouseleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
  c.addEventListener("click", () => c.classList.toggle("flip"));
});

/* ---------- About page: interactive wave lab ---------- */
const cv = $("waveCanvas");
if (cv) {
  const ctx = cv.getContext("2d"); let A = 50, f = 0.02, ph = 0;
  const rs = () => { cv.width = cv.clientWidth; cv.height = 300; }; rs(); addEventListener("resize", rs);
  cv.addEventListener("mousemove", e => { const r = cv.getBoundingClientRect(); A = 10 + (1 - (e.clientY - r.top) / r.height) * 110; f = .005 + ((e.clientX - r.left) / r.width) * .05; });
  const harm = $("waveHarm"), spd = $("waveSpeed"), eq = $("waveEq");
  (function loop() {
    const w = cv.width, h = cv.height; ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(0,162,255,.15)"; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, w, 0); grad.addColorStop(0, "#00a2ff"); grad.addColorStop(1, "#1e90ff");
    ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 0; x <= w; x += 2) { let y = A * Math.sin(f * x + ph); if (harm && harm.checked) y += A / 2 * Math.sin(2 * f * x + 1.5 * ph); x ? ctx.lineTo(x, h / 2 - y) : ctx.moveTo(x, h / 2 - y); }
    ctx.stroke(); ph += (spd ? +spd.value : 3) / 100;
    if (eq) eq.textContent = `y = ${A.toFixed(0)} · sin(${(f * 100).toFixed(1)}x + φ)` + (harm && harm.checked ? ` + ${(A / 2).toFixed(0)} · sin(${(2 * f * 100).toFixed(1)}x + 1.5φ)` : "");
    requestAnimationFrame(loop);
  })();
}
