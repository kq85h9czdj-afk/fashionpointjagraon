const WHATSAPP = "918847080855";
const img = (id, w = 700) => `https://images.unsplash.com/${id}?w=${w}&q=75&auto=format&fit=crop`;

const CLOTH = ["S", "M", "L", "XL", "XXL"];
const WAIST = ["28", "30", "32", "34", "36"];
const SHOES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
const LADIES_SHOES = ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7"];
const KIDS = ["0–2y", "3–5y", "6–9y", "10–14y"];

// Sample catalogue. Swap names, photos and sizes for the shop's real stock.
const PRODUCTS = [
  { id: "m1", cat: "men", name: "Midnight Tailored Suit", desc: "Slim-fit two-piece for weddings & occasions", img: img("photo-1507679799987-c73779587ccf"), sizes: CLOTH, badge: "BESTSELLER" },
  { id: "m2", cat: "men", name: "Royal Navy Blazer Set", desc: "Sharp, structured and made for celebrations", img: img("photo-1617137968427-85924c800a22"), sizes: CLOTH, badge: "NEW" },
  { id: "m3", cat: "men", name: "Biker Leather Jacket", desc: "Street-ready jacket with a modern cut", img: img("photo-1520975954732-35dd22299614"), sizes: CLOTH },
  { id: "m4", cat: "men", name: "Denim Print Shirt", desc: "Easy everyday shirt in soft cotton", img: img("photo-1596755094514-f87e34085b2c"), sizes: CLOTH },
  { id: "w1", cat: "women", name: "Burgundy Wool Coat", desc: "Statement winter coat with a clean drape", img: img("photo-1483985988355-763728e1935b"), sizes: CLOTH, badge: "NEW" },
  { id: "w2", cat: "women", name: "Checked Overcoat", desc: "Classic tartan layer for cooler days", img: img("photo-1485968579580-b6d095142e6e"), sizes: CLOTH },
  { id: "w3", cat: "women", name: "Striped Wide-Leg Set", desc: "Bold monochrome stripes with a crop top", img: img("photo-1509631179647-0177331693ae"), sizes: CLOTH, badge: "TRENDING" },
  { id: "w4", cat: "women", name: "Sunshine Co-ord", desc: "Cosy hoodie and joggers in mustard", img: img("photo-1515886657613-9f3515b0c78f"), sizes: CLOTH },
  { id: "f1", cat: "footwear", name: "Velocity Runner", desc: "Lightweight knit running sneaker", img: img("photo-1542291026-7eec264c27ff"), sizes: SHOES, badge: "HOT" },
  { id: "f2", cat: "footwear", name: "Floral Stiletto Heels", desc: "Printed pointed heels for party nights", img: img("photo-1543163521-1bf539c55dd2"), sizes: LADIES_SHOES },
  { id: "f3", cat: "footwear", name: "Tan Court Classic", desc: "Low-top leather sneaker in tan", img: img("photo-1549298916-b41d501d3772"), sizes: SHOES, badge: "NEW" },
  { id: "f4", cat: "footwear", name: "Red Retro High-Tops", desc: "Retro basketball style in red and black", img: img("photo-1552346154-21d32810aba3"), sizes: SHOES },
  { id: "k1", cat: "kids", name: "Little Champ Tee", desc: "Soft cotton tee for everyday play", img: img("photo-1471286174890-9c112ffca5b4"), sizes: KIDS },
  { id: "k2", cat: "kids", name: "Polka Dot Frock", desc: "Pretty dotted dress for little girls", img: img("photo-1518831959646-742c3a14ebf7"), sizes: KIDS, badge: "NEW" },
  { id: "k3", cat: "kids", name: "Little Gentleman Set", desc: "Cardigan, bow tie and shorts party set", img: img("photo-1519238263530-99bdd11df2ea"), sizes: KIDS, badge: "PARTY" },
  { id: "k4", cat: "kids", name: "Baby Essentials Pack", desc: "Tees, booties and a cap for newborns", img: img("photo-1622290291468-a28f7a7dc6a8"), sizes: ["0–6m", "6–12m", "1–2y"] }
];
const CAT_LABEL = { men: "Men", women: "Women", footwear: "Footwear", kids: "Kids Store" };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const openWhatsApp = (text) => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

