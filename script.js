const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}));

const heroScroll = document.querySelector('.hero-scroll');
const canvas = document.querySelector('#hero-canvas');
const heroImage = document.querySelector('.hero-image');
const context = canvas.getContext('2d');
const frameCount = 150;
const frames = Array.from({ length: frameCount }, (_, i) => {
  const image = new Image();
  image.src = `assets/hero-frames/${String(i * 2).padStart(5, '0')}.jpg`;
  return image;
});

function drawFrame(index) {
  const image = frames[index];
  if (!image || !image.complete || !image.naturalWidth) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const dpr = window.devicePixelRatio;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

let frameQueued = false;
function updateHeroFrame() {
  frameQueued = false;
  const rect = heroScroll.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
  drawFrame(Math.round(progress * (frameCount - 1)));
}

frames[0].addEventListener('load', () => { heroImage.classList.add('frames-ready'); drawFrame(0); }, { once: true });
window.addEventListener('scroll', () => { if (!frameQueued) { frameQueued = true; requestAnimationFrame(updateHeroFrame); } }, { passive: true });
window.addEventListener('resize', updateHeroFrame);
