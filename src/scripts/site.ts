import type { Exhibit } from '../data/content';

const toast = document.querySelector<HTMLDivElement>('#toast')!;
let toastTimeout: ReturnType<typeof setTimeout>;
function announce(message: string) {
  clearTimeout(toastTimeout);
  const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
  (dialog?.open ? dialog : document.body).append(toast);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3600);
}

async function copy(text: string, success: string) {
  try {
    await navigator.clipboard.writeText(text);
    announce(success);
  } catch {
    announce(`Kopyalanamadı. Manuel kopyalama: ${text}`);
  }
}

const exhibits: Exhibit[] = JSON.parse(document.querySelector('#exhibit-data')?.textContent || '[]');
const dialog = document.querySelector<HTMLDialogElement>('#lightbox')!;
// Keep keyboard navigation in the modal even at the browser-chrome boundary.
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(modal => {
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !modal.open) return;
    const controls = [...modal.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')]
      .filter(control => control.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
const image = document.querySelector<HTMLImageElement>('#lightbox-image')!;
let activeIndex = 0;
let previousFocus: HTMLElement | null = null;
let previousHash = '';

function updatePhoto(index: number) {
  activeIndex = (index + exhibits.length) % exhibits.length;
  const exhibit = exhibits[activeIndex];
  image.src = `/images/${exhibit.image}-960.webp`;
  image.alt = exhibit.alt;
  document.querySelector('#lightbox-title')!.textContent = exhibit.title;
  document.querySelector('#lightbox-note')!.textContent = exhibit.note;
  document.querySelector('#lightbox-category')!.textContent = exhibit.category.toLocaleUpperCase('tr');
  document.querySelector('#lightbox-counter')!.textContent = `KARAER ARŞİVİ / ${String(exhibit.id).padStart(3, '0')} — ${String(exhibits.length).padStart(3, '0')}`;
  history.replaceState(null, '', `${location.pathname}${location.search}#eser-${exhibit.id}`);
}

function openPhoto(id: number) {
  const index = exhibits.findIndex(item => item.id === id);
  if (index < 0) return;
  if (!dialog.open) {
    previousFocus = document.activeElement as HTMLElement;
    previousHash = location.hash.startsWith('#eser-') ? '' : location.hash;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
  }
  updatePhoto(index);
}

document.querySelectorAll<HTMLButtonElement>('[data-exhibit]').forEach(button => {
  button.addEventListener('click', () => openPhoto(Number(button.dataset.exhibit)));
});
document.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.documentElement.style.overflow = '';
  document.body.append(toast);
  toast.classList.remove('visible');
  if (location.hash.startsWith('#eser-')) history.replaceState(null, '', `${location.pathname}${location.search}${previousHash}`);
  previousFocus?.focus({ preventScroll: true });
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
document.querySelector('.photo-prev')?.addEventListener('click', () => updatePhoto(activeIndex - 1));
document.querySelector('.photo-next')?.addEventListener('click', () => updatePhoto(activeIndex + 1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    updatePhoto(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document.querySelector('#exhibit-copy')?.addEventListener('click', () => {
  const url = new URL(`/arsiv/#eser-${exhibits[activeIndex].id}`, location.origin);
  void copy(url.href, 'Eser bağlantısı kopyalandı.');
});

function readExhibitHash() {
  const match = /^#eser-(\d+)$/.exec(location.hash);
  if (match) openPhoto(Number(match[1]));
  else if (dialog.open) dialog.close();
}
window.addEventListener('hashchange', readExhibitHash);
readExhibitHash();

let category = 'Hepsi';
const search = document.querySelector<HTMLInputElement>('#archive-search');
const cards = [...document.querySelectorAll<HTMLElement>('.archive-grid .exhibit')];
function filterArchive() {
  const query = (search?.value ?? '').trim().toLocaleLowerCase('tr');
  let count = 0;
  cards.forEach(card => {
    const visible = (category === 'Hepsi' || card.dataset.category === category) && (card.dataset.search ?? '').includes(query);
    card.hidden = !visible;
    if (visible) count++;
  });
  const countElement = document.querySelector('#archive-count');
  if (countElement) countElement.textContent = `${count} ESER GÖSTERİLİYOR`;
  const empty = document.querySelector<HTMLElement>('#archive-empty');
  if (empty) empty.hidden = count !== 0;
}
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    category = button.dataset.filter || 'Hepsi';
    document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    filterArchive();
  });
});
search?.addEventListener('input', filterArchive);
document.querySelector('#reset-search')?.addEventListener('click', () => {
  if (search) search.value = '';
  document.querySelector<HTMLButtonElement>('[data-filter="Hepsi"]')?.click();
  search?.focus();
});
let lastRandom = -1;
document.querySelector('#random-exhibit')?.addEventListener('click', () => {
  // A different exhibit on every consecutive press, without retry loops.
  const offset = 1 + Math.floor(Math.random() * (exhibits.length - 1));
  lastRandom = (lastRandom + offset) % exhibits.length;
  openPhoto(exhibits[lastRandom].id);
});

let approvals = 0;
const seal = document.querySelector('#seal');
seal?.addEventListener('click', () => {
  approvals++;
  seal.classList.remove('stamped');
  requestAnimationFrame(() => requestAnimationFrame(() => seal.classList.add('stamped')));
  announce(approvals === 1 ? 'Onaylandı.' : approvals < 5 ? 'Onay geçerli.' : 'alr brom');
});
const excuses = [
  '“Olur öyle.”',
  '“Devam.”',
  '“Sonraki maç.”',
  '“Maç bitti.”',
  '“nt ya happen”',
  '“hmmmm”',
];
let excuseIndex = 0;
document.querySelector('#excuse-button')?.addEventListener('click', () => {
  excuseIndex = (excuseIndex + 1) % excuses.length;
  document.querySelector('#excuse')!.textContent = excuses[excuseIndex];
});
document.querySelector('#copy-email')?.addEventListener('click', () => void copy('efekaraer00@gmail.com', 'E-posta adresi kopyalandı.'));
const incident = document.querySelector<HTMLDialogElement>('#incident');
let incidentFocus: HTMLElement | null = null;
let incidentOverflow = '';
document.querySelector('#footer-secret')?.addEventListener('click', () => {
  if (!incident || incident.open) return;
  incidentFocus = document.activeElement as HTMLElement;
  incidentOverflow = document.documentElement.style.overflow;
  const photo = incident.querySelector<HTMLImageElement>('#incident-image');
  if (photo && !photo.getAttribute('src')) photo.src = photo.dataset.src!;
  incident.showModal();
  document.documentElement.style.overflow = 'hidden';
});
document.querySelector('#incident-close')?.addEventListener('click', () => incident?.close());
incident?.addEventListener('close', () => {
  document.documentElement.style.overflow = incidentOverflow;
  incidentFocus?.focus({ preventScroll: true });
});
document.querySelector<HTMLButtonElement>('#ticker-toggle')?.addEventListener('click', event => {
  const button = event.currentTarget as HTMLButtonElement;
  const paused = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(paused));
  button.setAttribute('aria-label', paused ? 'Yazı akışını devam ettir' : 'Yazı akışını durdur');
  button.textContent = paused ? '▷' : 'Ⅱ';
  document.querySelector('.ticker')?.classList.toggle('paused', paused);
});

// Keep the old single-page navigation useful for bookmarks arriving after replacement.
const legacyRoutes: Record<string, string> = { '#gallery': '/arsiv/', '#rank': '/rank/', '#signals': '/baglantilar/' };
if (location.pathname === '/' && legacyRoutes[location.hash]) location.replace(legacyRoutes[location.hash]);
