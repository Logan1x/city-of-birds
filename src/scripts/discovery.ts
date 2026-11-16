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

// One disclosure control. Without JavaScript the content and its anchor remain
// available; enhancement replaces that anchor with a native toggle button.
const credits = document.querySelector<HTMLElement>('#credits');
const creditsToggle = document.querySelector<HTMLButtonElement>('#credits-toggle');
const creditsFallback = document.querySelector<HTMLAnchorElement>('#credits-fallback');
if (credits && creditsToggle && creditsFallback) {
  const setCreditsExpanded = (expanded: boolean) => {
    credits.hidden = !expanded;
    creditsToggle.setAttribute('aria-expanded', String(expanded));
  };
  const hasCreditsHash = () => {
    try { return decodeURIComponent(window.location.hash.slice(1)) === 'credits'; } catch { return false; }
  };
  const revealCreditsFromHash = () => {
    if (!hasCreditsHash()) return;
    setCreditsExpanded(true);
    credits.scrollIntoView({ block: 'nearest' });
  };
  setCreditsExpanded(hasCreditsHash());
  creditsFallback.hidden = true;
  creditsToggle.hidden = false;
  creditsToggle.addEventListener('click', () => setCreditsExpanded(credits.hidden));
  window.addEventListener('hashchange', revealCreditsFromHash);
  window.addEventListener('pageshow', revealCreditsFromHash);
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
