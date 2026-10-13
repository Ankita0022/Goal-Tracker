// ---- State & sync -------------------------------------------------------
// state = { done: {topicId: true}, dates: {goalId: "YYYY-MM-DD"}, tasks: [{id, text, date, done}], updated }
let state = { done: {}, dates: {}, tasks: [], learn: [], seen: {}, notes: {}, updated: 0 };
let tab = location.hash.slice(1) || "today";
const syncEl = document.getElementById("sync");
const LOCAL_KEY = "mygoals-state";

function getPin() { try { return localStorage.getItem("mygoals-pin") || ""; } catch { return ""; } }
function setPin(p) { try { localStorage.setItem("mygoals-pin", p); } catch {} }
function saveLocal() { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); } catch {} }
function loadLocal() { try { const s = JSON.parse(localStorage.getItem(LOCAL_KEY)); if (s) state = { ...state, ...s }; } catch {} }

function askPin() {
  return new Promise((resolve) => {
    const d = document.getElementById("pinDialog");
    d.showModal();
    d.addEventListener("close", () => { setPin(document.getElementById("pinInput").value.trim()); resolve(); }, { once: true });
  });
}

async function api(method, body) {
  const res = await fetch("/api/state", {
    method, headers: { "x-pin": getPin(), "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) { await askPin(); return api(method, body); }
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

async function pull() {
  try {
    if (!getPin()) await askPin();
    const remote = await api("GET");
    if ((remote.updated || 0) >= (state.updated || 0)) state = { ...state, ...remote };
    else await api("PUT", state); // local is newer (edited offline)
    saveLocal();
    syncEl.textContent = "✓ synced";
  } catch { syncEl.textContent = "offline (saved on device)"; }
  render();
}

let pushTimer;
function commit() {
  state.updated = Date.now();
  saveLocal();
  render();
  syncEl.textContent = "saving…";
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try { await api("PUT", state); syncEl.textContent = "✓ synced"; }
    catch { syncEl.textContent = "offline (saved on device)"; }
  }, 600);
}

// ---- Helpers ------------------------------------------------------------
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const todayStr = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const daysUntil = (iso) => Math.round((new Date(iso + "T00:00:00") - new Date(todayStr() + "T00:00:00")) / 864e5);
const fmt = (iso) => new Date(iso + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const goalDate = (g) => state.dates[g.id] || g.date;
const topicId = (g, sec, t) => `${g.id}|${sec}|${t}`;
const isWeekend = (iso) => new Date(iso + "T00:00:00").getDay() === 0; // only Sunday off
const slotsFor = (p, iso) => (isWeekend(iso) && p.weekend) || p.weekday;
// "21:30–00:30" → "9:30 PM – 12:30 AM"
const to12h = (s) => s.replace(/(\d{1,2}):(\d{2})/g, (_, h, m) => `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`).replace("–", " – ");

// ---- Fun bits -----------------------------------------------------------
const GOAL_EMOJI = { uiux: "🎨", rrbje: "🚂", sscje: "🛠️", chsl: "📖", gate: "🎓" };
const SLOT_EMOJI = [
  [/commute/i, "🚌"], [/lunch/i, "🍱"], [/cook|dinner/i, "🍲"], [/sleep|plan tomorrow/i, "😴"],
  [/mock|pyq|test/i, "📝"], [/analy/i, "🔍"], [/math|quant/i, "🔢"], [/reason|puzzle/i, "🧩"],
  [/english|vocab|grammar/i, "🔤"], [/ga\b|current|science|gk/i, "🌍"], [/ui\/ux|figma/i, "🎨"],
  [/gate/i, "🎓"], [/technical|cs/i, "💻"], [/revis|notes|formula/i, "📒"], [/leave|exam|best/i, "🍀"],
];
const slotEmoji = (what) => (SLOT_EMOJI.find(([re]) => re.test(what)) || [, "⭐"])[1];

// Is the current time inside "HH:MM–HH:MM"? Handles ranges past midnight.
function isNowSlot(time) {
  const m = time.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
  if (!m) return false;
  const d = new Date(), now = d.getHours() * 60 + d.getMinutes();
  const a = +m[1] * 60 + +m[2], b = +m[3] * 60 + +m[4];
  return a <= b ? now >= a && now < b : now >= a || now < b;
}
const slotList = (slots, live) => slots.map(([time, what]) =>
  `<div class="slot ${live && isNowSlot(time) ? "now" : ""}"><span class="ico">${slotEmoji(what)}</span><b>${time ? to12h(time) : "All day"}</b><span>${esc(what)}</span></div>`).join("");

const LEVELS = ["Tiny Seed 🌱", "Sprout 🌿", "Busy Bee 🐝", "Bookworm 🐛", "Smarty Pants 👖", "Brainiac 🧠", "Rocket 🚀", "Superstar 🌟", "Wizard 🧙", "Legend 🦄"];
function xpInfo() {
  const keys = Object.keys(state.done), learnt = keys.filter((k) => k.startsWith("learn|")).length;
  const xp = (keys.length - learnt) * 10 + learnt * 15 + state.tasks.filter((t) => t.done).length * 5 + Object.keys(state.seen || {}).length * 2;
  const lvl = Math.floor(xp / 100);
  return { xp, lvl: lvl + 1, title: LEVELS[Math.min(lvl, LEVELS.length - 1)], into: xp % 100 };
}

const CHEERS = [
  "You've got this! 💪", "One topic at a time 🐢✨", "Small steps, big dreams 🌈", "Hoot hoot! Let's study 🦉",
  "Every tick = +10 XP 🎯", "Future officer in the making 🏅", "Drink water, then conquer! 💧", "Mistakes are just XP in disguise 🎁",
];
function greeting() {
  const h = new Date().getHours();
  const hi = h < 12 ? "Good morning ☀️" : h < 18 ? "Good afternoon 🌤️" : h < 21 ? "Good evening 🌆" : "Night owl mode 🌙";
  const next = GOALS.filter((g) => daysUntil(goalDate(g)) >= 0).sort((a, b) => goalDate(a).localeCompare(goalDate(b)))[0];
  if (!next) return `${hi} All goals done — you're a legend! 🦄`;
  const n = daysUntil(goalDate(next));
  return `${hi} ${n === 0 ? `It's ${next.name} day! Go shine ✨` : `${n} day${n === 1 ? "" : "s"} to ${next.name} ${GOAL_EMOJI[next.id] || ""}`}`;
}
function say(text) {
  const b = document.getElementById("bubble");
  b.textContent = text; b.style.animation = "none"; b.offsetWidth; b.style.animation = "";
}

function toast(text) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = text;
  document.getElementById("toasts").append(t);
  setTimeout(() => t.remove(), 2500);
}
function confetti(x, y, n = 14) {
  const bits = ["🎉", "⭐", "✨", "💖", "🌟", "🎈", "🍭"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span");
    c.className = "confetti"; c.textContent = bits[i % bits.length];
    const ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120;
    c.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist - 40}px;--r:${Math.random() * 720 - 360}deg`;
    document.body.append(c);
    setTimeout(() => c.remove(), 1200);
  }
}
function celebrate(el, msg, big) {
  const r = el.getBoundingClientRect();
  const before = celebrate.lvl;
  confetti(r.left + r.width / 2, r.top + r.height / 2, big ? 30 : 14);
  toast(msg);
  const { lvl, title } = xpInfo();
  if (before && lvl > before) { setTimeout(() => { toast(`LEVEL UP! You're now a ${title}`); confetti(innerWidth / 2, innerHeight / 3, 40); }, 500); say(`Whoa, level ${lvl}! 🎊`); }
}

function progress(g) {
  let total = 0, done = 0;
  for (const [sec, topics] of Object.entries(g.sections))
    for (const t of topics) { total++; if (state.done[topicId(g, sec, t)]) done++; }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function countdownCard(g) {
  const n = daysUntil(goalDate(g)), p = progress(g);
  const cls = n < 0 ? "past" : n <= 7 ? "urgent" : n <= 21 ? "soon" : "";
  const label = n < 0 ? "done" : n === 0 ? "TODAY!" : `${n} day${n === 1 ? "" : "s"} left`;
  return `<div class="card goal c${GOALS.indexOf(g) % 6} ${cls}">
    <span class="emoji">${GOAL_EMOJI[g.id] || "🎯"}</span>
    <span class="tag">${g.kind}</span>
    <h3 style="margin-top:8px">${esc(g.name)}</h3>
    <div class="big">${label}</div>
    <div class="muted">📅 ${fmt(goalDate(g))}${g.tentative && !state.dates[g.id] ? " (not final)" : ""}</div>
    <div class="bar"><i style="width:${p.pct}%"></i></div>
    <div class="muted">${p.done}/${p.total} topics done · ${p.pct}%</div>
  </div>`;
}

function renderLevel() {
  const { xp, lvl, title, into } = xpInfo();
  const doneToday = state.tasks.filter((t) => t.done && t.date === todayStr()).length;
  document.getElementById("level").innerHTML = `
    <span class="badge">🏅</span>
    <div class="xpinfo">
      <strong>Level ${lvl} · ${title}</strong>
      <div class="bar xpbar"><i style="width:${into}%"></i></div>
      <span class="muted">${100 - into} XP to next level · ✔ topic = 10 XP · ✔ task = 5 XP · 🌟 bonus topic = 15 XP</span>
    </div>
    <div class="stats"><span class="chip">⚡ ${xp} XP</span><span class="chip">📚 ${Object.keys(state.done).length} topics</span><span class="chip">✅ ${doneToday} today</span></div>`;
  celebrate.lvl = lvl;
}

// ---- Views --------------------------------------------------------------
function viewToday() {
  const t = todayStr();
  const phase = PHASES.find((p) => t >= p.from && t <= p.to);
  const tasks = state.tasks.filter((x) => x.date === t || (!x.done && x.date < t));
  const upcoming = GOALS.filter((g) => daysUntil(goalDate(g)) >= 0).sort((a, b) => goalDate(a).localeCompare(goalDate(b)));
  return `
    <h2>⏳ Countdown</h2>
    <div class="grid">${upcoming.map(countdownCard).join("")}</div>
    <h2>🗓️ Today's plan <span class="tag">${fmt(t)}</span> <span class="tag">${isWeekend(t) ? "☀️ Sunday — big study day" : "💼 Office day"}</span></h2>
    ${phase ? `<div class="card"><h3>${esc(phase.title)}</h3>${slotList(slotsFor(phase, t), true)}</div>`
            : `<div class="card empty"><span class="big-emoji">🏝️</span>No plan for today. Add one in data.js.</div>`}
    <h2>✅ Today's to-do</h2>
    ${taskForm(t)}
    <div class="card">${tasks.length ? tasks.map(taskRow).join("") : emptyBox("📝", "Nothing here yet! Add what you'll study today.")}</div>`;
}
const emptyBox = (emoji, text) => `<div class="empty"><span class="big-emoji">${emoji}</span><span class="muted">${text}</span></div>`;

function viewPlan() {
  const t = todayStr();
  return `<h2>🗺️ Your study journey</h2><p class="muted">Tap a stage to see its daily routine. ⭐ marks where you are now.</p>` + PHASES.map((p) => {
    const cls = t > p.to ? "past" : t >= p.from ? "now" : "";
    return `<details class="phase ${cls}" ${cls === "now" ? "open" : ""}>
      <summary><strong>${esc(p.title)}</strong><span class="muted">${fmt(p.from)}${p.from !== p.to ? " – " + fmt(p.to) : ""}</span></summary>
      <div class="phase-body">
        ${p.weekend ? `<span class="daylabel">💼 Mon–Sat (office days)</span>` : ""}${slotList(p.weekday)}
        ${p.weekend ? `<span class="daylabel sun">☀️ Sunday</span>${slotList(p.weekend)}` : ""}
      </div>
    </details>`;
  }).join("");
}

function viewSyllabus() {
  return GOALS.map((g) => {
    const p = progress(g);
    return `<div class="card goal c${GOALS.indexOf(g) % 6}" style="margin-top:26px">
        <div class="goalhead"><span class="emoji" style="position:static">${GOAL_EMOJI[g.id] || "🎯"}</span>
          <h2 style="margin:0;flex:1">${esc(g.name)}</h2><span class="chip">${p.pct}% ${p.pct === 100 ? "🏆" : ""}</span>
          <div class="bar"><i style="width:${p.pct}%"></i></div></div>
        <div class="row"><label class="muted">📅 Exam date: <input type="date" data-date="${g.id}" value="${goalDate(g)}"></label></div>
        ${g.note ? `<p class="note">💡 ${esc(g.note)}</p>` : ""}
      </div>
      ${Object.entries(g.sections).map(([sec, topics]) => {
        const d = topics.filter((x) => state.done[topicId(g, sec, x)]).length;
        return `<details class="${d === topics.length ? "section-done" : ""}" data-key="${esc(g.id + "|" + sec)}"><summary><span>${esc(sec)}</span><span class="chip">${d}/${topics.length}</span></summary><ul>
          ${topics.map((x) => { const id = topicId(g, sec, x), on = !!state.done[id];
            return `<li><label class="chk ${on ? "done" : ""}"><input type="checkbox" data-topic="${esc(id)}" ${on ? "checked" : ""}><span>${esc(x)}</span></label></li>`; }).join("")}
        </ul></details>`;
      }).join("")}`;
  }).join("");
}

function taskForm(date) {
  return `<form class="row" id="taskForm">
    <input type="text" name="text" placeholder="✏️ e.g. Finish OS chapter 3" required>
    <input type="date" name="date" value="${date}">
    <button class="primary">＋ Add</button></form>`;
}
function taskRow(x) {
  const overdue = !x.done && x.date < todayStr();
  return `<div class="row" style="margin:4px 0">
    <label class="chk ${x.done ? "done" : ""}" style="flex:1"><input type="checkbox" data-task="${x.id}" ${x.done ? "checked" : ""}>
      <span>${esc(x.text)} ${overdue ? '<span class="tag overdue">⏰ overdue</span>' : ""}</span></label>
    <span class="muted">${fmt(x.date)}</span>
    <button class="link" data-del="${x.id}" title="Delete">🗑️</button></div>`;
}
function viewTasks() {
  const open = state.tasks.filter((x) => !x.done).sort((a, b) => a.date.localeCompare(b.date));
  const done = state.tasks.filter((x) => x.done).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  return `<h2>📋 All tasks</h2>${taskForm(todayStr())}
    <div class="card">${open.length ? open.map(taskRow).join("") : emptyBox("🎈", "All clear! Nothing pending.")}</div>
    ${done.length ? `<h2>🏆 Done & dusted</h2><div class="card">${done.map(taskRow).join("")}</div>` : ""}`;
}

// ---- Learn: extra topics outside the timetable ---------------------------
// Built-in topics come from LEARN in data.js; ones you add live in state.learn.
const LINK_ICON = { youtube: "▶️", article: "📰", reel: "📸", other: "🔗" };
const linkType = (url) => /youtu\.?be/.test(url) ? "youtube" : /instagram\.com/.test(url) ? "reel" : "article";
const allLearn = () => [...(typeof LEARN !== "undefined" ? LEARN : []), ...(state.learn || [])];

// Main topics: built-in LEARN_GROUPS plus any you create (state.learnGroups), plus "Other".
const allGroups = () => [...(typeof LEARN_GROUPS !== "undefined" ? LEARN_GROUPS : []), ...(state.learnGroups || []), { id: "other", emoji: "✨", title: "Other" }];

let learnFilter = { group: "all", status: "all" };
const linkKey = (x, i) => `${x.id}|${i}`;
const seenCount = (x) => (x.links || []).filter((_, i) => (state.seen || {})[linkKey(x, i)]).length;
function learnStatus(x) {
  if (state.done["learn|" + x.id]) return "done";
  return seenCount(x) || (state.notes || {})[x.id] ? "going" : "new";
}

function viewLearn() {
  const items = allLearn();
  const done = items.filter((x) => state.done["learn|" + x.id]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const groups = allGroups().map((g) => ({ ...g, subs: items.filter((x) => (x.group || "other") === g.id) }))
    .filter((g) => g.subs.length || g.id !== "other");
  const shown = groups.filter((g) => learnFilter.group === "all" || g.id === learnFilter.group)
    .map((g) => ({ ...g, visible: g.subs.filter((x) => learnFilter.status === "all" || learnStatus(x) === learnFilter.status) }))
    .filter((g) => g.visible.length || learnFilter.status === "all");
  const chip = (kind, val, label) => `<button class="fchip ${learnFilter[kind] === val ? "on" : ""}" data-filter="${kind}|${val}">${label}</button>`;
  const badges = groups.filter((g) => g.subs.length && g.subs.every((x) => state.done["learn|" + x.id]));
  return `<h2>🌟 Extra learning</h2>
    <p class="muted">Bonus brain food from your saved reels 🍿 Not in your timetable, so dip in whenever you're curious!</p>
    <div class="card learnhero">
      <div style="flex:1;min-width:200px">
        <strong>${done}/${items.length} sub-topics explored · ${pct}%</strong>
        <div class="bar xpbar"><i style="width:${pct}%"></i></div>
        <span class="muted">👀 watched/read a link = +2 XP · 🌟 finished a sub-topic = +15 XP</span>
        ${badges.length ? `<div class="badges">${badges.map((g) => `<span class="sticker" title="${esc(g.title)} complete!">${g.emoji}</span>`).join("")}</div>` : ""}
      </div>
      <button class="primary dice" id="surprise">🎲 Surprise me!</button>
    </div>
    <div class="filters">
      ${chip("group", "all", "🌈 All")}${groups.map((g) => chip("group", g.id, `${g.emoji} ${esc(g.title.split(":")[0])}`)).join("")}
    </div>
    <div class="filters">
      ${chip("status", "all", "Everything")}${chip("status", "new", "🆕 Not started")}${chip("status", "going", "🚧 In progress")}${chip("status", "done", "✅ Done")}
    </div>
    ${shown.length ? shown.map(groupCard).join("") : emptyBox("🔍", "Nothing matches these filters.")}
    <details class="addbox" data-key="addbox"><summary><span>➕ Add your own sub-topic</span></summary>
      <form class="row phase-body" id="learnForm">
        <input type="text" name="title" placeholder="💡 e.g. How UPI works" required>
        <select name="group">${allGroups().map((g) => `<option value="${g.id}">${g.emoji} ${esc(g.title)}</option>`).join("")}
          <option value="__new">＋ New main topic…</option></select>
        <button class="primary">＋ Add</button></form>
    </details>`;
}
function groupCard(g) {
  const d = g.subs.filter((x) => state.done["learn|" + x.id]).length, pct = g.subs.length ? Math.round((d / g.subs.length) * 100) : 0;
  const mine = (state.learnGroups || []).some((x) => x.id === g.id);
  const complete = g.subs.length && d === g.subs.length;
  return `<div class="card goal c${allGroups().findIndex((x) => x.id === g.id) % 6}" style="margin-top:22px">
      ${complete ? `<span class="stamp">COMPLETE!</span>` : ""}
      <div class="goalhead"><span class="emoji" style="position:static">${g.emoji}</span>
        <h2 style="margin:0;flex:1">${esc(g.title)}</h2><span class="chip">${d}/${g.subs.length} ${complete ? "🏆" : ""}</span>
        ${mine && !g.subs.length ? `<button class="link" data-delgroup="${g.id}" title="Delete main topic">🗑️</button>` : ""}
        <div class="bar"><i style="width:${pct}%"></i></div></div>
      ${g.why ? `<p class="muted" style="margin:8px 0 0">${esc(g.why)}</p>` : ""}
    </div>
    <div class="subtopics">${g.visible.length ? g.visible.map(learnCard).join("") : emptyBox("🌱", "No sub-topics yet. Add one at the bottom!")}</div>`;
}
function learnCard(x) {
  const on = !!state.done["learn|" + x.id], mine = !!(state.learn || []).find((l) => l.id === x.id);
  const n = (x.links || []).length, seen = seenCount(x), st = learnStatus(x);
  const tag = { new: "🆕", going: "🚧", done: "✅" }[st];
  return `<details class="learncard ${on ? "section-done" : ""}" data-key="learn-${x.id}" id="learn-${x.id}"><summary>
      <span>${x.emoji || "💡"} ${esc(x.title)}</span>
      <span class="ring" style="--p:${n ? (seen / n) * 100 : 0}" title="${seen}/${n} links seen">${tag}</span></summary>
    <div class="phase-body">
      ${x.why ? `<p class="muted" style="margin:0 0 8px">${esc(x.why)}</p>` : ""}
      ${x.points ? `<div class="points">${x.points.map((pt) => `<span class="chip">${esc(pt)}</span>`).join("")}</div>` : ""}
      ${n ? `<div class="muted" style="margin:4px 0">👀 ${seen}/${n} explored. Tap the eye when you've watched or read one.</div>` : ""}
      ${(x.links || []).map((l, i) => { const s = !!(state.seen || {})[linkKey(x, i)];
        return `<div class="row linkrow ${s ? "seen" : ""}" style="margin:4px 0">
        <button class="eye" data-seen="${linkKey(x, i)}" title="${s ? "Mark as not seen" : "Mark as seen"}">${s ? "✅" : "👀"}</button>
        <a class="learnlink" href="${esc(l.url)}" target="_blank" rel="noopener" data-open="${linkKey(x, i)}">${LINK_ICON[l.type || linkType(l.url)]} ${esc(l.label || l.url)}</a>
        ${mine ? `<button class="link" data-dellink="${x.id}|${i}" title="Remove link">✕</button>` : ""}</div>`; }).join("")}
      ${mine ? `<form class="row linkForm" data-learn="${x.id}">
        <input type="text" name="url" placeholder="Paste a YouTube / article / reel link" required>
        <input type="text" name="label" placeholder="Name (optional)" style="min-width:120px">
        <button class="primary">＋</button></form>` : ""}
      <label class="takeaway"><span>📝 My takeaway</span>
        <textarea data-note="${x.id}" rows="2" placeholder="One thing I learnt is…">${esc((state.notes || {})[x.id] || "")}</textarea></label>
      <div class="row">
        <label class="chk ${on ? "done" : ""}" style="flex:1"><input type="checkbox" data-topic="learn|${x.id}" ${on ? "checked" : ""}><span>I've learnt this! 🌟</span></label>
        ${mine ? `<button class="link" data-dellearn="${x.id}" title="Delete topic">🗑️</button>` : ""}
      </div>
    </div></details>`;
}

function toggleSeen(key, el, force) {
  state.seen ||= {};
  const now = force ?? !state.seen[key];
  if (now === !!state.seen[key]) return;
  if (now) state.seen[key] = true; else delete state.seen[key];
  if (now) {
    celebrate(el, "+2 XP 👀 Nice!");
    const x = allLearn().find((t) => key.startsWith(t.id + "|"));
    if (x && seenCount(x) === x.links.length && !state.done["learn|" + x.id])
      setTimeout(() => { toast("All links explored! Now tick “I've learnt this” 🌟"); say(`You explored all of “${x.title}”! 🎉`); }, 700);
  }
  commit();
}
function surprise() {
  const pool = allLearn().filter((x) => !state.done["learn|" + x.id]);
  if (!pool.length) { toast("You've learnt everything! 🦄"); return; }
  const btn = document.getElementById("surprise");
  btn.classList.add("rolling");
  const faces = ["🎲", "🎯", "🍀", "✨", "🔮"];
  let k = 0; const spin = setInterval(() => { btn.textContent = faces[k++ % faces.length] + " Rolling…"; }, 90);
  setTimeout(() => {
    clearInterval(spin);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    learnFilter = { group: "all", status: "all" };
    render();
    const el = document.getElementById("learn-" + pick.id);
    el.open = true; el.classList.add("picked");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    confetti(innerWidth / 2, innerHeight / 2, 18);
    say(`Today's pick: ${pick.emoji || "💡"} ${pick.title}!`);
    setTimeout(() => el.classList.remove("picked"), 2500);
  }, 900);
}

// ---- Calendar -----------------------------------------------------------
let calMonth = todayStr().slice(0, 7); // "YYYY-MM"
let calPick = todayStr();
const isoOf = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
// An exam covers its window (e.g. SSC JE Nov 2–6) until you set your exact date in the Syllabus tab.
const goalRange = (g) => state.dates[g.id] ? [state.dates[g.id], state.dates[g.id]] : g.window || [g.date, g.date];

function eventsOn(iso) {
  const exams = GOALS.filter((g) => { const [a, b] = goalRange(g); return iso >= a && iso <= b; })
    .map((g) => ({ g, single: goalRange(g)[0] === goalRange(g)[1] }));
  const tasks = state.tasks.filter((t) => t.date === iso);
  return { exams, tasks };
}

function viewCalendar() {
  const [y, m] = calMonth.split("-").map(Number);
  const first = new Date(y, m - 1, 1), days = new Date(y, m, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // weeks start on Monday
  const t = todayStr();
  let cells = "";
  for (let i = 0; i < lead; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const iso = isoOf(y, m, d), { exams, tasks } = eventsOn(iso);
    const big = exams.find((e) => e.single);
    const cls = [iso === t && "today", iso === calPick && "picked", big && `exam c${GOALS.indexOf(big.g) % 6}`,
      !big && exams.length && "window", iso < t && "past", new Date(iso + "T00:00:00").getDay() === 0 && "sun"].filter(Boolean).join(" ");
    cells += `<button class="cal-cell ${cls}" data-day="${iso}">
      <span class="num">${d}</span>
      <span class="evs">${exams.map((e) => GOAL_EMOJI[e.g.id] || "🎯").join("")}</span>
      ${tasks.length ? `<span class="dots">${"•".repeat(Math.min(tasks.length, 4))}</span>` : ""}
    </button>`;
  }
  const monthName = first.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const inMonth = GOALS.filter((g) => { const [a, b] = goalRange(g); return a.slice(0, 7) <= calMonth && b.slice(0, 7) >= calMonth; });
  return `<h2>📅 Exam calendar</h2>
    <div class="card cal">
      <div class="cal-head">
        <button class="cal-nav" data-cal="-1" title="Previous month">◀</button>
        <strong>${monthName}</strong>
        <button class="cal-nav" data-cal="1" title="Next month">▶</button>
      </div>
      <div class="cal-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-dow">${d}</div>`).join("")}${cells}</div>
      <div class="row" style="justify-content:center"><button class="fchip" data-cal="today">📍 Jump to today</button></div>
    </div>
    <div class="card legend">
      ${GOALS.map((g, i) => `<span class="chip"><span class="sw c${i % 6}"></span>${GOAL_EMOJI[g.id] || "🎯"} ${esc(g.name)} · ${fmt(goalRange(g)[0])}${goalRange(g)[0] !== goalRange(g)[1] ? " – " + fmt(goalRange(g)[1]) : ""}</span>`).join("")}
      <span class="chip"><span class="sw window"></span>Exam window (date not fixed)</span><span class="chip">• Task</span>
    </div>
    ${dayDetail(calPick)}
    ${inMonth.length ? "" : `<p class="muted" style="text-align:center">No exams this month — a great month to get ahead! 🚀</p>`}`;
}

function dayDetail(iso) {
  const { exams, tasks } = eventsOn(iso), n = daysUntil(iso);
  const when = n === 0 ? "Today" : n === 1 ? "Tomorrow" : n > 0 ? `In ${n} days` : `${-n} days ago`;
  return `<div class="card daydetail">
    <h3>${fmt(iso)} <span class="tag">${when}</span></h3>
    ${exams.map(({ g, single }) => `<div class="slot"><span class="ico">${GOAL_EMOJI[g.id] || "🎯"}</span><b>${single ? "Exam day!" : "Exam window"}</b><span>${esc(g.name)}${single ? "" : " (your exact date isn't fixed yet. Set it in 📚 Syllabus)"}</span></div>`).join("")}
    ${tasks.map(taskRow).join("")}
    ${!exams.length && !tasks.length ? `<p class="muted" style="margin:6px 0">Nothing planned. Add a task for this day:</p>` : ""}
    ${taskForm(iso)}
  </div>`;
}

function render() {
  renderLevel();
  document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  const views = { today: viewToday, plan: viewPlan, syllabus: viewSyllabus, tasks: viewTasks, learn: viewLearn, calendar: viewCalendar };
  // Preserve which <details> are open across re-renders
  const keyOf = (d) => d.dataset.key || d.querySelector("summary").textContent;
  const open = [...document.querySelectorAll("#app details[open]")].map(keyOf);
  const animate = render.lastTab !== tab; render.lastTab = tab;
  const y = scrollY;
  document.getElementById("app").innerHTML = `<div class="${animate ? "view" : ""}">${(views[tab] || viewToday)()}</div>`;
  document.querySelectorAll("#app details").forEach((d) => { if (open.includes(keyOf(d))) d.open = true; });
  if (!animate) scrollTo(0, y);
}

// ---- Events -------------------------------------------------------------
document.querySelector("nav").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab; location.hash = tab; render();
});
document.getElementById("app").addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.topic) {
    const id = el.dataset.topic;
    if (el.checked) state.done[id] = true; else delete state.done[id];
    if (el.checked && id.startsWith("learn|")) { celebrate(el, "+15 XP 🧠 Smarter already!", true); say("Look at you, learning for fun! 🤓"); }
    else if (el.checked) {
      const [gid, sec] = id.split("|"), g = GOALS.find((x) => x.id === gid);
      const all = g.sections[sec].every((t) => state.done[topicId(g, sec, t)]);
      celebrate(el, all ? `🏆 "${sec}" complete! Amazing!` : "+10 XP 🎉", all);
      say(all ? "A whole section! I'm so proud 🥹" : CHEERS[Math.floor(Math.random() * CHEERS.length)]);
    }
    commit();
  }
  else if (el.dataset.task) {
    const x = state.tasks.find((t) => t.id === el.dataset.task);
    if (x) { x.done = el.checked; if (el.checked) celebrate(el, "+5 XP ✅ Task done!"); commit(); }
  }
  else if (el.dataset.note !== undefined) {
    state.notes ||= {};
    const v = el.value.trim();
    if (v) { if (!state.notes[el.dataset.note]) toast("📝 Takeaway saved!"); state.notes[el.dataset.note] = v; } else delete state.notes[el.dataset.note];
    commit();
  }
  else if (el.dataset.date && el.value) { state.dates[el.dataset.date] = el.value; toast("📅 Date updated"); commit(); }
});
document.getElementById("app").addEventListener("click", (e) => {
  const id = e.target.closest("[data-del]")?.dataset.del;
  if (id && confirm("Delete this task? 🥺")) { state.tasks = state.tasks.filter((t) => t.id !== id); toast("🗑️ Task deleted"); commit(); }
  const lid = e.target.closest("[data-dellearn]")?.dataset.dellearn;
  if (lid && confirm("Delete this topic and its links? 🥺")) { state.learn = state.learn.filter((x) => x.id !== lid); delete state.done["learn|" + lid]; commit(); }
  const day = e.target.closest("[data-day]")?.dataset.day;
  if (day) {
    calPick = day; render();
    const ex = eventsOn(day).exams.find((x) => x.single);
    if (ex) { say(`${ex.g.name} ${daysUntil(day) >= 0 ? `in ${daysUntil(day)} days. You've got this! 💪` : "is done! 🎉"}`); }
    return;
  }
  const cal = e.target.closest("[data-cal]")?.dataset.cal;
  if (cal) {
    if (cal === "today") { calMonth = todayStr().slice(0, 7); calPick = todayStr(); }
    else { const [y, m] = calMonth.split("-").map(Number), d = new Date(y, m - 1 + +cal, 1); calMonth = isoOf(d.getFullYear(), d.getMonth() + 1, 1).slice(0, 7); }
    render(); return;
  }
  const f = e.target.closest("[data-filter]")?.dataset.filter;
  if (f) { const [k, v] = f.split("|"); learnFilter[k] = v; render(); return; }
  const eye = e.target.closest("[data-seen]");
  if (eye) { toggleSeen(eye.dataset.seen, eye); return; }
  const opened = e.target.closest("[data-open]");
  if (opened) toggleSeen(opened.dataset.open, opened, true);
  if (e.target.closest("#surprise")) { surprise(); return; }
  const gid = e.target.closest("[data-delgroup]")?.dataset.delgroup;
  if (gid) { state.learnGroups = state.learnGroups.filter((g) => g.id !== gid); commit(); }
  const dl = e.target.closest("[data-dellink]")?.dataset.dellink;
  if (dl) { const [tid, i] = dl.split("|"); state.learn.find((x) => x.id === tid).links.splice(+i, 1); commit(); }
});
document.getElementById("mascot").addEventListener("click", (e) => {
  say(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  confetti(e.clientX, e.clientY, 6);
});
document.getElementById("app").addEventListener("submit", (e) => {
  const f = new FormData(e.target);
  if (e.target.id === "learnForm") {
    e.preventDefault();
    let group = f.get("group");
    if (group === "__new") {
      const name = prompt("Name of the new main topic (e.g. Psychology):")?.trim();
      if (!name) return;
      group = "g" + Date.now().toString(36);
      (state.learnGroups ||= []).push({ id: group, emoji: "📌", title: name });
    }
    (state.learn ||= []).push({ id: "u" + Date.now().toString(36), group, title: f.get("title").trim(), links: [] });
    toast("💡 Sub-topic added! Tap it to add links"); commit(); return;
  }
  if (e.target.classList.contains("linkForm")) {
    e.preventDefault();
    let url = f.get("url").trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    state.learn.find((x) => x.id === e.target.dataset.learn).links.push({ url, label: f.get("label").trim() || "", type: linkType(url) });
    toast("🔗 Link saved"); commit(); return;
  }
  if (e.target.id !== "taskForm") return;
  e.preventDefault();
  state.tasks.push({ id: Date.now().toString(36), text: f.get("text").trim(), date: f.get("date") || todayStr(), done: false });
  toast("📌 Task added!");
  commit();
});
// Refresh the "NOW" highlight every minute
setInterval(() => { if (tab === "today" && !document.hidden) render(); }, 60000);
// Re-pull when you come back to the tab (e.g. after editing on phone)
document.addEventListener("visibilitychange", () => { if (!document.hidden) pull(); });

loadLocal();
render();
say(greeting());
pull();
