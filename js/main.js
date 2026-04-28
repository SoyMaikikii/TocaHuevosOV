const SLOT_COUNT = 10;
const MAIN_SLOT_COUNT = 6;

const OVERLAY_IMAGES = {
  '3ds': {
    eggs: './img/overlays/Huevos-3ds.png',
    overlay: './img/overlays/Overlay-3ds.png',
  },
  switch: {
    eggs: './img/overlays/Huevos-sw.png',
    overlay: './img/overlays/Overlay-sw.png',
  },
};
const DEFAULT_SWAP_COMMAND = 'cpoke';
const DEFAULT_COMMAND_PREFIX = 'poke';
const DEFAULT_DEATH_COMMAND = 'muertes';

const EMPTY_IMAGE = './img/egg.png';
const EMPTY_LABEL = 'HUEVO';

const CLEAR_COMMANDS = ['pokel', 'pokelimpiar'];

const ALIVE_EMOTIONS = ['Joyous', 'Happy', 'Normal'];
const DEAD_EMOTIONS = ['Dizzy', 'Crying', 'Normal'];
const BENCH_EMOTIONS = ['Crying', 'Sad', 'Normal'];

const portraitExistsCache = new Map();
const portraitChoiceCache = new Map();

const PMD_BASE_URL = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait';

const SHINY_FLAG_TOKENS = new Set(['-shiny', 'shiny']);
const MEGA_FLAG_TOKENS = new Set(['-mega', 'mega']);

const REGION_FLAG_ALIASES = {
  '-alola': 'alola',
  'alola': 'alola',
  '-alolan': 'alola',
  'alolan': 'alola',

  '-galar': 'galar',
  'galar': 'galar',
  '-galarian': 'galar',
  'galarian': 'galar',

  '-hisui': 'hisui',
  'hisui': 'hisui',
  '-hisuian': 'hisui',
  'hisuian': 'hisui',
};

const REGIONAL_FORM_SLOTS = {
  // Alola
  rattata: { alola: '0001' },
  raticate: { alola: '0001' },
  raichu: { alola: '0001' },
  sandshrew: { alola: '0001' },
  sandslash: { alola: '0001' },
  vulpix: { alola: '0001' },
  ninetales: { alola: '0001' },
  diglett: { alola: '0001' },
  dugtrio: { alola: '0001' },
  meowth: { alola: '0001', galar: '0002' },
  persian: { alola: '0001' },
  geodude: { alola: '0001' },
  graveler: { alola: '0001' },
  golem: { alola: '0001' },
  grimer: { alola: '0001' },
  muk: { alola: '0001' },
  exeggutor: { alola: '0001' },
  marowak: { alola: '0001' },

  // Galar
  ponyta: { galar: '0001' },
  rapidash: { galar: '0001' },
  slowpoke: { galar: '0001' },
  slowbro: { galar: '0001' },
  farfetchd: { galar: '0001' },
  'farfetch\'d': { galar: '0001' },
  weezing: { galar: '0001' },
  'mr-mime': { galar: '0001' },
  articuno: { galar: '0001' },
  zapdos: { galar: '0001' },
  moltres: { galar: '0001' },
  slowking: { galar: '0001' },
  corsola: { galar: '0001' },
  zigzagoon: { galar: '0001' },
  linoone: { galar: '0001' },
  darumaka: { galar: '0001' },
  darmanitan: { galar: '0001' },
  yamask: { galar: '0001' },
  stunfisk: { galar: '0001' },

  // Hisui
  growlithe: { hisui: '0001' },
  arcanine: { hisui: '0001' },
  voltorb: { hisui: '0001' },
  electrode: { hisui: '0001' },
  typhlosion: { hisui: '0001' },
  qwilfish: { hisui: '0001' },
  sneasel: { hisui: '0001' },
  samurott: { hisui: '0001' },
  lilligant: { hisui: '0001' },
  zorua: { hisui: '0001' },
  zoroark: { hisui: '0001' },
  braviary: { hisui: '0001' },
  sliggoo: { hisui: '0001' },
  goodra: { hisui: '0001' },
  avalugg: { hisui: '0001' },
  decidueye: { hisui: '0001' },
};

