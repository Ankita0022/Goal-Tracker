// ---- State & sync -------------------------------------------------------
// state = { done: {topicId: true}, dates: {goalId: "YYYY-MM-DD"}, tasks: [{id, text, date, done}], updated }
let state = { done: {}, dates: {}, tasks: [], updated: 0 };
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

function progress(g) {
  let total = 0, done = 0;
  for (const [sec, topics] of Object.entries(g.sections))
    for (const t of topics) { total++; if (state.done[topicId(g, sec, t)]) done++; }
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function countdownCard(g) {
  const n = daysUntil(goalDate(g)), p = progress(g);
  const cls = n < 0 ? "past" : n <= 7 ? "urgent" : n <= 21 ? "soon" : "";
  const label = n < 0 ? "done" : n === 0 ? "TODAY" : `${n} day${n === 1 ? "" : "s"}`;
  return `<div class="card ${cls}">
    <span class="tag">${g.kind}</span>
    <h3 style="margin-top:6px">${esc(g.name)}</h3>
    <div class="big">${label}</div>
    <div class="muted">${fmt(goalDate(g))}${g.tentative && !state.dates[g.id] ? " (tentative)" : ""}</div>
    <div class="bar"><i style="width:${p.pct}%"></i></div>
    <div class="muted">${p.done}/${p.total} topics · ${p.pct}%</div>
  </div>`;
}

// ---- Views --------------------------------------------------------------
function viewToday() {
  const t = todayStr();
  const phase = PHASES.find((p) => t >= p.from && t <= p.to);
  const tasks = state.tasks.filter((x) => x.date === t || (!x.done && x.date < t));
  const upcoming = GOALS.filter((g) => daysUntil(goalDate(g)) >= 0).sort((a, b) => goalDate(a).localeCompare(goalDate(b)));
  return `
    <h2>Countdown</h2>
    <div class="grid">${upcoming.map(countdownCard).join("")}</div>
    <h2>Today's timetable · ${fmt(t)}</h2>
    ${phase ? `<div class="card"><h3>${esc(phase.title)}</h3>${phase.slots.map(([time, what]) => `<div class="slot"><b>${time}</b><span>${esc(what)}</span></div>`).join("")}</div>`
            : `<div class="card muted">No phase planned for today. Add one in data.js.</div>`}
    <h2>Today's tasks</h2>
    ${taskForm(t)}
    <div class="card">${tasks.length ? tasks.map(taskRow).join("") : '<span class="muted">Nothing yet — add what you\'ll cover today.</span>'}</div>`;
}

function viewPlan() {
  const t = todayStr();
  return `<h2>Study timetable</h2>` + PHASES.map((p) => {
    const cls = t > p.to ? "past" : t >= p.from ? "now" : "";
    return `<details class="card phase ${cls}" ${cls === "now" ? "open" : ""} style="padding:0">
      <summary><strong>${esc(p.title)}</strong><span class="muted">${fmt(p.from)}${p.from !== p.to ? " – " + fmt(p.to) : ""}</span></summary>
      <ul>${p.slots.map(([time, what]) => `<li class="slot"><b>${time}</b><span>${esc(what)}</span></li>`).join("")}</ul>
    </details>`;
  }).join("");
}

function viewSyllabus() {
  return GOALS.map((g) => {
    const p = progress(g);
    return `<h2>${esc(g.name)} <span class="muted">· ${p.pct}%</span></h2>
      <div class="row"><label class="muted">Date: <input type="date" data-date="${g.id}" value="${goalDate(g)}"></label></div>
      ${g.note ? `<p class="muted note">${esc(g.note)}</p>` : ""}
      ${Object.entries(g.sections).map(([sec, topics]) => {
        const d = topics.filter((x) => state.done[topicId(g, sec, x)]).length;
        return `<details><summary><span>${esc(sec)}</span><span class="muted">${d}/${topics.length}</span></summary><ul>
          ${topics.map((x) => { const id = topicId(g, sec, x), on = !!state.done[id];
            return `<li><label class="chk ${on ? "done" : ""}"><input type="checkbox" data-topic="${esc(id)}" ${on ? "checked" : ""}><span>${esc(x)}</span></label></li>`; }).join("")}
        </ul></details>`;
      }).join("")}`;
  }).join("");
}

function taskForm(date) {
  return `<form class="row" id="taskForm">
    <input type="text" name="text" placeholder="Add a task…" required>
    <input type="date" name="date" value="${date}">
    <button class="primary">Add</button></form>`;
}
function taskRow(x) {
  const overdue = !x.done && x.date < todayStr();
  return `<div class="row" style="margin:4px 0;align-items:center">
    <label class="chk ${x.done ? "done" : ""}" style="flex:1"><input type="checkbox" data-task="${x.id}" ${x.done ? "checked" : ""}>
      <span>${esc(x.text)} ${overdue ? '<span class="tag" style="color:var(--bad)">overdue</span>' : ""}</span></label>
    <span class="muted">${fmt(x.date)}</span>
    <button class="link" data-del="${x.id}" title="Delete">✕</button></div>`;
}
function viewTasks() {
  const open = state.tasks.filter((x) => !x.done).sort((a, b) => a.date.localeCompare(b.date));
  const done = state.tasks.filter((x) => x.done).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  return `<h2>All tasks</h2>${taskForm(todayStr())}
    <div class="card">${open.length ? open.map(taskRow).join("") : '<span class="muted">No open tasks.</span>'}</div>
    ${done.length ? `<h2>Completed</h2><div class="card">${done.map(taskRow).join("")}</div>` : ""}`;
}

function render() {
  document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  const views = { today: viewToday, plan: viewPlan, syllabus: viewSyllabus, tasks: viewTasks };
  // Preserve which <details> are open across re-renders
  const open = [...document.querySelectorAll("#app details[open] summary")].map((s) => s.textContent);
  document.getElementById("app").innerHTML = (views[tab] || viewToday)();
  document.querySelectorAll("#app details summary").forEach((s) => { if (open.includes(s.textContent)) s.parentElement.open = true; });
}

// ---- Events -------------------------------------------------------------
document.querySelector("nav").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab; location.hash = tab; render();
});
document.getElementById("app").addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.topic) { if (el.checked) state.done[el.dataset.topic] = true; else delete state.done[el.dataset.topic]; commit(); }
  else if (el.dataset.task) { const x = state.tasks.find((t) => t.id === el.dataset.task); if (x) { x.done = el.checked; commit(); } }
  else if (el.dataset.date && el.value) { state.dates[el.dataset.date] = el.value; commit(); }
});
document.getElementById("app").addEventListener("click", (e) => {
  const id = e.target.dataset.del;
  if (id && confirm("Delete this task?")) { state.tasks = state.tasks.filter((t) => t.id !== id); commit(); }
});
document.getElementById("app").addEventListener("submit", (e) => {
  if (e.target.id !== "taskForm") return;
  e.preventDefault();
  const f = new FormData(e.target);
  state.tasks.push({ id: Date.now().toString(36), text: f.get("text").trim(), date: f.get("date") || todayStr(), done: false });
  commit();
});
// Re-pull when you come back to the tab (e.g. after editing on phone)
document.addEventListener("visibilitychange", () => { if (!document.hidden) pull(); });

loadLocal();
render();
pull();
