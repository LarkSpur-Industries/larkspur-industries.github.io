const navWrap = document.querySelector('.site-nav-wrap');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Hide the sticky nav while scrolling down, reveal it on the way back up.
   Scroll events fire for sub-pixel momentum jitter too, so only react once the
   pointer has actually travelled far enough to read as a deliberate direction
   change; otherwise the bar flickers during iOS/trackpad inertial scrolling. */
if (navWrap && !reduceMotion.matches) {
    const DIRECTION_THRESHOLD = 8;
    const HIDE_AFTER = 80;

    let lastY = window.scrollY;
    let hidden = false;
    let ticking = false;

    const update = () => {
        ticking = false;
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;

        if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
        lastY = y;

        const shouldHide = delta > 0 && y > HIDE_AFTER;
        if (shouldHide === hidden) return;

        hidden = shouldHide;
        navWrap.style.transform = hidden ? 'translateY(-120%)' : 'translateY(0)';
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
    }, { passive: true });
}
