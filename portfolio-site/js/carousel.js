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
    var slide = img.parentNode;
    if (!slide) return;
    slide.parentNode.removeChild(slide);
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
      var slide = document.createElement('div');
      slide.className = 'carousel-slide';
      var img = document.createElement('img');
      img.alt = def.alt || '';
      img.draggable = false;
      img.addEventListener('error', function () { pruneSlide(img); });
      img.addEventListener('load', function () {
        /* skip zero-byte/broken-but-loading images too */
        if (!img.naturalWidth) pruneSlide(img);
      });
      img.src = def.getAttribute('src');
      slide.appendChild(img);

      /* Optional per-slide caption: data-caption-label / -title / -text on the
         source <img> in work.html become explainer text under the picture */
      var capLabel = def.getAttribute('data-caption-label');
      var capTitle = def.getAttribute('data-caption-title');
      var capText = def.getAttribute('data-caption-text');
      if (capLabel || capTitle || capText) {
        slide.classList.add('carousel-slide--caption');
        var caption = document.createElement('div');
        caption.className = 'slide-caption';
        if (capLabel) {
          var lbl = document.createElement('p');
          lbl.className = 'slide-caption-label';
          lbl.textContent = capLabel;
          caption.appendChild(lbl);
        }
        if (capTitle) {
          var ttl = document.createElement('p');
          ttl.className = 'slide-caption-title';
          ttl.textContent = capTitle;
          caption.appendChild(ttl);
        }
        if (capText) {
          var txt = document.createElement('p');
          txt.className = 'slide-caption-text';
          txt.textContent = capText;
          caption.appendChild(txt);
        }
        slide.appendChild(caption);
      }

      track.appendChild(slide);
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

  /* Wire the VIEW CASE STUDY links AND the clickable project hero images */
  Array.prototype.forEach.call(document.querySelectorAll('.case-link[data-carousel], .project-media[data-carousel]'), function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      open(el.getAttribute('data-carousel'));
    });
    /* hero images are divs, not links — add keyboard support (Enter / Space) */
    if (el.tagName !== 'A') {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(el.getAttribute('data-carousel'));
        }
      });
    }
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

  /* Touch swipe (mobile): drag the track with your finger, release to change
     slide. Vertical drags still scroll the page normally. */
  var viewport = carousel.querySelector('.carousel-viewport');
  var touchStartX = 0, touchStartY = 0, touchCurX = 0;
  var touching = false, touchHorizontal = null;

  viewport.addEventListener('touchstart', function (e) {
    if (!total) return;
    touching = true;
    touchHorizontal = null;
    var t = e.touches[0];
    touchStartX = touchCurX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    if (!touching) return;
    var t = e.touches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    /* decide once per gesture whether it's a horizontal swipe */
    if (touchHorizontal === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      touchHorizontal = Math.abs(dx) > Math.abs(dy);
    }
    if (!touchHorizontal) return;
    touchCurX = t.clientX;
    /* let the track follow the finger */
    track.style.transition = 'none';
    track.style.transform = 'translateX(calc(-' + (index * 100) + '% + ' + dx + 'px))';
    if (e.cancelable) e.preventDefault(); /* keep the page from scrolling sideways under the swipe */
  }, { passive: false });

  function endTouch() {
    if (!touching) return;
    touching = false;
    track.style.transition = '';
    var dx = touchCurX - touchStartX;
    var width = viewport.clientWidth || 1;
    /* commit the swipe if it was long enough (15% of width or 40px) */
    if (touchHorizontal && Math.abs(dx) > Math.max(40, width * 0.15)) {
      index += (dx < 0) ? 1 : -1;
    }
    render();
  }
  viewport.addEventListener('touchend', endTouch);
  viewport.addEventListener('touchcancel', endTouch);
})();
