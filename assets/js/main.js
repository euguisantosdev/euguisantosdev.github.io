/* Portfólio — interações leves, sem dependências. O site funciona sem JavaScript;
   aqui entram apenas: menu mobile, destaque do link ativo, revelar ao rolar,
   brilho nos cards e o botão "Copiar e-mail". */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ano no rodapé */
  var year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Cabeçalho: borda ao rolar */
  var header = doc.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });


  /* Barra de progresso de leitura */
  var bar = doc.querySelector('.progress span');
  if (bar) {
    var ticking = false;
    var update = function () {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* Hero: o quadro de incidente roda uma única vez (estado final já está no HTML) */
  var board = doc.getElementById('board');
  if (board && !reduceMotion) {
    var lines = Array.prototype.slice.call(board.querySelectorAll('.board-log li'));
    var steps = Array.prototype.slice.call(board.querySelectorAll('.board-steps i'));
    var chip = doc.getElementById('board-chip');
    var chipText = doc.getElementById('board-chip-text');
    steps.forEach(function (s) { s.classList.remove('on'); });
    if (chip) chip.setAttribute('data-state', 'open');
    if (chipText) chipText.textContent = 'Investigando';
    board.classList.add('is-playing');
    lines.forEach(function (li, i) {
      window.setTimeout(function () {
        li.classList.add('is-in');
        if (i >= 1 && i <= 5 && steps[i - 1]) steps[i - 1].classList.add('on');
        if (i === lines.length - 1) {
          if (chip) chip.setAttribute('data-state', 'done');
          if (chipText) chipText.textContent = 'Resolvido';
        }
      }, 700 + i * 650);
    });
  } else if (board) {
    board.querySelectorAll('.board-log li').forEach(function (li) { li.classList.add('is-in'); });
  }

  /* Indicadores: contagem ao entrar na tela */
  var counters = Array.prototype.slice.call(doc.querySelectorAll('.count'));
  function fmt(v, dec, prefix) {
    return (prefix || '') + v.toFixed(dec).replace('.', ',');
  }
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        co.unobserve(entry.target);
        var el = entry.target;
        var to = parseFloat(el.getAttribute('data-to'));
        var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        var prefix = el.getAttribute('data-prefix') || '';
        var t0 = null, dur = 1500;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(to * eased, dec, prefix);
          if (p < 1) window.requestAnimationFrame(step); else el.textContent = fmt(to, dec, prefix);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      el.textContent = fmt(0, dec, el.getAttribute('data-prefix') || '');
      co.observe(el);
    });
  }

  /* Menu mobile */
  var toggle = doc.querySelector('.nav-toggle');
  var menu = doc.getElementById('menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    doc.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* Revelar ao rolar (escalonado dentro do mesmo grupo) */
  var revealEls = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      revealEls.forEach(function (el) {
        var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) {
          return c.classList.contains('reveal');
        }) : [el];
        var idx = Math.max(0, siblings.indexOf(el));
        el.style.setProperty('--d', Math.min(idx, 5) * 70 + 'ms');
        io.observe(el);
      });
    }
  }

  /* Link ativo no menu conforme a seção visível */
  var links = Array.prototype.slice.call(doc.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)'));
  var sections = links
    .map(function (a) { return doc.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (a) {
          var active = a.getAttribute('href') === id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* Brilho que segue o cursor nos cards (somente mouse) */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    doc.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* Copiar e-mail */
  var copyBtn = doc.getElementById('copy-email');
  var copyStatus = doc.getElementById('copy-status');
  if (copyBtn) {
    var label = copyBtn.querySelector('.copy-label');
    var timer;

    function done(ok) {
      var msg = ok ? 'E-mail copiado' : 'Não foi possível copiar. O endereço está logo abaixo.';
      if (label) label.textContent = ok ? 'Copiado!' : 'Copiar e-mail';
      copyBtn.classList.toggle('is-copied', ok);
      if (copyStatus) copyStatus.textContent = msg;
      clearTimeout(timer);
      timer = setTimeout(function () {
        copyBtn.classList.remove('is-copied');
        if (label) label.textContent = 'Copiar e-mail';
        if (copyStatus) copyStatus.textContent = '';
      }, 2200);
    }

    function fallbackCopy(text) {
      var ta = doc.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = doc.execCommand('copy'); } catch (err) { ok = false; }
      doc.body.removeChild(ta);
      return ok;
    }

    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email') || '';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(fallbackCopy(email)); });
      } else {
        done(fallbackCopy(email));
      }
    });
  }
})();
