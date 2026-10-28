(() => {
const R = n => Math.floor(Math.random() * n), pick = a => a[R(a.length)], shuf = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const E = (h, c = "") => { const e = document.createElement("div"); e.className = c; e.innerHTML = h; return e; };
const best = (k, v) => { try { const o = +localStorage["ms_g_" + k] || 0; if (v > o) { localStorage["ms_g_" + k] = v; return v; } return o; } catch (e) { return v || 0; } };
let ids = [], off = [];
const T = (f, ms) => { const i = setInterval(f, ms); ids.push(i); return i; };
const L = (t, ev, f) => { t.addEventListener(ev, f); off.push(() => t.removeEventListener(ev, f)); };
const clean = () => { ids.forEach(clearInterval); off.forEach(f => f()); ids = []; off = []; };
const norm = s => s.toLowerCase().replace(/\s|\*/g, "").replace(/−/g, "-").replace(/²/g, "^2").replace(/³/g, "^3").replace(/√/g, "sqrt");

/* ---------- 24 Game ---------- */
function solve(a) {
  if (a.length == 1) return Math.abs(a[0].v - 24) < 1e-6 ? a[0].e : null;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < a.length; j++) {
    if (i == j) continue;
    const r = a.filter((_, k) => k != i && k != j), x = a[i], y = a[j];
    const c = [[x.v + y.v, `(${x.e}+${y.e})`], [x.v - y.v, `(${x.e}-${y.e})`], [x.v * y.v, `(${x.e}*${y.e})`]];
    if (Math.abs(y.v) > 1e-9) c.push([x.v / y.v, `(${x.e}/${y.e})`]);
    for (const [v, e] of c) { const s = solve([...r, { v, e }]); if (s) return s; }
  } return null;
}
function g24(el) {
  let nums, sol, score = 0;
  const newQ = () => { do { nums = [0, 0, 0, 0].map(() => R(9) + 1); sol = solve(nums.map(n => ({ v: n, e: "" + n }))); } while (!sol); draw(); };
  const draw = () => {
    el.innerHTML = `<div class="g-bar"><span>Solved: <b>${score}</b></span><span>Best: <b>${best("g24", score)}</b></span></div>
    <p>Use all four numbers once each to make <b>24</b>.</p>
    <div class="g-row">${nums.map(n => `<span class="g-chip">${n}</span>`).join("")}</div>
    <div class="g-row"><input class="g-in" id="ex" placeholder="e.g. (8-2)*(1+3)" autocomplete="off"></div>
    <div class="g-row">${["+", "-", "*", "/", "(", ")"].map(o => `<button class="g-btn ghost" data-o="${o}">${o}</button>`).join("")}</div>
    <div class="g-row"><button class="g-btn" id="ck">Check</button><button class="g-btn ghost" id="sk">Skip</button><button class="g-btn ghost" id="sh">Show answer</button></div><div class="g-msg" id="ms"></div>`;
    const ex = el.querySelector("#ex"), ms = el.querySelector("#ms");
    el.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { ex.value += b.dataset.o; ex.focus(); });
    const check = () => {
      const s = ex.value.replace(/\s/g, ""), u = (s.match(/\d+/g) || []).map(Number).sort().join(), w = [...nums].sort().join();
      if (!/^[\d+\-*/().]+$/.test(s)) { ms.className = "g-msg bad"; return ms.textContent = "Use only numbers and + − × ÷ ( )"; }
      if (u != w) { ms.className = "g-msg bad"; return ms.textContent = "Use each of the four numbers exactly once."; }
      let v; try { v = Function("return " + s)(); } catch (e) { v = NaN; }
      if (Math.abs(v - 24) < 1e-6) { score++; best("g24", score); ms.className = "g-msg ok"; ms.textContent = "✅ Correct!"; setTimeout(newQ, 700); }
      else { ms.className = "g-msg bad"; ms.textContent = `= ${Math.round(v * 100) / 100}, not 24. Try again.`; }
    };
    el.querySelector("#ck").onclick = check; ex.onkeydown = e => e.key == "Enter" && check();
    el.querySelector("#sk").onclick = newQ;
    el.querySelector("#sh").onclick = () => { ms.className = "g-msg"; ms.textContent = "One way: " + sol.replace(/^\((.*)\)$/, "$1"); };
  };
  newQ();
}

