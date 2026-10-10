// A gentle, non-blocking explanation of the visitor's own motion preference.
(() => {
  const mobile = matchMedia('(max-width: 809px) and (hover: none) and (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'banu-motion-note-seen';
  let seen = false;
  let notice;
  try { seen = sessionStorage.getItem(key) === '1'; } catch (_) {}
  const dismiss = () => { notice?.remove(); notice = undefined; };
  const update = () => {
    if (!mobile.matches || !reduced.matches) { dismiss(); return; }
    if (seen || notice) return;
    seen = true;
    try { sessionStorage.setItem(key, '1'); } catch (_) {}
    notice = document.createElement('aside');
    notice.className = 'motion-note';
    notice.setAttribute('aria-labelledby', 'motion-note-title');
    notice.innerHTML = `<div class="motion-note-top"><span class="motion-note-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 8h10M4 12h16M4 16h7"/><circle cx="17" cy="8" r="2"/><circle cx="14" cy="16" r="2"/></svg></span><button class="motion-note-close" type="button" aria-label="Dismiss motion note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg></button></div><div role="status"><h2 id="motion-note-title">A little note on motion</h2><p>Your device has reduced motion turned on, so animations are paused.</p><p>Want to see them? You can turn off <strong>Reduce Motion</strong> in your device’s accessibility settings. Keeping it on is absolutely fine, too.</p></div><button class="motion-note-done" type="button">Got it</button>`;
    notice.querySelector('.motion-note-close').addEventListener('click', dismiss);
    notice.querySelector('.motion-note-done').addEventListener('click', dismiss);
    notice.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
    document.body.append(notice);
  };
  for (const query of [mobile, reduced]) {
    if (query.addEventListener) query.addEventListener('change', update);
    else query.addListener(update);
  }
  update();
})();
