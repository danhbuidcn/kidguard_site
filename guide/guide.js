// Builds the left table of contents from <div class="part"> + <section id><h2>, highlights the section being read,
// and opens/closes the menu on small screens. Shared by parent.html and child.html.
(function () {
  const nav = document.getElementById('toc');
  let html = '';
  document.querySelectorAll('.content > .part, .content > section[id]').forEach(el => {
    if (el.classList.contains('part')) html += `<p>${el.querySelector('h1').textContent}</p>`;
    else html += `<a href="#${el.id}">${el.querySelector('h2').textContent}</a>`;
  });
  nav.innerHTML = html;

  const links = [...nav.querySelectorAll('a')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('active'));
      const a = byId[e.target.id];
      if (a) { a.classList.add('active'); a.scrollIntoView({ block: 'nearest' }); }
    });
  }, { rootMargin: '0px 0px -70% 0px' });
  document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

  const btn = document.querySelector('.menu-btn');
  btn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') document.body.classList.remove('menu-open'); });
})();
