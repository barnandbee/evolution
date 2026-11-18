/* Click-to-load YouTube embeds (privacy-enhanced domain, captions on by default).
   A slot stays hidden until its data-youtube attribute holds a video ID or URL. */
(function () {
  "use strict";
  function videoId(v) {
    v = (v || "").trim(); if (!v) return "";
    var m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(v) ? v : "";
  }
  document.querySelectorAll("figure.video[data-youtube]").forEach(function (fig) {
    var id = videoId(fig.getAttribute("data-youtube"));
    if (!id) return;
    var start = parseInt(fig.getAttribute("data-start") || "0", 10);
    var title = fig.getAttribute("data-title") || "Video";
    var frame = fig.querySelector(".video-frame");
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "video-play";
    btn.setAttribute("aria-label", "Play video: " + title);
    btn.innerHTML = '<img alt="" loading="lazy" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg">' +
      '<span class="video-icon" aria-hidden="true"><svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.4.3 34 .3 34 .3s-21.4 0-26.6 1.4c-2.9.8-5.1 3.1-5.9 6C.1 13 .1 24 .1 24s0 11 1.4 16.3c.8 2.9 3 5.2 5.9 6C12.6 47.7 34 47.7 34 47.7s21.4 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6 1.4-5.3 1.4-16.3 1.4-16.3s0-11-1.4-16.3z" fill="#9a4a22"/><path d="M45 24 27 14v20z" fill="#fff"/></svg></span>';
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&cc_load_policy=1&modestbranding=1" + (start ? "&start=" + start : "");
      f.title = title; f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.setAttribute("allowfullscreen", ""); f.referrerPolicy = "strict-origin-when-cross-origin";
      frame.innerHTML = ""; frame.appendChild(f); f.focus();
    });
    frame.appendChild(btn);
    var link = fig.querySelector(".video-link");
    if (link) link.href = "https://www.youtube.com/watch?v=" + id + (start ? "&t=" + start + "s" : "");
    fig.hidden = false;
  });
})();
