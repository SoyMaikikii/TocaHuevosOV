const SLOT_COUNT = 6;
const DEFAULT_COMMAND_PREFIX = 'poke';
const DEFAULT_DEATH_COMMAND = 'muertes';
const BLANK_IMAGE = './img/MainBlank.png';

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
        class="portrait"
        src="${BLANK_IMAGE}"
        alt="Pokémon ${i + 1}"
      />
      <div id="nick${i + 1}" class="nick"></div>
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

  const parts = message.split(/\s+/);
  const identifier = (parts.shift() || '').toLowerCase();
  const nickname = parts.join(' ').trim();

  // Marcar como muerto
  // Ejemplos:
  // !poke2 d
  // !poke2 dead
  // !poke2 muerto
  if (['d', 'dead', 'muerto'].includes(identifier)) {
    if (team[index]) {
      team[index].dead = true;
      saveState();
      renderSlot(index);
    }
    return;
  }

  // Revivir si ya existe y quieres quitar gris:
  // !poke2 alive
  // !poke2 revive
  if (['alive', 'revive', 'vivo'].includes(identifier)) {
    if (team[index]) {
      team[index].dead = false;
      saveState();
      renderSlot(index);
    }
    return;
  }

  await setPokemon(index, identifier, nickname);
}

async function setPokemon(index, identifier, nickname) {
  try {
    const pokemon = await fetchPokemon(identifier);

    if (!pokemon) {
      console.warn(`[Overlay] Pokémon no encontrado: ${identifier}`);
      return;
    }

    const numero = String(pokemon.id).padStart(4, '0');
    const species = pokemon.species?.name || identifier;
    const displayName = nickname || formatDisplayName(species);
    const spriteUrl = buildPMDSpriteUrl(numero);

    team[index] = {
      poke: identifier,
      sprite: spriteUrl,
      name: species,
      nick: displayName,
      numero,
      dead: false
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

function buildPMDSpriteUrl(numero) {
  return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${numero}/Normal.png`;
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
    img.src = BLANK_IMAGE;
    img.classList.remove('dead');
    nick.textContent = '';
    return;
  }

  img.src = slot.sprite || BLANK_IMAGE;
  img.classList.toggle('dead', !!slot.dead);
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