/* ---------- Math Sprint ---------- */
const Q = {
  easy: () => { const a = R(20) + 1, b = R(20) + 1; return R(2) ? [`${a} + ${b}`, a + b] : [`${a + b} − ${b}`, a]; },
  medium: () => { const a = R(11) + 2, b = R(11) + 2, x = R(80) + 10, y = R(80) + 10; return R(2) ? [`${a} × ${b}`, a * b] : [`${x} + ${y}`, x + y]; },
  hard: () => { const a = R(15) + 5, b = R(30) + 1, c = R(9) + 2, d = R(12) + 2; return pick([[`${a}² − ${b}`, a * a - b], [`(${b} + ${c}) × ${d}`, (b + c) * d], [`${c * d * a} ÷ ${d}`, c * a]]); }
};
function sprint(el) {
  el.innerHTML = `<p>60 seconds. Answer as many as you can. Streaks give bonus points!</p><div class="g-row">${["easy", "medium", "hard"].map(l => `<button class="g-btn ${l}" data-l="${l}">${l}</button>`).join("")}</div><div class="g-msg">Best: ${best("sprint")}</div>`;
  el.querySelectorAll("[data-l]").forEach(b => b.onclick = () => play(b.dataset.l));
  function play(lv) {
    let t = 60, sc = 0, st = 0, q = Q[lv]();
    el.innerHTML = `<div class="g-bar"><span>⏱ <b id="t">60</b>s</span><span>Score: <b id="s">0</b></span><span>🔥 <b id="k">0</b></span></div><div class="g-big" id="q"></div><input class="g-in" id="a" inputmode="numeric" autocomplete="off"><div class="g-msg" id="m"></div>`;
    const $ = i => el.querySelector("#" + i), a = $("a"); const show = () => { $("q").textContent = q[0] + " = ?"; a.value = ""; a.focus(); }; show();
    a.onkeydown = e => { if (e.key != "Enter" || a.value === "") return;
      if (+a.value == q[1]) { st++; sc += 10 + Math.min(st, 10); $("m").className = "g-msg ok"; $("m").textContent = "✔"; } else { st = 0; $("m").className = "g-msg bad"; $("m").textContent = "✘ " + q[1]; }
      $("s").textContent = sc; $("k").textContent = st; q = Q[lv](); show(); };
    T(() => { $("t").textContent = --t; if (t <= 0) { clean(); const b = best("sprint", sc); el.innerHTML = `<div class="g-big">⏱ Time's up!</div><p>Score: <b>${sc}</b> · Best: <b>${b}</b></p><div class="g-row"><button class="g-btn" id="re">Play again</button></div>`; el.querySelector("#re").onclick = () => sprint(el); } }, 1000);
  }
}

/* ---------- Guess the Graph ---------- */
const GR = { absolute: "Absolute value", constant: "Constant", cubing: "Cubic", exponential: "Exponential", goniometric: "Sine / Cosine", linear: "Linear", logarithmic: "Logarithmic", quadratic: "Quadratic", reciprocal: "Reciprocal" };
function graph(el) {
  const keys = shuf(Object.keys(GR)); let i = 0, sc = 0;
  const next = () => {
    if (i >= 9) { const b = best("graph", sc); return el.innerHTML = `<div class="g-big">🏁 ${sc} / 9</div><p>Best: <b>${b}</b></p><div class="g-row"><button class="g-btn" id="re">Play again</button></div>`, el.querySelector("#re").onclick = () => graph(el); }
    const k = keys[i], o = shuf([k, ...shuf(keys.filter(x => x != k)).slice(0, 3)]);
    el.innerHTML = `<div class="g-bar"><span>Question ${i + 1} / 9</span><span>Score: <b>${sc}</b></span></div><p>Which function is this graph?</p><img class="g-img" src="images/${k}.png" alt="graph"><div class="g-opts">${o.map(x => `<button class="g-btn ghost" data-k="${x}">${GR[x]}</button>`).join("")}</div><div class="g-msg" id="m"></div>`;
    el.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { const ok = b.dataset.k == k; if (ok) sc++; el.querySelectorAll("[data-k]").forEach(x => { x.disabled = true; if (x.dataset.k == k) x.style.background = "#2e7d32"; }); if (!ok) b.style.background = "#e53935"; el.querySelector("#m").textContent = ok ? "✅ Correct!" : "❌ It was " + GR[k]; i++; setTimeout(next, 1100); });
  }; next();
}