window.addEventListener("load", () => document.body.classList.add("loaded"));
setTimeout(() => document.body.classList.add("loaded"), 2500);
$("#year").textContent = new Date().getFullYear();

/* Mobile menu */
const nav = $("#nav");
const toggle = $(".menu-toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "✕" : "☰";
});
$$("#nav a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "☰";
}));

/* Toast */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* Products */
const grid = $("#productGrid");
const selectedSize = {};

function renderProducts(filter = "all") {
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
  grid.innerHTML = list.map((p, i) => `
    <article class="product tilt" data-id="${p.id}" style="animation-delay:${i * 60}ms">
      <div class="product-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      </div>
      <div class="product-body">
        <p class="product-cat">${CAT_LABEL[p.cat]}</p>
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="sizes" role="group" aria-label="Choose size">
          ${p.sizes.map((s) => `<button class="size${selectedSize[p.id] === s ? " active" : ""}" data-size="${s}">${s}</button>`).join("")}
        </div>
        <div class="product-actions">
          <button class="button button-gold" data-action="buy">Order Now</button>
          <button class="button button-ghost" data-action="add">Add to Bag</button>
        </div>
        <button class="prebook-link" data-action="prebook">Pre-book this item</button>
      </div>
    </article>`).join("");
}

function setFilter(filter) {
  $$(".filter").forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  renderProducts(filter);
}

$$(".filter").forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.filter)));
$$("a[data-filter]").forEach((a) => a.addEventListener("click", () => setFilter(a.dataset.filter)));

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".product");
  if (!card) return;
  const p = PRODUCTS.find((x) => x.id === card.dataset.id);
  const sizeBtn = e.target.closest(".size");
  if (sizeBtn) {
    selectedSize[p.id] = sizeBtn.dataset.size;
    $$(".size", card).forEach((b) => b.classList.toggle("active", b === sizeBtn));
    return;
  }
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  const size = selectedSize[p.id];
  if (action === "prebook") return prebookFor(CAT_LABEL[p.cat], `${p.name}${size ? ` (size ${size})` : ""}`);
  if (!size) {
    toast("Please choose a size first");
    $(".sizes", card).animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
    return;
  }
  if (action === "buy") {
    openWhatsApp(`Hello Fashion Point! 🛍️\nI'd like to order:\n• ${p.name} (${CAT_LABEL[p.cat]}) — Size: ${size}\n\nPlease confirm the price and availability.`);
  } else {
    addToBag(p, size);
  }
});

/* Bag */
let bag = JSON.parse(localStorage.getItem("fp-bag") || "[]");
const saveBag = () => { localStorage.setItem("fp-bag", JSON.stringify(bag)); renderBag(); };

function addToBag(p, size) {
  const line = bag.find((l) => l.id === p.id && l.size === size);
  if (line) line.qty++;
  else bag.push({ id: p.id, size, qty: 1 });
  saveBag();
  const btn = $("#bagBtn");
  btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  toast(`${p.name} added to your bag`);
}

function renderBag() {
  const items = bag.map((l) => ({ ...l, p: PRODUCTS.find((x) => x.id === l.id) })).filter((l) => l.p);
  $("#bagCount").textContent = items.reduce((n, l) => n + l.qty, 0);
  $("#drawerItems").innerHTML = items.length
    ? items.map((l, i) => `
      <div class="bag-item" data-index="${i}">
        <img src="${l.p.img}" alt="">
        <div><strong>${l.p.name}</strong><small>${CAT_LABEL[l.p.cat]} · Size ${l.size}</small>
          <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="1" aria-label="Increase">+</button></div>
        </div>
        <button class="remove" data-remove>Remove</button>
      </div>`).join("")
    : `<p class="drawer-empty">Your bag is empty.<br>Find something you love in the collection.</p>`;
}

