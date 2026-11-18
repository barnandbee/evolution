/* Interactive hominin timeline. Dates in millions of years ago (Ma); approximate, rounded from published ranges. */
(function () {
  "use strict";
  var GROUPS = {
    early: { label: "Earliest hominins", color: "#7a6a55" },
    austr: { label: "Australopiths", color: "#c9783f" },
    paran: { label: "Paranthropus", color: "#8c5a3c" },
    homoE: { label: "Early Homo", color: "#4f7a8c" },
    homoL: { label: "Later Homo & relatives", color: "#2f4f6b" },
    sap: { label: "Homo sapiens", color: "#9a4a22" }
  };

  var SPECIES = [
    { n: "Sahelanthropus tchadensis", g: "early", s: 7.2, e: 6.8, mod: 1, where: "Chad (Toros-Menalla)",
      d: "A cranium nicknamed Toumaï, found in 2001. The position of the foramen magnum and later-studied limb bones are used to argue for upright walking, though this remains debated. A candidate for one of the earliest members of the human lineage." },
    { n: "Orrorin tugenensis", g: "early", s: 6.1, e: 5.7, mod: 1, where: "Kenya (Tugen Hills)",
      d: "Known from femurs, teeth and jaw fragments. The thigh bone's structure has been interpreted as evidence of bipedal walking around 6 million years ago." },
    { n: "Ardipithecus kadabba", g: "early", s: 5.8, e: 5.2, mod: 1, where: "Ethiopia (Middle Awash)",
      d: "Fragmentary teeth and bones, closely related to the later Ar. ramidus." },
    { n: "Ardipithecus ramidus", g: "early", s: 4.5, e: 4.3, mod: 1, where: "Ethiopia (Aramis)",
      d: "The partial skeleton 'Ardi' (published in detail in 2009) combines a grasping big toe for climbing with a pelvis adapted for some upright walking — a mosaic that undercut the idea of a 'knuckle-walking' ancestor stage." },
    { n: "Australopithecus anamensis", g: "austr", s: 4.2, e: 3.8, mod: 1, where: "Kenya, Ethiopia",
      d: "Earliest confirmed Australopithecus. A near-complete 3.8-million-year-old cranium (MRD) described in 2019 showed it overlapped in time with Au. afarensis." },
    { n: "Australopithecus afarensis", g: "austr", s: 3.9, e: 2.9, mod: 1, where: "Ethiopia, Kenya, Tanzania",
      d: "Includes 'Lucy' (about 3.2 Ma, found 1974) and is associated with the Laetoli footprints (about 3.66 Ma). Habitually bipedal, with a brain only slightly larger than a chimpanzee's." },
    { n: "Kenyanthropus platyops", g: "austr", s: 3.5, e: 3.2, mod: 1, where: "Kenya (Lomekwi)",
      d: "A flat-faced cranium whose status is debated. Its find area is near Lomekwi 3, where stone tools of about 3.3 Ma were reported in 2015." },
    { n: "Australopithecus africanus", g: "austr", s: 3.3, e: 2.1, mod: 1, where: "South Africa",
      d: "Named in 1925 by Australian-born anatomist Raymond Dart from the Taung Child. Dart's claim that Africa was the cradle of humankind was widely rejected at the time and later vindicated." },
    { n: "Paranthropus aethiopicus", g: "paran", s: 2.7, e: 2.3, mod: 1, where: "Kenya, Ethiopia",
      d: "The 'Black Skull'. Earliest of the robust australopiths, with massive chewing muscles." },
    { n: "Paranthropus boisei", g: "paran", s: 2.3, e: 1.3, mod: 1, where: "East Africa",
      d: "Very large molars and jaws. Lived alongside early Homo for roughly a million years." },
    { n: "Paranthropus robustus", g: "paran", s: 2.0, e: 1.0, mod: 1, where: "South Africa",
      d: "Robust australopith from caves such as Swartkrans and Drimolen. A 2 Ma Drimolen skull was described in 2020 by a team led from La Trobe University." },
    { n: "Australopithecus sediba", g: "austr", s: 2.0, e: 1.95, mod: 1, where: "South Africa (Malapa)",
      d: "Two partial skeletons dated to about 1.98 Ma, mixing australopith and Homo-like traits." },
    { n: "Homo habilis", g: "homoE", s: 2.4, e: 1.5, mod: 2, where: "East Africa",
      d: "Named in 1964 and long associated with early stone tools. The Ledi-Geraru jaw (about 2.8 Ma) pushes the Homo lineage earlier still." },
    { n: "Homo rudolfensis", g: "homoE", s: 2.0, e: 1.8, mod: 2, where: "Kenya",
      d: "A larger-brained, flat-faced early Homo. Whether it is distinct from H. habilis is still argued." },
    { n: "Homo erectus", g: "homoE", s: 2.0, e: 0.11, mod: 2, where: "Africa, Western Asia, China, Java",
      d: "Body proportions close to ours, the Acheulean handaxe, and the first hominin known well outside Africa (Dmanisi, Georgia, about 1.8 Ma). Its last known appearance is at Ngandong, Java, about 117,000–108,000 years ago, a date produced by an international team including Australian researchers." },
    { n: "Homo antecessor", g: "homoL", s: 1.2, e: 0.8, mod: 2, where: "Spain (Atapuerca)",
      d: "Early Europeans from Gran Dolina and Sima del Elefante. Ancient proteins from its tooth enamel place it as a close relative of the lineage leading to Neanderthals, Denisovans and us." },
    { n: "Homo heidelbergensis (broad sense)", g: "homoL", s: 0.7, e: 0.2, mod: 3, where: "Africa, Europe",
      d: "A contested 'catch-all' name for Middle Pleistocene fossils. Some researchers split African material off under other names." },
    { n: "Homo naledi", g: "homoL", s: 0.335, e: 0.236, mod: 2, where: "South Africa (Rising Star)",
      d: "Small-brained but surprisingly recent. Claims of deliberate burial and engraving are highly contested." },
    { n: "Neanderthals (Homo neanderthalensis)", g: "homoL", s: 0.43, e: 0.04, mod: 3, where: "Europe, Western & Central Asia",
      d: "Sima de los Huesos fossils (about 430,000 years old) already carry Neanderthal DNA. Neanderthals buried dead, made pigments, and interbred with Homo sapiens; their DNA makes up about 1–2% of non-African genomes." },
    { n: "Denisovans", g: "homoL", s: 0.3, e: 0.04, mod: 3, where: "Siberia, Tibetan Plateau, China, possibly Laos",
      d: "First identified from DNA in a finger bone (2010). Known physically from a handful of fossils. Their ancestry is highest today in people of New Guinea and in Aboriginal and Torres Strait Islander peoples, pointing to meetings in or near Island Southeast Asia." },
    { n: "Homo floresiensis", g: "homoL", s: 0.19, e: 0.05, mod: 2, where: "Flores, Indonesia (Liang Bua)",
      d: "Discovered in 2003 by an Indonesian–Australian team. About a metre tall, with a brain the size of a chimpanzee's. Revised dating (2016) puts skeletal remains at about 100,000–60,000 years ago and its tools at 190,000–50,000. Earlier small hominins at Mata Menge (about 700,000 years) suggest a long island history." },
    { n: "Homo luzonensis", g: "homoL", s: 0.07, e: 0.05, mod: 2, where: "Luzon, Philippines (Callao Cave)",
      d: "Named in 2019 from teeth and hand and foot bones at least 50,000 years old. Butchered rhino bones on Luzon dated to about 709,000 years show hominins reached the island far earlier." },
    { n: "Homo sapiens", g: "sap", s: 0.315, e: 0, mod: 3, where: "Africa, then worldwide",
      d: "Fossils from Jebel Irhoud, Morocco, are about 315,000 years old; our species emerged across a connected African population. After about 60,000–50,000 years ago people spread across Eurasia and reached Sahul (Australia–New Guinea) by at least 50,000 and possibly about 65,000 years ago." }
  ];

  var host = document.getElementById("tl-chart");
  if (!host) return;
  var detail = document.getElementById("tl-detail");
  var legend = document.getElementById("tl-legend");
  var range = 7.5, selected = null;

  Object.keys(GROUPS).forEach(function (k) {
    var s = document.createElement("span");
    s.innerHTML = '<i style="background:' + GROUPS[k].color + '"></i>' + GROUPS[k].label;
    legend.appendChild(s);
  });

  function fmt(ma) {
    if (ma === 0) return "present";
    if (ma >= 1) return ma.toFixed(ma % 1 ? 1 : 0) + " Ma";
    return Math.round(ma * 1000).toLocaleString() + " ka";
  }

  function render() {
    var list = SPECIES.filter(function (sp) { return sp.e < range; })
      .sort(function (a, b) { return b.s - a.s; });
    var W = 960, left = 230, right = 20, rowH = 26, top = 34;
    var H = top + list.length * rowH + 10;
    var x = function (ma) { return left + (1 - Math.min(ma, range) / range) * (W - left - right); };
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Timeline of hominin species, " + fmt(range) + " to present");

    var step = range > 3 ? 1 : range > 1 ? 0.25 : 0.1;
    for (var t = 0; t <= range + 1e-9; t += step) {
      var g = document.createElementNS(NS, "g"); g.setAttribute("class", "tick");
      var l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x(t)); l.setAttribute("x2", x(t)); l.setAttribute("y1", top - 8); l.setAttribute("y2", H);
      var tx = document.createElementNS(NS, "text");
      tx.setAttribute("x", x(t)); tx.setAttribute("y", 16); tx.setAttribute("text-anchor", "middle");
      tx.textContent = t === 0 ? "Today" : fmt(+t.toFixed(2));
      g.appendChild(l); g.appendChild(tx); svg.appendChild(g);
    }

    list.forEach(function (sp, i) {
      var y = top + i * rowH;
      var g = document.createElementNS(NS, "g");
      g.setAttribute("class", "tl-bar" + (selected === sp.n ? " sel" : ""));
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", sp.n + ", about " + fmt(sp.s) + " to " + fmt(sp.e));
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", left - 10); label.setAttribute("y", y + 15); label.setAttribute("text-anchor", "end");
      label.setAttribute("font-style", "italic");
      label.textContent = sp.n;
      var x1 = x(sp.s), x2 = x(sp.e);
      var r = document.createElementNS(NS, "rect");
      r.setAttribute("x", x1); r.setAttribute("y", y + 4);
      r.setAttribute("width", Math.max(5, x2 - x1)); r.setAttribute("height", rowH - 9);
      r.setAttribute("fill", GROUPS[sp.g].color);
      var hit = document.createElementNS(NS, "rect");
      hit.setAttribute("x", 0); hit.setAttribute("y", y); hit.setAttribute("width", W); hit.setAttribute("height", rowH);
      hit.setAttribute("fill", "transparent");
      g.appendChild(hit); g.appendChild(label); g.appendChild(r);
      function pick() {
        selected = sp.n; show(sp);
        svg.querySelectorAll(".tl-bar").forEach(function (o) { o.classList.remove("sel"); });
        g.classList.add("sel");
      }
      g.addEventListener("click", pick);
      g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(); } });
      svg.appendChild(g);
    });

    host.innerHTML = "";
    host.appendChild(svg);
  }

  function show(sp) {
    detail.innerHTML = "<h3><em>" + sp.n + "</em></h3>" +
      '<div class="span">About ' + fmt(sp.s) + " – " + fmt(sp.e) + " · " + sp.where + "</div>" +
      "<p>" + sp.d + "</p>" +
      '<p><a href="module-' + sp.mod + '.html">Covered in Module ' + sp.mod + " →</a></p>";
  }

  document.querySelectorAll("[data-range]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      range = parseFloat(btn.getAttribute("data-range"));
      document.querySelectorAll("[data-range]").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      render();
    });
  });

  render();
})();