/* ---------- Equation Wordle ---------- */
function wordle(el) {
  clean();
  const gen = () => { for (;;) { const a = R(99) + 1, b = R(99) + 1, o = pick(["+", "-", "*", "/"]); let c; if (o == "+") c = a + b; else if (o == "-") c = a - b; else if (o == "*") c = a * b; else { if (a % b) continue; c = a / b; } if (c < 0) continue; const s = `${a}${o}${b}=${c}`; if (s.length == 8) return s; } };
  const ans = gen(), keys = "0123456789+-*/=".split(""); let rows = [], cur = "", over = false, st = {};
  const sh = c => c == "*" ? "×" : c == "/" ? "÷" : c == "-" ? "−" : c;
  const draw = () => {
    const rs = []; for (let r = 0; r < 6; r++) { const g = rows[r], w = g ? g.w : r == rows.length ? cur : ""; rs.push(`<div>${Array.from({ length: 8 }, (_, i) => `<span class="${g ? g.c[i] : ""}">${w[i] ? sh(w[i]) : ""}</span>`).join("")}</div>`); }
    el.innerHTML = `<p>Guess the hidden <b>8-character</b> equation in 6 tries. 🟩 right place · 🟨 wrong place · ⬛ not in it.</p><div class="wd">${rs.join("")}</div><div class="g-msg" id="m"></div><div class="kb">${keys.map(k => `<button class="${st[k] || ""}" data-k="${k}">${sh(k)}</button>`).join("")}<button class="w" data-k="Del">⌫</button><button class="w" data-k="Enter">Enter</button></div>`;
    el.querySelectorAll("[data-k]").forEach(b => b.onclick = () => key(b.dataset.k));
  };
  const msg = t => { const m = el.querySelector("#m"); if (m) m.textContent = t; };
  const key = k => {
    if (over) return;
    if (k == "Backspace" || k == "Del") cur = cur.slice(0, -1);
    else if (k == "Enter") {
      if (cur.length < 8) return msg("Equation must be 8 characters.");
      const [l, r, ...x] = cur.split("="); let ok = false; try { ok = !x.length && r !== undefined && /^[\d+\-*/]+$/.test(l) && /^\d+$/.test(r) && Math.abs(Function("return " + l)() - +r) < 1e-9; } catch (e) { }
      if (!ok) return msg("That is not a true equation.");
      const c = Array(8).fill("x"), left = {}; for (let i = 0; i < 8; i++) if (cur[i] == ans[i]) c[i] = "g"; else left[ans[i]] = (left[ans[i]] || 0) + 1;
      for (let i = 0; i < 8; i++) if (c[i] != "g" && left[cur[i]] > 0) { c[i] = "y"; left[cur[i]]--; }
      for (let i = 0; i < 8; i++) { const p = st[cur[i]]; if (p != "g" && !(p == "y" && c[i] == "x")) st[cur[i]] = c[i]; }
      rows.push({ w: cur, c }); const win = cur == ans; cur = ""; draw();
      if (win || rows.length == 6) { over = true; msg(win ? "🎉 You got it!" : "The equation was " + ans.replace("*", "×").replace("/", "÷")); const b = el.querySelector("#m"); b.insertAdjacentHTML("afterend", `<div class="g-row"><button class="g-btn" id="re">New puzzle</button></div>`); el.querySelector("#re").onclick = () => wordle(el); }
      return;
    } else if (keys.includes(k) && cur.length < 8) cur += k;
    draw();
  };
  L(document, "keydown", e => { if (e.target.tagName != "INPUT" && !e.ctrlKey && !e.metaKey) key(e.key); });
  draw();
}

/* ---------- Memory Match ---------- */
const DP = [["d/dx x²", "2x"], ["d/dx x³", "3x²"], ["d/dx sin x", "cos x"], ["d/dx cos x", "−sin x"], ["d/dx eˣ", "eˣ"], ["d/dx ln x", "1/x"], ["d/dx √x", "1/(2√x)"], ["d/dx tan x", "sec²x"], ["d/dx 5x", "5"]];
function memory(el) {
  const ps = shuf(DP).slice(0, 6), cards = shuf(ps.flatMap((p, i) => [{ i, t: p[0] }, { i, t: p[1] }]));
  let a = null, moves = 0, found = 0, lock = false;
  el.innerHTML = `<div class="g-bar"><span>Match each function with its derivative</span><span>Moves: <b id="mv">0</b> · Best: <b>${best("memory")}</b></span></div><div class="mm">${cards.map((c, k) => `<button data-k="${k}">?</button>`).join("")}</div><div class="g-msg" id="m"></div>`;
  const bs = el.querySelectorAll("[data-k]");
  bs.forEach(b => b.onclick = () => {
    const k = +b.dataset.k; if (lock || b.classList.contains("up") || b.classList.contains("done")) return;
    b.classList.add("up"); b.textContent = cards[k].t;
    if (a === null) return a = k;
    moves++; el.querySelector("#mv").textContent = moves; const p = a; a = null;
    if (cards[p].i == cards[k].i && cards[p].t != cards[k].t) { [p, k].forEach(x => { bs[x].classList.replace("up", "done"); }); if (++found == 6) { const sc = Math.max(10, 100 - (moves - 6) * 5); best("memory", sc); const m = el.querySelector("#m"); m.className = "g-msg ok"; m.innerHTML = `🎉 Done in ${moves} moves · Score ${sc}<div class="g-row"><button class="g-btn" id="re">Play again</button></div>`; el.querySelector("#re").onclick = () => memory(el); } }
    else { lock = true; setTimeout(() => { [p, k].forEach(x => { bs[x].classList.remove("up"); bs[x].textContent = "?"; }); lock = false; }, 800); }
  });
}

