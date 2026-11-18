/* Human Origins — interactive learning activities: flip cards, hotspots, drag-and-drop (sort, match, order).
   Every activity works with mouse, touch and keyboard. Drag-and-drop also supports "select, then place"
   so no dragging movement is required (WCAG 2.2 SC 2.5.7). */
(function () {
  "use strict";

  function done(act) {
    var id = act.getAttribute("data-activity");
    var badge = act.querySelector(".act-done");
    if (badge) badge.hidden = false;
    if (window.HumanOrigins && id) window.HumanOrigins.markActivity(id);
  }
  function say(act, msg) {
    var s = act.querySelector(".act-status");
    if (s) s.textContent = msg;
  }
  function mark(el, ok) {
    el.classList.remove("right", "wrong");
    var old = el.querySelector(".mark"); if (old) old.remove();
    if (ok === null) return;
    el.classList.add(ok ? "right" : "wrong");
    var m = document.createElement("span");
    m.className = "mark";
    m.textContent = ok ? "✓ Correct" : "✗ Try again";
    el.appendChild(m);
  }
  function plain(el) {
    var c = el.cloneNode(true);
    c.querySelectorAll(".mark, .reveal").forEach(function (n) { n.remove(); });
    return c.textContent.trim();
  }

  /* ---------- Flip cards ---------- */
  document.querySelectorAll('.activity[data-type="flip"]').forEach(function (act) {
    var cards = act.querySelectorAll(".flip");
    cards.forEach(function (card) {
      var front = card.querySelector(".flip-front"), back = card.querySelector(".flip-back");
      back.setAttribute("aria-hidden", "true");
      card.addEventListener("click", function () {
        var on = card.getAttribute("aria-pressed") !== "true";
        card.setAttribute("aria-pressed", on ? "true" : "false");
        front.setAttribute("aria-hidden", on ? "true" : "false");
        back.setAttribute("aria-hidden", on ? "false" : "true");
        card.classList.add("seen");
        var seen = act.querySelectorAll(".flip.seen").length;
        say(act, "Viewed " + seen + " of " + cards.length + " cards.");
        if (seen === cards.length) done(act);
      });
    });
    say(act, "Viewed 0 of " + cards.length + " cards.");
  });

  /* ---------- Hotspots ---------- */
  document.querySelectorAll('.activity[data-type="hotspot"]').forEach(function (act) {
    var pins = act.querySelectorAll(".hs-pin");
    var infos = act.querySelectorAll(".hs-info");
    pins.forEach(function (pin) {
      pin.setAttribute("aria-pressed", "false");
      pin.addEventListener("click", function () {
        var key = pin.getAttribute("data-hs");
        pins.forEach(function (p) { p.setAttribute("aria-pressed", p === pin ? "true" : "false"); });
        infos.forEach(function (i) { i.hidden = i.getAttribute("data-for") !== key; });
        var intro = act.querySelector(".hs-intro"); if (intro) intro.hidden = true;
        pin.classList.add("seen");
        var seen = act.querySelectorAll(".hs-pin.seen").length;
        say(act, "Explored " + seen + " of " + pins.length + " points.");
        if (seen === pins.length) done(act);
      });
    });
    say(act, "Explored 0 of " + pins.length + " points.");
  });

  /* ---------- Drag and drop: sort into groups / match pairs ---------- */
  document.querySelectorAll('.activity[data-type="sort"], .activity[data-type="match"]').forEach(function (act) {
    var bank = act.querySelector(".dnd-bank");
    var zones = act.querySelectorAll(".dnd-zone");
    var items = act.querySelectorAll(".dnd-item");
    var explain = act.querySelector(".act-explain");
    var selected = null, dragged = null;
    Array.prototype.slice.call(bank.childNodes).forEach(function (n) { if (n.nodeType === 3) n.remove(); });

    function li(item) { return item.parentNode; }
    function select(item) {
      if (selected) selected.setAttribute("aria-pressed", "false");
      selected = (selected === item) ? null : item;
      if (selected) {
        selected.setAttribute("aria-pressed", "true");
        say(act, "Selected “" + plain(selected) + "”. Now choose where to place it.");
      } else {
        say(act, "Selection cleared.");
      }
    }
    function place(item, zone) {
      var list = zone === bank ? bank : zone.querySelector(".dnd-list");
      var cap = zone === bank ? 0 : parseInt(zone.getAttribute("data-cap") || "0", 10);
      if (cap && list.children.length >= cap && li(item).parentNode !== list) {
        bank.appendChild(list.firstElementChild);           // slot full: return its card to the bank
      }
      mark(item, null);
      list.appendChild(li(item));
      item.setAttribute("aria-pressed", "false");
      selected = null;
      var name = zone === bank ? "unsorted cards" : plain(zone.querySelector(".dnd-target strong") || zone);
      say(act, "Placed “" + plain(item) + "” in " + name + ".");
    }

    items.forEach(function (item) {
      item.setAttribute("aria-pressed", "false");
      item.setAttribute("draggable", "true");
      item.addEventListener("click", function () { select(item); });
      item.addEventListener("dragstart", function (e) {
        dragged = item; item.classList.add("dragging");
        try { e.dataTransfer.setData("text/plain", "x"); e.dataTransfer.effectAllowed = "move"; } catch (err) {}
      });
      item.addEventListener("dragend", function () { item.classList.remove("dragging"); dragged = null; });
    });

    zones.forEach(function (zone) {
      zone.querySelector(".dnd-target").addEventListener("click", function () {
        if (selected) place(selected, zone);
        else say(act, "Select a card first, then choose where to place it.");
      });
    });

    var bankBtn = act.querySelector("[data-dnd-return]");
    if (bankBtn) bankBtn.addEventListener("click", function () {
      if (selected) place(selected, bank); else say(act, "Select a placed card first to return it.");
    });

    [bank].concat(Array.prototype.slice.call(zones)).forEach(function (zone) {
      zone.addEventListener("dragover", function (e) { if (dragged) { e.preventDefault(); zone.classList.add("over"); } });
      zone.addEventListener("dragleave", function () { zone.classList.remove("over"); });
      zone.addEventListener("drop", function (e) {
        e.preventDefault(); zone.classList.remove("over");
        if (dragged) place(dragged, zone);
      });
    });

    act.querySelector("[data-check]").addEventListener("click", function () {
      var right = 0, placed = 0;
      zones.forEach(function (zone) {
        var key = zone.getAttribute("data-zone");
        zone.querySelectorAll(".dnd-item").forEach(function (item) {
          placed++;
          var ok = item.getAttribute("data-answer") === key;
          if (ok) right++;
          mark(item, ok);
        });
      });
      var left = items.length - placed;
      var msg = right + " of " + items.length + " correct." + (left ? " " + left + " card" + (left > 1 ? "s" : "") + " still to place." : "");
      if (right === items.length) { msg = "All " + items.length + " correct. Well done."; done(act); if (explain) explain.hidden = false; }
      say(act, msg);
      act.querySelector("[data-reveal]").hidden = false;
    });

    act.querySelector("[data-reveal]").addEventListener("click", function () {
      items.forEach(function (item) {
        var zone = act.querySelector('.dnd-zone[data-zone="' + item.getAttribute("data-answer") + '"] .dnd-list');
        zone.appendChild(li(item)); mark(item, true);
      });
      if (explain) explain.hidden = false;
      say(act, "Answers shown.");
      done(act);
    });

    act.querySelector("[data-reset]").addEventListener("click", function () {
      items.forEach(function (item) { mark(item, null); item.setAttribute("aria-pressed", "false"); bank.appendChild(li(item)); });
      selected = null;
      if (explain) explain.hidden = true;
      say(act, "Reset. All cards are back in the unsorted area.");
    });
  });

  /* ---------- Drag and drop: put in order ---------- */
  document.querySelectorAll('.activity[data-type="order"]').forEach(function (act) {
    var list = act.querySelector(".ord-list");
    var explain = act.querySelector(".act-explain");
    var dragged = null;
    var initial = Array.prototype.slice.call(list.children);

    function refresh() {
      var kids = list.children;
      Array.prototype.forEach.call(kids, function (li, i) {
        li.querySelector("[data-up]").disabled = i === 0;
        li.querySelector("[data-down]").disabled = i === kids.length - 1;
      });
    }
    function clearMarks() {
      Array.prototype.forEach.call(list.children, function (li) {
        mark(li, null);
        li.querySelectorAll(".reveal").forEach(function (r) { r.hidden = true; });
      });
    }
    function move(li, dir) {
      clearMarks();
      if (dir < 0 && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (dir > 0 && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
      refresh();
      var pos = Array.prototype.indexOf.call(list.children, li) + 1;
      say(act, "Moved “" + plain(li.querySelector(".ord-text")) + "” to position " + pos + " of " + list.children.length + ".");
    }

    Array.prototype.forEach.call(list.children, function (li) {
      var label = plain(li.querySelector(".ord-text"));
      li.querySelector("[data-up]").setAttribute("aria-label", "Move up: " + label);
      li.querySelector("[data-down]").setAttribute("aria-label", "Move down: " + label);
      li.querySelector("[data-up]").addEventListener("click", function (e) { move(li, -1); e.currentTarget.disabled ? li.querySelector("[data-down]").focus() : e.currentTarget.focus(); });
      li.querySelector("[data-down]").addEventListener("click", function (e) { move(li, 1); e.currentTarget.disabled ? li.querySelector("[data-up]").focus() : e.currentTarget.focus(); });
      li.setAttribute("draggable", "true");
      li.addEventListener("dragstart", function (e) {
        dragged = li; li.classList.add("dragging");
        try { e.dataTransfer.setData("text/plain", "x"); e.dataTransfer.effectAllowed = "move"; } catch (err) {}
      });
      li.addEventListener("dragend", function () {
        li.classList.remove("dragging"); dragged = null;
        Array.prototype.forEach.call(list.children, function (x) { x.classList.remove("over-top", "over-bottom"); });
      });
      li.addEventListener("dragover", function (e) {
        if (!dragged || dragged === li) return;
        e.preventDefault();
        var r = li.getBoundingClientRect(), top = e.clientY < r.top + r.height / 2;
        li.classList.toggle("over-top", top); li.classList.toggle("over-bottom", !top);
      });
      li.addEventListener("dragleave", function () { li.classList.remove("over-top", "over-bottom"); });
      li.addEventListener("drop", function (e) {
        e.preventDefault();
        if (!dragged || dragged === li) return;
        clearMarks();
        var r = li.getBoundingClientRect();
        list.insertBefore(dragged, e.clientY < r.top + r.height / 2 ? li : li.nextElementSibling);
        li.classList.remove("over-top", "over-bottom");
        refresh();
        say(act, "Moved “" + plain(dragged.querySelector(".ord-text")) + "”.");
      });
    });

    act.querySelector("[data-check]").addEventListener("click", function () {
      var right = 0;
      Array.prototype.forEach.call(list.children, function (li, i) {
        var ok = parseInt(li.getAttribute("data-pos"), 10) === i + 1;
        if (ok) right++;
        mark(li, ok);
        li.querySelectorAll(".reveal").forEach(function (r) { r.hidden = !ok; });
      });
      var n = list.children.length;
      if (right === n) { say(act, "All " + n + " in the correct order."); done(act); if (explain) explain.hidden = false; }
      else say(act, right + " of " + n + " in the correct position. Dates are shown for the correct ones.");
      act.querySelector("[data-reveal]").hidden = false;
    });

    act.querySelector("[data-reveal]").addEventListener("click", function () {
      var sorted = Array.prototype.slice.call(list.children).sort(function (a, b) {
        return parseInt(a.getAttribute("data-pos"), 10) - parseInt(b.getAttribute("data-pos"), 10);
      });
      sorted.forEach(function (li) { list.appendChild(li); mark(li, true); li.querySelectorAll(".reveal").forEach(function (r) { r.hidden = false; }); });
      refresh();
      if (explain) explain.hidden = false;
      say(act, "Correct order shown.");
      done(act);
    });

    act.querySelector("[data-reset]").addEventListener("click", function () {
      initial.forEach(function (li) { list.appendChild(li); });
      clearMarks(); refresh();
      if (explain) explain.hidden = true;
      say(act, "Reset to the starting order.");
    });

    clearMarks(); refresh();
  });

  /* Restore "completed" badges from saved progress */
  if (window.HumanOrigins) {
    document.querySelectorAll(".activity[data-activity]").forEach(function (act) {
      if (window.HumanOrigins.isActivityDone(act.getAttribute("data-activity"))) {
        var b = act.querySelector(".act-done"); if (b) b.hidden = false;
      }
    });
  }
})();
