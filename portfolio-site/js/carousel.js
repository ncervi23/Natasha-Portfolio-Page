/* Natasha Cervi — Portfolio
   Case-study carousel (Work page): opens a gallery over the page when a
   VIEW CASE STUDY link is clicked. No dependencies.
   Slides come from the hidden .carousel-source lists in work.html; images
   that fail to load (e.g. not added yet) are skipped automatically. */
(function () {
  var carousel = document.getElementById('case-carousel');
  if (!carousel) return;

  var track = carousel.querySelector('.carousel-track');
  var emptyMsg = carousel.querySelector('.carousel-empty');
  var titleEl = carousel.querySelector('.carousel-title');
  var countEl = carousel.querySelector('.carousel-count');
  var source = carousel.nextElementSibling; /* .carousel-source */
  var index = 0;
  var total = 0;
  var lastFocus = null;

  function render() {
    if (!total) return;
    if (index < 0) index = total - 1;       /* wrap around */
    if (index >= total) index = 0;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    countEl.textContent = (index + 1) + ' / ' + total;
  }

  function pruneSlide(img) {
    /* drop slides whose image is missing so gaps never appear */
    if (!img.parentNode) return;
    img.parentNode.removeChild(img);
    total = track.children.length;
    if (!total) {
      emptyMsg.hidden = false;
      countEl.textContent = '';
      return;
    }
    render();
  }

  function buildSlides(key) {
    var group = source.querySelector('[data-slides="' + key + '"]');
    if (!group) return false;
    track.innerHTML = '';
    emptyMsg.hidden = true;
    titleEl.textContent = group.getAttribute('data-title') || '';
    countEl.textContent = '';

    var defs = group.querySelectorAll('img');
    total = 0;
    Array.prototype.forEach.call(defs, function (def) {
      var img = document.createElement('img');
      img.className = 'carousel-slide';
      img.alt = def.alt || '';
      img.draggable = false;
      img.addEventListener('error', function () { pruneSlide(img); });
      img.addEventListener('load', function () {
        /* skip zero-byte/broken-but-loading images too */
        if (!img.naturalWidth) pruneSlide(img);
      });
      img.src = def.getAttribute('src');
      track.appendChild(img);
      total = track.children.length;
    });

    if (!total) { emptyMsg.hidden = false; return true; }
    return true;
  }

  function open(key) {
    if (!buildSlides(key)) return;
    index = 0;
    render();
    lastFocus = document.activeElement;
    carousel.hidden = false;
    carousel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('carousel-open');
    carousel.querySelector('.carousel-close').focus();
  }

  function close() {
    carousel.hidden = true;
    carousel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('carousel-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Wire the VIEW CASE STUDY links */
  Array.prototype.forEach.call(document.querySelectorAll('.case-link[data-carousel]'), function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open(link.getAttribute('data-carousel'));
    });
  });

  /* Controls */
  Array.prototype.forEach.call(carousel.querySelectorAll('[data-carousel-close]'), function (el) {
    el.addEventListener('click', close);
  });
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', function () { index--; render(); });
  carousel.querySelector('[data-carousel-next]').addEventListener('click', function () { index++; render(); });

  /* Keyboard: Esc closes, arrows navigate */
  document.addEventListener('keydown', function (e) {
    if (carousel.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') { index--; render(); }
    else if (e.key === 'ArrowRight') { index++; render(); }
  });
})();