/* ---------- Derivative Duel ---------- */
const DD = [["x^2", ["2x"]], ["x^3", ["3x^2"]], ["x^4", ["4x^3"]], ["5x", ["5"]], ["3x^2", ["6x"]], ["2x^3", ["6x^2"]], ["x^2+3x", ["2x+3"]], ["sin(x)", ["cos(x)", "cosx"]], ["cos(x)", ["-sin(x)", "-sinx"]], ["e^x", ["e^x"]], ["ln(x)", ["1/x", "x^-1"]], ["1/x", ["-1/x^2", "-x^-2"]], ["7", ["0"]], ["x^5", ["5x^4"]], ["4x^2+x", ["8x+1"]], ["sqrt(x)", ["1/(2sqrt(x))", "1/2sqrt(x)", "0.5x^-0.5"]]];
function duel(el) {
  let sc = 0, lives = 3, items = [], tick = 0;
  el.innerHTML = `<div class="g-bar"><span>Score: <b id="s">0</b></span><span>Best: <b>${best("duel")}</b></span><span id="lv">❤️❤️❤️</span></div><p>Type the derivative (e.g. <code>3x^2</code>, <code>cos(x)</code>) and press Enter before it lands!</p><div class="fall" id="f"></div><input class="g-in" id="a" autocomplete="off" placeholder="d/dx = ?"><div class="g-msg" id="m"></div>`;
  const f = el.querySelector("#f"), a = el.querySelector("#a"); a.focus();
  const end = () => { clean(); const b = best("duel", sc); el.innerHTML = `<div class="g-big">💥 Game over</div><p>Score: <b>${sc}</b> · Best: <b>${b}</b></p><div class="g-row"><button class="g-btn" id="re">Play again</button></div>`; el.querySelector("#re").onclick = () => duel(el); };
  a.onkeydown = e => { if (e.key != "Enter") return; const v = norm(a.value); a.value = "";
    const hit = items.filter(i => i.ans.map(norm).includes(v)).sort((p, q) => q.y - p.y)[0];
    if (hit) { hit.el.remove(); items = items.filter(i => i != hit); sc += 10; el.querySelector("#s").textContent = sc; } };
  T(() => {
    tick++; const spd = 1.1 + sc / 150;
    if (tick % 45 == 1) { const [q, ans] = pick(DD), d = E(`d/dx ( ${q} )`); d.style.left = 15 + R(70) + "%"; d.style.top = "0px"; f.appendChild(d); items.push({ el: d, ans, y: 0 }); }
    items.forEach(i => { i.y += spd; i.el.style.top = i.y + "px"; });
    const dead = items.filter(i => i.y > 285); dead.forEach(i => { i.el.remove(); lives--; });
    items = items.filter(i => i.y <= 285); if (dead.length) { el.querySelector("#lv").textContent = "❤️".repeat(Math.max(lives, 0)) || "💔"; if (lives <= 0) end(); }
  }, 40);
}

/* ---------- Hub ---------- */
const G = [
  { id: "g24", ic: "🎯", n: "24 Game", d: "Make 24 using four numbers", f: g24, b: "g24" },
  { id: "sprint", ic: "⚡", n: "Math Sprint", d: "60 seconds of mental maths", f: sprint, b: "sprint" },
  { id: "graph", ic: "📈", n: "Guess the Graph", d: "Name the function from its graph", f: graph, b: "graph" },
  { id: "wordle", ic: "🔢", n: "Equation Wordle", d: "Find the hidden equation in 6 tries", f: wordle },
  { id: "memory", ic: "🧠", n: "Memory Match", d: "Pair functions with derivatives", f: memory, b: "memory" },
  { id: "duel", ic: "☄️", n: "Derivative Duel", d: "Type derivatives before they land", f: duel, b: "duel" }
];
const root = document.getElementById("gm");
function menu() {
  clean(); root.innerHTML = "";
  const m = E("", "g-menu");
  G.forEach(g => { const c = E(`<div class="ic">${g.ic}</div><h3>${g.n}</h3><p>${g.d}</p>${g.b && best(g.b) ? `<small>Best: ${best(g.b)}</small>` : ""}`, "g-card"); c.onclick = () => open(g); m.appendChild(c); });
  root.appendChild(m);
}
function open(g) {
  clean(); root.innerHTML = "";
  const top = E(`<button class="g-btn ghost">← All games</button>`, "g-row"); top.firstChild.onclick = menu;
  const box = E("", "g-box"); root.append(top, box); g.f(box);
}
menu();
})();
