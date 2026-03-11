const SLOT_COUNT = 6;
const DEFAULT_COMMAND_PREFIX = 'poke';
const DEFAULT_DEATH_COMMAND = 'muertes';

const EMPTY_IMAGE = './img/egg.png';
const EMPTY_LABEL = 'HUEVO';

const CLEAR_COMMANDS = ['pokel', 'pokelimpiar'];

const ALIVE_EMOTIONS = ['Joyous', 'Happy', 'Normal'];
const DEAD_EMOTIONS = ['Dizzy', 'Crying', 'Normal'];

const portraitExistsCache = new Map();
const portraitChoiceCache = new Map();

const PMD_BASE_URL = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait';

const SHINY_FLAG_TOKENS = new Set(['-shiny', 'shiny']);
const MEGA_FLAG_TOKENS = new Set(['-mega', 'mega']);

let canal = '';
let commandPrefix = DEFAULT_COMMAND_PREFIX;
let deathCommand = DEFAULT_DEATH_COMMAND;

let team = Array.from({ length: SLOT_COUNT }, () => null);
let death = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
  buildSlots();

  const params = new URLSearchParams(window.location.search);

  canal = (params.get('canal') || '').trim().toLowerCase();
  const comandoParam = (params.get('comando') || '').trim().toLowerCase();
  const deathParam = (params.get('deathCommand') || '').trim().toLowerCase();

  if (comandoParam) commandPrefix = comandoParam;
  if (deathParam) deathCommand = deathParam;

  if (!canal) {
    showError('Falta el parámetro ?canal=. Ejemplo: ?canal=maikikii');
    return;
  }

  loadState();
  renderAll();
  connectToChat();
}

function buildSlots() {
  const teamContainer = document.getElementById('team');
  teamContainer.innerHTML = '';

  for (let i = 0; i < SLOT_COUNT; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.innerHTML = `
      <img
        id="pk${i + 1}"
        class="portrait egg"
        src="${EMPTY_IMAGE}"
        alt="Pokémon ${i + 1}"
      />
      <div id="nick${i + 1}" class="nick">${EMPTY_LABEL}</div>
    `;
    teamContainer.appendChild(slot);
  }
}

function connectToChat() {
  if (!window.ComfyJS) {
    showError('No se pudo cargar ComfyJS.');
    return;
  }

  ComfyJS.onCommand = async (user, command, message, flags, extra) => {
    const normalizedCommand = (command || '').toLowerCase();
    const channelFromEvent = normalizeChannel(extra?.channel);

    if (!flags?.broadcaster && !flags?.mod) return;
    if (channelFromEvent !== canal) return;

    if (isClearCommand(normalizedCommand)) {
      handleClearCommand(message);
      return;
    }

    const slotIndex = getCommands().indexOf(normalizedCommand);

    if (slotIndex !== -1) {
      await handlePokemonCommand(slotIndex, message);
      return;
    }

    if (normalizedCommand === deathCommand) {
      handleDeathCommand(message);
    }
  };

  ComfyJS.Init(canal);
  console.log(`[Overlay] Escuchando comandos en #${canal}`);
}

function getCommands() {
  return Array.from({ length: SLOT_COUNT }, (_, i) => `${commandPrefix}${i + 1}`);
}

function parsePokemonMessage(rawMessage) {
  const parts = (rawMessage || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const identifier = (parts.shift() || '').toLowerCase();

  const flags = {
    shiny: false,
    mega: false
  };

  const nicknameParts = [];

  for (const part of parts) {
    const normalized = part.toLowerCase();

    if (SHINY_FLAG_TOKENS.has(normalized)) {
      flags.shiny = true;
      continue;
    }

    if (MEGA_FLAG_TOKENS.has(normalized)) {
      flags.mega = true;
      continue;
    }

    nicknameParts.push(part);
  }

  return {
    identifier,
    nickname: nicknameParts.join(' ').trim(),
    flags
  };
}

function isClearCommand(command) {
  return CLEAR_COMMANDS.includes(command);
}

function handleClearCommand(rawMessage) {
  const message = (rawMessage || '').trim();

  // !pokel  -> limpia todo
  if (!message) {
    team = Array.from({ length: SLOT_COUNT }, () => null);
    saveState();
    renderAll();
    return;
  }

  // !pokel 1 3 5
  const indexes = [...new Set(
    message
      .split(/[\s,]+/)
      .map(value => parseInt(value, 10))
      .filter(value => !Number.isNaN(value) && value >= 1 && value <= SLOT_COUNT)
  )];

  if (indexes.length === 0) return;

  for (const slotNumber of indexes) {
    clearSlot(slotNumber - 1);
  }

  saveState();
  renderAll();
}

async function handlePokemonCommand(index, rawMessage) {
  const message = (rawMessage || '').trim();

  // Sin mensaje = limpiar slot
  // Ejemplo: !poke3
  if (!message) {
    clearSlot(index);
    saveState();
    renderSlot(index);
    return;
  }

  const { identifier, nickname, flags } = parsePokemonMessage(message);

  if (!identifier) return;

  // Marcar como muerto
  if (['d', 'dead', 'muerto', 'm'].includes(identifier)) {
    if (team[index]) {
      team[index].dead = true;
      saveState();
      renderSlot(index);
    }
    return;
  }

  // Revivir
  if (['alive', 'revive', 'vivo', 'v'].includes(identifier)) {
    if (team[index]) {
      team[index].dead = false;
      saveState();
      renderSlot(index);
    }
    return;
  }

  await setPokemon(index, identifier, nickname, flags);
}

async function setPokemon(index, identifier, nickname, flags = {}) {
  try {
    const pokemon = await fetchPokemon(identifier);

    if (!pokemon) {
      console.warn(`[Overlay] Pokémon no encontrado: ${identifier}`);
      return;
    }

    const numero = String(pokemon.id).padStart(4, '0');
    const species = pokemon.species?.name || identifier;
    const displayName = nickname || formatDisplayName(species);

    const spriteAlive = await resolvePortraitByPriority(numero, ALIVE_EMOTIONS, flags);
    const spriteDead = await resolvePortraitByPriority(numero, DEAD_EMOTIONS, flags);

    team[index] = {
      poke: identifier,
      name: species,
      nick: displayName,
      numero,
      dead: false,

      shiny: !!flags.shiny,
      mega: !!flags.mega,

      sprite: spriteAlive,
      spriteAlive,
      spriteDead
    };

    saveState();
    renderSlot(index);
  } catch (error) {
    console.error('[Overlay] Error al asignar Pokémon:', error);
  }
}

function clearSlot(index) {
  team[index] = null;
}

function handleDeathCommand(rawMessage) {
  const message = (rawMessage || '').trim();

  // !muertes  -> suma 1
  if (!message) {
    death++;
    saveState();
    renderDeath();
    return;
  }

  // !muertes 4 -> fija en 4
  const value = parseInt(message.split(/\s+/)[0], 10);
  if (!Number.isNaN(value) && value >= 0) {
    death = value;
    saveState();
    renderDeath();
  }
}

async function fetchPokemon(identifier) {
  const endpoint = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(identifier.toLowerCase())}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function imageExists(url) {
  if (portraitExistsCache.has(url)) {
    return portraitExistsCache.get(url);
  }

  const existsPromise = new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

    img.src = url;
  });

  portraitExistsCache.set(url, existsPromise);
  return existsPromise;
}

