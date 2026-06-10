/* FlowDaptor — mobile nav */
(function () {
  'use strict';

  function init() {
    var nav = document.querySelector('.fd-nav');
    if (!nav) return;

    var navLinks = nav.querySelector('.fd-nav-links');
    var navCta   = nav.querySelector('.fd-nav-cta');

    /* ── Hamburger button ─────────────────────────────────── */
    var btn = document.createElement('button');
    btn.className = 'fd-nav-hamburger';
    btn.setAttribute('aria-label', 'Open navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'fd-mobile-nav');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    /* ── Build drawer ──────────────────────────────────────── */
    var drawer = document.createElement('div');
    drawer.className = 'fd-mobile-nav';
    drawer.id = 'fd-mobile-nav';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Navigation menu');
    drawer.setAttribute('aria-hidden', 'true');

    var overlay = document.createElement('div');
    overlay.className = 'fd-mobile-nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    var panel = document.createElement('div');
    panel.className = 'fd-mobile-nav-panel';

    /* Close ×  button */
    var closeBtn = document.createElement('button');
    closeBtn.className = 'fd-mobile-nav-close';
    closeBtn.setAttribute('aria-label', 'Close navigation menu');
    closeBtn.innerHTML = '&#215;';

    /* Logo header */
    var logoEl = nav.querySelector('.fd-logo');
    var header = document.createElement('div');
    header.className = 'fd-mobile-nav-header';
    if (logoEl) header.appendChild(logoEl.cloneNode(true));

    /* Nav links — Home first, then desktop links */
    var list = document.createElement('ul');
    list.className = 'fd-mobile-nav-links';
    list.setAttribute('role', 'list');

    var homeLi = document.createElement('li');
    var homeA = document.createElement('a');
    homeA.href = logoEl ? logoEl.getAttribute('href') : '/';
    homeA.textContent = 'Home';
    homeLi.appendChild(homeA);
    list.appendChild(homeLi);

    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(function (a) {
        var li = document.createElement('li');
        var clone = a.cloneNode(true);
        li.appendChild(clone);
        list.appendChild(li);
      });
    }

    /* Clone CTA */
    var ctaClone = null;
    if (navCta) {
      ctaClone = navCta.cloneNode(true);
      ctaClone.className = 'fd-mobile-nav-cta';
    }

    panel.appendChild(closeBtn);
    panel.appendChild(header);
    panel.appendChild(list);
    if (ctaClone) panel.appendChild(ctaClone);
    drawer.appendChild(overlay);
    drawer.appendChild(panel);
    document.body.appendChild(drawer);

    /* ── Open / close ─────────────────────────────────────── */
    function open() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      /* Focus first focusable after slide begins */
      setTimeout(function () { closeBtn.focus(); }, 50);
    }

    function close() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      btn.focus();
    }

    /* ── Tab trap ─────────────────────────────────────────── */
    function focusables() {
      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      var els   = focusables();
      var first = els[0];
      var last  = els[els.length - 1];
      if (!first) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* ── Wire events ──────────────────────────────────────── */
    btn.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);

    /* Close when any link inside is activated */
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
