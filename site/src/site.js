window.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        width: 18,
        height: 18,
        'stroke-width': 2,
      },
    });
  }

  const lightbox = createLightbox();
  document.body.append(lightbox.root);

  document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lightbox.open(trigger.getAttribute('data-lightbox-src'), trigger.getAttribute('data-lightbox-alt') || 'Screenshot evidence');
    });
  });

  const popover = createMetaPopover();
  document.body.append(popover.root);

  document.querySelectorAll('[data-popover-title]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      popover.toggle(trigger);
    });
  });
});

function createLightbox() {
  const root = document.createElement('div');
  root.className = 'lightbox';
  root.hidden = true;
  root.innerHTML = `
    <div class="lightbox-backdrop" data-lightbox-close></div>
    <figure class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Screenshot evidence">
      <button class="lightbox-close" type="button" data-lightbox-close aria-label="Close screenshot">
        <i data-lucide="x"></i>
      </button>
      <img alt="">
      <figcaption></figcaption>
    </figure>
  `;

  const image = root.querySelector('img');
  const caption = root.querySelector('figcaption');

  function close() {
    root.hidden = true;
    image.removeAttribute('src');
    document.body.classList.remove('has-lightbox');
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-lightbox-close]')) close();
  });

  window.addEventListener('keydown', (event) => {
    if (!root.hidden && event.key === 'Escape') close();
  });

  return {
    root,
    open(src, alt) {
      image.src = src;
      image.alt = alt;
      caption.textContent = alt;
      root.hidden = false;
      document.body.classList.add('has-lightbox');
      if (window.lucide) window.lucide.createIcons();
      root.querySelector('.lightbox-close').focus();
    },
  };
}

function createMetaPopover() {
  const root = document.createElement('aside');
  root.className = 'meta-popover';
  root.hidden = true;
  root.innerHTML = '<h3></h3><ul></ul>';

  const title = root.querySelector('h3');
  const list = root.querySelector('ul');
  let activeTrigger = null;

  function close() {
    root.hidden = true;
    activeTrigger?.setAttribute('aria-expanded', 'false');
    activeTrigger = null;
  }

  function open(trigger) {
    activeTrigger?.setAttribute('aria-expanded', 'false');
    activeTrigger = trigger;
    activeTrigger.setAttribute('aria-expanded', 'true');
    title.textContent = trigger.getAttribute('data-popover-title') || 'Chip details';
    list.replaceChildren(...(trigger.getAttribute('data-popover-content') || '')
      .split('||')
      .filter(Boolean)
      .map((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      }));

    const rect = trigger.getBoundingClientRect();
    root.hidden = false;
    const popoverRect = root.getBoundingClientRect();
    const left = Math.min(window.innerWidth - popoverRect.width - 16, Math.max(16, rect.left));
    const top = Math.min(window.innerHeight - popoverRect.height - 16, rect.bottom + 8);
    root.style.left = `${left}px`;
    root.style.top = `${top}px`;
  }

  document.addEventListener('click', (event) => {
    if (!root.hidden && !root.contains(event.target) && event.target !== activeTrigger) close();
  });

  window.addEventListener('keydown', (event) => {
    if (!root.hidden && event.key === 'Escape') close();
  });

  return {
    root,
    toggle(trigger) {
      if (activeTrigger === trigger && !root.hidden) close();
      else open(trigger);
    },
  };
}
