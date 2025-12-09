const space = document.getElementById("mix-space");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const percent1 = document.getElementById("percent1");
const percent2 = document.getElementById("percent2");
const display = document.getElementById("mix-display");
const displayBox = document.getElementById("mix-display-box");
const root = document.documentElement;

function updateMix() {
  const sp = space.value;
  const c1 = color1.value.trim();
  const c2 = color2.value.trim();
  const p1 = percent1.value;
  const p2 = percent2.value;
  const result = `color-mix(in ${sp}, ${c1} ${p1}%, ${c2} ${p2}%)`;
  root.style.setProperty("--mixed-color", result);
  display.textContent = result;
}

[space, color1, color2, percent1, percent2].forEach(el => {
  el.addEventListener("input", updateMix);
});

updateMix();