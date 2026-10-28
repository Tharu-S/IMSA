import { auth, db, provider } from "./firebase.js";
import { signInWithPopup, signOut as so, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, arrayUnion, arrayRemove, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let me = null; const subs = [];
const clean = s => String(s ?? "").replace(/[<>]/g, "");
async function ensureUser(u) {
  const r = doc(db, "users", u.uid); let s = await getDoc(r);
  if (!s.exists()) { await setDoc(r, { name: clean(u.displayName || u.email), email: u.email, photo: u.photoURL || "", role: "user", createdAt: serverTimestamp() }); s = await getDoc(r); }
  return { id: u.uid, ...s.data() };
}
function sync() {
  const L = localStorage;
  if (me) { L.ms_logged_in = "true"; L.ms_user_email = me.email; L.ms_user_name = me.name; L.ms_role = me.role; }
  else ["ms_logged_in", "ms_user_email", "ms_user_name", "ms_role"].forEach(k => L.removeItem(k));
}
export const ready = new Promise(res => onAuthStateChanged(auth, async u => {
  try { me = u ? await ensureUser(u) : null; } catch (e) { console.warn(e); me = null; }
  sync(); subs.forEach(f => f(me)); res(me); }));
export const onUser = f => { subs.push(f); ready.then(() => f(me)); };
export const login = async () => { const { user } = await signInWithPopup(auth, provider); me = await ensureUser(user); sync(); subs.forEach(f => f(me)); return me; };
export const logout = async () => { await so(auth); me = null; sync(); };

const toA = s => { const d = s.data(); return { id: s.id, ...d, ms: d.date?.toMillis?.() ?? Date.now() }; };
const byDate = (a, b) => b.ms - a.ms;
const col = "articles", A = () => collection(db, col);
const byStatus = async st => (await getDocs(query(A(), where("status", "==", st)))).docs.map(toA).sort(byDate);
export const approved = () => byStatus("approved");
export const pending = () => byStatus("pending");
export const mine = async () => (await getDocs(query(A(), where("authorId", "==", me.id)))).docs.map(toA).sort(byDate);
export const getArticle = async id => { const s = await getDoc(doc(db, col, id)); return s.exists() ? toA(s) : null; };
const fields = d => { const content = String(d.content || "").slice(0, 30000);
  return { title: clean(d.title).trim().slice(0, 150), category: clean(d.category), image: /^https?:\/\//i.test(d.image || "") ? d.image.trim() : "",
    content, excerpt: clean(content.replace(/\$[^$]*\$/g, " ").replace(/^img:.*$/gim, "").replace(/\s+/g, " ").trim().slice(0, 140)) }; };
export const createArticle = d => addDoc(A(), { ...fields(d), authorId: me.id, authorName: me.name, status: "pending", likes: [], dislikes: [], date: serverTimestamp() });
export const updateArticle = (id, d) => updateDoc(doc(db, col, id), { ...fields(d), status: "pending", rejectReason: "" });
export const setStatus = (id, status, reason = "") => updateDoc(doc(db, col, id), { status, rejectReason: status === "rejected" ? clean(reason).trim().slice(0, 500) : "" });
export const del = id => deleteDoc(doc(db, col, id));
export const react = (a, type) => { const k = type === "like" ? "likes" : "dislikes", o = type === "like" ? "dislikes" : "likes";
  return updateDoc(doc(db, col, a.id), (a[k] || []).includes(me.id) ? { [k]: arrayRemove(me.id) } : { [k]: arrayUnion(me.id), [o]: arrayRemove(me.id) }); };
export const watchComments = (id, cb) => onSnapshot(query(collection(db, col, id, "comments"), orderBy("date")), s => cb(s.docs.map(toA)), () => cb([]));
export const addComment = (id, text) => addDoc(collection(db, col, id, "comments"), { text: clean(text).trim().slice(0, 1000), authorId: me.id, authorName: me.name, date: serverTimestamp() });
export const delComment = (id, cid) => deleteDoc(doc(db, col, id, "comments", cid));
export const sendMessage = (name, email, message) => addDoc(collection(db, "messages"), { name: clean(name).slice(0, 100), email: clean(email).slice(0, 150), message: clean(message).slice(0, 2000), date: serverTimestamp() });
export const messages = async () => (await getDocs(collection(db, "messages"))).docs.map(toA).sort(byDate);
