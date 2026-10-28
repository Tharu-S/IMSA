import * as F from "./fb.js";
import SAMPLES from "./samples.js";
const $ = s => document.querySelector(s), page = document.body.dataset.page;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = ms => new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const cssUrl = u => encodeURI(u).replace(/['()]/g, c => "%" + c.charCodeAt(0).toString(16));
const CATS = ["Algebra", "Calculus", "Statistics", "Probability", "Geometry", "Trigonometry", "Industrial Maths", "Other"];
const math = el => window.renderMathInElement && renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
const body = t => String(t || "").split("\n").map(l => { const m = l.match(/^img:\s*(https?:\/\/\S+)/i);
  return m ? `<img src="${esc(m[1])}" alt="">` : l.startsWith("## ") ? `<h3>${esc(l.slice(3))}</h3>` : l.trim() ? `<p>${esc(l)}</p>` : ""; }).join("");
const card = a => `<a class="card-a" href="article.html?id=${a.id}"><div class="cover" ${a.image ? `style="background-image:url('${cssUrl(a.image)}')"` : ""}>${a.image ? "" : "∑"}</div>
  <div class="cb"><span class="tag">${esc(a.category || "Other")}</span><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>
  <div class="meta">by ${esc(a.authorName)} · ${fmt(a.ms)} · 👍 ${(a.likes || []).length} 👎 ${(a.dislikes || []).length}</div></div></a>`;
const fail = (el, e) => el.innerHTML = `<div class="notice">Something went wrong: ${esc(e.code || e.message)}</div>`;

/* ---------------- Articles list ---------------- */
if (page === "list") {
  let all = [], cat = "All";
  const chips = $("#chips"), draw = () => { const q = $("#q").value.toLowerCase();
    const l = all.filter(a => (cat === "All" || a.category === cat) && (a.title + " " + a.excerpt).toLowerCase().includes(q));
    $("#grid").innerHTML = l.length ? l.map(card).join("") : '<p class="muted">No articles found. Be the first to write one!</p>'; };
  chips.innerHTML = ["All", ...CATS].map(c => `<button class="chip ${c === "All" ? "on" : ""}">${c}</button>`).join("");
  chips.onclick = e => { if (!e.target.classList.contains("chip")) return; cat = e.target.textContent;
    chips.querySelectorAll(".chip").forEach(x => x.classList.toggle("on", x === e.target)); draw(); };
  $("#q").oninput = draw;
  F.ready.then(() => F.approved()).then(a => { all = a; draw(); }).catch(e => fail($("#grid"), e));
}

/* ---------------- Single article ---------------- */
if (page === "view") {
  const id = new URLSearchParams(location.search).get("id"); let a = null, unsub = null;
  const need = () => { if (!F.me) { alert("Please log in first."); location.href = "login.html"; return true; } };
  const render = () => { const me = F.me, can = me && (me.id === a.authorId || me.role === "admin");
    $("#art").innerHTML = `${a.status !== "approved" ? `<div class="notice">Status: <b>${esc(a.status)}</b> — only you and admins can see this article.${a.status === "rejected" && a.rejectReason ? `<br>Reason: ${esc(a.rejectReason)}` : ""}</div>` : ""}
      <span class="tag">${esc(a.category)}</span><h1>${esc(a.title)}</h1><div class="meta">by ${esc(a.authorName)} · ${fmt(a.ms)}</div>
      ${a.image ? `<img class="hero-img" src="${esc(a.image)}" alt="">` : ""}<div class="content">${body(a.content)}</div>
      <div class="react"><button id="bl" class="${me && (a.likes || []).includes(me.id) ? "on" : ""}">👍 ${(a.likes || []).length}</button>
      <button id="bd" class="${me && (a.dislikes || []).includes(me.id) ? "on" : ""}">👎 ${(a.dislikes || []).length}</button>${can ? '<button id="bx" class="danger">🗑 Delete</button>' : ""}</div>`;
    math($("#art"));
    const rx = t => async () => { if (need()) return; try { await F.react(a, t); a = await F.getArticle(id); render(); } catch (e) { alert(e.code || e.message); } };
    $("#bl").onclick = rx("like"); $("#bd").onclick = rx("dislike");
    if ($("#bx")) $("#bx").onclick = async () => { if (confirm("Delete this article?")) { await F.del(id); location.href = "articles.html"; } };
    $("#cmBox").hidden = a.status !== "approved";
    $("#cmB").onclick = async () => { if (need()) return; const t = $("#cmT").value.trim(); if (!t) return; try { await F.addComment(id, t); $("#cmT").value = ""; } catch (e) { alert(e.code || e.message); } };
    if (!unsub && a.status === "approved") unsub = F.watchComments(id, cs => { $("#cmN").textContent = `(${cs.length})`;
      $("#cmList").innerHTML = cs.map(c => `<div class="cm">${F.me && (F.me.id === c.authorId || F.me.role === "admin") ? `<button data-c="${c.id}">✕</button>` : ""}
        <div class="meta"><b>${esc(c.authorName)}</b> · ${fmt(c.ms)}</div>${esc(c.text)}</div>`).join("") || '<p class="muted">No comments yet.</p>';
      $("#cmList").querySelectorAll("button[data-c]").forEach(b => b.onclick = () => F.delComment(id, b.dataset.c)); });
  };
  F.ready.then(async () => { try { a = await F.getArticle(id); } catch (e) { a = null; }
    if (!a) return $("#art").innerHTML = '<div class="notice">Article not found.</div>'; render(); });
  F.onUser(() => a && render());
}

/* ---------------- Write / My articles ---------------- */
if (page === "write") {
  let editId = null; $("#wc").innerHTML = CATS.map(c => `<option>${c}</option>`).join("");
  const pv = () => { $("#pv").innerHTML = body($("#wb").value); math($("#pv")); }; $("#wb").oninput = pv;
  const reset = () => { editId = null; ["#wt", "#wi", "#wb"].forEach(s => $(s).value = ""); $("#ws").textContent = "Submit for approval"; pv(); };
  const loadMine = async () => { const l = await F.mine();
    $("#mine").innerHTML = l.map(a => `<div class="row-i"><div><a href="article.html?id=${a.id}">${esc(a.title)}</a><span class="badge ${a.status}">${a.status}</span>
      <div class="meta">${fmt(a.ms)} · 👍 ${(a.likes || []).length} 👎 ${(a.dislikes || []).length}</div>${a.status === "rejected" && a.rejectReason ? `<div class="why">❌ Rejected: ${esc(a.rejectReason)}</div>` : ""}</div>
      <div class="acts"><button class="ar-btn ghost" data-e="${a.id}">Edit</button><button class="ar-btn red" data-d="${a.id}">Delete</button></div></div>`).join("") || '<p class="muted">You have not written any articles yet.</p>';
    $("#mine").querySelectorAll("[data-e]").forEach(b => b.onclick = () => { const a = l.find(x => x.id === b.dataset.e); editId = a.id;
      $("#wt").value = a.title; $("#wc").value = a.category; $("#wi").value = a.image; $("#wb").value = a.content; $("#ws").textContent = "Save (needs approval again)"; pv(); scrollTo({ top: 0, behavior: "smooth" }); });
    $("#mine").querySelectorAll("[data-d]").forEach(b => b.onclick = async () => { if (confirm("Delete this article?")) { await F.del(b.dataset.d); loadMine(); } }); };
  F.ready.then(u => { if (!u) { $("#wBox").innerHTML = '<div class="notice">Please <a href="login.html">log in with Google</a> to write an article.</div>'; return; }
    $("#wBox").hidden = false; $("#mineBox").hidden = false; loadMine();
    $("#ws").onclick = async () => { const d = { title: $("#wt").value, category: $("#wc").value, image: $("#wi").value, content: $("#wb").value };
      if (!d.title.trim() || !d.content.trim()) return alert("Title and content are required.");
      try { editId ? await F.updateArticle(editId, d) : await F.createArticle(d); alert("Submitted! An admin will review it soon."); reset(); loadMine(); } catch (e) { alert("Could not save: " + (e.code || e.message)); } }; });
}

/* ---------------- Admin ---------------- */
if (page === "admin") {
  const row = (a, acts, open) => `<div class="row-i"><div><a href="article.html?id=${a.id}">${esc(a.title)}</a><div class="meta">by ${esc(a.authorName)} · ${esc(a.category)} · ${fmt(a.ms)}</div></div><div class="acts">${acts}</div>
    <details class="full" ${open ? "open" : ""}><summary>👁 Full article</summary>${a.image ? `<img class="hero-img" src="${esc(a.image)}" alt="">` : ""}<div class="content">${body(a.content)}</div></details></div>`;
  const load = async () => { try {
    const [p, ap, m] = await Promise.all([F.pending(), F.approved(), F.messages()]);
    $("#pend").innerHTML = p.map(a => row(a, `<button class="ar-btn green" data-s="approved" data-id="${a.id}">Approve</button><button class="ar-btn red" data-s="rejected" data-id="${a.id}">Reject</button>`, true)).join("") || '<p class="muted">No articles waiting for approval 🎉</p>';
    $("#appr").innerHTML = ap.map(a => row(a, `<button class="ar-btn red" data-x="${a.id}">Delete</button>`, false)).join("") || '<p class="muted">Nothing published yet.</p>';
    $("#msgs").innerHTML = m.map(x => `<div class="row-i"><div><b>${esc(x.name)}</b> &lt;${esc(x.email)}&gt;<div class="meta">${fmt(x.ms)}</div><p>${esc(x.message)}</p></div></div>`).join("") || '<p class="muted">No messages.</p>';
    math($("#pend")); math($("#appr"));
    document.querySelectorAll("[data-s]").forEach(b => b.onclick = async () => {
      let reason = "";
      if (b.dataset.s === "rejected") { reason = (prompt("Reason for rejecting this article:") || "").trim(); if (!reason) return alert("A reason is required to reject."); }
      try { await F.setStatus(b.dataset.id, b.dataset.s, reason); load(); } catch (e) { alert(e.code || e.message); } });
    document.querySelectorAll("[data-x]").forEach(b => b.onclick = async () => { if (confirm("Delete this article?")) { await F.del(b.dataset.x); load(); } });
  } catch (e) { fail($("#pend"), e); } };
  F.ready.then(u => { if (!u || u.role !== "admin") { $("#aBox").innerHTML = '<div class="notice">This page is for admins only.</div>'; return; } $("#aBox").hidden = false; load();
    $("#seed").onclick = async () => { if (!confirm("Add 6 sample articles (published immediately)?")) return; $("#seed").disabled = true;
      try { for (const s of SAMPLES) { const r = await F.createArticle(s); await F.setStatus(r.id, "approved"); } alert("Sample articles added!"); load(); } catch (e) { alert("Failed: " + (e.code || e.message)); } $("#seed").disabled = false; }; });
}