const SPECIAL_FORM_FLAG_ALIASES = {
  '-therian': 'therian',
  'therian': 'therian',

  '-resolute': 'resolute',
  'resolute': 'resolute',

  '-heat': 'heat',
  'heat': 'heat',
  'horno': 'heat',
  '-horno': 'heat',

  '-wash': 'wash',
  'wash': 'wash',
  'lavadora': 'wash',
  '-lavadora': 'wash',

  '-frost': 'frost',
  'frost': 'frost',
  'refrigerador': 'frost',
  '-refrigerador': 'frost',

  '-fan': 'fan',
  'fan': 'fan',
  'ventilador': 'fan',
  '-ventilador': 'fan',

  '-mow': 'mow',
  'mow': 'mow',
  'podadora': 'mow',
  '-podadora': 'mow',

  '-blade': 'blade',
  'blade': 'blade',
  '-sword': 'blade',
  'sword': 'blade',
  'espada': 'blade',
  '-espada': 'blade',

  '-sky': 'sky',
  'sky': 'sky',
  '-cielo': 'sky',
  'cielo': 'sky',
};

const BASE_IDENTIFIER_ALIASES = {
  tornadus: 'tornadus-incarnate',
  thundurus: 'thundurus-incarnate',
  landorus: 'landorus-incarnate',
  keldeo: 'keldeo-ordinary',
  shaymin: 'shaymin-land',
  aegislash: 'aegislash-shield',
};

const IDENTIFIER_FORM_ALIASES = {
  'tornadus-therian': { apiIdentifier: 'tornadus-incarnate', specialForm: 'therian' },
  'thundurus-therian': { apiIdentifier: 'thundurus-incarnate', specialForm: 'therian' },
  'landorus-therian': { apiIdentifier: 'landorus-incarnate', specialForm: 'therian' },

  'keldeo-resolute': { apiIdentifier: 'keldeo-ordinary', specialForm: 'resolute' },

  'rotom-heat': { apiIdentifier: 'rotom', specialForm: 'heat' },
  'rotom-wash': { apiIdentifier: 'rotom', specialForm: 'wash' },
  'rotom-frost': { apiIdentifier: 'rotom', specialForm: 'frost' },
  'rotom-fan': { apiIdentifier: 'rotom', specialForm: 'fan' },
  'rotom-mow': { apiIdentifier: 'rotom', specialForm: 'mow' },

  'aegislash-blade': { apiIdentifier: 'aegislash-shield', specialForm: 'blade' },

  'shaymin-sky': { apiIdentifier: 'shaymin-land', specialForm: 'sky' },
};

const SPECIAL_FORM_SLOTS = {
  'tornadus-incarnate': { therian: '0001' },
  'thundurus-incarnate': { therian: '0001' },
  'landorus-incarnate': { therian: '0001' },

  'keldeo-ordinary': { resolute: '0001' },

  rotom: {
    heat: '0001',
    wash: '0002',
    frost: '0003',
    fan: '0004',
    mow: '0005',
  },

  'aegislash-shield': { blade: '0001' },

  'shaymin-land': { sky: '0001' },
};

const SPECIAL_FORM_DISPLAY = {
  therian: 'Therian',
  resolute: 'Resolute',
  heat: 'Heat',
  wash: 'Wash',
  frost: 'Frost',
  fan: 'Fan',
  mow: 'Mow',
  blade: 'Blade',
  sky: 'Sky',
};

let juego = '3ds';
let canal = '';
let commandPrefix = DEFAULT_COMMAND_PREFIX;
let deathCommand = DEFAULT_DEATH_COMMAND;
let swapCommand = DEFAULT_SWAP_COMMAND;

