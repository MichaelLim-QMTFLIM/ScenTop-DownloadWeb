/* Call for url download in case*/
var DOWNLOAD = {
  apk: "scentop.apk"
};

var PRODUCTS = [
  { name: "Velvet Dusk", img: "images/products/velvet-dusk.png", cat: "Woody amber", notes: "Bergamot, cardamom, amber", bg: ["#ffe3e7", "#ffccd5"], liquid: "#e0794f", shape: 0 },
  { name: "Peach Soda", img: "images/products/peach-soda.png", cat: "Fruity fizz", notes: "Peach, pink pepper, musk", bg: ["#fef2c7", "#fde38a"], liquid: "#fb9a5c", shape: 1 },
  { name: "Salt & Cedar", img: "images/products/salt-cedar.png", cat: "Fresh aquatic", notes: "Sea salt, cedar, grapefruit", bg: ["#dff3f1", "#bfe6e2"], liquid: "#4fb3c4", shape: 2 },
  { name: "Midnight Fig", img: "images/products/midnight-fig.png", cat: "Green gourmand", notes: "Fig leaf, vanilla, sandalwood", bg: ["#ece3f6", "#d8c8ee"], liquid: "#7a5aa6", shape: 0 },
  { name: "Rose Ember", img: "images/products/rose-ember.png", cat: "Warm floral", notes: "Damask rose, saffron, oud", bg: ["#ffd9e0", "#ffa6b6"], liquid: "#d6294f", shape: 1 },
  { name: "Matcha Mist", img: "images/products/matcha-mist.png", cat: "Soft green", notes: "Matcha, white tea, lily", bg: ["#e6f3d6", "#cfe6b4"], liquid: "#7fae4a", shape: 2 }
];

function bottle(p) {
  var body = ["<rect x='24' y='52' width='72' height='88' rx='14'", "<path d='M60 50 L98 72 L98 126 Q98 140 84 140 L36 140 Q22 140 22 126 L22 72 Z'", "<ellipse cx='60' cy='98' rx='40' ry='44'"][p.shape];
  var cap = "<rect x='46' y='14' width='28' height='24' rx='5' fill='#474747'/><rect x='52' y='36' width='16' height='18' fill='#d3d3d3'/>";
  return "<svg viewBox='0 0 120 150' aria-hidden='true'>" + cap +
    body + " fill='#ffffff' fill-opacity='.7' stroke='#ffffff' stroke-width='3'/>" +
    body + " fill='" + p.liquid + "' fill-opacity='.85' transform='translate(0 18) scale(1 .8)' transform-origin='60 140'/>" +
    "<path d='M34 70 Q32 100 36 128' stroke='#fff' stroke-width='5' stroke-linecap='round' fill='none' opacity='.6'/></svg>";
}

var track = document.getElementById("track"), dotsEl = document.getElementById("dots");
PRODUCTS.forEach(function (p, i) {
  var a = document.createElement("article");
  a.className = "pcard";
  a.innerHTML = "<div class='pimg' style='background:linear-gradient(160deg," + p.bg[0] + "," + p.bg[1] + ")'><span class='rank'>Hot #" + (i + 1) + "</span>" + bottle(p) + "</div>" +
    "<div class='pbody'><span class='cat'>" + p.cat + "</span><h3>" + p.name + "</h3><p class='notes'>" + p.notes + "</p></div>";
  track.appendChild(a);
});
var more = document.createElement("a");
more.className = "pcard more-card"; more.href = "#download"; more.setAttribute("data-go", "download");
more.innerHTML = "<strong>See more products</strong><span class='arrow'>&rarr;</span>";
track.appendChild(more);
var cards = track.children;
for (var i = 0; i < cards.length; i++) {
  (function (i) {
    var d = document.createElement("button");
    d.type = "button"; d.setAttribute("aria-label", "Go to item " + (i + 1));
    d.onclick = function () { goTo(i); paused = true; };
    dotsEl.appendChild(d);
  })(i);
}
function cur() {
  var best = 0, bd = 1e9;
  for (var i = 0; i < cards.length; i++) { var d = Math.abs(cards[i].offsetLeft - track.offsetLeft - track.scrollLeft); if (d < bd) { bd = d; best = i; } }
  if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = cards.length - 1;
  return best;
}
function goTo(i) { track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: "smooth" }); }
function sync() { var c = cur(); for (var i = 0; i < dotsEl.children.length; i++) dotsEl.children[i].setAttribute("aria-current", i === c ? "true" : "false"); }
track.addEventListener("scroll", sync, { passive: true });
function step(dir) {
  var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4, atStart = track.scrollLeft <= 4;
  if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
  else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
  else goTo(Math.max(0, Math.min(cards.length - 1, cur() + dir)));
}
var paused = false, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("next").onclick = function () { paused = true; step(1); };
document.getElementById("prev").onclick = function () { paused = true; step(-1); };
["mouseenter", "focusin", "touchstart"].forEach(function (e) { track.addEventListener(e, function () { paused = true; }, { passive: true }); });
track.addEventListener("mouseleave", function () { paused = false; });
setInterval(function () {
  if (paused || reduce || !track.offsetWidth || document.hidden) return;
  step(1);
}, 3500);
sync();

