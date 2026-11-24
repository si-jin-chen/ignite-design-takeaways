let content;
let slides = [];
let currentSlide = -1;
const $ = selector => document.querySelector(selector);
function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function report(message) { $('#status').textContent = message; }
function image(source, alt, className = '') {
  const img = node('img', className);
  img.src = source.startsWith('/media/') ? './assets/' + source.slice('/media/'.length) : source;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  return img;
}
function heading(section) {
  const header = node('div', 'section-header');
  const text = node('div');
  text.append(node('p', 'eyebrow', section.eyebrow), node('h2', '', section.title));
  header.append(text);
  return header;
}
function takeaway(section, parent) {
  if (!section.takeaway) return;
  const aside = node('aside', 'takeaway');
  aside.append(node('span', '', section.takeawayLabel), node('p', '', section.takeaway));
  parent.append(aside);
}
function cards(items, className = '') {
  const list = node('div', 'cards ' + className);
  for (const item of items) {
    const card = node('div', 'card');
    card.append(node('h3', '', item.title), node('p', '', item.body));
    list.append(card);
  }
  return list;
}
function illustration(kind) {
  const art = node('div', 'illustration ' + kind);
  art.setAttribute('aria-hidden', 'true');
  if (kind === 'choose') art.append(node('i'), node('i'), node('i'));
  if (kind === 'adopt') art.append(node('i'), node('span'), node('i'));
  if (kind === 'trust') art.append(node('i'), node('i'), node('span', '', '✓'));
  return art;
}
function render() {
  document.title = content.title + ' | Ignite takeaways';
  const main = $('#readout');
  main.replaceChildren();
  const hero = node('section', 'hero');
  hero.id = 'top';
  hero.append(node('div', 'paper-lens'));
  const heroText = node('div', 'hero-text');
  heroText.append(node('p', 'eyebrow', content.subtitle), node('h1', '', content.title), node('p', 'intro', content.introduction));
  hero.append(heroText);
  main.append(hero);
  for (const section of content.sections) {
    const article = node('section', 'section ' + section.kind);
    article.id = section.id;
    article.append(heading(section));
    switch (section.kind) {
      case 'gallery': {
        const grid = node('div', 'gallery-grid');
        for (const photo of section.photos) {
          const figure = node('figure');
          figure.append(image(photo.src, photo.alt), node('figcaption', '', photo.caption));
          grid.append(figure);
        }
        article.append(grid);
        break;
      }
      case 'signals':
        article.append(node('p', 'description', section.description), cards(section.items));
        break;
      case 'choices':
        article.append(node('p', 'statement', section.statement), cards(section.items));
        break;
      case 'terms': {
        const composition = node('div', 'terms-composition');
        const list = node('ul', 'terms-list');
        section.terms.forEach(term => list.append(node('li', '', term)));
        const question = node('div', 'naming-question');
        question.append(node('p', '', section.question), image('/media/laugh.png', 'Face with tears of joy'));
        composition.append(list, question); article.append(composition);
        break;
      }
      case 'guidance': {
        article.append(node('p', 'idea-label', section.ideaLabel), node('div', 'goal', section.goal));
        const routes = node('div', 'routes');
        for (const [index, route] of section.routes.entries()) {
          const card = node('div', 'route card');
          card.append(node('p', 'eyebrow accent', route.label), node('h3', '', route.title));
          const steps = node('ul', 'plain-list');
          route.steps.forEach(step => steps.append(node('li', '', step)));
          card.append(steps);
          if (index === 1) card.append(node('p', 'availability', section.availability));
          routes.append(card);
        }
        article.append(routes, node('p', 'outcome', section.outcome));
        break;
      }
      case 'surfaces': {
        const list = node('div', 'surface-list');
        for (const surface of section.surfaces) {
          const item = node('div', 'surface');
          item.append(image(surface.src, ''), node('h3', '', surface.label));
          if (surface.status) item.append(node('p', '', surface.status));
          list.append(item);
        }
        article.append(list);
        break;
      }
      case 'security': article.append(cards(section.items, 'two')); break;
      case 'loop': {
        const loop = node('div', 'loop-steps');
        section.steps.forEach((step, index) => {
          loop.append(node('div', '', step));
          if (index < section.steps.length - 1) loop.append(node('span', 'arrow', '→'));
        });
        const human = node('div', 'human-review');
        human.append(node('strong', '', section.review), node('p', '', section.feedback), node('span', '', '↻ ' + section.repeat));
        article.append(loop, human);
        break;
      }
      case 'synthesis': {
        const list = node('div', 'synthesis-grid');
        for (const [index, item] of section.items.entries()) {
          const column = node('div');
          column.append(illustration(['choose', 'adopt', 'trust'][index]), node('h3', '', item.title), node('p', '', item.body));
          list.append(column);
        }
        article.append(list);
        break;
      }
    }
    takeaway(section, article);
    main.append(article);
  }
}
function showSlide(index, updateHash = true) {
  const next = Math.max(0, Math.min(slides.length - 1, index));
  if (next === currentSlide) return;
  slides.forEach((slide, position) => { slide.hidden = position !== next; });
  currentSlide = next;
  $('#readout').scrollTop = 0;
  $('#previous-slide').disabled = next === 0;
  $('#next-slide').disabled = next === slides.length - 1;
  $('#slide-count').textContent = (next + 1) + ' / ' + slides.length;
  $('#slide-announcement').textContent = 'Slide ' + (next + 1) + ' of ' + slides.length + ': ' + slides[next].querySelector('h1, h2').textContent;
  if (updateHash) history.replaceState(null, '', '#' + slides[next].id);
}
function initializeSlides() {
  slides = Array.from($('#readout').children);
  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (index + 1) + ' of ' + slides.length + ': ' + slide.querySelector('h1, h2').textContent);
  });
  const initial = slides.findIndex(slide => slide.id === location.hash.slice(1));
  showSlide(initial < 0 ? 0 : initial, false);
  $('#previous-slide').addEventListener('click', () => showSlide(currentSlide - 1));
  $('#next-slide').addEventListener('click', () => showSlide(currentSlide + 1));
  window.addEventListener('hashchange', () => {
    const index = slides.findIndex(slide => slide.id === location.hash.slice(1));
    if (index >= 0) showSlide(index, false);
  });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    let index;
    switch (event.key) {
      case 'ArrowLeft': index = currentSlide - 1; break;
      case 'ArrowRight': index = currentSlide + 1; break;
      case 'Home': index = 0; break;
      case 'End': index = slides.length - 1; break;
      default: return;
    }
    event.preventDefault();
    showSlide(index);
  });
}
async function loadContent() {
  const response = await fetch('./content.json');
  if (!response.ok) throw new Error('The website content could not be loaded (HTTP ' + response.status + ').');
  content = await response.json();
  render();
  initializeSlides();
  $('#layout').hidden = false;
  report('');
}
loadContent().catch(error => {
  report('Unable to display the readout: ' + error.message);
  console.error(error);
});
