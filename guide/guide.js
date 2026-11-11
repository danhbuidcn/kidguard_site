// Builds the left table of contents from <div class="part"> + <section id><h2> (parts fold open/closed), highlights the section being read,
// and opens/closes the menu on small screens. Shared by parent.html and child.html.
(function () {
  const nav = document.getElementById('toc');
  // Each big part is a button that opens/closes its list of sections. All closed by default.
  let html = '', open = false;
  document.querySelectorAll('.content > .part, .content > section[id]').forEach(el => {
    if (el.classList.contains('part')) {
      if (open) html += '</div>';
      html += `<button type="button" class="grp">${el.querySelector('h1').textContent}</button><div class="grp-items">`;
      open = true;
    } else html += `<a href="#${el.id}">${el.querySelector('h2').textContent}</a>`;
  });
  nav.innerHTML = html + (open ? '</div>' : '');
  const openGroupOf = a => { const g = a && a.closest('.grp-items'); if (g) g.previousElementSibling.classList.add('open'); };
  nav.addEventListener('click', e => { if (e.target.classList.contains('grp')) e.target.classList.toggle('open'); });

  const links = [...nav.querySelectorAll('a')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('active'));
      nav.querySelectorAll('.grp.active').forEach(b => b.classList.remove('active'));
      const a = byId[e.target.id];
      if (!a) return;
      a.classList.add('active');
      const g = a.closest('.grp-items');
      if (g) g.previousElementSibling.classList.add('active'); // marks the part even while it is closed
      if (a.offsetParent) a.scrollIntoView({ block: 'nearest' });
    });
  }, { rootMargin: '0px 0px -70% 0px' });
  document.querySelectorAll('section[id]').forEach(s => spy.observe(s));
  // Opened from a link like parent.html#group → open that part so the section shows in the menu.
  const openFromHash = () => openGroupOf(byId[location.hash.slice(1)]);
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  const btn = document.querySelector('.menu-btn');
  btn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') document.body.classList.remove('menu-open'); });
})();