let team = Array.from({ length: SLOT_COUNT }, () => null);
let death = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
  buildSlots();
  buildTextSlots();

  const params = new URLSearchParams(window.location.search);

  canal = (params.get('canal') || '').trim().toLowerCase();
  juego = (params.get('juego') || '3ds').trim().toLowerCase();

  if (!['3ds', 'switch'].includes(juego)) {
    juego = '3ds';
  }

	const comandoParam = (params.get('comando') || '').trim().toLowerCase();
	const deathParam = (params.get('deathCommand') || '').trim().toLowerCase();
	const swapParam = (params.get('swapCommand') || '').trim().toLowerCase();

	if (comandoParam) commandPrefix = comandoParam.replace(/^!/, '');
	if (deathParam) deathCommand = deathParam.replace(/^!/, '');
	if (swapParam) swapCommand = swapParam.replace(/^!/, '');

  if (!canal) {
    showError('Falta el parámetro ?canal=. Ejemplo: ?canal=maikikii');
    return;
  }

  applyGameClass();
  applyOverlayImages();
  loadState();
  renderAll();
  connectToChat();
}

function applyGameClass() {
  document.body.classList.remove('game-3ds', 'game-switch');
  document.body.classList.add(`game-${juego}`);
}

function applyOverlayImages() {
  const assets = OVERLAY_IMAGES[juego] || OVERLAY_IMAGES['3ds'];

  const eggsImage = document.getElementById('eggsImage');
  const overlayImage = document.getElementById('overlayImage');

  if (eggsImage) {
    eggsImage.src = assets.eggs;
  }

  if (overlayImage) {
    overlayImage.src = assets.overlay;
  }
}

function buildTextSlots() {
  const container = document.getElementById('textOverlay');
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < MAIN_SLOT_COUNT; i++) {
    const nick = document.createElement('div');
    nick.id = `textNick${i + 1}`;
    nick.className = `text-nick text-slot-${i + 1}`;
    nick.textContent = EMPTY_LABEL;
    container.appendChild(nick);
  }
}

