const SLOT_COUNT = 10;
const MAIN_SLOT_COUNT = 6;
const EMPTY_LABEL = 'HUEVO';

let juego = '3ds';
let canal = '';

document.addEventListener('DOMContentLoaded', initTextOverlay);

function initTextOverlay() {
  const params = new URLSearchParams(window.location.search);
	canal = (params.get('canal') || '').trim().toLowerCase();
	juego = (params.get('juego') || '3ds').trim().toLowerCase();

if (!['3ds', 'switch'].includes(juego)) {
  juego = '3ds';
}

  if (!canal) {
    console.warn('[TextOverlay] Falta el parámetro ?canal=');
    return;
  }

  applyGameClass();
  buildTextSlots();
  renderTextSlots();

  // Refresca periódicamente por si el otro widget actualizó localStorage
  setInterval(renderTextSlots, 500);
}

function applyGameClass() {
  document.body.classList.remove('game-3ds', 'game-switch');
  document.body.classList.add(`game-${juego}`);
}

function buildTextSlots() {
  const container = document.getElementById('textOverlay');
  container.innerHTML = '';

  for (let i = 0; i < MAIN_SLOT_COUNT; i++) {
    const nick = document.createElement('div');
    nick.id = `textNick${i + 1}`;
    nick.className = `text-nick text-slot-${i + 1}`;
    nick.textContent = EMPTY_LABEL;
    container.appendChild(nick);
  }
}

function renderTextSlots() {
  const team = loadTeam();

  for (let i = 0; i < MAIN_SLOT_COUNT; i++) {
    const el = document.getElementById(`textNick${i + 1}`);
    if (!el) continue;

    const slot = team[i];
    el.textContent = slot?.nick?.trim() || EMPTY_LABEL;
  }
}

function loadTeam() {
  try {
    const raw = localStorage.getItem(`pokemon-overlay:${canal}:team`);
    const parsed = JSON.parse(raw || 'null');

    if (Array.isArray(parsed) && parsed.length === SLOT_COUNT) {
      return parsed;
    }
  } catch (error) {
    console.warn('[TextOverlay] No se pudo leer localStorage:', error);
  }

  return Array.from({ length: SLOT_COUNT }, () => null);
}