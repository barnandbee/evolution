/* Human Origins — course behaviour: theme, nav, progress, quizzes, reflections, TOC */
(function () {
  "use strict";

  var STORE_KEY = "human-origins-progress-v1";
  var MODULES = ["m1", "m2", "m3", "m4"];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  var state = load();
  state.done = state.done || {};
  state.scores = state.scores || {};
  state.notes = state.notes || {};
  state.acts = state.acts || {};

  /* Theme */
  var root = document.documentElement;
  try { var t = localStorage.getItem("human-origins-theme"); if (t) root.setAttribute("data-theme", t); } catch (e) {}
  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme");
      var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("human-origins-theme", next); } catch (e) {}
    });
  });

  /* Mobile nav */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Progress display */
  function renderProgress() {
    var n = MODULES.filter(function (m) { return state.done[m]; }).length;
    document.querySelectorAll("[data-progress-count]").forEach(function (el) { el.textContent = n; });
    document.querySelectorAll("[data-progress-bar]").forEach(function (el) { el.style.width = (n / MODULES.length * 100) + "%"; });
    document.querySelectorAll("[data-status-for]").forEach(function (el) {
      var m = el.getAttribute("data-status-for");
      if (state.done[m]) {
        el.textContent = "Completed" + (state.scores[m] != null ? " · quiz " + state.scores[m] : "");
        el.classList.add("done");
      } else {
        el.textContent = state.scores[m] != null ? "In progress · quiz " + state.scores[m] : "Not started";
        el.classList.remove("done");
      }
    });
    document.querySelectorAll("[data-acts-for]").forEach(function (el) {
      var m = el.getAttribute("data-acts-for");
      var total = document.querySelectorAll('.activity[data-activity^="' + m + '-"]').length;
      var n = Object.keys(state.acts).filter(function (k) { return k.indexOf(m + "-") === 0 && state.acts[k]; }).length;
      el.textContent = Math.min(n, total) + "/" + total + " activities done";
    });
    document.querySelectorAll("[data-complete-btn]").forEach(function (btn) {
      var m = btn.getAttribute("data-complete-btn");
      btn.textContent = state.done[m] ? "Completed ✓ (click to undo)" : "Mark module complete";
    });
  }
  document.querySelectorAll("[data-complete-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var m = btn.getAttribute("data-complete-btn");
      state.done[m] = !state.done[m];
      save(state); renderProgress();
    });
  });
  document.querySelectorAll("[data-reset-progress]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!confirm("Clear your progress, quiz scores and reflection notes on this device?")) return;
      state = { done: {}, scores: {}, notes: {}, acts: {} };
      save(state); renderProgress();
      document.querySelectorAll(".reflect textarea").forEach(function (ta) { ta.value = ""; });
    });
  });

  /* Quizzes
     Markup: <div class="quiz" data-module="m1" data-pass="4">
               <div class="q" data-answer="b" data-explain="...">
                 <p class="q-text">...</p>
                 <div class="q-opts"><button class="q-opt" data-k="a">...</button>...</div>
                 <div class="q-feedback"></div>
               </div>
               ...
               <div class="quiz-result"></div>
               <div class="quiz-actions"><button class="btn secondary" data-quiz-reset>Retake</button></div>
             </div> */
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var mod = quiz.getAttribute("data-module");
    var pass = parseInt(quiz.getAttribute("data-pass") || "4", 10);
    var qs = quiz.querySelectorAll(".q");
    var result = quiz.querySelector(".quiz-result");
    var answered = 0, correct = 0;

    qs.forEach(function (q) {
      var opts = q.querySelectorAll(".q-opt");
      opts.forEach(function (o, i) {
        var letter = document.createElement("span");
        letter.className = "letter"; letter.textContent = String.fromCharCode(65 + i);
        o.insertBefore(letter, o.firstChild);
        o.addEventListener("click", function () {
          if (q.dataset.done) return;
          q.dataset.done = "1"; answered++;
          var ans = q.getAttribute("data-answer");
          var ok = o.getAttribute("data-k") === ans;
          if (ok) correct++;
          opts.forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute("data-k") === ans) { x.classList.add("correct"); addMark(x, "✓ Correct answer"); }
          });
          if (!ok) { o.classList.add("wrong"); addMark(o, "✗ Your answer"); }
          var fb = q.querySelector(".q-feedback");
          fb.innerHTML = (ok ? '<strong class="ok">Correct.</strong> ' : '<strong class="no">Not quite.</strong> ') + q.getAttribute("data-explain");
          fb.classList.add("show");
          if (answered === qs.length) finish();
        });
      });
    });

    function addMark(el, txt) {
      var m = document.createElement("span"); m.className = "mark"; m.textContent = txt; el.appendChild(m);
    }

    function finish() {
      var score = correct + "/" + qs.length;
      state.scores[mod] = score;
      var passed = correct >= pass;
      if (passed) state.done[mod] = true;
      save(state); renderProgress();
      result.className = "quiz-result show " + (passed ? "pass" : "fail");
      result.textContent = passed
        ? "You scored " + score + ". Module marked complete."
        : "You scored " + score + ". " + pass + " or more marks the module complete — review the sections flagged above and retake when ready.";
    }

    var reset = quiz.querySelector("[data-quiz-reset]");
    if (reset) reset.addEventListener("click", function () {
      answered = 0; correct = 0;
      qs.forEach(function (q) {
        delete q.dataset.done;
        q.querySelectorAll(".q-opt").forEach(function (x) {
          x.disabled = false; x.classList.remove("correct", "wrong");
          var m = x.querySelector(".mark"); if (m) m.remove();
        });
        var fb = q.querySelector(".q-feedback"); fb.classList.remove("show"); fb.innerHTML = "";
      });
      result.className = "quiz-result";
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Reflection notes (stored on this device only) */
  document.querySelectorAll(".reflect textarea[data-note]").forEach(function (ta) {
    var key = ta.getAttribute("data-note");
    var saved = ta.parentNode.querySelector(".saved");
    if (state.notes[key]) ta.value = state.notes[key];
    var timer;
    ta.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.notes[key] = ta.value; save(state);
        if (saved) saved.textContent = "Saved on this device.";
      }, 400);
    });
  });

  /* Table of contents highlighting */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("active"); });
          var a = map[en.target.id]; if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  window.HumanOrigins = {
    markActivity: function (id) { if (!state.acts[id]) { state.acts[id] = true; save(state); renderProgress(); } },
    isActivityDone: function (id) { return !!state.acts[id]; }
  };

  renderProgress();
})();
