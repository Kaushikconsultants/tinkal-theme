/* Ombre Bliss — product modules. Vanilla, no deps, Dawn-safe. */
(function () {
  'use strict';

  function initStrip(root) {
    if (root.dataset.obInit === '1') return;
    root.dataset.obInit = '1';

    var dataEl = root.querySelector('[data-ob-strip-data]');
    if (!dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var tabsWrap = root.querySelector('.ob-tabs');
    var tabs  = Array.prototype.slice.call(root.querySelectorAll('[data-ob-stage]'));
    var dots  = Array.prototype.slice.call(root.querySelectorAll('[data-ob-note]'));
    var nameEl = root.querySelector('[data-ob-name]');
    var descEl = root.querySelector('[data-ob-desc]');
    var keys = ['top', 'mid', 'base'];
    var stage = 0, picked = null;

    function paint() {
      var key = keys[stage];
      tabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === stage ? 'true' : 'false'); });
      if (tabsWrap) tabsWrap.style.setProperty('--ob-sx', (stage * 100) + '%');

      dots.forEach(function (d) {
        var lit = d.getAttribute('data-ob-group') === key;
        d.classList.toggle('lit', lit);
        d.setAttribute('aria-pressed', picked === d.getAttribute('data-ob-note') ? 'true' : 'false');
      });

      if (picked) {
        if (nameEl) nameEl.textContent = picked;
        if (descEl) descEl.textContent = descEl.getAttribute('data-note-desc') || '';
      } else {
        if (nameEl) nameEl.textContent = data.notes[key] || '';
        if (descEl) descEl.textContent = data.copy[key] || '';
      }
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        stage = parseInt(t.getAttribute('data-ob-stage'), 10) || 0;
        picked = null;
        paint();
      });
    });

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var note = d.getAttribute('data-ob-note');
        var grp  = d.getAttribute('data-ob-group');
        var idx  = keys.indexOf(grp);
        if (idx !== stage) { stage = idx; picked = note; }
        else { picked = (picked === note) ? null : note; }
        paint();
      });
    });

    paint();
  }

  function initAll(scope) {
    (scope || document).querySelectorAll('[data-ob-strip]').forEach(initStrip);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(document); });
  } else {
    initAll(document);
  }

  /* Shopify theme editor */
  document.addEventListener('shopify:section:load',   function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:select', function (e) { initAll(e.target); });
  document.addEventListener('shopify:block:select',   function (e) { initAll(e.target); });
})();