async function resolvePortraitByPriority(numero, emotions, flags = {}) {
  const variantKey = buildVariantPath(flags) || 'base';
  const cacheKey = `${numero}|${variantKey}|${emotions.join(',')}`;

  if (portraitChoiceCache.has(cacheKey)) {
    return portraitChoiceCache.get(cacheKey);
  }

  for (const emotion of emotions) {
    const url = buildPMDSpriteUrl(numero, emotion, flags);
    const exists = await imageExists(url);

    if (exists) {
      portraitChoiceCache.set(cacheKey, url);
      return url;
    }
  }

  const fallback = buildPMDSpriteUrl(numero, 'Normal', flags);
  portraitChoiceCache.set(cacheKey, fallback);
  return fallback;
}

function buildVariantPath(flags = {}) {
  const shiny = !!flags.shiny;
  const mega = !!flags.mega;

  if (mega && shiny) return '0001/0001';
  if (mega) return '0001';
  if (shiny) return '0000/0001';

  return '';
}

function buildPMDSpriteUrl(numero, emotion = 'Normal', flags = {}) {
  const variantPath = buildVariantPath(flags);

  if (variantPath) {
    return `${PMD_BASE_URL}/${numero}/${variantPath}/${emotion}.png`;
  }

  return `${PMD_BASE_URL}/${numero}/${emotion}.png`;
}

function renderAll() {
  for (let i = 0; i < SLOT_COUNT; i++) {
    renderSlot(i);
  }
  renderDeath();
}

function renderSlot(index) {
  const slot = team[index];
  const img = document.getElementById(`pk${index + 1}`);
  const nick = document.getElementById(`nick${index + 1}`);

  if (!img || !nick) return;

  if (!slot) {
    img.src = EMPTY_IMAGE;
    img.classList.remove('dead');
    img.classList.add('egg');
    nick.textContent = EMPTY_LABEL;
    return;
  }

  const aliveSprite = slot.spriteAlive || slot.sprite || EMPTY_IMAGE;
  const deadSprite = slot.spriteDead || aliveSprite;
  const currentSprite = slot.dead ? deadSprite : aliveSprite;

  img.src = currentSprite;
  img.classList.toggle('dead', !!slot.dead);
  img.classList.remove('egg');
  nick.textContent = slot.nick || '';
}

function renderDeath() {
  const deathElement = document.getElementById('death');
  if (deathElement) {
    deathElement.textContent = `X${death}`;
  }
}

function normalizeChannel(channel) {
  return String(channel || '')
    .replace(/^#/, '')
    .trim()
    .toLowerCase();
}

function formatDisplayName(name) {
  return String(name || '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getTeamStorageKey() {
  return `pokemon-overlay:${canal}:team`;
}

function getDeathStorageKey() {
  return `pokemon-overlay:${canal}:death`;
}

function saveState() {
  localStorage.setItem(getTeamStorageKey(), JSON.stringify(team));
  localStorage.setItem(getDeathStorageKey(), String(death));
}

function loadState() {
  try {
    const savedTeam = JSON.parse(localStorage.getItem(getTeamStorageKey()) || 'null');
    const savedDeath = parseInt(localStorage.getItem(getDeathStorageKey()) || '0', 10);

    if (Array.isArray(savedTeam) && savedTeam.length === SLOT_COUNT) {
      team = savedTeam;
    }

    if (!Number.isNaN(savedDeath) && savedDeath >= 0) {
      death = savedDeath;
    }
  } catch (error) {
    console.warn('[Overlay] No se pudo cargar el estado local:', error);
  }
}

function showError(message) {
  const errorBox = document.getElementById('errorBox');
  if (!errorBox) return;

  errorBox.textContent = message;
  errorBox.classList.remove('hidden');

}