$("#drawerItems").addEventListener("click", (e) => {
  const row = e.target.closest(".bag-item");
  if (!row) return;
  const i = +row.dataset.index;
  if (e.target.closest("[data-remove]")) bag.splice(i, 1);
  const q = e.target.closest("[data-q]");
  if (q) {
    bag[i].qty += +q.dataset.q;
    if (bag[i].qty < 1) bag.splice(i, 1);
  }
  saveBag();
});

const setDrawer = (open) => {
  document.body.classList.toggle("drawer-open", open);
  $("#drawer").setAttribute("aria-hidden", !open);
};
$("#bagBtn").addEventListener("click", () => setDrawer(true));
$("#drawerClose").addEventListener("click", () => setDrawer(false));
$("#drawerBackdrop").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));

$("#checkoutBtn").addEventListener("click", () => {
  if (!bag.length) return toast("Your bag is empty");
  const name = $("#orderName").value.trim();
  const lines = bag.map((l, i) => {
    const p = PRODUCTS.find((x) => x.id === l.id);
    return `${i + 1}. ${p.name} (${CAT_LABEL[p.cat]}) — Size: ${l.size} × ${l.qty}`;
  });
  openWhatsApp(`Hello Fashion Point! 🛍️\nI'd like to place an order:\n\n${lines.join("\n")}\n\nOption: ${$("#orderMode").value}${name ? `\nName: ${name}` : ""}\n\nPlease confirm the total and availability. Thank you!`);
});

/* Pre-booking */
const form = $("#prebookForm");
function prebookFor(dept, item) {
  const sel = $("#prebookDept");
  if ([...sel.options].some((o) => o.value === dept)) sel.value = dept;
  if (item) form.details.value = `I'd like to pre-book: ${item}`;
  $("#prebook").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.name.focus({ preventScroll: true }), 700);
}
$$("[data-prebook]").forEach((b) => b.addEventListener("click", () => prebookFor(b.dataset.prebook)));
$$("[data-order]").forEach((b) => b.addEventListener("click", () =>
  openWhatsApp(`Hello Fashion Point! ✨\nI love "${b.dataset.order}" from your New Looks. Please share the details, sizes and price.`)));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const date = d.date ? new Date(d.date + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Flexible";
  openWhatsApp(
    `Hello Fashion Point! 📌 PRE-BOOKING REQUEST\n\nName: ${d.name}\nPhone: ${d.phone}\nDepartment: ${d.dept}\nSize: ${d.size || "Not sure"}\nOccasion: ${d.occasion}\nNeeded by: ${date}\n\nDetails: ${d.details || "-"}`
  );
  toast("Opening WhatsApp…");
});

/* 3D carousel: auto-spin, drag to rotate */
const stage = $("#stage");
const carousel = $("#carousel");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let angle = 0, velocity = reduceMotion ? 0 : -0.15, tiltX = -8, dragging = false, lastX = 0;

stage.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId); });
stage.addEventListener("pointermove", (e) => {
  const r = stage.getBoundingClientRect();
  tiltX = -8 + ((e.clientY - r.top) / r.height - 0.5) * -14;
  if (!dragging) return;
  velocity = (e.clientX - lastX) * 0.25;
  lastX = e.clientX;
});
const endDrag = () => { dragging = false; };
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

(function spin() {
  angle += velocity;
  if (!dragging) velocity += ((reduceMotion ? 0 : -0.15) - velocity) * 0.03;
  carousel.style.transform = `rotateX(${tiltX}deg) rotateY(${angle}deg)`;
  requestAnimationFrame(spin);
})();

/* 3D tilt on cards (delegated so it works for re-rendered products) */
const canHover = matchMedia("(hover: hover)").matches && !reduceMotion;
let tilted = null;
if (canHover) {
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest(".tilt");
    if (tilted && tilted !== el) {
      tilted.classList.remove("tilting");
      tilted.style.transform = "";
    }
    tilted = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.classList.add("tilting");
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${y * -14}deg) translateZ(10px)`;
  });
}

/* Scroll reveal */
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));

renderProducts();
renderBag();
