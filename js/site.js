const navWrap = document.querySelector('.site-nav-wrap');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (navWrap && !reduceMotion.matches) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        navWrap.style.transform = y > lastY && y > 80 ? 'translateY(-120%)' : 'translateY(0)';
        lastY = y;
    }, { passive: true });
}