function buildSlots() {
  const teamContainer = document.getElementById('team');
  teamContainer.innerHTML = '';

  for (let i = 0; i < SLOT_COUNT; i++) {
    const isMainSlot = i < 6;

    const slot = document.createElement('div');
    slot.className = `slot slot-${i + 1} ${isMainSlot ? 'main-slot' : 'sub-slot'}`;

    slot.innerHTML = `
      <img
        id="pk${i + 1}"
        class="portrait egg"
        src="${EMPTY_IMAGE}"
        alt="Pokémon ${i + 1}"
      />
      ${isMainSlot ? `<div id="nick${i + 1}" class="nick">${EMPTY_LABEL}</div>` : ''}
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
	
	if (normalizedCommand === swapCommand) {
	  await handleSwapCommand(message);
	  return;
	}
  };

  ComfyJS.Init(canal);
  console.log(`[Overlay] Escuchando comandos en #${canal}`);
}

function getCommands() {
  return Array.from({ length: SLOT_COUNT }, (_, i) => `${commandPrefix}${i + 1}`);
}

function isBenchSlot(index) {
  return index >= 6;
}

function parsePokemonMessage(rawMessage) {
  const parts = (rawMessage || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const identifier = (parts.shift() || '').toLowerCase();

  const flags = {
    shiny: false,
    mega: false,
    region: null,
    specialForm: null,
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

    if (REGION_FLAG_ALIASES[normalized]) {
      flags.region = REGION_FLAG_ALIASES[normalized];
      continue;
    }

    if (SPECIAL_FORM_FLAG_ALIASES[normalized]) {
      flags.specialForm = SPECIAL_FORM_FLAG_ALIASES[normalized];
      continue;
    }

    nicknameParts.push(part);
  }

  return {
    identifier,
    nickname: nicknameParts.join(' ').trim(),
    flags,
  };
}

function resolvePokemonRequest(identifier, flags = {}) {
  const normalizedIdentifier = String(identifier || '').toLowerCase();

  const aliasEntry = IDENTIFIER_FORM_ALIASES[normalizedIdentifier];
  if (aliasEntry) {
    return {
      apiIdentifier: aliasEntry.apiIdentifier,
      flags: {
        ...flags,
        specialForm: flags.specialForm || aliasEntry.specialForm,
      },
    };
  }

  return {
    apiIdentifier: BASE_IDENTIFIER_ALIASES[normalizedIdentifier] || normalizedIdentifier,
    flags: { ...flags },
  };
}

function getSpecialFormPath(apiIdentifier, specialForm) {
  if (!specialForm) return '';

  const formData = SPECIAL_FORM_SLOTS[apiIdentifier];
  return formData?.[specialForm] || '';
}

function sanitizeSpeciesKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[.’']/g, '')
    .trim();
}

function getRegionalFormPath(speciesName, region) {
  if (!region) return '';

  const key = sanitizeSpeciesKey(speciesName);
  const regionalData = REGIONAL_FORM_SLOTS[key];

  return regionalData?.[region] || '';
}

function getDisplayFormName(speciesName, flags = {}) {
  const baseName = formatDisplayName(speciesName);

  if (flags.specialForm) {
    const specialLabel = SPECIAL_FORM_DISPLAY[flags.specialForm] || formatDisplayName(flags.specialForm);
    return `${baseName} ${specialLabel}`;
  }

  if (flags.region === 'alola') return `${baseName} Alola`;
  if (flags.region === 'galar') return `${baseName} Galar`;
  if (flags.region === 'hisui') return `${baseName} Hisui`;

  if (flags.mega) return `Mega ${baseName}`;

  return baseName;
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
    const resolved = resolvePokemonRequest(identifier, flags);
    const apiIdentifier = resolved.apiIdentifier;
    const resolvedFlags = resolved.flags;

    const pokemon = await fetchPokemon(apiIdentifier);

    if (!pokemon) {
      console.warn(`[Overlay] Pokémon no encontrado: ${apiIdentifier}`);
      return;
    }

    const numero = String(pokemon.id).padStart(4, '0');
    const species = pokemon.species?.name || apiIdentifier;

    const specialFormPath = getSpecialFormPath(apiIdentifier, resolvedFlags.specialForm);
    const regionalFormPath = specialFormPath ? '' : getRegionalFormPath(species, resolvedFlags.region);

    const formPath = specialFormPath || regionalFormPath;

    const spriteFlags = {
      shiny: !!resolvedFlags.shiny,
      mega: formPath ? false : !!resolvedFlags.mega,
      region: resolvedFlags.region || null,
      specialForm: resolvedFlags.specialForm || null,
      formPath,
    };

    const displayName = nickname || getDisplayFormName(species, spriteFlags);

    const aliveEmotionSet = isBenchSlot(index) ? BENCH_EMOTIONS : ALIVE_EMOTIONS;

    const spriteAlive = await resolvePortraitByPriority(numero, aliveEmotionSet, spriteFlags);
    const spriteDead = await resolvePortraitByPriority(numero, DEAD_EMOTIONS, spriteFlags);

    team[index] = {
      poke: apiIdentifier,
      originalInput: identifier,
      name: species,
      nick: displayName,
      numero,
      dead: false,

      shiny: spriteFlags.shiny,
      mega: spriteFlags.mega,
      region: spriteFlags.region,
      specialForm: spriteFlags.specialForm,
      formPath: spriteFlags.formPath,

      sprite: spriteAlive,
      spriteAlive,
      spriteDead,
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
  const formPath = flags.formPath || '';

  if (formPath) {
    if (shiny) return `${formPath}/0001`;
    return formPath;
  }

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

async function handleSwapCommand(message) {
  const raw = (message || '').trim();

  if (!raw) {
    showError(`Uso: !${swapCommand} 1 7 [Nombre opcional]`);
    return;
  }

  const parts = raw.split(/\s+/);

  if (parts.length < 2) {
    showError(`Uso: !${swapCommand} 1 7 [Nombre opcional]`);
    return;
  }

  const indexA = parseSlotIndex(parts[0]);
  const indexB = parseSlotIndex(parts[1]);
  const customNick = parts.slice(2).join(' ').trim();

  if (indexA === null || indexB === null) {
    showError(`Los slots deben ser números del 1 al ${SLOT_COUNT}. Ejemplo: !${swapCommand} 1 7`);
    return;
  }

  if (indexA === indexB) {
    showError('No puedes intercambiar un slot consigo mismo. Eso es hacer ejercicio sin moverse.');
    return;
  }

  const slotAIsVisible = indexA < MAIN_SLOT_COUNT;
  const slotBIsVisible = indexB < MAIN_SLOT_COUNT;
  const isVisibleBenchSwap = slotAIsVisible !== slotBIsVisible;

  const temp = team[indexA];
  team[indexA] = team[indexB];
  team[indexB] = temp;

  // Si se intercambia un slot visible con banca y escribiste un nombre,
  // ese nombre se asigna al Pokémon que quedó en el slot visible.
  if (isVisibleBenchSwap && customNick) {
    const visibleIndex = slotAIsVisible ? indexA : indexB;

    if (team[visibleIndex]) {
      team[visibleIndex].nick = customNick;
    }
  }

  // Recalcula los sprites según la NUEVA posición.
  // Slot 1-6: Joyous > Happy > Normal
  // Slot 7-10: Crying > Sad > Normal
  // Si está muerto, mantiene sprite de DEAD_EMOTIONS.
  await refreshSlotEmotionSprite(indexA);
  await refreshSlotEmotionSprite(indexB);

  saveState();
  renderAll();
}

async function refreshSlotEmotionSprite(index) {
  const slot = team[index];

  if (!slot || !slot.numero) {
    return;
  }

  const spriteFlags = {
    shiny: !!slot.shiny,
    mega: !!slot.mega,
    region: slot.region || null,
    specialForm: slot.specialForm || null,
    formPath: slot.formPath || '',
  };

  const emotionSet = isBenchSlot(index) ? BENCH_EMOTIONS : ALIVE_EMOTIONS;

  slot.spriteAlive = await resolvePortraitByPriority(slot.numero, emotionSet, spriteFlags);
  slot.spriteDead = await resolvePortraitByPriority(slot.numero, DEAD_EMOTIONS, spriteFlags);

  // Mantiene compatibilidad con partes viejas del código que usen "sprite".
  slot.sprite = slot.spriteAlive;
}

function parseSlotIndex(value) {
  const number = Number.parseInt(String(value || '').trim(), 10);

  if (!Number.isInteger(number)) {
    return null;
  }

  if (number < 1 || number > SLOT_COUNT) {
    return null;
  }

  return number - 1;
}

function renderAll() {
  for (let i = 0; i < SLOT_COUNT; i++) {
    renderSlot(i);
  }

  renderTextSlots();
  renderDeath();
}

function renderSlot(index) {
  const slot = team[index];
  const img = document.getElementById(`pk${index + 1}`);
  const nick = document.getElementById(`nick${index + 1}`);

  if (!img) {
    renderTextSlot(index);
    return;
  }

  if (!slot) {
    img.src = EMPTY_IMAGE;
    img.classList.remove('dead');
    img.classList.add('egg');

    if (nick) {
      nick.textContent = EMPTY_LABEL;
    }

    renderTextSlot(index);
    return;
  }

  const aliveSprite = slot.spriteAlive || slot.sprite || EMPTY_IMAGE;
  const deadSprite = slot.spriteDead || aliveSprite;
  const currentSprite = slot.dead ? deadSprite : aliveSprite;

  img.src = currentSprite;
  img.classList.remove('egg');

  const forceGray = isBenchSlot(index);
  img.classList.toggle('dead', !!slot.dead || forceGray);

  if (nick) {
    nick.textContent = slot.nick || '';
  }

  renderTextSlot(index);
}

function renderTextSlots() {
  for (let i = 0; i < MAIN_SLOT_COUNT; i++) {
    renderTextSlot(i);
  }
}

function renderTextSlot(index) {
  if (index >= MAIN_SLOT_COUNT) return;

  const textElement = document.getElementById(`textNick${index + 1}`);
  if (!textElement) return;

  const slot = team[index];
  textElement.textContent = slot?.nick?.trim() || EMPTY_LABEL;
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
