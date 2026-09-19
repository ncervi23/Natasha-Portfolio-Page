/* Natasha Cervi — Portfolio
   "More of My Work" mobile carousel (Work page): on phones the auto-scroll
   marquee becomes a one-picture-at-a-time viewer — an arrow on each side of
   the picture pages through it, and tapping the picture shows the next one.
   Desktop keeps the seamless auto-scrolling marquee. No dependencies. */
(function () {
  var frame = document.querySelector('.more-work-frame');
  var strip = document.querySelector('.more-work-strip');
  if (!frame || !strip) return;

  var prevBtn = frame.querySelector('.gallery-prev');
  var nextBtn = frame.querySelector('.gallery-next');
  if (!prevBtn || !nextBtn) return;

  var mq = window.matchMedia('(max-width: 700px)');
  function mobile() { return mq.matches; }

  function atStart() { return strip.scrollLeft <= 4; }
  function atEnd() {
    return strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
  }

  /* Page one picture left/right; wrap around at the ends */
  function go(dir) {
    if (!mobile()) return; /* desktop keeps the auto-scroll marquee */
    if (dir > 0 && atEnd()) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (dir < 0 && atStart()) {
      strip.scrollTo({ left: strip.scrollWidth, behavior: 'smooth' });
    } else {
      strip.scrollBy({ left: dir * strip.clientWidth, behavior: 'smooth' });
    }
  }

  prevBtn.addEventListener('click', function () { go(-1); });
  nextBtn.addEventListener('click', function () { go(1); });

  /* Tapping the picture advances to the next one (mobile only) */
  Array.prototype.forEach.call(
    strip.querySelectorAll('.more-work-item img'),
    function (img) {
      img.draggable = false;
      img.addEventListener('click', function () { go(1); });
    }
  );
})();
