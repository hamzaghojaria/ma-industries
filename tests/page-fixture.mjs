// Minimal DOM fixture for interaction tests; it never opens links or sends messages.
export function createPageFixture() {
  const elements = new Map();
  const openedLinks = [];
  class Element {
    constructor(id = '') {
      this.id = id; this.dataset = {}; this.attributes = {}; this.children = [];
      this.listeners = {}; this.value = ''; this.open = false; this.scrollLeft = 0;
      const classes = new Set();
      this.classList = {
        add: name => classes.add(name), remove: name => classes.delete(name),
        contains: name => classes.has(name),
        toggle(name, force) { const add = force ?? !classes.has(name); if (add) classes.add(name); else classes.delete(name); return add; }
      };
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    append(...nodes) { for (const node of nodes) this.children.push(...(node.fragment ? node.children : [node])); }
    replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
    addEventListener(type, callback) { (this.listeners[type] ??= []).push(callback); }
    dispatch(type, event = {}) { for (const callback of this.listeners[type] ?? []) callback({ target: this, preventDefault() {}, ...event }); }
    querySelector(selector) {
      if (selector === 'small') return this.badge;
      if (selector === '.eyebrow') return this.eyebrow;
      if (selector === '[aria-current]') return this.children.find(child => child.attributes['aria-current']);
      return null;
    }
    querySelectorAll() { return this.links ?? []; }
    closest(selector) { return this.matches(selector) ? this : null; }
    matches(selector) {
      return (selector === 'button[data-page]' && this.dataset.page !== undefined) ||
        (selector === '[data-paper-id]' && this.dataset.paperId !== undefined) ||
        (selector === '[data-choose-paper]' && this.dataset.choosePaper !== undefined) ||
        (selector === '[data-reset-search]' && this.resetSearch);
    }
    focus() { this.focused = true; }
    scrollIntoView() { this.scrolled = true; }
    showModal() { this.open = true; }
    close() { this.open = false; }
    getBoundingClientRect() { return { left: 10, right: 500, top: 10, bottom: 500 }; }
    click() { if (this.href) openedLinks.push(this.href); else this.dispatch('click'); }
  }
  function get(id) { if (!elements.has(id)) elements.set(id, new Element(id)); return elements.get(id); }
  const filters = ['all', 'packaging', 'boards', 'creative', 'wrapping', 'everyday', 'office', 'labels', 'specialty'].map(category => {
    const button = get('filter-' + category); button.dataset.filter = category; button.badge = new Element(); return button;
  });
  const categoryCards = filters.slice(1).map(button => {
    const card = new Element(); card.dataset.categoryLink = button.dataset.filter; card.eyebrow = new Element(); return card;
  });
  const navigation = get('site-navigation');
  navigation.links = ['categories', 'collection', 'approach', 'enquiry'].map(id => {
    const link = new Element(); link.setAttribute('href', '#' + id); return link;
  });
  const values = new Map([['name', 'Test visitor'], ['email', 'visitor@example.com'], ['paper', 'Kraft paper'], ['quantity', '500 kg'], ['details', 'Carry bags']]);
  get('sort').value = 'collection';
  const document = {
    getElementById: get,
    createElement: () => new Element(),
    createDocumentFragment: () => Object.assign(new Element(), { fragment: true }),
    querySelector(selector) {
      const ids = { header: 'header', '.menu': 'menu', '.close': 'close', '.hero-foot span': 'hero-count', '.art-tag b': 'art-count' };
      return get(ids[selector] ?? selector);
    },
    querySelectorAll(selector) {
      if (selector === '[data-filter]') return filters;
      if (selector === '.category-card[data-category-link]') return categoryCards;
      return [];
    },
    listeners: {},
    addEventListener(type, callback) { (this.listeners[type] ??= []).push(callback); }
  };
  const location = { search: '', hash: '', href: '' };
  const window = {
    scrollY: 0, listeners: {},
    addEventListener(type, callback) { (this.listeners[type] ??= []).push(callback); },
    matchMedia: () => ({ matches: true, addEventListener() {} }),
    requestAnimationFrame: callback => callback(),
    getSelection: () => ({ toString: () => '' })
  };
  return {
    get, document, window, location, openedLinks, filters, values, Element,
    globals: {
      document, window, location, URLSearchParams, Date,
      Option: class { constructor(label, value) { this.textContent = label; this.value = value; } },
      FormData: class { has(key) { return values.has(key); } get(key) { return values.get(key); } }
    }
  };
}