/* routing */
var ROUTES = ["home", "about", "faq", "download"];
function show(r, scrollToId) {
  if (ROUTES.indexOf(r) < 0) r = "home";
  ROUTES.forEach(function (n) { document.getElementById("p-" + n).classList.toggle("on", n === r); });
  document.querySelectorAll("nav.main a").forEach(function (a) {
    if (a.getAttribute("data-go") === r) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  try { history.replaceState(null, "", "#" + r); } catch (e) {}
  if (scrollToId) { var el = document.getElementById(scrollToId); if (el) el.scrollIntoView({ behavior: "smooth" }); }
  else window.scrollTo(0, 0);
  sync();
}
document.addEventListener("click", function (e) {
  var a = e.target.closest("[data-go],[data-scroll]");
  if (!a) return;
  e.preventDefault();
  if (a.hasAttribute("data-scroll")) show("home", a.getAttribute("data-scroll"));
  else show(a.getAttribute("data-go"));
});
window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });

var ua = navigator.userAgent || "";
document.getElementById("dl-apk").href = DOWNLOAD.apk;
document.getElementById("detected").textContent = /iphone|ipad|ipod/i.test(ua)
  ? "ScenTop is not available on iPhone or iPad yet. Open this page on an Android phone to download."
  : /android/i.test(ua) ? "We detected an Android phone." : "On a computer? Scan the QR code with your Android phone.";
var base = location.href.split("#")[0].split("?")[0];
var shareUrl = base + "#download";
document.getElementById("share").value = shareUrl;
try {
  new QRCode(document.getElementById("qr"), { text: shareUrl, width: 160, height: 160, colorDark: "#474747", colorLight: "#ffffff" });
} catch (e) {}
function toast(t) { var el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); setTimeout(function () { el.classList.remove("on"); }, 1800); }
document.getElementById("copy").onclick = function () {
  var inp = document.getElementById("share");
  function fallback() { inp.focus(); inp.select(); toast("Press copy on your keyboard"); }
  try { navigator.clipboard.writeText(shareUrl).then(function () { toast("Link copied"); }, fallback); } catch (e) { fallback(); }
};

var q = new URLSearchParams(location.search), initial = location.hash.slice(1);
var linked = q.get("product");
if (linked || q.get("ref")) {
  initial = "download";
  var hit = PRODUCTS.filter(function (p) { return p.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "") === (linked || "").toLowerCase(); })[0];
  var b = document.getElementById("banner");
  b.textContent = hit ? "Someone shared " + hit.name + " with you. Download ScenTop to see it." : "You were invited to ScenTop. Download the app to get started.";
  b.hidden = false;
}
show(initial);

/* splash */
var splash = document.getElementById("splash");
function hideSplash() { splash.classList.add("gone"); }
splash.onclick = hideSplash;
setTimeout(hideSplash, 3600);
