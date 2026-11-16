const controls = document.querySelector<HTMLElement>('#discovery-controls');
const search = document.querySelector<HTMLInputElement>('#spot-search');
const filters = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-spot]'));
const count = document.querySelector<HTMLElement>('#result-count');
const empty = document.querySelector<HTMLElement>('#empty-state');
const clear = document.querySelector<HTMLButtonElement>('#clear-filters');
let category = 'all';

function updateResults() {
  const query = (search?.value ?? '').trim().toLocaleLowerCase('en-IN');
  let visible = 0;
  for (const card of cards) {
    const matches = (category === 'all' || category === card.dataset.category)
      && (card.dataset.search ?? '').includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  }
  for (const filter of filters) {
    filter.setAttribute('aria-pressed', String(filter.dataset.filter === category));
  }
  if (count) count.textContent = `${visible} ${visible === 1 ? 'spot' : 'spots'} ${query || category !== 'all' ? 'found' : 'to explore'}`;
  if (empty) empty.hidden = visible !== 0;
}

if (controls && search && count && empty && clear && cards.length) {
  controls.hidden = false;
  search.addEventListener('input', updateResults);
  // WebKit's native search clear button may dispatch `search` as well as input.
  search.addEventListener('search', updateResults);
  for (const filter of filters) {
    filter.addEventListener('click', () => {
      category = filter.dataset.filter ?? 'all';
      updateResults();
    });
  }
  clear.addEventListener('click', () => {
    search.value = '';
    category = 'all';
    updateResults();
    search.focus();
  });
  // A same-document anchor must remain reachable even after filtering.
  const revealHashTarget = () => {
    let id: string;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.matches('[data-spot]') && target.hidden) {
      category = 'all';
      search.value = '';
      updateResults();
      target.scrollIntoView();
    }
    if (target instanceof HTMLDetailsElement) target.open = true;
  };
  window.addEventListener('hashchange', revealHashTarget);
  // Respect browser-restored search values while preserving deep links.
  window.addEventListener('pageshow', () => { updateResults(); revealHashTarget(); });
  updateResults();
  revealHashTarget();
}

// Clicking an already-current hash does not fire hashchange. Open the credits
// explicitly so the footer link also works after their disclosure is closed.
const credits = document.querySelector<HTMLDetailsElement>('#credits');
const creditsLink = document.querySelector<HTMLAnchorElement>('.footer-bottom a[href="#credits"]');
if (credits && creditsLink) {
  const syncCreditsState = () => creditsLink.setAttribute('aria-expanded', String(credits.open));
  syncCreditsState();
  credits.addEventListener('toggle', syncCreditsState);
  creditsLink.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // Native fragment navigation would take focus back from the summary.
    event.preventDefault();
    if (window.location.hash !== '#credits') window.history.pushState(null, '', '#credits');
    credits.open = true;
    syncCreditsState();
    credits.querySelector('summary')?.focus({ preventScroll: true });
    credits.scrollIntoView({ block: 'start' });
  });
}

// Pointer-only press feedback: keyboard actions remain instant and motion-free.
for (const element of document.querySelectorAll<HTMLElement>('.pressable:not([data-static])')) {
  element.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    element.dataset.pressed = 'true';
  });
  const release = () => { delete element.dataset.pressed; };
  element.addEventListener('pointerleave', release);
  element.addEventListener('pointercancel', release);
  element.addEventListener('blur', release);
  window.addEventListener('pointerup', release);
  window.addEventListener('blur', release);
}
