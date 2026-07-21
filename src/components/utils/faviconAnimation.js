const frames = [
  0, 2, 4, 6, 8, 10, 12, 14,
  18, 20, 22, 24, 26, 28, 30
].map(
  (num) => `/favicon/frame_${String(num).padStart(2, "0")}.png`
);

let index = 0;
let timer;

export function startFaviconAnimation() {
  const favicon = document.getElementById("favicon");

  if (!favicon) return;

  timer = setInterval(() => {
    favicon.href = frames[index];

    index++;

    if (index >= frames.length) {
      index = 0;
    }
  }, 120);
}


export function stopFaviconAnimation() {
  clearInterval(timer);

  const favicon = document.getElementById("favicon");

  if (favicon) {
    favicon.href = "/favicon/frame_00.png";
  }
}
