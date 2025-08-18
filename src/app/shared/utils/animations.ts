
/**
 * Detecta cuando un elemento entra en el viewport mediante IntersectionObserver
 * y aplica una animación de entrada (fade-in + slide-in).
 *
 * @param element - Elemento HTML que será observado y animado al entrar en pantalla.
 *
 * Funcionamiento:
 * - Inicialmente el elemento debería tener clases de estado oculto
 *   (ej: `opacity-0`, `-translate-x-10`).
 * - Cuando el elemento es visible en el viewport (threshold >= 20%),
 *   se reemplazan esas clases por `opacity-100` y `translate-x-0`
 *   para hacerlo visible con una transición suave.
 */
export function animateOnScroll(element: HTMLElement) {
  // SSR o navegador sin la API
  if (typeof window === 'undefined' || typeof (window as any).IntersectionObserver === 'undefined') {
    element.classList.add('opacity-100', 'translate-x-0');
    element.classList.remove('opacity-0', '-translate-x-10');
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-x-0');
        entry.target.classList.remove('opacity-0', '-translate-x-10');
        obs.unobserve(entry.target as Element);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(element);
}