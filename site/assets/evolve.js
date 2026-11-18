/* Ages of Evolution — an original top-down RPG for Module 1 of Human Origins.
   Walk through six eras (about 8 to 2 million years ago), collect each era's Age Stone,
   answer its question to evolve, and carry new abilities into the next era. */
(function () {
  "use strict";

  var TILE = 32, COLS = 72, ROWS = 12, VIEW_C = 16, VIEW_R = 12;
  var canvas = document.getElementById("game");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Species ---------- */
  var SPECIES = [
    { name: "Last common ancestor", sci: false, ma: "≈8 Ma", lean: 0.15, h: 20, fur: "#5b4636", skin: "#8a6a52", walk: "Climbs; walks on all fours", brain: "≈350 cm³" },
    { name: "Sahelanthropus tchadensis", sci: true, ma: "≈7 Ma", lean: 0.45, h: 21, fur: "#5e4a38", skin: "#8f6e55", walk: "Possibly upright for short distances", brain: "≈360 cm³" },
    { name: "Ardipithecus ramidus", sci: true, ma: "≈4.4 Ma", lean: 0.6, h: 22, fur: "#634d3a", skin: "#93725a", walk: "Upright on the ground; grasping toe for trees", brain: "≈300–350 cm³" },
    { name: "Australopithecus afarensis", sci: true, ma: "≈3.7 Ma", lean: 0.82, h: 23, fur: "#6a523d", skin: "#9a785d", walk: "Habitually upright; human-like stride", brain: "≈450 cm³" },
    { name: "Australopithecus africanus", sci: true, ma: "≈2.8 Ma", lean: 0.86, h: 23, fur: "#6f563f", skin: "#9e7c60", walk: "Upright; still a capable climber", brain: "≈460 cm³" },
    { name: "Homo habilis", sci: true, ma: "≈2.4 Ma", lean: 0.93, h: 25, fur: "#6b5442", skin: "#a07d62", walk: "Upright; makes Oldowan tools", brain: "≈610 cm³" },
    { name: "Homo erectus", sci: true, ma: "≈2.0 Ma", lean: 1, h: 29, fur: "#5f4a3a", skin: "#a8846a", walk: "Long legs built for endurance", brain: "≈850 cm³ (early)" }
  ];
  var PARAN = { name: "Paranthropus robustus", sci: true, ma: "≈2.0 Ma", lean: 0.88, h: 23, fur: "#4f3b2c", skin: "#8a6a50", walk: "Upright; huge jaws for tough plants", brain: "≈520 cm³", robust: true };

  /* ---------- Eras (zones) ---------- */
  var ZONES = [
    { name: "Late Miocene forest", place: "Chad", ma: "≈7 million years ago", base: "F", wall: "T" },
    { name: "Pliocene woodland", place: "Aramis, Ethiopia", ma: "≈4.4 million years ago", base: "G", wall: "T" },
    { name: "Rift Valley ash plains", place: "Laetoli and Lomekwi", ma: "3.7–3.3 million years ago", base: "A", wall: "R" },
    { name: "Cave country", place: "Taung, South Africa", ma: "≈2.8 million years ago", base: "G", wall: "K" },
    { name: "The fork in the bush", place: "Eastern and southern Africa", ma: "≈2.4 million years ago", base: "S", wall: "R" },
    { name: "Open savanna", place: "Drimolen and Koobi Fora", ma: "≈2.0 million years ago", base: "S", wall: "T" }
  ];

  /* ---------- Questions ---------- */
  var Q = {
    age1: { era: "7 Ma", title: "Toumaï’s skull", q: "Toumaï, the 7-million-year-old <em>Sahelanthropus</em> skull from Chad, is used to argue for upright walking. What feature is the evidence?",
      opts: ["A forward-placed foramen magnum, where the spinal cord leaves the skull", "A brain larger than a chimpanzee’s", "Stone tools found beside it"], a: 0,
      why: "A forward foramen magnum suggests the head balanced on top of an upright spine. Whether <em>Sahelanthropus</em> really walked upright is still debated (Brunet et al., 2002)." },
    age2: { era: "4.4 Ma", title: "Meet Ardi", q: "What did the 4.4-million-year-old skeleton of “Ardi” reveal?",
      opts: ["A fully modern foot, used on open grassland", "A pelvis partly adapted for upright walking, a grasping big toe, and a woodland home", "Chimpanzee-style knuckle-walking"], a: 1,
      why: "Ardi combined upright walking with a grasping toe for climbing, and lived in woodland. This challenged both the knuckle-walking stage and the savannah hypothesis (White et al., 2009)." },
    age3: { era: "3.66 Ma", title: "Footprints in the ash", q: "About 3.66 million years ago, hominins walked across wet volcanic ash at Laetoli. What do their footprints show?",
      opts: ["A heel strike and a big toe in line with the others: a human-like stride", "Four-legged walking on the knuckles", "Evidence that they used fire"], a: 0,
      why: "The Laetoli prints show a human-like walking pattern, probably made by <em>Australopithecus afarensis</em> (Leakey and Hay, 1979)." },
    tools: { era: "3.3 Ma", title: "The first stone tools", q: "Stone tools from Lomekwi 3 in Kenya are about 3.3 million years old. What does that tell us?",
      opts: ["Only <em>Homo sapiens</em> made tools", "Tools were made before any known <em>Homo</em> fossil, so by earlier hominins", "Tools were first invented about 100,000 years ago"], a: 1,
      why: "Lomekwi 3 tools predate the earliest <em>Homo</em>, so toolmaking is not unique to our genus (Harmand et al., 2015)." },
    age4: { era: "2.8 Ma", title: "The Taung Child", q: "In 1925 the Australian-born anatomist Raymond Dart named <em>Australopithecus africanus</em> from the Taung Child. Why did most experts reject it at first?",
      opts: ["It was found in Asia", "Its small brain clashed with the belief that big brains evolved first", "It was dated by radiocarbon to 10,000 years"], a: 1,
      why: "Experts expected brain growth to come first, a belief the Piltdown forgery seemed to support. Dart was vindicated decades later (Dart, 1925)." },
    homo: { era: "2.4 Ma", title: "Stay a generalist", q: "Which change marks the early members of our genus, <em>Homo</em>?",
      opts: ["Smaller teeth and jaws, larger brains and more meat and marrow in the diet", "Massive molars for grinding tough plants", "A return to life in the trees"], a: 0,
      why: "Early <em>Homo</em> had smaller teeth, somewhat larger brains and left cut-marked bones, a sign of a broader diet (Villmoare et al., 2015)." },
    paran: { era: "2.4 Ma", title: "Specialise", q: "<em>Paranthropus</em> had huge molars, thick jaws and a bony crest for chewing muscles. What were they specialised for?",
      opts: ["Hunting large animals", "Chewing tough plant foods", "Swimming"], a: 1,
      why: "<em>Paranthropus</em> was built to process tough plant foods. It was a successful side branch that lived alongside <em>Homo</em> for over a million years." },
    age6: { era: "2.0 Ma", title: "Dating Drimolen", q: "The oldest known <em>Homo erectus</em> skull, about 2 million years old, comes from Drimolen cave in South Africa. How was it dated?",
      opts: ["Radiocarbon dating of the bone", "Uranium–lead dating of the flowstone layers around it", "Argon–argon dating of volcanic ash"], a: 1,
      why: "South African caves have no volcanic ash, so flowstone layers are dated with uranium–lead. A La Trobe-led team showed that three hominin genera coexisted here (Herries et al., 2020)." }
  };

  /* ---------- Build the world ---------- */
  var map = [], items = [], hazards = [];
  for (var y = 0; y < ROWS; y++) { map.push([]); for (var x = 0; x < COLS; x++) map[y].push("G"); }
  function zx(z, lx) { return z * 12 + lx; }
  function set(z, lx, ly, t) { map[ly][zx(z, lx)] = t; }
  ZONES.forEach(function (zn, z) {
    for (var yy = 0; yy < ROWS; yy++) for (var lx = 0; lx < 12; lx++) {
      var edge = yy === 0 || yy === ROWS - 1 || (z === 0 && lx === 0) || (lx === 11);
      set(z, lx, yy, edge ? zn.wall : zn.base);
    }
    if (z < 5) { set(z, 11, 5, z === 3 ? "B" : "X"); set(z, 11, 6, z === 3 ? "B" : "X"); }
  });
  function many(z, t, pts) { pts.forEach(function (p) { set(z, p[0], p[1], t); }); }
  // Zone 0: dense forest
  many(0, "T", [[2, 2], [3, 3], [5, 2], [6, 7], [7, 8], [4, 9], [2, 7], [8, 5], [9, 7], [5, 5], [10, 2], [3, 10]]);
  // Zone 1: woodland with a river and a ford
  for (var r = 1; r < 11; r++) if (r !== 8) set(1, 5, r, "W");
  many(1, "T", [[2, 4], [3, 8], [8, 2], [9, 5], [7, 9], [10, 9]]);
  // Zone 2: ash plain, rocks, footprint trail
  many(2, "R", [[3, 2], [4, 7], [8, 4], [9, 9], [6, 9]]);
  [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 5], [7, 6], [8, 6], [9, 6], [10, 6]].forEach(function (p) { if (map[p[1]][zx(2, p[0])] === "A") set(2, p[0], p[1], "P"); });
  // Zone 3: a limestone cave
  for (var cx = 3; cx <= 8; cx++) { set(3, cx, 1, "K"); set(3, cx, 5, "K"); }
  for (var cy = 1; cy <= 5; cy++) { set(3, 3, cy, "K"); set(3, 8, cy, "K"); }
  for (cx = 4; cx <= 7; cx++) for (cy = 2; cy <= 4; cy++) set(3, cx, cy, "C");
  set(3, 5, 5, "C"); set(3, 6, 5, "C");
  // Zone 4: lake between two paths
  many(4, "W", [[5, 4], [6, 4], [5, 5], [6, 5], [7, 5], [5, 6], [6, 6], [7, 6], [6, 7]]);
  // Zone 5: savanna with acacias
  many(5, "T", [[3, 3], [7, 2], [4, 8], [8, 9], [2, 6]]);

  function item(type, z, lx, ly, extra) { var it = { type: type, x: zx(z, lx), y: ly, taken: false }; for (var k in extra) it[k] = extra[k]; items.push(it); return it; }
  item("age", 0, 9, 3, { q: "age1", stage: 1, label: "Age Stone · 7 Ma" });
  item("age", 1, 9, 10, { q: "age2", stage: 2, label: "Age Stone · 4.4 Ma" });
  item("age", 2, 6, 2, { q: "age3", stage: 3, label: "Age Stone · 3.66 Ma" });
  item("tool", 2, 9, 8, { q: "tools", label: "Stone tools · 3.3 Ma" });
  item("age", 3, 5, 3, { q: "age4", stage: 4, label: "Age Stone · 2.8 Ma" });
  item("fork", 4, 8, 2, { q: "paran", branch: "paran", label: "Robust jaws" });
  item("fork", 4, 8, 9, { q: "homo", branch: "homo", label: "Bigger brain, more meat" });
  item("age", 5, 9, 6, { q: "age6", stage: 6, label: "Age Stone · 2.0 Ma" });
  [[0, 3, 8, "fruit"], [0, 7, 3, "fruit"], [0, 9, 9, "fruit"], [1, 2, 2, "fruit"], [1, 8, 4, "fruit"], [1, 3, 10, "fruit"],
   [2, 2, 3, "tuber"], [2, 5, 9, "tuber"], [3, 2, 9, "marrow"], [3, 9, 8, "marrow"], [4, 2, 4, "tuber"], [4, 3, 8, "tuber"],
   [5, 5, 4, "marrow"], [5, 6, 9, "marrow"]].forEach(function (f) { item("food", f[0], f[1], f[2], { kind: f[3] }); });

  function hazard(kind, z, path, speed) {
    var pts = path.map(function (p) { return { x: zx(z, p[0]), y: p[1] }; });
    hazards.push({ kind: kind, path: pts, i: 0, dir: 1, x: pts[0].x, y: pts[0].y, t: 0, speed: speed });
  }
  hazard("snake", 1, [[7, 6], [8, 6], [9, 6], [10, 6], [10, 7], [9, 7], [8, 7]], 650);
  hazard("eagle", 3, [[1, 7], [2, 7], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 7], [10, 7], [10, 8], [9, 8], [8, 8], [7, 8], [6, 7], [5, 7], [4, 8], [3, 8]], 420);
  hazard("cat", 5, [[2, 2], [3, 2], [4, 2], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [6, 7], [7, 7], [7, 6], [7, 5], [6, 5]], 430);
  hazard("cat", 5, [[9, 2], [9, 3], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [9, 8], [8, 8], [8, 7]], 520);

  /* ---------- State ---------- */
  var S;
  function fresh() {
    return { x: 1, y: 6, px: 1, py: 6, stage: 0, branch: null, tools: false, energy: 5, maxE: 5, zone: 0, ages: [], explored: false,
      invuln: 0, paused: true, done: false, lastMove: 0, wrong: 0, flash: 0 };
  }
  function species() { return S.branch === "paran" ? PARAN : SPECIES[S.stage]; }

  /* ---------- DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var hud = { sp: $("hud-species"), ma: $("hud-ma"), en: $("hud-energy"), enBar: $("hud-energy-bar"), ages: $("hud-ages"), abil: $("hud-abil"), zone: $("hud-zone") };
  var log = $("game-log"), dlg = $("game-dialog"), dlgBody = $("dialog-body");
  function say(msg) {
    var p = document.createElement("p"); p.innerHTML = msg;
    log.insertBefore(p, log.firstChild);
    while (log.children.length > 5) log.removeChild(log.lastChild);
  }
  function renderHud() {
    var sp = species();
    hud.sp.innerHTML = sp.sci ? "<em>" + sp.name + "</em>" : sp.name;
    hud.ma.textContent = sp.ma + " · brain " + sp.brain;
    hud.en.textContent = S.energy + " / " + S.maxE;
    hud.enBar.style.width = (S.energy / S.maxE * 100) + "%";
    hud.ages.textContent = S.ages.length + " / 6";
    hud.abil.textContent = sp.walk + (S.tools ? " · Stone tools" : "");
    hud.zone.textContent = ZONES[S.zone].name + " · " + ZONES[S.zone].ma;
    var chips = $("hud-chips"); chips.innerHTML = "";
    ["7 Ma", "4.4 Ma", "3.66 Ma", "2.8 Ma", "2.4 Ma", "2.0 Ma"].forEach(function (lab) {
      var c = document.createElement("span"); c.className = "age-chip" + (S.ages.indexOf(lab) >= 0 ? " got" : "");
      c.textContent = (S.ages.indexOf(lab) >= 0 ? "◆ " : "◇ ") + lab; chips.appendChild(c);
    });
  }

  /* ---------- Dialogs ---------- */
  var lastFocus = null;
  function openDialog(html, buttons) {
    S.paused = true; lastFocus = document.activeElement;
    dlgBody.innerHTML = html;
    var act = $("dialog-actions"); act.innerHTML = "";
    buttons.forEach(function (b) {
      var btn = document.createElement("button"); btn.type = "button"; btn.className = b.cls || "btn";
      btn.innerHTML = b.label; btn.addEventListener("click", b.fn); act.appendChild(btn);
    });
    dlg.hidden = false;
    var first = dlg.querySelector("button"); if (first) first.focus();
  }
  function closeDialog() { dlg.hidden = true; S.paused = false; canvas.focus(); }
  dlg.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = dlg.querySelectorAll("button"); if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  function ask(it) {
    var q = Q[it.q];
    var html = '<p class="dlg-era">' + q.era + " · " + it.label + "</p><h2 id=\"dialog-title\">" + q.title + "</h2><p>" + q.q + "</p>";
    openDialog(html, q.opts.map(function (o, i) {
      return { label: o, cls: "q-opt", fn: function () { answer(it, q, i); } };
    }).concat([{ label: "Not yet — step back", cls: "btn secondary small", fn: function () { S.x = S.px; S.y = S.py; closeDialog(); } }]));
  }
  function answer(it, q, i) {
    if (i !== q.a) {
      S.energy = Math.max(0, S.energy - 1); S.wrong++;
      renderHud();
      openDialog('<h2 id="dialog-title">Not quite</h2><p>' + q.why + '</p><p class="dlg-cost">You lose 1 energy. The stone is still here when you’re ready.</p>',
        [{ label: "Try again", fn: function () { if (S.energy <= 0) { closeDialog(); faint(); } else ask(it); } },
         { label: "Step back", cls: "btn secondary", fn: function () { S.x = S.px; S.y = S.py; closeDialog(); if (S.energy <= 0) faint(); } }]);
      return;
    }
    it.taken = true;
    if (it.type === "tool") {
      S.tools = true; renderHud();
      openDialog('<p class="dlg-era">3.3 Ma · Artefact found</p><h2 id="dialog-title">You can make stone tools</h2><p>' + q.why + "</p><p><strong>New ability:</strong> break boulders that block your path.</p>",
        [{ label: "Continue", fn: closeDialog }]);
      say("You found the Lomekwi stone tools. Boulders can now be broken.");
      return;
    }
    if (it.type === "fork") return forkChoice(it, q);
    var before = species().name;
    S.stage = it.stage;
    S.ages.push(q.era);
    evolve(before, q);
  }
  function evolve(before, q, extra) {
    var sp = species(); S.flash = reduceMotion ? 0 : 1; renderHud();
    var html = '<p class="dlg-era">' + q.era + ' · Age collected</p><h2 id="dialog-title">You evolved</h2>' +
      '<p class="evo-line">' + before + ' → <strong>' + (sp.sci ? "<em>" + sp.name + "</em>" : sp.name) + "</strong></p><p>" + q.why + "</p>" +
      '<p><strong>Now:</strong> ' + sp.walk + ". Brain " + sp.brain + ".</p>" + (extra || "");
    if (S.stage === 6) {
      openDialog(html, [{ label: "See your journey", fn: finish }]);
    } else {
      openDialog(html, [{ label: "Continue", fn: closeDialog }]);
    }
    say("You evolved into " + (sp.sci ? "<em>" + sp.name + "</em>" : sp.name) + ".");
  }
  function forkChoice(it, q) {
    var before = species().name;
    if (it.branch === "paran") {
      S.branch = "paran"; S.flash = reduceMotion ? 0 : 1; renderHud();
      openDialog('<p class="dlg-era">2.4 Ma · Side branch</p><h2 id="dialog-title">You specialised</h2><p class="evo-line">' + before + ' → <strong><em>Paranthropus robustus</em></strong></p><p>' + q.why +
        '</p><p>Your lineage thrives for more than a million years. But about 1 million years ago, as environments shift, <em>Paranthropus</em> dies out. This branch of the bush ends here.</p>',
        [{ label: "Rewind to 2.4 million years ago", fn: function () {
          S.branch = null; S.explored = true; it.taken = false; it.visited = true; S.x = S.px; S.y = S.py; renderHud(); closeDialog();
          say("You rewound time. The <em>Homo</em> path lies to the south.");
        } }]);
      say("You became <em>Paranthropus robustus</em>, a specialised side branch.");
    } else {
      S.branch = "homo"; S.stage = 5; S.ages.push("2.4 Ma");
      items.forEach(function (o) { if (o.type === "fork") o.taken = true; });
      evolve(before, q, S.explored ? '<p class="dlg-cost">◆ Bonus: you explored the <em>Paranthropus</em> side branch.</p>' : "");
    }
  }
  function faint() {
    var z = S.zone;
    S.energy = S.maxE; S.x = z === 0 ? 1 : zx(z, 1); S.y = 6; S.px = S.x; S.py = S.y; S.invuln = 1500;
    renderHud();
    openDialog('<h2 id="dialog-title">You collapse from exhaustion</h2><p>You recover at the start of this era with full energy. Eat food to restore energy, and keep clear of predators.</p>',
      [{ label: "Continue", fn: closeDialog }]);
  }
  function finish() {
    S.done = true;
    if (window.HumanOrigins) window.HumanOrigins.markActivity("game-m1");
    var path = ["Last common ancestor"].concat(SPECIES.slice(1).map(function (s) { return "<em>" + s.name + "</em>"; }));
    openDialog('<p class="dlg-era">≈2 million years ago</p><h2 id="dialog-title">Journey complete</h2>' +
      "<p>You collected all six Ages and evolved through:</p><ol class=\"evo-path\">" + path.map(function (p) { return "<li>" + p + "</li>"; }).join("") + "</ol>" +
      "<p>" + (S.explored ? "◆ You also explored the <em>Paranthropus</em> side branch. " : "Tip: next time, try the robust-jaw path at the fork. ") +
      (S.wrong === 0 ? "◆ Every question right first time." : "Questions answered wrongly along the way: " + S.wrong + ".") + "</p>" +
      "<p>This is one simplified path through a branching bush. The real relationships between these species are still debated. Module 2 picks up the story with <em>Homo erectus</em> leaving Africa.</p>",
      [{ label: "Play again", fn: function () { start(); } },
       { label: "Back to Module 1", cls: "btn secondary", fn: function () { location.href = "module-1.html#game"; } },
       { label: "Go to Module 2", cls: "btn secondary", fn: function () { location.href = "module-2.html"; } }]);
  }

  /* ---------- Movement ---------- */
  function blocked(t) { return t === "T" || t === "W" || t === "R" || t === "K"; }
  function tryMove(dx, dy) {
    if (S.paused || S.done) return;
    var nx = S.x + dx, ny = S.y + dy;
    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
    var t = map[ny][nx];
    if (blocked(t)) return;
    var z = Math.floor(S.x / 12);
    if (t === "X") {
      var ok = (z === 0 && S.stage >= 1) || (z === 1 && S.stage >= 2) || (z === 2 && S.stage >= 3 && S.tools) || (z === 4 && S.branch === "homo");
      if (!ok) { say(gateMsg(z)); return; }
    }
    if (t === "B") {
      if (!S.tools) { say("Huge boulders block the way. You need tools to break them."); return; }
      if (S.stage < 4) { say("Collect this era’s Age Stone in the cave before moving on."); return; }
      map[ny][nx] = "G"; say("You break the boulder with a stone tool.");
      return;
    }
    S.px = S.x; S.py = S.y; S.x = nx; S.y = ny;
    var nz = Math.floor(S.x / 12);
    if (nz !== S.zone) { S.zone = nz; renderHud(); say("You enter <strong>" + ZONES[nz].name + "</strong> (" + ZONES[nz].place + ", " + ZONES[nz].ma + "). " + hint(nz)); }
    items.forEach(function (it) {
      if (it.taken || it.x !== S.x || it.y !== S.y) return;
      if (it.type === "food") {
        it.taken = true;
        if (S.energy < S.maxE) { S.energy++; renderHud(); }
        say({ fruit: "You eat ripe fruit.", tuber: "You dig up a starchy tuber.", marrow: "You crack a bone for marrow, rich in fat." }[it.kind] + " Energy " + S.energy + "/" + S.maxE + ".");
      } else if (it.type === "fork" && S.branch === "homo") {
        // already resolved
      } else {
        ask(it);
      }
    });
    checkHazards();
  }
  function gateMsg(z) {
    return ["Thick undergrowth blocks the way. Collect this era’s Age Stone to evolve first.",
      "The woodland beyond needs a better walker. Find the Age Stone by the river.",
      S.stage < 3 ? "Collect the Age Stone on the ash plain first." : "You’ll need stone tools for what lies ahead. Search the plain.",
      "", "The path ahead is for a generalist. Choose the <em>Homo</em> path at the fork."][z];
  }
  function hint(z) {
    return ["Find the glowing Age Stone.", "Cross the river at the ford.", "Follow the footprints. Look for stone tools too.",
      "The Age Stone is inside the cave. Watch out for the eagle.", "Two paths: robust jaws (north) or a bigger brain (south).", "Big cats hunt here. Reach the last Age Stone."][z];
  }
  function checkHazards() {
    if (S.invuln > 0) return;
    hazards.forEach(function (h) {
      if (h.x === S.x && h.y === S.y) {
        S.energy = Math.max(0, S.energy - 1); S.invuln = 1500; renderHud();
        say({ snake: "A snake bites you!", eagle: "An eagle swoops down! (A similar attack killed the Taung Child.)", cat: "A big cat attacks!" }[h.kind] + " Energy " + S.energy + "/" + S.maxE + ".");
        S.x = S.px; S.y = S.py;
        if (S.energy <= 0) faint();
      }
    });
  }

  /* ---------- Input ---------- */
  var held = {}, KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
  canvas.addEventListener("keydown", function (e) {
    if (KEYS[e.key]) { e.preventDefault(); if (!held[e.key]) { held[e.key] = true; var k = KEYS[e.key]; tryMove(k[0], k[1]); S.lastMove = performance.now() + 120; } }
  });
  canvas.addEventListener("keyup", function (e) { delete held[e.key]; });
  canvas.addEventListener("blur", function () { held = {}; });
  document.querySelectorAll("[data-dir]").forEach(function (b) {
    var d = b.getAttribute("data-dir").split(",").map(Number), timer = null;
    function go() { tryMove(d[0], d[1]); }
    b.addEventListener("pointerdown", function (e) { e.preventDefault(); go(); clearInterval(timer); timer = setInterval(go, 170); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { b.addEventListener(ev, function () { clearInterval(timer); }); });
    b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
  $("btn-where").addEventListener("click", function () { say(describe()); });
  function describe() {
    var z = S.zone, near = [];
    items.forEach(function (it) {
      if (it.taken || Math.floor(it.x / 12) !== z || it.type === "food") return;
      var dx = it.x - S.x, dy = it.y - S.y;
      near.push(it.label + ": " + (dy ? Math.abs(dy) + (dy < 0 ? " up" : " down") : "") + (dx && dy ? ", " : "") + (dx ? Math.abs(dx) + (dx < 0 ? " left" : " right") : "") + (dx || dy ? "" : "here"));
    });
    return "You are a " + species().name + " in the " + ZONES[z].name + ". " + (near.length ? near.join(". ") + "." : "Nothing left to collect here. Head right.");
  }

  /* ---------- Rendering ---------- */
  var PAL = { F: "#2f5a35", G: "#6f9a4b", A: "#9c958a", P: "#9c958a", S: "#c9b26a", C: "#6e6253", T: "#2f5a35", W: "#3f7fa6", R: "#7b746a", K: "#6d6150", X: "#2f5a35", B: "#9c958a" };
  function draw(now) {
    var camX = Math.max(0, Math.min(COLS - VIEW_C, S.x - Math.floor(VIEW_C / 2)));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var yy = 0; yy < VIEW_R; yy++) for (var xx = 0; xx < VIEW_C; xx++) {
      var wx = xx + camX, t = map[yy][wx], X = xx * TILE, Y = yy * TILE, z = Math.floor(wx / 12);
      var base = ZONES[z].base;
      ctx.fillStyle = PAL[(t === "T" || t === "R" || t === "X" || t === "B" || t === "K") ? base : t] || PAL.G;
      if (t === "K") ctx.fillStyle = PAL.K;
      ctx.fillRect(X, Y, TILE, TILE);
      if ((wx * 7 + yy * 13) % 5 === 0 && t !== "W" && t !== "K") { ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(X + 6, Y + 20, 3, 3); ctx.fillRect(X + 22, Y + 9, 2, 2); }
      if (t === "T") { ctx.fillStyle = "#5a3d24"; ctx.fillRect(X + 13, Y + 18, 6, 12); ctx.fillStyle = z === 5 ? "#5f7a2f" : "#1f4626"; ctx.beginPath(); ctx.arc(X + 16, Y + 14, 12, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.beginPath(); ctx.arc(X + 12, Y + 10, 5, 0, 7); ctx.fill(); }
      if (t === "W") { ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; var o = reduceMotion ? 0 : Math.sin(now / 500 + wx) * 3; ctx.beginPath(); ctx.moveTo(X + 4, Y + 12 + o); ctx.lineTo(X + 14, Y + 10 + o); ctx.moveTo(X + 16, Y + 22 - o); ctx.lineTo(X + 27, Y + 20 - o); ctx.stroke(); }
      if (t === "R") { ctx.fillStyle = "#5a544c"; ctx.beginPath(); ctx.moveTo(X + 4, Y + 28); ctx.lineTo(X + 10, Y + 8); ctx.lineTo(X + 22, Y + 5); ctx.lineTo(X + 29, Y + 27); ctx.closePath(); ctx.fill(); }
      if (t === "K") { ctx.fillStyle = "#54493b"; ctx.fillRect(X, Y, TILE, 6); ctx.fillRect(X + 4, Y + 14, 10, 4); }
      if (t === "C") { ctx.fillStyle = "rgba(0,0,0,.15)"; ctx.fillRect(X, Y, TILE, TILE); }
      if (t === "P") { ctx.fillStyle = "#6c665d"; ctx.beginPath(); ctx.ellipse(X + 11, Y + 12, 3, 5, -.3, 0, 7); ctx.ellipse(X + 21, Y + 21, 3, 5, -.3, 0, 7); ctx.fill(); }
      if (t === "X") { ctx.fillStyle = "#1f4626"; for (var v = 0; v < 4; v++) ctx.fillRect(X + 3 + v * 7, Y, 4, TILE); ctx.fillStyle = "#f3e3d6"; ctx.strokeStyle = "#f3e3d6"; ctx.lineWidth = 2; ctx.fillRect(X + 10, Y + 15, 12, 10); ctx.beginPath(); ctx.arc(X + 16, Y + 15, 4, Math.PI, 0); ctx.stroke(); }
      if (t === "B") { ctx.fillStyle = "#6b655c"; ctx.beginPath(); ctx.arc(X + 16, Y + 18, 13, 0, 7); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(X + 11, Y + 13, 4, 0, 7); ctx.fill(); }
    }
    // items
    items.forEach(function (it) {
      if (it.taken) return;
      var X = (it.x - camX) * TILE, Y = it.y * TILE; if (X < -TILE || X > canvas.width) return;
      var bob = reduceMotion ? 0 : Math.sin(now / 300 + it.x) * 2;
      if (it.type === "age" || it.type === "fork") {
        var col = it.type === "fork" ? (it.branch === "paran" ? "#c99470" : "#7fb0c4") : "#f0b07f";
        if (!reduceMotion) { ctx.fillStyle = "rgba(240,176,127,.25)"; ctx.beginPath(); ctx.arc(X + 16, Y + 16, 15 + Math.sin(now / 250) * 2, 0, 7); ctx.fill(); }
        ctx.fillStyle = col; ctx.strokeStyle = "#1d1a16"; ctx.lineWidth = 2;
        ctx.beginPath(); for (var k = 0; k < 6; k++) { var a = Math.PI / 3 * k + Math.PI / 6; ctx.lineTo(X + 16 + Math.cos(a) * 11, Y + 15 + bob + Math.sin(a) * 11); } ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#1d1a16"; ctx.font = "bold 11px system-ui"; ctx.textAlign = "center";
        ctx.fillText(it.type === "fork" ? (it.branch === "paran" ? "P" : "H") : String(it.stage), X + 16, Y + 19 + bob);
        if (it.visited) { ctx.strokeStyle = "#f7f4ee"; ctx.beginPath(); ctx.arc(X + 16, Y + 15, 14, 0, 7); ctx.stroke(); }
      } else if (it.type === "tool") {
        ctx.fillStyle = "#d9d2c5"; ctx.strokeStyle = "#1d1a16"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X + 8, Y + 24 + bob); ctx.lineTo(X + 16, Y + 6 + bob); ctx.lineTo(X + 25, Y + 22 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else if (it.type === "food") {
        ctx.fillStyle = { fruit: "#d9534f", tuber: "#b07a3c", marrow: "#f3ead8" }[it.kind]; ctx.strokeStyle = "#1d1a16"; ctx.lineWidth = 1.5;
        if (it.kind === "marrow") { ctx.fillRect(X + 9, Y + 14, 14, 5); ctx.strokeRect(X + 9, Y + 14, 14, 5); ctx.beginPath(); ctx.arc(X + 9, Y + 16, 4, 0, 7); ctx.arc(X + 23, Y + 16, 4, 0, 7); ctx.fill(); }
        else { ctx.beginPath(); ctx.ellipse(X + 16, Y + 17, it.kind === "tuber" ? 9 : 6, 6, 0, 0, 7); ctx.fill(); ctx.stroke(); }
      }
    });
    // hazards
    hazards.forEach(function (h) {
      var X = (h.x - camX) * TILE, Y = h.y * TILE; if (X < -TILE || X > canvas.width) return;
      ctx.lineWidth = 2; ctx.strokeStyle = "#1d1a16";
      if (h.kind === "snake") { ctx.strokeStyle = "#3b5d1f"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(X + 4, Y + 22); ctx.quadraticCurveTo(X + 12, Y + 10, X + 18, Y + 22); ctx.quadraticCurveTo(X + 24, Y + 30, X + 29, Y + 18); ctx.stroke(); }
      if (h.kind === "eagle") { ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(X + 16, Y + 26, 12, 4, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#4a3426"; var f = reduceMotion ? 0 : Math.sin(now / 120) * 4; ctx.beginPath(); ctx.moveTo(X + 2, Y + 10 + f); ctx.lineTo(X + 16, Y + 14); ctx.lineTo(X + 30, Y + 10 + f); ctx.lineTo(X + 16, Y + 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#f3ead8"; ctx.beginPath(); ctx.arc(X + 16, Y + 12, 3, 0, 7); ctx.fill(); }
      if (h.kind === "cat") { ctx.fillStyle = "#c99a3e"; ctx.beginPath(); ctx.ellipse(X + 15, Y + 20, 11, 6, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(X + 26, Y + 14, 5, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#1d1a16"; ctx.fillRect(X + 27, Y + 12, 2, 2); }
    });
    drawPlayer((S.x - camX) * TILE, S.y * TILE, now);
    if (S.flash > 0) { ctx.fillStyle = "rgba(255,240,210," + (S.flash * .6) + ")"; ctx.fillRect(0, 0, canvas.width, canvas.height); S.flash = Math.max(0, S.flash - .03); }
  }
  function drawPlayer(X, Y, now) {
    var sp = species(), lean = sp.lean, h = sp.h;
    if (S.invuln > 0 && !reduceMotion && Math.floor(now / 100) % 2) return;
    limbs.X = X; limbs.Y = Y;
    var footY = Y + 30, hipX = X + 16 - (1 - lean) * 4, hipY = footY - h * 0.42;
    var shX = hipX + (1 - lean) * 9, shY = hipY - h * 0.38 * (0.5 + lean / 2);
    ctx.fillStyle = "rgba(255,248,235,.75)"; ctx.strokeStyle = "#9a4a22"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(X + 16, footY, 13, 4.5, 0, 0, 7); ctx.fill(); ctx.stroke();
    limbs("#1d1a16", 3); limbs(null, 0);
  }
  function limbs(outline, extra) {
    var sp = species(), lean = sp.lean, h = sp.h, X = limbs.X, Y = limbs.Y;
    var footY = Y + 30, hipX = X + 16 - (1 - lean) * 4, hipY = footY - h * 0.42;
    var shX = hipX + (1 - lean) * 9, shY = hipY - h * 0.38 * (0.5 + lean / 2);
    ctx.lineCap = "round"; ctx.strokeStyle = outline || sp.fur; ctx.lineWidth = (sp.robust ? 6 : 5) + extra;
    ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX - 4, footY); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX + 4, footY); ctx.stroke();
    ctx.lineWidth = 8 + extra; ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(shX, shY); ctx.stroke();
    var handY = lean < 0.5 ? footY - 1 : shY + h * 0.36 * (lean > .9 ? 0.85 : 1);
    ctx.lineWidth = 4 + extra; ctx.beginPath(); ctx.moveTo(shX, shY + 2); ctx.lineTo(shX + 6, handY); ctx.stroke();
    if (outline) return;
    var headR = 4.5 + (S.branch === "paran" ? 0.8 : S.stage * 0.35);
    ctx.fillStyle = sp.skin; ctx.strokeStyle = "#1d1a16"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(shX + (1 - lean) * 4, shY - headR - 1, headR, 0, 7); ctx.fill(); ctx.stroke();
    if (sp.robust) { ctx.fillStyle = sp.fur; ctx.fillRect(shX - 2, shY - headR * 2 - 3, 6, 3); }
    ctx.fillStyle = "#1d1a16"; ctx.fillRect(shX + (1 - lean) * 4 + 1.5, shY - headR - 2, 2, 2);
    if (S.tools) { ctx.fillStyle = "#d9d2c5"; ctx.beginPath(); ctx.moveTo(shX + 5, handY); ctx.lineTo(shX + 10, handY - 5); ctx.lineTo(shX + 11, handY + 2); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  }

  /* ---------- Loop ---------- */
  var last = performance.now();
  function loop(now) {
    var dt = now - last; last = now;
    if (!S.paused) {
      if (S.invuln > 0) S.invuln -= dt;
      hazards.forEach(function (h) {
        h.t += dt;
        if (h.t > h.speed) {
          h.t = 0; h.i += h.dir;
          if (h.i >= h.path.length || h.i < 0) { h.dir *= -1; h.i += h.dir * 2; }
          h.x = h.path[h.i].x; h.y = h.path[h.i].y;
          checkHazards();
        }
      });
      if (now > S.lastMove) {
        for (var k in held) { var d = KEYS[k]; if (d) { tryMove(d[0], d[1]); S.lastMove = now + 150; break; } }
      }
    }
    draw(now);
    requestAnimationFrame(loop);
  }

  function start() {
    S = fresh();
    items.forEach(function (it) { it.taken = false; it.visited = false; });
    for (var yy = 0; yy < ROWS; yy++) for (var xx = 0; xx < COLS; xx++) if (map[yy][xx] === "G" && xx === zx(3, 11) && (yy === 5 || yy === 6)) map[yy][xx] = "B";
    log.innerHTML = "";
    renderHud();
    say("You are the last common ancestor of chimpanzees and humans, in a Late Miocene forest about 8 million years ago. " + hint(0));
    dlg.hidden = true; S.paused = false; canvas.focus();
  }
  S = fresh(); renderHud();
  /* Read-only hook used by automated tests */
  window.AgesOfEvolution = { state: function () { return S; }, map: map, items: items, hazards: hazards, questions: Q };
  $("btn-start").addEventListener("click", function () { $("game-intro").hidden = true; $("game-ui").hidden = false; start(); });
  requestAnimationFrame(loop);
})();
