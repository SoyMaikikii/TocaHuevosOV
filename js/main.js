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

    const spriteAlive = await resolvePortraitByPriority(numero, ALIVE_EMOTIONS, spriteFlags);
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