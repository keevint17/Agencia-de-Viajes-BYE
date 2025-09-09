// --- Selección de elementos ---
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalImg = document.getElementById('modal-img');
const modalInfo = document.getElementById('modal-info');
const closeBtn = modal ? modal.querySelector('.close') : null;
const body = document.body;

let lastFocused = null;
let keydownHandler = null;

// --- Utilidades ---
function setCardBackgrounds() {
  cards.forEach((card) => {
    const img = card.dataset.img;
    if (img) {
      card.style.backgroundImage = `url('${img}')`;
    }
  });
}

function trapFocusWithinModal() {
  const focusables = modal.querySelectorAll(
    'button, [href], input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  keydownHandler = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === 'Tab' && focusables.length) {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', keydownHandler);

  // Enfocar el botón de cierre (o el primero disponible)
  (closeBtn || first)?.focus();
}

function openModalFromCard(card) {
  if (!modal) return;

  lastFocused = document.activeElement;

  const destino = card.dataset.destino || '';
  const info = card.dataset.info || '';
  const img = card.dataset.img || '';

  modalTitle.textContent = destino;
  modalInfo.textContent = info;
  modalImg.src = img;
  modalImg.alt = destino ? `Imagen del destino ${destino}` : 'Imagen del destino';

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  body.classList.add('modal-open');

  trapFocusWithinModal();
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  body.classList.remove('modal-open');

  if (keydownHandler) {
    document.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }

  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}

// --- Eventos de tarjetas ---
cards.forEach((card) => {
  // Click abre modal
  card.addEventListener('click', () => openModalFromCard(card));

  // Accesibilidad: Enter o Space también abren
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModalFromCard(card);
    }
  });
});

// --- Eventos del modal ---
if (closeBtn) closeBtn.addEventListener('click', closeModal);

if (modal) {
  // Cerrar al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// --- Inicialización ---
setCardBackgrounds();

// --- Formulario ---
const form = document.getElementById('contacto-form');
const statusEl = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpia estado previo
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      if (statusEl) {
        statusEl.textContent = 'Por favor, completa los campos correctamente.';
        statusEl.classList.add('error');
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }
      if (statusEl) {
        statusEl.textContent = 'Enviando...';
      }

      // Simula envío asincrónico
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (statusEl) {
        statusEl.textContent = 'Mensaje enviado correctamente. ¡Gracias por contactarnos!';
        statusEl.classList.add('success');
      }

      form.reset();
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = 'Ocurrió un error. Intenta nuevamente más tarde.';
        statusEl.classList.add('error');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}