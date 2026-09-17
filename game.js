const startScreen = document.getElementById("startScreen");
const creatureScreen = document.getElementById("creatureScreen");
const gameScreen = document.getElementById("gameScreen");

const pseudoInput = document.getElementById("pseudoInput");
const passwordInput = document.getElementById("passwordInput");
const authError = document.getElementById("authError");
const authButtons = document.getElementById("authButtons");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const startButton = document.getElementById("startButton");

const playerName = document.getElementById("playerName");
const teamDisplay = document.getElementById("teamDisplay");
const creatureSelection = document.getElementById("creatureSelection");
const pokedexButton = document.getElementById("pokedexButton");
const pvpButton = document.getElementById("pvpButton");
const tradeButton = document.getElementById("tradeButton");
const logoutButton = document.getElementById("logoutButton");
const moneyDisplay = document.getElementById("moneyDisplay");

const zoneLabel = document.getElementById("zoneLabel");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Les 3 créatures starters
const STARTER_CREATURES = [
    { id: 1, name: "Flamant", type: "Feu" },
    { id: 4, name: "Salasaur", type: "Plante" },
    { id: 7, name: "Aquali", type: "Eau" }
];

// Espèces sauvages disponibles par zone, avec le niveau des créatures qu'on y rencontre
// (plus la zone est éloignée du village, plus les créatures y sont hautes en niveau)
const ZONE_WILD_DATA = {
    "🏘️ Bourg Palette": {
        minLevel: 2,
        maxLevel: 6,
        creatures: [
            { id: 10, name: "Rosapin", type: "Plante" },
            { id: 16, name: "Lunégriff", type: "Normal" },
            { id: 36, name: "Nébulapin", type: "Plante" },
            { id: 47, name: "Queueflor", type: "Plante" },
            { id: 62, name: "Vénépine", type: "Plante" },
            { id: 76, name: "Voltichat", type: "Plante" },
            { id: 102, name: "Ténébrûle", type: "Plante" },
            { id: 135, name: "Roncours", type: "Plante" },
            { id: 142, name: "Pétalys", type: "Plante" },
        ]
    },
    "🌊 Lac Azur": {
        minLevel: 2,
        maxLevel: 6,
        creatures: [
            { id: 20, name: "Aquapin", type: "Eau" },
            { id: 28, name: "Crabraz", type: "Eau" },
            { id: 42, name: "Aquaboule", type: "Eau" },
            { id: 71, name: "Aquaryx", type: "Eau" },
            { id: 79, name: "Brutalynx", type: "Eau" },
            { id: 88, name: "Aquabris", type: "Eau" },
            { id: 96, name: "Aqualou", type: "Eau" },
            { id: 111, name: "Électriva", type: "Eau" },
            { id: 120, name: "Aqualame", type: "Eau" },
            { id: 126, name: "Tonnerreux", type: "Eau" },
        ]
    },
    "🌲 Forêt Sombre": {
        minLevel: 7,
        maxLevel: 12,
        creatures: [
            { id: 19, name: "Champignon", type: "Plante" },
            { id: 17, name: "Floramie", type: "Plante" },
            { id: 25, name: "Mousselin", type: "Plante" },
            { id: 39, name: "Cactulin", type: "Plante" },
            { id: 56, name: "Aéribou", type: "Plante" },
            { id: 74, name: "Champépin", type: "Plante" },
            { id: 94, name: "Champibois", type: "Plante" },
            { id: 129, name: "Papilys", type: "Plante" },
            { id: 138, name: "Lunéclair", type: "Plante" },
            { id: 148, name: "Sylvadrake", type: "Plante" },
        ]
    },
    "🏜️ Route Sablonneuse": {
        minLevel: 7,
        maxLevel: 12,
        creatures: [
            { id: 21, name: "Électrisson", type: "Normal" },
            { id: 24, name: "Serpentis", type: "Normal" },
            { id: 45, name: "Feuillodon", type: "Feu" },
            { id: 59, name: "Braséonix", type: "Feu" },
            { id: 85, name: "Lunélys", type: "Feu" },
            { id: 108, name: "Cendryx", type: "Feu" },
            { id: 132, name: "Brasifureur", type: "Feu" },
            { id: 145, name: "Sombrafée", type: "Normal" },
            { id: 151, name: "Noctéroc", type: "Normal" },
        ]
    },
    "🌋 Zone Volcanique": {
        minLevel: 13,
        maxLevel: 20,
        creatures: [
            { id: 12, name: "Brasiflam", type: "Feu" },
            { id: 30, name: "Giraflamm", type: "Feu" },
            { id: 33, name: "Raptiblu", type: "Feu" },
            { id: 50, name: "Félinflam", type: "Feu" },
            { id: 68, name: "Ténébrix", type: "Feu" },
            { id: 105, name: "Aquaflamm", type: "Feu" },
            { id: 114, name: "Flamécaille", type: "Feu" },
        ]
    },
    "❄️ Zone Arctique": {
        minLevel: 13,
        maxLevel: 20,
        creatures: [
            { id: 14, name: "Vampibou", type: "Normal" },
            { id: 22, name: "Oursonyx", type: "Normal" },
            { id: 53, name: "Papilune", type: "Eau" },
            { id: 65, name: "Féraloup", type: "Normal" },
            { id: 82, name: "Glacibulle", type: "Eau" },
            { id: 91, name: "Givrelame", type: "Eau" },
            { id: 99, name: "Noctyra", type: "Eau" },
            { id: 117, name: "Hydrourson", type: "Eau" },
            { id: 123, name: "Givrou", type: "Eau" },
        ]
    },
};

// Toutes les espèces sauvages de base (hors évolutions), à plat pour le Pokédex
const WILD_CREATURES = Object.values(ZONE_WILD_DATA).flatMap(zone => zone.creatures);

// Zone bonus géante, débloquée après avoir battu la dernière arène : toutes
// les espèces sauvages du jeu (de toutes les zones) peuvent y apparaître,
// à un niveau bien plus élevé que partout ailleurs.
const POSTGAME_ZONE_NAME = "🏔️ Plateau des Légendes";
ZONE_WILD_DATA[POSTGAME_ZONE_NAME] = {
    minLevel: 27,
    maxLevel: 32,
    creatures: WILD_CREATURES
};

const WILD_ENCOUNTER_CHANCE = 0.12;
const WILD_MIN_LEVEL = 2;
const WILD_MAX_LEVEL = 6;

// Espèces obtenues uniquement par évolution (jamais rencontrées à l'état sauvage)
const EVOLVED_SPECIES = [
    { id: 2, name: "Braisor", type: "Feu" },
    { id: 3, name: "Vulcanor", type: "Feu" },
    { id: 5, name: "Salaflore", type: "Plante" },
    { id: 6, name: "Saladraxe", type: "Plante" },
    { id: 8, name: "Aqualon", type: "Eau" },
    { id: 9, name: "Aquatitan", type: "Eau" },
    { id: 11, name: "Rosélia", type: "Plante" },
    { id: 15, name: "Dracoryx", type: "Normal" },
    { id: 18, name: "Roncépine", type: "Plante" },
    { id: 23, name: "Givrillon", type: "Normal" },
    { id: 26, name: "Ombrelynx", type: "Plante" },
    { id: 27, name: "Glacelin", type: "Plante" },
    { id: 31, name: "Corbécaille", type: "Feu" },
    { id: 32, name: "Félinrose", type: "Feu" },
    { id: 34, name: "Flamèche", type: "Feu" },
    { id: 35, name: "Roncroc", type: "Feu" },
    { id: 37, name: "Sombryx", type: "Plante" },
    { id: 38, name: "Scorplume", type: "Plante" },
    { id: 40, name: "Blobelin", type: "Plante" },
    { id: 41, name: "Mousseron", type: "Plante" },
    { id: 43, name: "Givrapin", type: "Eau" },
    { id: 44, name: "Pyrogriff", type: "Eau" },
    { id: 48, name: "Pétalune", type: "Plante" },
    { id: 49, name: "Aquilame", type: "Plante" },
    { id: 51, name: "Noctifée", type: "Feu" },
    { id: 52, name: "Éclipsia", type: "Feu" },
    { id: 54, name: "Corallin", type: "Eau" },
    { id: 55, name: "Volcanin", type: "Eau" },
    { id: 57, name: "Florécorne", type: "Plante" },
    { id: 58, name: "Cristalys", type: "Plante" },
    { id: 60, name: "Nuagelin", type: "Feu" },
    { id: 63, name: "Sombroux", type: "Plante" },
    { id: 64, name: "Métalou", type: "Plante" },
    { id: 66, name: "Givrours", type: "Normal" },
    { id: 67, name: "Évolyn", type: "Normal" },
    { id: 69, name: "Feuillix", type: "Feu" },
    { id: 70, name: "Rosabri", type: "Feu" },
    { id: 72, name: "Pyrolynx", type: "Eau" },
    { id: 73, name: "Rocacier", type: "Eau" },
    { id: 77, name: "Lunapin", type: "Plante" },
    { id: 78, name: "Ombregriffe", type: "Plante" },
    { id: 80, name: "Coraloup", type: "Eau" },
    { id: 81, name: "Bourrisson", type: "Eau" },
    { id: 83, name: "Flamicroc", type: "Eau" },
    { id: 84, name: "Feuillours", type: "Eau" },
    { id: 86, name: "Noirécaille", type: "Feu" },
    { id: 87, name: "Igniflame", type: "Feu" },
    { id: 89, name: "Rosabulle", type: "Eau" },
    { id: 90, name: "Électryl", type: "Eau" },
    { id: 92, name: "Sombrafang", type: "Eau" },
    { id: 93, name: "Jellyflam", type: "Eau" },
    { id: 97, name: "Flammour", type: "Eau" },
    { id: 98, name: "Serpiflor", type: "Eau" },
    { id: 100, name: "Éclatix", type: "Eau" },
    { id: 101, name: "Givrélion", type: "Eau" },
    { id: 103, name: "Sylvaroc", type: "Plante" },
    { id: 104, name: "Grizzarbre", type: "Plante" },
    { id: 106, name: "Roséclair", type: "Feu" },
    { id: 109, name: "Bourgelin", type: "Feu" },
    { id: 110, name: "Sombrefée", type: "Feu" },
    { id: 112, name: "Rocaglace", type: "Eau" },
    { id: 113, name: "Feuillou", type: "Eau" },
    { id: 115, name: "Abyssour", type: "Feu" },
    { id: 116, name: "Pétabulle", type: "Feu" },
    { id: 118, name: "Cornéclair", type: "Eau" },
    { id: 119, name: "Brasédrake", type: "Eau" },
    { id: 121, name: "Noctiflore", type: "Eau" },
    { id: 122, name: "Roncédrac", type: "Eau" },
    { id: 124, name: "Féralacier", type: "Eau" },
    { id: 127, name: "Électrours", type: "Eau" },
    { id: 128, name: "Aquapince", type: "Eau" },
    { id: 130, name: "Sylvaflore", type: "Plante" },
    { id: 131, name: "Glacécroc", type: "Plante" },
    { id: 133, name: "Ombryon", type: "Feu" },
    { id: 134, name: "Cristabulle", type: "Feu" },
    { id: 136, name: "Moussépine", type: "Plante" },
    { id: 137, name: "Ténéflore", type: "Plante" },
    { id: 139, name: "Noctacier", type: "Plante" },
    { id: 140, name: "Floréclat", type: "Plante" },
    { id: 143, name: "Mégalithe", type: "Plante" },
    { id: 144, name: "Foudragon", type: "Plante" },
    { id: 146, name: "Givralys", type: "Normal" },
    { id: 147, name: "Volcaroc", type: "Normal" },
    { id: 149, name: "Hydrogriff", type: "Plante" },
    { id: 150, name: "Luminours", type: "Plante" },
];

// Toutes les espèces pouvant apparaître dans le jeu (pour le Pokédex)
const ALL_SPECIES = [...STARTER_CREATURES, ...WILD_CREATURES, ...EVOLVED_SPECIES];

// Chaînes d'évolution : id de l'espèce de base -> id de l'espèce suivante + niveau requis
const EVOLUTIONS = {
    1: { id: 2, level: 16 },
    2: { id: 3, level: 32 },
    4: { id: 5, level: 16 },
    5: { id: 6, level: 32 },
    7: { id: 8, level: 16 },
    8: { id: 9, level: 32 },
    10: { id: 11, level: 18 },
    14: { id: 15, level: 16 },
    17: { id: 18, level: 16 },
    22: { id: 23, level: 16 },
    25: { id: 26, level: 16 },
    26: { id: 27, level: 32 },
    30: { id: 31, level: 16 },
    31: { id: 32, level: 32 },
    33: { id: 34, level: 16 },
    34: { id: 35, level: 32 },
    36: { id: 37, level: 16 },
    37: { id: 38, level: 32 },
    39: { id: 40, level: 16 },
    40: { id: 41, level: 32 },
    42: { id: 43, level: 16 },
    43: { id: 44, level: 32 },
    47: { id: 48, level: 16 },
    48: { id: 49, level: 32 },
    50: { id: 51, level: 16 },
    51: { id: 52, level: 32 },
    53: { id: 54, level: 16 },
    54: { id: 55, level: 32 },
    56: { id: 57, level: 16 },
    57: { id: 58, level: 32 },
    59: { id: 60, level: 16 },
    62: { id: 63, level: 16 },
    63: { id: 64, level: 32 },
    65: { id: 66, level: 16 },
    66: { id: 67, level: 32 },
    68: { id: 69, level: 16 },
    69: { id: 70, level: 32 },
    71: { id: 72, level: 16 },
    72: { id: 73, level: 32 },
    76: { id: 77, level: 16 },
    77: { id: 78, level: 32 },
    79: { id: 80, level: 16 },
    80: { id: 81, level: 32 },
    82: { id: 83, level: 16 },
    83: { id: 84, level: 32 },
    85: { id: 86, level: 16 },
    86: { id: 87, level: 32 },
    88: { id: 89, level: 16 },
    89: { id: 90, level: 32 },
    91: { id: 92, level: 16 },
    92: { id: 93, level: 32 },
    96: { id: 97, level: 16 },
    97: { id: 98, level: 32 },
    99: { id: 100, level: 16 },
    100: { id: 101, level: 32 },
    102: { id: 103, level: 16 },
    103: { id: 104, level: 32 },
    105: { id: 106, level: 16 },
    108: { id: 109, level: 16 },
    109: { id: 110, level: 32 },
    111: { id: 112, level: 16 },
    112: { id: 113, level: 32 },
    114: { id: 115, level: 16 },
    115: { id: 116, level: 32 },
    117: { id: 118, level: 16 },
    118: { id: 119, level: 32 },
    120: { id: 121, level: 16 },
    121: { id: 122, level: 32 },
    123: { id: 124, level: 16 },
    126: { id: 127, level: 16 },
    127: { id: 128, level: 32 },
    129: { id: 130, level: 16 },
    130: { id: 131, level: 32 },
    132: { id: 133, level: 16 },
    133: { id: 134, level: 32 },
    135: { id: 136, level: 16 },
    136: { id: 137, level: 32 },
    138: { id: 139, level: 16 },
    139: { id: 140, level: 32 },
    142: { id: 143, level: 16 },
    143: { id: 144, level: 32 },
    145: { id: 146, level: 16 },
    146: { id: 147, level: 32 },
    148: { id: 149, level: 16 },
    149: { id: 150, level: 32 },
};

function getSpeciesInfo(id) {
    return ALL_SPECIES.find(species => species.id === id) || null;
}

function markPokedexSeen(id) {
    if (!currentPlayer.pokedex.seen.includes(id)) {
        currentPlayer.pokedex.seen.push(id);
    }
}

function markPokedexCaught(id) {
    markPokedexSeen(id);

    if (!currentPlayer.pokedex.caught.includes(id)) {
        currentPlayer.pokedex.caught.push(id);
    }
}

// Attaques apprenables par une créature selon son type : 25 par type (100
// au total), pour que deux créatures du même type puissent avoir un style
// de combat différent une fois que chacune en a appris un sous-ensemble.
const MOVE_POOL = {
    Feu: [
        { name: "Griffe Ardente", power: 1.00 },
        { name: "Lance-Flammes", power: 1.35 },
        { name: "Étincelle", power: 0.75 },
        { name: "Souffle Brûlant", power: 1.10 },
        { name: "Éruption", power: 1.55 },
        { name: "Flammèche", power: 0.80 },
        { name: "Brasier", power: 1.30 },
        { name: "Onde de Chaleur", power: 1.15 },
        { name: "Combustion", power: 1.25 },
        { name: "Feu Follet", power: 0.85 },
        { name: "Explosion Solaire", power: 1.60 },
        { name: "Vague de Chaleur", power: 1.05 },
        { name: "Cendres Ardentes", power: 0.90 },
        { name: "Colère du Volcan", power: 1.45 },
        { name: "Danse des Flammes", power: 1.00 },
        { name: "Jet de Lave", power: 1.40 },
        { name: "Morsure Enflammée", power: 1.20 },
        { name: "Tourbillon de Feu", power: 1.30 },
        { name: "Impact Solaire", power: 1.35 },
        { name: "Rugissement Ardent", power: 1.15 },
        { name: "Cœur de Magma", power: 1.50 },
        { name: "Pluie de Braises", power: 0.95 },
        { name: "Souffle du Dragon Rouge", power: 1.45 },
        { name: "Flamme Éternelle", power: 1.20 },
        { name: "Sursaut Incandescent", power: 1.10 }
    ],
    Plante: [
        { name: "Charge", power: 1.00 },
        { name: "Tranch'Herbe", power: 1.35 },
        { name: "Fouet Liane", power: 1.10 },
        { name: "Piqûre Toxique", power: 0.85 },
        { name: "Feuille Tranchante", power: 1.15 },
        { name: "Tempête de Pétales", power: 1.30 },
        { name: "Épines Acérées", power: 0.90 },
        { name: "Croissance Sauvage", power: 0.75 },
        { name: "Frappe Racinaire", power: 1.20 },
        { name: "Vent Végétal", power: 1.00 },
        { name: "Rugissement des Bois", power: 1.10 },
        { name: "Lianes Étrangleuses", power: 1.25 },
        { name: "Spores Toxiques", power: 0.80 },
        { name: "Fouet Ronce", power: 1.05 },
        { name: "Pollen Explosif", power: 1.40 },
        { name: "Assaut Botanique", power: 1.35 },
        { name: "Griffe Végétale", power: 1.15 },
        { name: "Tornade de Feuilles", power: 1.30 },
        { name: "Éveil de la Forêt", power: 1.45 },
        { name: "Piège Végétal", power: 0.95 },
        { name: "Sève Corrosive", power: 1.00 },
        { name: "Bourrasque Verte", power: 1.20 },
        { name: "Danse des Pétales", power: 0.85 },
        { name: "Colère de la Jungle", power: 1.50 },
        { name: "Éclosion Fatale", power: 1.55 }
    ],
    Eau: [
        { name: "Charge", power: 1.00 },
        { name: "Pistolet à O", power: 1.35 },
        { name: "Jet d'Écume", power: 0.90 },
        { name: "Vague Déferlante", power: 1.30 },
        { name: "Griffe Aquatique", power: 1.05 },
        { name: "Bulles d'Attaque", power: 0.80 },
        { name: "Trombe d'Eau", power: 1.20 },
        { name: "Lame d'Eau", power: 1.15 },
        { name: "Tourbillon Marin", power: 1.25 },
        { name: "Éclaboussure Puissante", power: 0.85 },
        { name: "Raz-de-Marée", power: 1.55 },
        { name: "Jet Glacé", power: 1.10 },
        { name: "Colère de l'Océan", power: 1.45 },
        { name: "Cyclone Aquatique", power: 1.30 },
        { name: "Souffle des Abysses", power: 1.20 },
        { name: "Brouillard Marin", power: 0.75 },
        { name: "Coup de Nageoire", power: 1.00 },
        { name: "Onde Sous-Marine", power: 1.15 },
        { name: "Torrent Déchaîné", power: 1.40 },
        { name: "Vapeur Brûlante", power: 0.95 },
        { name: "Fontaine de Cristal", power: 1.05 },
        { name: "Frappe des Récifs", power: 1.10 },
        { name: "Marée Furieuse", power: 1.35 },
        { name: "Déluge", power: 1.50 },
        { name: "Écume Tranchante", power: 1.25 }
    ],
    Normal: [
        { name: "Charge", power: 1.00 },
        { name: "Griffe", power: 1.15 },
        { name: "Coup de Boule", power: 0.90 },
        { name: "Frappe Rapide", power: 0.80 },
        { name: "Écrasement", power: 1.20 },
        { name: "Riposte", power: 1.05 },
        { name: "Hurlement", power: 0.75 },
        { name: "Attaque Éclair", power: 1.10 },
        { name: "Choc Frontal", power: 1.15 },
        { name: "Griffe Rapide", power: 1.00 },
        { name: "Ruade", power: 1.25 },
        { name: "Percussion", power: 1.30 },
        { name: "Coup de Grâce", power: 1.45 },
        { name: "Bousculade", power: 0.85 },
        { name: "Frappe Précise", power: 1.10 },
        { name: "Tacle", power: 1.00 },
        { name: "Furie", power: 1.35 },
        { name: "Corne Perforante", power: 1.20 },
        { name: "Choc Brutal", power: 1.15 },
        { name: "Assaut Sauvage", power: 1.40 },
        { name: "Feinte", power: 0.70 },
        { name: "Contre-Attaque", power: 1.05 },
        { name: "Frappe Décisive", power: 1.50 },
        { name: "Élan Puissant", power: 1.25 },
        { name: "Instinct Primitif", power: 1.55 }
    ]
};

// Nombre d'attaques qu'une créature connaît à la fois (comme dans les jeux
// officiels, où chaque créature connaît un sous-ensemble de ses attaques
// possibles plutôt que toutes en même temps).
const MOVES_PER_CREATURE = 4;

// ==========================================================
// Avantages/désavantages de types
//
// Triangle classique Feu / Plante / Eau (chacun fort contre un, faible
// contre un autre) ; Normal reste neutre partout, comme dans les jeux
// officiels où il n'a ni faiblesse ni résistance particulière parmi les
// types élémentaires de base.
//
// TYPE_CHART[typeDeLAttaque][typeDuDéfenseur] = multiplicateur de dégâts :
//   2    = super efficace
//   1    = efficacité normale
//   0.5  = pas très efficace
//   0    = n'affecte pas (immunité)
//
// getTypeMultiplier() accepte un type unique OU un tableau de types pour le
// défenseur (les multiplicateurs se cumulent, comme la double-typologie des
// jeux officiels), afin qu'une créature qui aurait plusieurs types un jour
// soit déjà prise en charge sans modifier cette fonction.
// ==========================================================

const TYPE_CHART = {
    Feu: { Feu: 1, Plante: 2, Eau: 0.5, Normal: 1 },
    Plante: { Feu: 0.5, Plante: 1, Eau: 2, Normal: 1 },
    Eau: { Feu: 2, Plante: 0.5, Eau: 1, Normal: 1 },
    Normal: { Feu: 1, Plante: 1, Eau: 1, Normal: 1 }
};

function getTypeMultiplier(moveType, defenderTypes) {

    const types = Array.isArray(defenderTypes) ? defenderTypes : [defenderTypes];
    const chart = TYPE_CHART[moveType];

    if (!chart) return 1;

    return types.reduce((multiplier, type) => {
        const factor = chart[type];
        return multiplier * (typeof factor === "number" ? factor : 1);
    }, 1);
}

function getEffectivenessMessage(multiplier) {
    if (multiplier === 0) return "Ça n'affecte pas l'adversaire...";
    if (multiplier > 1) return "C'est super efficace !";
    if (multiplier < 1) return "Ce n'est pas très efficace...";
    return null;
}

// Petit badge de type réutilisé à la fois pour une attaque (menu de combat)
// et pour une créature (en-tête du combat), pour que le joueur voie
// toujours à quel type il a affaire.
function renderTypeBadge(type) {
    return `<span class="move-type-badge move-type-${type.toLowerCase()}">${type}</span>`;
}

// Indique, avant de choisir l'attaque, si elle sera avantagée/désavantagée
// contre la créature adverse actuellement sur le terrain.
function renderMoveEffectivenessBadge(moveType, defenderType) {

    const multiplier = getTypeMultiplier(moveType, defenderType);

    if (multiplier === 0) {
        return `<span class="move-effectiveness move-effectiveness-immune">Inefficace</span>`;
    }

    if (multiplier > 1) {
        return `<span class="move-effectiveness move-effectiveness-super">Super efficace</span>`;
    }

    if (multiplier < 1) {
        return `<span class="move-effectiveness move-effectiveness-weak">Peu efficace</span>`;
    }

    return "";
}

// Badge du coût en MP d'une attaque, dans le menu de combat, marqué en
// rouge si la créature n'a plus assez de MP pour se la payer.
function renderMoveMpBadge(move, creature) {

    const affordable = canAffordMove(creature, move);

    return `<span class="move-mp-cost${affordable ? "" : " move-mp-cost-unaffordable"}">${move.mpCost} MP</span>`;
}

// Coût en MP d'une attaque, proportionnel à sa puissance (une attaque deux
// fois plus puissante coûte deux fois plus de MP) : plus une attaque tape
// fort, moins on peut la lancer de fois d'affilée sans se reposer.
const MP_COST_FACTOR = 10;

function getMoveMpCost(power) {
    return Math.max(1, Math.round(power * MP_COST_FACTOR));
}

function getMovesForType(type) {
    const moves = MOVE_POOL[type] || MOVE_POOL.Normal;
    const moveType = MOVE_POOL[type] ? type : "Normal";
    return moves.map(move => ({ ...move, type: moveType, mpCost: getMoveMpCost(move.power) }));
}

// Tire au sort (sans répétition) MOVES_PER_CREATURE attaques parmi celles
// du type de la créature, pour que deux créatures du même type puissent
// jouer différemment.
function pickMovesForCreature(type) {

    const pool = getMovesForType(type);

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, MOVES_PER_CREATURE);
}

// Attaque de repli utilisée quand une créature n'a plus assez de MP pour
// aucune de ses attaques (comme "Lutte" dans les jeux officiels) : gratuite,
// mais inflige un contrecoup à celui qui l'utilise.
const STRUGGLE_MOVE = {
    name: "Lutte",
    power: 0.5,
    type: "Normal",
    mpCost: 0,
    isStruggle: true
};

function canAffordMove(creature, move) {
    return creature.mp >= move.mpCost;
}

function hasAffordableMove(creature) {
    return !!creature.attacks && creature.attacks.some(move => canAffordMove(creature, move));
}

// Choisit une attaque au hasard parmi celles que la créature peut encore se
// payer ; si aucune n'est abordable, elle se rabat sur Lutte.
function pickAffordableMove(creature) {

    if (!creature.attacks || creature.attacks.length === 0) {
        return STRUGGLE_MOVE;
    }

    const affordable = creature.attacks.filter(move => canAffordMove(creature, move));

    if (affordable.length === 0) {
        return STRUGGLE_MOVE;
    }

    return affordable[Math.floor(Math.random() * affordable.length)];
}

// Objets en vente à la boutique
const SHOP_ITEMS = [
    {
        id: "potion",
        name: "Potion",
        icon: "🧪",
        price: 15,
        description: "Soigne 20 PV d'une créature."
    },
    {
        id: "capture_sphere",
        name: "Sphère de Capture",
        icon: "🔴",
        price: 25,
        description: "Permet de tenter de capturer une créature sauvage."
    },
    {
        id: "ether",
        name: "Élixir",
        icon: "🔷",
        price: 20,
        description: "Restaure 20 MP d'une créature."
    }
];

function getShopItem(id) {
    return SHOP_ITEMS.find(item => item.id === id) || null;
}

// Personnages non-joueurs du village
const NPCS = [
    {
        id: "elder",
        name: "Papi Ancien",
        tileX: 3,
        tileY: 3,
        color: "#7a5c3e",
        type: "dialogue",
        icon: "💬",
        lines: [
            "Bienvenue dans notre village, jeune dresseur !",
            "Les hautes herbes cachent des créatures sauvages, sois prudent."
        ]
    },
    {
        id: "merchant",
        name: "Marchande Léa",
        tileX: 11,
        tileY: 4,
        color: "#c2478c",
        type: "shop",
        icon: "🛒",
        lines: [
            "Bienvenue dans ma boutique !",
            "J'ai de quoi t'aider pour l'exploration et le combat."
        ]
    },
    {
        id: "trainer",
        name: "Dresseur Théo",
        tileX: 3,
        tileY: 9,
        color: "#2b6cb0",
        type: "battle",
        icon: "⚔️",
        lines: [
            "Une créature contre une créature, ça te dit ?"
        ],
        defeatedLine: "Tu es plus fort que moi, bravo !",
        team: [
            { speciesId: 16, level: 6 }
        ],
        reward: 30
    },
    {
        id: "fisher",
        name: "Pêcheur Yann",
        tileX: 5,
        tileY: 12,
        color: "#1f6fa8",
        type: "battle",
        icon: "🎣",
        lines: [
            "L'eau n'a aucun secret pour moi. Un combat ?"
        ],
        defeatedLine: "Bien joué, tu nages... euh, tu combats bien !",
        team: [
            { speciesId: 20, level: 8 },
            { speciesId: 28, level: 9 }
        ],
        reward: 60
    },
    {
        id: "hiker_forest",
        name: "Randonneuse Clara",
        tileX: 20,
        tileY: 11,
        color: "#3f8f3a",
        type: "battle",
        icon: "🌲",
        lines: [
            "La forêt regorge de créatures Plante. Prouve ta valeur !"
        ],
        defeatedLine: "Impressionnant, tu connais bien la forêt !",
        team: [
            { speciesId: 10, level: 9 },
            { speciesId: 19, level: 10 }
        ],
        reward: 70
    },
    {
        id: "adventurer_desert",
        name: "Aventurier Marco",
        tileX: 22,
        tileY: 12,
        color: "#c99a4a",
        type: "battle",
        icon: "🏜️",
        lines: [
            "Le désert forge les dresseurs les plus endurants."
        ],
        defeatedLine: "Tu as la trempe d'un vrai dresseur du désert !",
        team: [
            { speciesId: 21, level: 10 },
            { speciesId: 24, level: 11 }
        ],
        reward: 80
    },
    {
        id: "volcano_trainer",
        name: "Pyromane Igor",
        tileX: 35,
        tileY: 11,
        color: "#c0392b",
        type: "battle",
        icon: "🌋",
        lines: [
            "Sens la chaleur de mes créatures !"
        ],
        defeatedLine: "Mes flammes n'ont pas suffi... bien joué !",
        team: [
            { speciesId: 1, level: 12 },
            { speciesId: 2, level: 14 }
        ],
        reward: 100
    },
    {
        id: "arctic_trainer",
        name: "Exploratrice Nao",
        tileX: 35,
        tileY: 12,
        color: "#4a90c9",
        type: "battle",
        icon: "❄️",
        lines: [
            "Seuls les plus forts survivent ici. Montre-moi ta force !"
        ],
        defeatedLine: "Tu as bravé le froid et gagné, respect !",
        team: [
            { speciesId: 8, level: 14 },
            { speciesId: 28, level: 15 }
        ],
        reward: 100
    }
];

// PNJ présents dans le Centre Fakemon
const CENTER_NPCS = [
    {
        id: "nurse",
        name: "Infirmière",
        tileX: 10,
        tileY: 3,
        color: "#ff69b4",
        type: "heal",
        icon: "💗",
        lines: [
            "Bonjour ! Bienvenue au Centre Fakemon !",
            "Je peux soigner gratuitement toute ton équipe.",
            "Voilà ! Toutes tes créatures sont maintenant en pleine forme !"
        ]
    },
    {
        id: "center_vendor",
        name: "Vendeur Tom",
        tileX: 6,
        tileY: 11,
        color: "#c2478c",
        type: "shop",
        icon: "🛒",
        lines: [
            "Bienvenue ! Repose-toi et fais le plein de fournitures avant de repartir à l'aventure."
        ]
    }
];

// Arènes, une par biome. L'ordre du tableau est l'ordre de progression :
// chaque maître d'arène refuse de combattre tant que le précédent n'est pas battu.
const GYMS = [
    {
        id: "gym_bourg_palette",
        zone: "🏘️ Bourg Palette",
        leaderName: "Léa",
        badge: "Badge Bourgeon",
        icon: "🌱",
        color: "#3f8f3a",
        doorX: 10,
        doorY: 10,
        lines: ["Bienvenue dans l'Arène Bourgeon ! Voyons ce que tu vaux."],
        defeatedLine: "Ma médaille est à toi, dresseur !",
        requiresGymId: null,
        team: [
            { speciesId: 10, level: 4 },
            { speciesId: 16, level: 6 },
            { speciesId: 36, level: 10 }
        ],
        reward: 100
    },
    {
        id: "gym_lac_azur",
        zone: "🌊 Lac Azur",
        leaderName: "Yumi",
        badge: "Badge Vague",
        icon: "💧",
        color: "#1f6fa8",
        doorX: 2,
        doorY: 22,
        lines: ["L'Arène Vague t'attendait. Prête à plonger ?"],
        defeatedLine: "Tu nages en plein succès, bravo !",
        requiresGymId: "gym_bourg_palette",
        team: [
            { speciesId: 20, level: 4 },
            { speciesId: 28, level: 6 },
            { speciesId: 42, level: 10 }
        ],
        reward: 100
    },
    {
        id: "gym_foret_sombre",
        zone: "🌲 Forêt Sombre",
        leaderName: "Elouan",
        badge: "Badge Forêt",
        icon: "🍃",
        color: "#2f6b30",
        doorX: 27,
        doorY: 2,
        lines: ["La forêt n'a aucun secret pour moi. Montre-moi ta force !"],
        defeatedLine: "Impressionnant, la forêt t'accepte !",
        requiresGymId: "gym_lac_azur",
        team: [
            { speciesId: 19, level: 10 },
            { speciesId: 39, level: 12 },
            { speciesId: 18, level: 16 }
        ],
        reward: 150
    },
    {
        id: "gym_route_sablonneuse",
        zone: "🏜️ Route Sablonneuse",
        leaderName: "Karim",
        badge: "Badge Dune",
        icon: "🌵",
        color: "#c99a4a",
        doorX: 27,
        doorY: 20,
        lines: ["Le désert forge les champions. En es-tu un ?"],
        defeatedLine: "Tu as la trempe d'un vrai champion du désert !",
        requiresGymId: "gym_foret_sombre",
        team: [
            { speciesId: 21, level: 10 },
            { speciesId: 24, level: 12 },
            { speciesId: 60, level: 16 }
        ],
        reward: 150
    },
    {
        id: "gym_zone_volcanique",
        zone: "🌋 Zone Volcanique",
        leaderName: "Ardan",
        badge: "Badge Braise",
        icon: "🔥",
        color: "#c0392b",
        doorX: 42,
        doorY: 3,
        lines: ["Sens la chaleur de l'Arène Braise !"],
        defeatedLine: "Mes flammes s'inclinent devant toi !",
        requiresGymId: "gym_route_sablonneuse",
        team: [
            { speciesId: 31, level: 18 },
            { speciesId: 34, level: 20 },
            { speciesId: 51, level: 24 }
        ],
        reward: 250
    },
    {
        id: "gym_zone_arctique",
        zone: "❄️ Zone Arctique",
        leaderName: "Freya",
        badge: "Badge Gel",
        icon: "❄️",
        color: "#4a90c9",
        doorX: 42,
        doorY: 20,
        lines: ["Seuls les plus forts survivent à l'Arène Gel. Prêt ?"],
        defeatedLine: "Tu as bravé le froid jusqu'au bout, respect !",
        requiresGymId: "gym_zone_volcanique",
        team: [
            { speciesId: 15, level: 18 },
            { speciesId: 23, level: 20 },
            { speciesId: 54, level: 24 }
        ],
        reward: 250
    }
];

// Id de la dernière arène du jeu : sert de condition pour débloquer le
// Plateau des Légendes, la zone bonus accessible après avoir battu Freya.
const LAST_GYM_ID = GYMS[GYMS.length - 1].id;

let currentPlayer = {
    pseudo: "",
    team: [],
    storage: [],
    inventory: [],
    npcGifts: [],
    defeatedTrainers: [],
    activeCreature: 0,
    position: null,
    pokedex: { seen: [], caught: [] },
    money: 300
};

const MAX_TEAM_SIZE = 6;

startButton.addEventListener("click", startGame);
pokedexButton.addEventListener("click", openPokedex);
pvpButton.addEventListener("click", openPvpMenu);
tradeButton.addEventListener("click", openTradeMenu);

// ==========================================================
// Client Supabase (backend partagé nécessaire pour le PvP — US19 —
// et pour le compte joueur pseudo + mot de passe)
//
// SUPABASE_URL et SUPABASE_ANON_KEY viennent de supabase-config.js,
// chargé avant game.js. Tant qu'ils gardent leur valeur d'exemple, le PvP
// et le système de compte restent désactivés : le jeu se comporte comme
// avant (pseudo libre, sauvegarde locale uniquement), sans rien casser
// pour un joueur qui n'a pas configuré Supabase.
// ==========================================================

let supabaseClient = null;

function isSupabaseConfigured() {
    return (
        typeof SUPABASE_URL === "string" &&
        typeof SUPABASE_ANON_KEY === "string" &&
        !SUPABASE_URL.includes("VOTRE-PROJET") &&
        !SUPABASE_ANON_KEY.includes("VOTRE_CLE")
    );
}

function getSupabaseClient() {
    if (!isSupabaseConfigured()) return null;

    if (!supabaseClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    return supabaseClient;
}

// ==========================================================
// Compte joueur (pseudo + mot de passe)
//
// Utilise Supabase Auth avec un e-mail "synthétique" dérivé du pseudo
// (ex. "Sacha" -> "sacha@monsterquest.local"), pour n'exposer au joueur
// qu'un formulaire pseudo + mot de passe. Supabase gère le hachage du
// mot de passe et les sessions ; l'unicité de l'e-mail garantit au passage
// l'unicité du pseudo.
//
// Ce compte sert uniquement à identifier le joueur (utile pour le PvP,
// où il évite qu'un autre joueur usurpe un pseudo). La sauvegarde de
// partie reste locale (localStorage), simplement isolée par compte via
// une clé différente pour chaque utilisateur connecté.
// ==========================================================

let authUser = null;

function pseudoToAuthEmail(pseudo) {
    const slug = pseudo
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");

    return `${slug}@monsterquest.local`;
}

function showAuthError(message) {
    authError.textContent = message;
}

function clearAuthError() {
    authError.textContent = "";
}

function setAuthFormDisabled(disabled) {
    loginButton.disabled = disabled;
    registerButton.disabled = disabled;
}

function validatePseudoAndPassword(pseudo, password) {
    if (pseudo.length < 3) {
        showAuthError("Le pseudo doit faire au moins 3 caractères.");
        return false;
    }

    if (pseudoToAuthEmail(pseudo).startsWith("@")) {
        showAuthError("Ce pseudo doit contenir au moins une lettre ou un chiffre.");
        return false;
    }

    if (password.length < 6) {
        showAuthError("Le mot de passe doit faire au moins 6 caractères.");
        return false;
    }

    return true;
}

async function registerWithPseudo() {

    const client = getSupabaseClient();

    if (!client) return;

    clearAuthError();

    const pseudo = pseudoInput.value.trim();
    const password = passwordInput.value;

    if (!validatePseudoAndPassword(pseudo, password)) return;

    setAuthFormDisabled(true);

    const { data, error } = await client.auth.signUp({
        email: pseudoToAuthEmail(pseudo),
        password,
        options: { data: { pseudo } }
    });

    setAuthFormDisabled(false);

    if (error) {
        if (/registered|exists/i.test(error.message || "")) {
            showAuthError("Ce pseudo est déjà pris.");
        } else {
            showAuthError("Impossible de créer le compte : " + error.message);
        }
        return;
    }

    if (!data.session) {
        showAuthError(
            "Compte créé, mais aucune session n'a été ouverte. " +
            "Vérifie que la confirmation par e-mail est désactivée dans " +
            "Authentication > Providers > Email sur ton projet Supabase, " +
            "puis connecte-toi."
        );
        return;
    }

    onAuthSuccess(data.user);
}

async function loginWithPseudo() {

    const client = getSupabaseClient();

    if (!client) return;

    clearAuthError();

    const pseudo = pseudoInput.value.trim();
    const password = passwordInput.value;

    if (pseudo.length === 0 || password.length === 0) {
        showAuthError("Entre ton pseudo et ton mot de passe.");
        return;
    }

    setAuthFormDisabled(true);

    const { data, error } = await client.auth.signInWithPassword({
        email: pseudoToAuthEmail(pseudo),
        password
    });

    setAuthFormDisabled(false);

    if (error) {
        showAuthError("Pseudo ou mot de passe incorrect.");
        return;
    }

    onAuthSuccess(data.user);
}

function onAuthSuccess(user) {

    authUser = user;
    clearAuthError();

    logoutButton.classList.remove("hidden");

    const pseudo = (user.user_metadata && user.user_metadata.pseudo) || pseudoInput.value.trim();

    loadGameForUser(user.id, pseudo);
}

async function logout() {

    const client = getSupabaseClient();

    if (client) {
        await client.auth.signOut();
    }

    // Le moyen le plus sûr de repartir sur un état propre (équipe, carte,
    // fenêtres ouvertes, etc.) est de recharger la page : le prochain
    // initGame() retrouvera qu'il n'y a plus de session et réaffichera
    // l'écran de connexion.
    location.reload();
}

loginButton.addEventListener("click", loginWithPseudo);
registerButton.addEventListener("click", registerWithPseudo);
logoutButton.addEventListener("click", logout);

passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginWithPseudo();
});

function startGame() {
    const pseudo = pseudoInput.value.trim();

    // Vérifier que le joueur a renseigné un pseudo
    if (pseudo === "") {
        alert("Veuillez entrer un pseudo !");
        return;
    }

    currentPlayer.pseudo = pseudo;

    // Cacher l'écran d'accueil
    startScreen.classList.add("hidden");

    // Afficher l'écran de sélection de créature
    showCreatureSelection();
}

function showCreatureSelection() {
    // Vider la sélection
    creatureSelection.innerHTML = "";

    // Créer les cartes de créature
    STARTER_CREATURES.forEach(creature => {
        const card = document.createElement("div");
        card.className = "creature-card";
        card.innerHTML = `
            <img src="fakemon_creatures/${String(creature.id).padStart(3, '0')}.png" alt="${creature.name}">
            <h3>${creature.name}</h3>
            <p>Type: ${creature.type}</p>
            <button onclick="selectCreature(${creature.id}, '${creature.name}', '${creature.type}')">
                Choisir
            </button>
        `;
        creatureSelection.appendChild(card);
    });

    // Afficher l'écran de sélection
    creatureScreen.classList.remove("hidden");
}

// Base de MP par type au niveau 5, avant application du niveau (voir
// getMaxMpForCreature ci-dessous). Séparée de la table de stats principale
// pour pouvoir être réutilisée lors de la migration d'anciennes sauvegardes
// (voir applySavedGame) sans dupliquer les nombres magiques.
const MP_BASE_BY_TYPE = {
    Feu: 36,
    Plante: 44,
    Eau: 40
};

function getMaxMpForCreature(type, level) {
    const base = MP_BASE_BY_TYPE[type] || 40;
    return base + (level - 5) * 3;
}

function createCreature(id, name, type, level = 5) {
    const stats = {
        Feu: {
            maxHp: 24,
            attack: 14,
            defense: 10,
            speed: 13
        },
        Plante: {
            maxHp: 26,
            attack: 11,
            defense: 13,
            speed: 9
        },
        Eau: {
            maxHp: 25,
            attack: 12,
            defense: 11,
            speed: 11
        }
    };

    const base = stats[type] || {
        maxHp: 25,
        attack: 12,
        defense: 10,
        speed: 10
    };

    // Les stats de base ci-dessus correspondent au niveau 5 (niveau de départ
    // des starters). On les fait évoluer avec le niveau, avec les mêmes
    // incréments que levelUpCreature(), pour qu'une créature créée directement
    // à un niveau élevé (sauvage, dresseur, arène) soit aussi forte qu'une
    // créature montée jusque-là niveau par niveau.
    const levelDiff = level - 5;

    const maxHp = base.maxHp + levelDiff * 2;
    const attack = base.attack + levelDiff * 1;
    const defense = base.defense + levelDiff * 1;
    const speed = base.speed + levelDiff * 1;
    const maxMp = getMaxMpForCreature(type, level);

    return {
        uid: Date.now() + Math.random(),

        id,
        name,
        type,

        level,
        xp: 0,

        maxHp,
        hp: maxHp,

        maxMp,
        mp: maxMp,

        attack,
        defense,
        speed,

        fainted: false,

        attacks: pickMovesForCreature(type)
    };
}

function updateMoneyDisplay() {
    moneyDisplay.textContent = `💰 ${currentPlayer.money}`;
}

function updateTeamDisplay() {
    teamDisplay.innerHTML = "";

    currentPlayer.team.forEach((creature, index) => {
        const creatureDiv = document.createElement("div");

        creatureDiv.className = "team-creature";

        if (index === currentPlayer.activeCreature) {
            creatureDiv.classList.add("active");
        }

        const hpPercent = Math.max(
            0,
            Math.min(100, (creature.hp / creature.maxHp) * 100)
        );

        creatureDiv.innerHTML = `
            <img
                src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png"
                alt="${creature.name}"
            >

            <div class="team-creature-info">
                <strong>${creature.name}</strong>
                <span>Nv. ${creature.level}</span>

                <div class="hp-bar">
                    <div
                        class="hp-fill"
                        style="width: ${hpPercent}%"
                    ></div>
                </div>

                <small>
                    ${creature.hp}/${creature.maxHp} PV
                </small>
            </div>
        `;

        // Cliquer sur la créature
        creatureDiv.addEventListener("click", () => {
            openCreatureMenu(index);
        });

        teamDisplay.appendChild(creatureDiv);
    });
}

function openCreatureMenu(index) {

    const creature = currentPlayer.team[index];

    if (!creature) return;

    // Éviter plusieurs menus
    const oldMenu = document.getElementById("creatureMenu");

    if (oldMenu) {
        oldMenu.remove();
    }

    const menu = document.createElement("div");

    menu.id = "creatureMenu";

    menu.innerHTML = `
        <div class="creature-menu-box">

            <div class="creature-menu-header">
                <h2>${creature.name}</h2>
                <button id="closeCreatureMenu">✕</button>
            </div>

            <img
                class="creature-menu-sprite"
                src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png"
                alt="${creature.name}"
            >

            <p>
                Type : ${creature.type}<br>
                Niveau : ${creature.level}<br>
                PV : ${creature.hp}/${creature.maxHp}<br>
                MP : ${creature.mp}/${creature.maxMp}
            </p>

            <div class="creature-menu-actions">

                <button id="mainCreatureButton">
                    ⭐ Devenir la créature principale
                </button>

                <button id="healCreatureButton">
                    💊 Soigner
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(menu);

    document
        .getElementById("closeCreatureMenu")
        .addEventListener("click", closeCreatureMenu);

    document
        .getElementById("mainCreatureButton")
        .addEventListener("click", () => {
            setActiveCreature(index);
        });

    document
        .getElementById("healCreatureButton")
        .addEventListener("click", () => {
            openHealingMenu(index);
        });
}

function setActiveCreature(index) {

    const creature = currentPlayer.team[index];

    if (!creature) return;

    if (creature.hp <= 0) {
        alert(
            `${creature.name} est K.O. ! Elle doit être soignée avant de devenir la créature principale.`
        );
        return;
    }

    currentPlayer.activeCreature = index;

    updateTeamDisplay();
    saveGame();

    closeCreatureMenu();

    alert(
        `${creature.name} est maintenant ta créature principale !`
    );
}

function openHealingMenu(index) {

    const creature = currentPlayer.team[index];

    if (!creature) return;

    const menu = document.getElementById("creatureMenu");

    if (!menu) return;

    // Chercher les objets de soin disponibles
    const healingItems = currentPlayer.inventory.filter(
        item => item.id === "potion"
    );

    const etherItems = currentPlayer.inventory.filter(
        item => item.id === "ether"
    );

    const actions = menu.querySelector(".creature-menu-actions");

    if (!actions) return;


    // Aucun objet de soin
    if (healingItems.length === 0 && etherItems.length === 0) {

        actions.innerHTML = `
            <p class="no-healing">
                ❌ Tu n'as aucun objet de soin.
            </p>

            <button id="backCreatureMenu">
                ◀ Retour
            </button>
        `;

        document
            .getElementById("backCreatureMenu")
            .addEventListener("click", () => {

                closeCreatureMenu();
                openCreatureMenu(index);

            });

        return;
    }


    // Objets disponibles
    actions.innerHTML = `
        <h3>💊 Objets de soin</h3>

        ${healingItems.length > 0 ? `
            <button id="usePotionButton">
                🧪 Potion (${healingItems.length})
            </button>
        ` : ""}

        ${etherItems.length > 0 ? `
            <button id="useEtherButton">
                🔷 Élixir (${etherItems.length})
            </button>
        ` : ""}

        <button id="backCreatureMenu">
            ◀ Retour
        </button>
    `;


    const potionBtn = document.getElementById("usePotionButton");
    if (potionBtn) {
        potionBtn.addEventListener("click", () => {
            usePotion(index);
        });
    }

    const etherBtn = document.getElementById("useEtherButton");
    if (etherBtn) {
        etherBtn.addEventListener("click", () => {
            useEther(index);
        });
    }


    document
        .getElementById("backCreatureMenu")
        .addEventListener("click", () => {

            closeCreatureMenu();
            openCreatureMenu(index);

        });
}


function usePotion(index) {

    const creature = currentPlayer.team[index];

    if (!creature) return;


    // Trouver une potion
    const potionIndex = currentPlayer.inventory.findIndex(
        item => item.id === "potion"
    );

    if (potionIndex === -1) {

        alert("Tu n'as aucune potion !");

        return;
    }


    // Créature déjà au maximum
    if (creature.hp >= creature.maxHp) {

        alert(
            `${creature.name} a déjà tous ses PV !`
        );

        return;
    }


    const oldHp = creature.hp;


    // La potion soigne 20 PV
    creature.hp = Math.min(
        creature.maxHp,
        creature.hp + 20
    );


    const healed = creature.hp - oldHp;


    // Retirer la potion de l'inventaire
    currentPlayer.inventory.splice(
        potionIndex,
        1
    );


    updateTeamDisplay();
    saveGame();


    alert(
        `${creature.name} récupère ${healed} PV !`
    );


    closeCreatureMenu();
}


function useEther(index) {

    const creature = currentPlayer.team[index];

    if (!creature) return;


    // Trouver un élixir
    const etherIndex = currentPlayer.inventory.findIndex(
        item => item.id === "ether"
    );

    if (etherIndex === -1) {

        alert("Tu n'as aucun élixir !");

        return;
    }


    // Créature déjà au maximum
    if (creature.mp >= creature.maxMp) {

        alert(
            `${creature.name} a déjà tous ses MP !`
        );

        return;
    }


    const oldMp = creature.mp;


    // L'élixir restaure 20 MP
    creature.mp = Math.min(
        creature.maxMp,
        creature.mp + 20
    );


    const restored = creature.mp - oldMp;


    // Retirer l'élixir de l'inventaire
    currentPlayer.inventory.splice(
        etherIndex,
        1
    );


    updateTeamDisplay();
    saveGame();


    alert(
        `${creature.name} récupère ${restored} MP !`
    );


    closeCreatureMenu();
}


function closeCreatureMenu() {

    const menu = document.getElementById("creatureMenu");

    if (menu) {
        menu.remove();
    }
}



function selectCreature(id, name, type) {
    const creature = createCreature(id, name, type, 5);

    currentPlayer.team = [creature];
    currentPlayer.activeCreature = 0;

    markPokedexCaught(creature.id);

    playerName.textContent = "👤 " + currentPlayer.pseudo;

    updateTeamDisplay();
    updateMoneyDisplay();

    creatureScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    currentPlayer.position = {
        x: player.tileX,
        y: player.tileY
    };

    saveGame();
}

function addCreatureToTeam(creature) {
    if (currentPlayer.team.length >= MAX_TEAM_SIZE) {
        alert("Ton équipe est complète ! Maximum 6 créatures.");
        return false;
    }

    currentPlayer.team.push(creature);

    updateTeamDisplay();
    saveGame();

    return true;
}

// Sans compte (Supabase non configuré), la sauvegarde est unique par
// navigateur. Une fois connecté (authUser défini), chaque compte a sa
// propre clé, pour que deux comptes sur le même navigateur ne se marchent
// pas dessus.
function getSaveKey() {
    return authUser ? `playerData:${authUser.id}` : "playerData";
}

function saveGame() {
    localStorage.setItem(getSaveKey(), JSON.stringify(currentPlayer));
    console.log("Partie sauvegardée:", currentPlayer);
}

function loadGame() {

    const saved = localStorage.getItem("playerData");

    if (!saved) return;

    applySavedGame(saved);
}

// Appelée après une connexion/inscription réussie : reprend la sauvegarde
// de ce compte si elle existe, sinon démarre une nouvelle partie (sélection
// de créature de départ) avec le pseudo du compte déjà rempli.
function loadGameForUser(userId, pseudo) {

    const saved = localStorage.getItem(`playerData:${userId}`);

    if (saved) {
        applySavedGame(saved);
        return;
    }

    currentPlayer.pseudo = pseudo;
    startScreen.classList.add("hidden");
    showCreatureSelection();
}

function applySavedGame(saved) {

    currentPlayer = JSON.parse(saved);

    if (!Array.isArray(currentPlayer.storage)) {
        currentPlayer.storage = [];
    }

    if (!Array.isArray(currentPlayer.inventory)) {
        currentPlayer.inventory = [];
    }

    if (!Array.isArray(currentPlayer.npcGifts)) {
        currentPlayer.npcGifts = [];
    }

    if (!Array.isArray(currentPlayer.defeatedTrainers)) {
        currentPlayer.defeatedTrainers = [];
    }


    // =========================
    // ANCIENNES SAUVEGARDES
    // =========================

    if (!currentPlayer.team) {

        currentPlayer.team = [];

        if (currentPlayer.creature) {

            currentPlayer.team.push(
                createCreature(
                    currentPlayer.creature.id,
                    currentPlayer.creature.name,
                    currentPlayer.creature.type
                )
            );
        }

        delete currentPlayer.creature;
    }


    // =========================
    // ATTAQUES (anciennes sauvegardes)
    // =========================

    // Régénère les attaques d'une sauvegarde faite avant l'ajout des 100
    // attaques / des types de dégâts / des MP (fix #35, #36 et le système
    // de MP) : ces anciennes créatures n'avaient pas 4 attaques avec un
    // champ "type" et un coût en MP, donc les avantages de types et la
    // gestion des MP les traitaient de façon incorrecte (efficacité neutre,
    // ou incapables de payer la moindre attaque). On sauvegarde tout de
    // suite le résultat pour que cette mise à jour ne se refasse qu'une
    // seule fois, même si le joueur recharge la page avant toute autre action.
    let attacksMigrated = false;

    [...currentPlayer.team, ...currentPlayer.storage].forEach(creature => {

        const outdated =
            !creature.attacks ||
            creature.attacks.length !== MOVES_PER_CREATURE ||
            creature.attacks.some(move => !move.type || !move.mpCost);

        if (outdated) {
            creature.attacks = pickMovesForCreature(creature.type);
            attacksMigrated = true;
        }

        if (typeof creature.maxMp !== "number") {
            creature.maxMp = getMaxMpForCreature(creature.type, creature.level);
            creature.mp = creature.maxMp;
            attacksMigrated = true;
        }
    });

    if (attacksMigrated) {
        saveGame();
    }


    // =========================
    // POKÉDEX (anciennes sauvegardes)
    // =========================

    if (!currentPlayer.pokedex) {
        currentPlayer.pokedex = { seen: [], caught: [] };
    }

    if (!Array.isArray(currentPlayer.pokedex.seen)) {
        currentPlayer.pokedex.seen = [];
    }

    if (!Array.isArray(currentPlayer.pokedex.caught)) {
        currentPlayer.pokedex.caught = [];
    }

    currentPlayer.team.forEach(creature => markPokedexCaught(creature.id));
    currentPlayer.storage.forEach(creature => markPokedexCaught(creature.id));


    // =========================
    // ARGENT (anciennes sauvegardes)
    // =========================

    if (typeof currentPlayer.money !== "number") {
        currentPlayer.money = 300;
    }


    // =========================
    // CRÉATURE ACTIVE
    // =========================

    if (
        typeof currentPlayer.activeCreature !== "number" ||
        currentPlayer.activeCreature < 0 ||
        currentPlayer.activeCreature >= currentPlayer.team.length
    ) {
        currentPlayer.activeCreature = 0;
    }


    // =========================
    // CARTE ACTUELLE
    // =========================

    if (
        currentPlayer.currentMap === "center" ||
        currentPlayer.currentMap === "world" ||
        currentPlayer.currentMap === "postgame"
    ) {
        currentMap = currentPlayer.currentMap;
    } else {
        currentMap = "world";
    }

    // Le Centre Fakemon de Bourg Palette et celui du Plateau des Légendes
    // partagent la même salle : on restaure d'où le joueur y était entré
    // pour que la sortie le ramène au bon endroit après un rechargement.
    if (currentMap === "center") {
        centerEntryMap = currentPlayer.centerEntryMap || "world";
        centerEntryDoor = currentPlayer.centerEntryDoor || { x: 7, y: 4 };
    }


    // =========================
    // AFFICHAGE
    // =========================

    playerName.textContent =
        "👤 " + currentPlayer.pseudo;

    updateTeamDisplay();
    updateMoneyDisplay();

    startScreen.classList.add("hidden");
    creatureScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");


    // =========================
    // POSITION
    // =========================

    if (currentPlayer.position) {

        setPlayerTile(
            currentPlayer.position.x,
            currentPlayer.position.y
        );
    }


    // =========================
    // NOM DE LA ZONE
    // =========================

    if (currentMap === "center") {
        zoneLabel.textContent = "🏥 Centre Fakemon";
    } else if (currentMap === "postgame") {
        zoneLabel.textContent = POSTGAME_ZONE_NAME;
    } else {
        zoneLabel.textContent =
            getZoneName(player.tileX, player.tileY);
    }
}

// ===================== CARTE DU MONDE =====================

const TILE_SIZE = 32;
const MAP_COLS = 45;
const MAP_ROWS = 24;

const TILES = {
    GRASS: { color: "#5fb84c", walkable: true },
    GRASS_DARK: { color: "#2f6b30", walkable: true },
    PATH: { color: "#d8c48a", walkable: true },
    SAND: { color: "#e8d38a", walkable: true },
    DESERT: { color: "#e0a458", walkable: true },

    WATER: { color: "#3a8ee6", walkable: false },

    TREE: {
        color: "#2f6b30",
        walkable: false,
        deco: "tree"
    },

    ROCK: {
        color: "#e0a458",
        walkable: false,
        deco: "rock"
    },

    HOUSE: {
        color: "#5fb84c",
        walkable: false,
        deco: "house"
    },

    FLOWER: {
        color: "#5fb84c",
        walkable: true,
        deco: "flower"
    },

    TALL_GRASS: {
        color: "#3f8f3a",
        walkable: true,
        deco: "tallgrass",
        encounterZone: true
    },

    BUSH: {
        color: "#3f8f3a",
        walkable: true,
        deco: "bush",
        decoColor: "#1f5c1f"
    },

    DRY_BUSH: {
        color: "#e8d38a",
        walkable: true,
        deco: "bush",
        decoColor: "#8a6d3a"
    },

    // Buisson dense : cache des créatures sauvages (comme les hautes herbes)
    REED_THICKET: {
        color: "#e8d38a",
        walkable: true,
        deco: "thicket",
        decoColor: "#2f6b4a",
        encounterZone: true
    },

    // Zone Volcanique
    ASH: { color: "#5c5248", walkable: true },

    LAVA: {
        color: "#ff5a1f",
        walkable: false,
        deco: "lava"
    },

    OBSIDIAN: {
        color: "#332d26",
        walkable: false,
        deco: "obsidian"
    },

    ASH_BUSH: {
        color: "#5c5248",
        walkable: true,
        deco: "bush",
        decoColor: "#2e2a24"
    },

    ASH_THICKET: {
        color: "#5c5248",
        walkable: true,
        deco: "thicket",
        decoColor: "#b23a1a",
        encounterZone: true
    },

    CACTUS_THICKET: {
        color: "#e0a458",
        walkable: true,
        deco: "thicket",
        decoColor: "#3f7d3f",
        encounterZone: true
    },

    // Zone Arctique
    SNOW: { color: "#eef6fb", walkable: true },

    ICE: {
        color: "#bfe3f5",
        walkable: false,
        deco: "ice"
    },

    PINE: {
        color: "#eef6fb",
        walkable: false,
        deco: "pine"
    },

    SNOW_BUSH: {
        color: "#eef6fb",
        walkable: true,
        deco: "bush",
        decoColor: "#c8dced"
    },

    SNOW_THICKET: {
        color: "#eef6fb",
        walkable: true,
        deco: "thicket",
        decoColor: "#6a9fc0",
        encounterZone: true
    },

    // Centre Fakemon
    CENTER_WALL: {
        color: "#ffffff",
        walkable: false
    },

    CENTER_DOOR: {
        color: "#ffffff",
        walkable: true
    },

    GYM_WALL: {
        color: "#8b5a2b",
        walkable: false
    },

    GYM_DOOR: {
        color: "#e8c15a",
        walkable: true
    },

    // Passage scellé menant au Plateau des Légendes, tout au nord de
    // Bourg Palette. Reste franchissable dans les deux sens, seule
    // l'entrée est bloquée tant que la dernière arène n'est pas battue.
    SUMMIT_GATE: {
        color: "#c9b6e8",
        walkable: true,
        deco: "gate"
    },

    // Façade de l'immense arène du Maître Pokémon, sur le Plateau des Légendes
    ARENA_WALL: {
        color: "#5b2a86",
        walkable: false
    },

    ARENA_DOOR: {
        color: "#f4c430",
        walkable: true
    }
};

function getBaseTile(x, y) {
    const isTop = y < 12;

    if (x < 15) return isTop ? "GRASS" : "SAND";
    if (x < 30) return isTop ? "GRASS_DARK" : "DESERT";
    return isTop ? "ASH" : "SNOW";
}

function placeVillage(grid) {

    // Maisons normales
    const houses = [
        [2, 2],
        [11, 2],
        [2, 8],
        [12, 8]
    ];

    houses.forEach(([x, y]) => {
        grid[y][x] = "HOUSE";
    });


    // =========================
    // CENTRE FAKEMON
    // =========================

    // Position du centre
    // largeur : 5 cases
    // hauteur : 4 cases

    const centerX = 5;
    const centerY = 1;

    for (let y = centerY; y < centerY + 4; y++) {
        for (let x = centerX; x < centerX + 5; x++) {

            // Porte au milieu
            if (x === centerX + 2 && y === centerY + 3) {
                grid[y][x] = "CENTER_DOOR";
            } else {
                grid[y][x] = "CENTER_WALL";
            }
        }
    }


    // Fleurs autour du village
    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 14; x++) {

            // Ne pas mettre de fleurs dans le centre
            const insideCenter =
                x >= centerX &&
                x < centerX + 5 &&
                y >= centerY &&
                y < centerY + 4;

            if (
                !insideCenter &&
                grid[y][x] === "GRASS" &&
                (x * 3 + y * 5) % 17 === 0
            ) {
                grid[y][x] = "FLOWER";
            }
        }
    }
}

function placeForest(grid) {
    for (let y = 0; y < 11; y++) {
        for (let x = 16; x < 29; x++) {
            if ((x * 7 + y * 13) % 5 === 0) {
                grid[y][x] = "TREE";
            }
        }
    }
}

function placeTallGrass(grid) {

    // Zone de hautes herbes près du village
    for (let y = 6; y < 11; y++) {
        for (let x = 8; x < 13; x++) {
            if (grid[y][x] === "GRASS") {
                grid[y][x] = "TALL_GRASS";
            }
        }
    }

    // Zone de hautes herbes en lisière de forêt
    for (let y = 2; y < 9; y++) {
        for (let x = 18; x < 24; x++) {
            if (grid[y][x] === "GRASS_DARK") {
                grid[y][x] = "TALL_GRASS";
            }
        }
    }
}

function placeLake(grid) {
    const cx = 7, cy = 17, rx = 5, ry = 4;
    for (let y = 13; y < MAP_ROWS; y++) {
        for (let x = 0; x < 14; x++) {
            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            if (dx * dx + dy * dy <= 1) {
                grid[y][x] = "WATER";
            }
        }
    }
}

function placeDesert(grid) {
    for (let y = 13; y < MAP_ROWS; y++) {
        for (let x = 16; x < 29; x++) {
            if ((x * 11 + y * 3) % 9 === 0) {
                grid[y][x] = "ROCK";
            }
        }
    }
}

function placeVolcanicZone(grid) {
    for (let y = 0; y < 11; y++) {
        for (let x = 31; x < MAP_COLS; x++) {
            if ((x * 5 + y * 9) % 11 === 0) {
                grid[y][x] = "LAVA";
            } else if ((x * 13 + y * 3) % 7 === 0) {
                grid[y][x] = "OBSIDIAN";
            }
        }
    }
}

function placeArcticZone(grid) {
    for (let y = 13; y < MAP_ROWS; y++) {
        for (let x = 31; x < MAP_COLS; x++) {
            if ((x * 5 + y * 9) % 11 === 0) {
                grid[y][x] = "ICE";
            } else if ((x * 13 + y * 3) % 7 === 0) {
                grid[y][x] = "PINE";
            }
        }
    }
}

function placeEncounterThickets(grid) {

    // Lac Azur : roseaux sur la rive
    for (let y = 13; y < 18; y++) {
        for (let x = 1; x < 6; x++) {
            if (grid[y][x] === "SAND") {
                grid[y][x] = "REED_THICKET";
            }
        }
    }

    // Route Sablonneuse : buissons de cactus
    for (let y = 17; y < 22; y++) {
        for (let x = 20; x < 25; x++) {
            if (grid[y][x] === "DESERT") {
                grid[y][x] = "CACTUS_THICKET";
            }
        }
    }

    // Zone Volcanique : broussailles calcinées
    for (let y = 2; y < 7; y++) {
        for (let x = 36; x < 41; x++) {
            if (grid[y][x] === "ASH") {
                grid[y][x] = "ASH_THICKET";
            }
        }
    }

    // Zone Arctique : buissons givrés denses
    for (let y = 17; y < 22; y++) {
        for (let x = 36; x < 41; x++) {
            if (grid[y][x] === "SNOW") {
                grid[y][x] = "SNOW_THICKET";
            }
        }
    }
}

function placeBushes(grid) {

    // Bourg Palette : buissons dans l'herbe autour du village
    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 14; x++) {
            if (grid[y][x] === "GRASS" && (x * 5 + y * 7) % 23 === 0) {
                grid[y][x] = "BUSH";
            }
        }
    }

    // Forêt Sombre : buissons entre les arbres
    for (let y = 0; y < 11; y++) {
        for (let x = 16; x < 29; x++) {
            if (grid[y][x] === "GRASS_DARK" && (x * 9 + y * 2) % 13 === 0) {
                grid[y][x] = "BUSH";
            }
        }
    }

    // Lac Azur : buissons secs sur le sable
    for (let y = 13; y < MAP_ROWS; y++) {
        for (let x = 0; x < 14; x++) {
            if (grid[y][x] === "SAND" && (x * 3 + y * 11) % 17 === 0) {
                grid[y][x] = "DRY_BUSH";
            }
        }
    }

    // Route Sablonneuse : buissons secs entre les rochers
    for (let y = 13; y < MAP_ROWS; y++) {
        for (let x = 16; x < 29; x++) {
            if (grid[y][x] === "DESERT" && (x * 3 + y * 17) % 13 === 0) {
                grid[y][x] = "DRY_BUSH";
            }
        }
    }

    // Zone Volcanique : buissons calcinés
    for (let y = 0; y < 11; y++) {
        for (let x = 31; x < MAP_COLS; x++) {
            if (grid[y][x] === "ASH" && (x * 7 + y * 5) % 19 === 0) {
                grid[y][x] = "ASH_BUSH";
            }
        }
    }

    // Zone Arctique : buissons givrés
    for (let y = 13; y < MAP_ROWS; y++) {
        for (let x = 31; x < MAP_COLS; x++) {
            if (grid[y][x] === "SNOW" && (x * 7 + y * 5) % 19 === 0) {
                grid[y][x] = "SNOW_BUSH";
            }
        }
    }
}

// Emplacement du passage vers le Plateau des Légendes : au tout nord de
// Bourg Palette, dans le coin libre près du chemin vers la Forêt Sombre.
const SUMMIT_GATE_X = 13;
const SUMMIT_GATE_Y = 0;

function placeSummitGate(grid) {
    grid[SUMMIT_GATE_Y][SUMMIT_GATE_X] = "SUMMIT_GATE";
}

function buildMap() {
    const grid = [];
    for (let y = 0; y < MAP_ROWS; y++) {
        const row = [];
        for (let x = 0; x < MAP_COLS; x++) {
            row.push(getBaseTile(x, y));
        }
        grid.push(row);
    }

    // Chemin qui relie les zones
    for (let x = 0; x < MAP_COLS; x++) {
        grid[11][x] = "PATH";
        grid[12][x] = "PATH";
    }
    for (let y = 0; y < MAP_ROWS; y++) {
        grid[y][14] = "PATH";
        grid[y][15] = "PATH";
        grid[y][29] = "PATH";
        grid[y][30] = "PATH";
    }

    placeVillage(grid);
    placeForest(grid);
    placeTallGrass(grid);
    placeLake(grid);
    placeDesert(grid);
    placeVolcanicZone(grid);
    placeArcticZone(grid);
    placeEncounterThickets(grid);
    placeBushes(grid);
    placeGyms(grid);
    placeSummitGate(grid);

    return grid;
}

// Place le petit bâtiment de chaque arène (3 cases de mur + une porte) sur la carte
function placeGyms(grid) {
    GYMS.forEach(gym => {

        // Bâtiment plein de 3 cases de large sur 3 de haut, comme le Centre Fakemon
        for (let y = gym.doorY - 2; y <= gym.doorY; y++) {
            for (let x = gym.doorX - 1; x <= gym.doorX + 1; x++) {
                grid[y][x] = "GYM_WALL";
            }
        }

        // Porte au milieu du mur du bas
        grid[gym.doorY][gym.doorX] = "GYM_DOOR";

        // Case d'accès devant la porte : toujours praticable, même si un
        // rocher/pin/lave y avait été placé par la génération de la zone
        grid[gym.doorY + 1][gym.doorX] = "PATH";
    });
}

function getZoneName(x, y) {
    const isTop = y < 12;

    if (x < 15) return isTop ? "🏘️ Bourg Palette" : "🌊 Lac Azur";
    if (x < 30) return isTop ? "🌲 Forêt Sombre" : "🏜️ Route Sablonneuse";
    return isTop ? "🌋 Zone Volcanique" : "❄️ Zone Arctique";
}

const mapGrid = buildMap();

// ===================== JOUEUR =====================

let player = {
    tileX: 6,
    tileY: 5,
    pixelX: 6 * TILE_SIZE,
    pixelY: 5 * TILE_SIZE,
    targetPixelX: 6 * TILE_SIZE,
    targetPixelY: 5 * TILE_SIZE,
    moving: false,
    direction: "down",
    speed: 3,
};

let currentMap = "world";

let pcOpen = false;
let pokedexOpen = false;
let shopOpen = false;

// Menu de triche (touche C) : réservé au compte "Lucas", permet de donner
// de l'XP à volonté à une créature de l'équipe pour faciliter les tests.
let cheatMenuOpen = false;

const CHEAT_ACCOUNT_PSEUDO = "Lucas";

function isCheatAccount() {
    return (
        typeof currentPlayer.pseudo === "string" &&
        currentPlayer.pseudo.trim().toLowerCase() === CHEAT_ACCOUNT_PSEUDO.toLowerCase()
    );
}

let encounterOpen = false;
let wildEncounterCreature = null;

let dialogueOpen = false;
let currentDialogueNPC = null;
let currentDialogueLineIndex = 0;

let battleOpen = false;
let battlePlayerCreature = null;
let battleWildCreature = null;
let battleEnded = false;

// Combat de dresseur : dresseur affronté, son équipe complète et l'index du combattant actuel
let battleTrainer = null;
let battleTrainerTeam = [];
let battleTrainerIndex = 0;

// Combat PvP (US19) : pvpOpen couvre à la fois le menu de création/connexion
// et la fenêtre de combat en ligne. pvpMatch contient tout l'état de la
// partie en cours (rôle, code, canal Supabase, dernière ligne connue).
let pvpOpen = false;
let pvpMatch = null;

// Recherche d'adversaire (matchmaking) : { rowId, channel } tant qu'on est
// dans la file d'attente pvp_queue, null sinon.
let pvpSearch = null;

// Échange entre joueurs (US18) : mêmes principes que le PvP (fenêtre de
// menu + session active), mais table et logique séparées.
let tradeOpen = false;
let tradeSession = null;

const CENTER_COLS = 20;
const CENTER_ROWS = 15;

let centerMap = [];

function buildCenterMap() {

    const grid = [];

    for (let y = 0; y < CENTER_ROWS; y++) {

        const row = [];

        for (let x = 0; x < CENTER_COLS; x++) {

            // Murs
            if (
                x === 0 ||
                x === CENTER_COLS - 1 ||
                y === 0 ||
                y === CENTER_ROWS - 1
            ) {
                row.push("CENTER_WALL");
            } else {
                row.push("PATH");
            }
        }

        grid.push(row);
    }

    // PC de stockage
    grid[7][15] = "CENTER_WALL";

    // Porte de sortie
    grid[CENTER_ROWS - 1][Math.floor(CENTER_COLS / 2)] = "CENTER_DOOR";

    return grid;
}

centerMap = buildCenterMap();

// Mêmes dimensions que le Centre Fakemon, pour que la salle remplisse
// exactement le canvas (640x480) et garde le même style visuel.
const GYM_COLS = CENTER_COLS;
const GYM_ROWS = CENTER_ROWS;
const GYM_LEADER_X = 10;
const GYM_LEADER_Y = 3;

let gymMap = [];
let currentGymId = null;

function buildGymMap() {

    const grid = [];

    for (let y = 0; y < GYM_ROWS; y++) {

        const row = [];

        for (let x = 0; x < GYM_COLS; x++) {

            if (
                x === 0 ||
                x === GYM_COLS - 1 ||
                y === 0 ||
                y === GYM_ROWS - 1
            ) {
                row.push("GYM_WALL");
            } else {
                row.push("PATH");
            }
        }

        grid.push(row);
    }

    // Porte de sortie
    grid[GYM_ROWS - 1][Math.floor(GYM_COLS / 2)] = "GYM_DOOR";

    return grid;
}

gymMap = buildGymMap();

// Un seul Centre Fakemon existe "physiquement" dans le code : celui de
// Bourg Palette et celui du Plateau des Légendes mènent tous les deux à la
// même salle. On garde donc en mémoire d'où le joueur est entré (quelle
// carte, quelle porte) pour l'y ramener exactement à la sortie.
let centerEntryMap = "world";
let centerEntryDoor = { x: 7, y: 4 };

function enterCenter(originMap, doorTile) {

    centerEntryMap = originMap || "world";
    centerEntryDoor = doorTile || { x: 7, y: 4 };

    currentMap = "center";
    currentPlayer.currentMap = "center";
    currentPlayer.centerEntryMap = centerEntryMap;
    currentPlayer.centerEntryDoor = centerEntryDoor;

    player.tileX = Math.floor(CENTER_COLS / 2);
    player.tileY = CENTER_ROWS - 2;

    player.pixelX = player.tileX * TILE_SIZE;
    player.pixelY = player.tileY * TILE_SIZE;

    player.targetPixelX = player.pixelX;
    player.targetPixelY = player.pixelY;

    player.moving = false;

    zoneLabel.textContent = "🏥 Centre Fakemon";

    saveGame();
}

function exitCenter() {

    currentMap = centerEntryMap;
    currentPlayer.currentMap = centerEntryMap;

    // Position devant le Centre par lequel le joueur est entré
    setPlayerTile(centerEntryDoor.x, centerEntryDoor.y + 1);

    zoneLabel.textContent =
        currentMap === "postgame"
            ? POSTGAME_ZONE_NAME
            : getZoneName(player.tileX, player.tileY);

    saveGame();
}

function enterGym(gym) {

    currentMap = "gym";
    currentGymId = gym.id;

    player.tileX = GYM_LEADER_X;
    player.tileY = GYM_ROWS - 2;

    player.pixelX = player.tileX * TILE_SIZE;
    player.pixelY = player.tileY * TILE_SIZE;

    player.targetPixelX = player.pixelX;
    player.targetPixelY = player.pixelY;

    player.moving = false;

    zoneLabel.textContent = `🏟️ Arène ${gym.leaderName}`;
}

function exitGym() {

    const gym = GYMS.find(g => g.id === currentGymId);

    currentMap = "world";
    currentGymId = null;

    if (gym) {
        setPlayerTile(gym.doorX, gym.doorY + 1);
    }

    zoneLabel.textContent = getZoneName(player.tileX, player.tileY);

    saveGame();
}

// ===================== PLATEAU DES LÉGENDES (ZONE POSTGAME) =====================
//
// Carte bonus au nord de Bourg Palette, débloquée une fois la dernière
// arène battue. Une petite ville (Centre Fakemon + arène du Maître
// Pokémon + maisons) occupe le centre de la carte, entourée de quelques
// zones de hautes herbes où absolument toutes les espèces sauvages du jeu
// peuvent apparaître, à un niveau très élevé (27-32).

const POSTGAME_COLS = 32;
const POSTGAME_ROWS = 26;
const POSTGAME_EXIT_X = Math.floor(POSTGAME_COLS / 2);

// Quelques zones de hautes herbes, au nord de la ville
const POSTGAME_GRASS_FIELDS = [
    { x0: 2, y0: 2, w: 6, h: 6 },
    { x0: 13, y0: 2, w: 6, h: 6 },
    { x0: 23, y0: 2, w: 6, h: 6 }
];

// Ville du Plateau, avec le Centre Fakemon et l'arène du Maître Pokémon.
// Réservée au sud de la carte, près de l'entrée : aucune zone de hautes
// herbes n'y est générée, pour laisser la place aux bâtiments.
const PG_TOWN_X0 = 7;
const PG_TOWN_X1 = 25;
const PG_TOWN_Y0 = 13;
const PG_TOWN_Y1 = 23;

// Centre Fakemon du Plateau (même gabarit que celui de Bourg Palette : 5
// cases de large sur 4 de haut, porte au milieu du mur du bas)
const PG_CENTER_X = 9;
const PG_CENTER_Y = 14;
const PG_CENTER_DOOR_X = PG_CENTER_X + 2;
const PG_CENTER_DOOR_Y = PG_CENTER_Y + 3;

// Immense arène du Maître Pokémon (9 cases de large sur 5 de haut, bien
// plus grande que les arènes classiques de 3x3)
const ARENA_BUILD_X = 16;
const ARENA_BUILD_Y = 14;
const ARENA_BUILD_W = 9;
const ARENA_BUILD_H = 5;
const ARENA_DOOR_X = ARENA_BUILD_X + Math.floor(ARENA_BUILD_W / 2);
const ARENA_DOOR_Y = ARENA_BUILD_Y + ARENA_BUILD_H - 1;

// Maisons décoratives de la ville : impossible d'y entrer, comme les
// maisons de Bourg Palette
const PG_HOUSES = [
    [8, 15], [8, 21], [14, 15], [14, 22],
    [23, 20], [19, 13], [11, 21], [17, 21], [21, 13]
];

let postgameGrid = [];

function placePostgameTown(grid) {

    // Sol de la ville : herbe classique, comme le reste du monde
    for (let y = PG_TOWN_Y0; y <= PG_TOWN_Y1; y++) {
        for (let x = PG_TOWN_X0; x <= PG_TOWN_X1; x++) {
            grid[y][x] = "GRASS";
        }
    }

    // Centre Fakemon
    for (let y = PG_CENTER_Y; y < PG_CENTER_Y + 4; y++) {
        for (let x = PG_CENTER_X; x < PG_CENTER_X + 5; x++) {
            grid[y][x] = "CENTER_WALL";
        }
    }
    grid[PG_CENTER_DOOR_Y][PG_CENTER_DOOR_X] = "CENTER_DOOR";
    grid[PG_CENTER_DOOR_Y + 1][PG_CENTER_DOOR_X] = "GRASS";

    // Immense arène du Maître Pokémon
    for (let y = ARENA_BUILD_Y; y < ARENA_BUILD_Y + ARENA_BUILD_H; y++) {
        for (let x = ARENA_BUILD_X; x < ARENA_BUILD_X + ARENA_BUILD_W; x++) {
            grid[y][x] = "ARENA_WALL";
        }
    }
    grid[ARENA_DOOR_Y][ARENA_DOOR_X] = "ARENA_DOOR";
    grid[ARENA_DOOR_Y + 1][ARENA_DOOR_X] = "GRASS";

    // Maisons (non franchissables, purement décoratives)
    PG_HOUSES.forEach(([x, y]) => {
        grid[y][x] = "HOUSE";
    });
}

function buildPostgameMap() {

    const grid = [];

    // Base : un réseau de chemins qui relie toutes les zones entre elles
    for (let y = 0; y < POSTGAME_ROWS; y++) {
        const row = [];
        for (let x = 0; x < POSTGAME_COLS; x++) {
            row.push("PATH");
        }
        grid.push(row);
    }

    // Quelques zones de hautes herbes, au nord de la ville
    POSTGAME_GRASS_FIELDS.forEach(field => {
        for (let y = field.y0; y < field.y0 + field.h; y++) {
            for (let x = field.x0; x < field.x0 + field.w; x++) {
                grid[y][x] = "TALL_GRASS";
            }
        }
    });

    const overlapsTown = (x0, y0, x1, y1) =>
        !(x1 < PG_TOWN_X0 || x0 > PG_TOWN_X1 || y1 < PG_TOWN_Y0 || y0 > PG_TOWN_Y1);

    placePostgameTown(grid);

    // Bordure d'arbres infranchissable tout autour de la carte
    for (let x = 0; x < POSTGAME_COLS; x++) {
        grid[0][x] = "TREE";
        grid[POSTGAME_ROWS - 1][x] = "TREE";
    }
    for (let y = 0; y < POSTGAME_ROWS; y++) {
        grid[y][0] = "TREE";
        grid[y][POSTGAME_COLS - 1] = "TREE";
    }

    // Entrée/sortie au sud, toujours praticable
    grid[POSTGAME_ROWS - 1][POSTGAME_EXIT_X] = "PATH";
    grid[POSTGAME_ROWS - 2][POSTGAME_EXIT_X] = "PATH";

    // Quelques rochers décoratifs le long des chemins, en dehors de la ville
    for (let y = 1; y < POSTGAME_ROWS - 1; y++) {
        for (let x = 1; x < POSTGAME_COLS - 1; x++) {
            if (
                grid[y][x] === "PATH" &&
                x !== POSTGAME_EXIT_X &&
                !overlapsTown(x, y, x, y) &&
                (x * 7 + y * 13) % 29 === 0
            ) {
                grid[y][x] = "ROCK";
            }
        }
    }

    return grid;
}

postgameGrid = buildPostgameMap();

function enterPostgame() {

    currentMap = "postgame";
    currentPlayer.currentMap = "postgame";

    player.tileX = POSTGAME_EXIT_X;
    player.tileY = POSTGAME_ROWS - 2;

    player.pixelX = player.tileX * TILE_SIZE;
    player.pixelY = player.tileY * TILE_SIZE;

    player.targetPixelX = player.pixelX;
    player.targetPixelY = player.pixelY;

    player.moving = false;

    zoneLabel.textContent = POSTGAME_ZONE_NAME;

    saveGame();
}

function exitPostgame() {

    currentMap = "world";
    currentPlayer.currentMap = "world";

    // Position juste devant le passage scellé, à Bourg Palette
    setPlayerTile(SUMMIT_GATE_X, SUMMIT_GATE_Y + 1);

    zoneLabel.textContent = getZoneName(player.tileX, player.tileY);

    saveGame();
}

// ===================== ARÈNE DU MAÎTRE POKÉMON =====================
//
// Immense salle (bien plus grande que les arènes classiques 20x15) située
// dans la ville du Plateau des Légendes. Un anneau de public occupe tout le
// pourtour de la salle, et le Maître Pokémon attend en plein milieu du
// terrain pour le combat le plus difficile du jeu.

const ARENA_COLS = 30;
const ARENA_ROWS = 24;
const CHAMPION_X = Math.floor(ARENA_COLS / 2);
const CHAMPION_Y = Math.floor(ARENA_ROWS / 2);

// Le Maître Pokémon utilise les formes finales des trois starters, à un
// niveau supérieur à tout ce que le joueur a pu croiser jusque-là.
const CHAMPION = {
    id: "champion_plateau",
    leaderName: "Maître Orion",
    badge: "Badge Suprême",
    icon: "👑",
    color: "#5b2a86",
    lines: [
        "Bienvenue au sommet du Plateau des Légendes.",
        "Je suis le Maître Pokémon. Seuls les dresseurs les plus forts osent m'affronter ici !"
    ],
    defeatedLine: "Incroyable... tu as ce qu'il faut pour être un vrai Maître Pokémon.",
    requiresGymId: null,
    team: [
        { speciesId: 3, level: 38 },
        { speciesId: 6, level: 38 },
        { speciesId: 9, level: 40 }
    ],
    reward: 1000
};

let arenaMap = [];

function buildArenaMap() {

    const grid = [];

    for (let y = 0; y < ARENA_ROWS; y++) {

        const row = [];

        for (let x = 0; x < ARENA_COLS; x++) {

            const isOuterWall =
                x === 0 || x === ARENA_COLS - 1 ||
                y === 0 || y === ARENA_ROWS - 1;

            // Anneau de gradins (public), infranchissable comme les murs
            const isStands =
                x === 1 || x === ARENA_COLS - 2 ||
                y === 1 || y === ARENA_ROWS - 2;

            if (isOuterWall || isStands) {
                row.push("GYM_WALL");
            } else {
                row.push("PATH");
            }
        }

        grid.push(row);
    }

    // Porte de sortie et couloir d'entrée qui traverse l'anneau de gradins
    grid[ARENA_ROWS - 1][CHAMPION_X] = "GYM_DOOR";
    grid[ARENA_ROWS - 2][CHAMPION_X] = "PATH";

    return grid;
}

arenaMap = buildArenaMap();

// Construit un objet "NPC" pour le Maître Pokémon, réutilisable tel quel
// par le système de dialogue et de combat de dresseur existant.
function buildChampionNpc() {
    return {
        id: CHAMPION.id,
        name: CHAMPION.leaderName,

        tileX: CHAMPION_X,
        tileY: CHAMPION_Y,

        color: CHAMPION.color,
        type: "battle",
        icon: CHAMPION.icon,

        lines: CHAMPION.lines,
        defeatedLine: CHAMPION.defeatedLine,
        requiresGymId: CHAMPION.requiresGymId,
        team: CHAMPION.team,
        reward: CHAMPION.reward,
        badge: CHAMPION.badge
    };
}

function checkChampionInteraction() {

    if (currentMap !== "champion_arena") return false;
    if (player.moving) return false;

    const facing = getFacingTile();

    if (facing.x !== CHAMPION_X || facing.y !== CHAMPION_Y) {
        return false;
    }

    startDialogue(buildChampionNpc());

    return true;
}

function enterChampionArena() {

    currentMap = "champion_arena";

    player.tileX = CHAMPION_X;
    player.tileY = ARENA_ROWS - 2;

    player.pixelX = player.tileX * TILE_SIZE;
    player.pixelY = player.tileY * TILE_SIZE;

    player.targetPixelX = player.pixelX;
    player.targetPixelY = player.pixelY;

    player.moving = false;

    zoneLabel.textContent = `👑 Arène de ${CHAMPION.leaderName}`;
}

function exitChampionArena() {

    currentMap = "postgame";

    setPlayerTile(ARENA_DOOR_X, ARENA_DOOR_Y + 1);

    zoneLabel.textContent = POSTGAME_ZONE_NAME;

    saveGame();
}

function setPlayerTile(x, y) {
    player.tileX = x;
    player.tileY = y;
    player.pixelX = x * TILE_SIZE;
    player.pixelY = y * TILE_SIZE;
    player.targetPixelX = player.pixelX;
    player.targetPixelY = player.pixelY;
}

const pressedKeys = new Set();

document.addEventListener("keydown", (e) => {

    if (gameScreen.classList.contains("hidden")) return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    // Rencontre sauvage en cours
    if (encounterOpen) {
        return;
    }

    // Combat en cours
    if (battleOpen) {
        return;
    }

    // Dialogue PNJ en cours
    if (dialogueOpen) {

        if (key === "e") {
            advanceDialogue();
        } else if (key === "Escape") {
            closeDialogue();
        }

        return;
    }

    // PC ouvert
    if (pcOpen) {

        if (key === "e" || key === "Escape") {
            closePC();
        }

        return;
    }

    // Pokédex ouvert
    if (pokedexOpen) {

        if (key === "e" || key === "Escape") {
            closePokedex();
        }

        return;
    }

    // Boutique ouverte
    if (shopOpen) {

        if (key === "e" || key === "Escape") {
            closeShop();
        }

        return;
    }

    // Menu de triche ouvert
    if (cheatMenuOpen) {

        if (key === "c" || key === "Escape") {
            closeCheatMenu();
        }

        return;
    }

    // Menu ou combat PvP ouvert (le déplacement est bloqué dans tous les cas ;
    // Échap ne ferme que l'écran de création/connexion, jamais un combat ou
    // une recherche d'adversaire en cours)
    if (pvpOpen) {

        if (key === "Escape" && !pvpMatch && !pvpSearch) {
            closePvpMenu();
        }

        return;
    }

    // Menu ou échange en ligne ouvert (même logique que le PvP : Échap ne
    // ferme que l'écran de création/connexion, jamais un échange en cours)
    if (tradeOpen) {

        if (key === "Escape" && !tradeSession) {
            closeTradeMenu();
        }

        return;
    }

    // Interaction avec un PNJ, un maître d'arène, le Maître Pokémon ou le PC
    if (key === "e") {
        if (!checkNPCInteraction() && !checkGymLeaderInteraction() && !checkChampionInteraction()) {
            checkPCInteraction();
        }
        return;
    }

    // Menu de triche (réservé au compte "Lucas")
    if (key === "c" && isCheatAccount()) {
        openCheatMenu();
        return;
    }

    pressedKeys.add(key);
});

document.addEventListener("keyup", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pressedKeys.delete(key);
});

function tryMove(dx, dy, direction) {

    player.direction = direction;

    const newX = player.tileX + dx;
    const newY = player.tileY + dy;

    // =========================
    // MONDE EXTÉRIEUR
    // =========================

    if (currentMap === "world") {

        if (
            newX < 0 ||
            newX >= MAP_COLS ||
            newY < 0 ||
            newY >= MAP_ROWS
        ) {
            return;
        }

        const tile = TILES[mapGrid[newY][newX]];

        if (!tile.walkable) {
            return;
        }

        if (findNPCAt(newX, newY)) {
            return;
        }

        player.tileX = newX;
        player.tileY = newY;

        player.targetPixelX = newX * TILE_SIZE;
        player.targetPixelY = newY * TILE_SIZE;

        player.moving = true;

        return;
    }

    if (currentMap === "center") {

    if (
        newX < 0 ||
        newX >= CENTER_COLS ||
        newY < 0 ||
        newY >= CENTER_ROWS
    ) {
        return;
    }

    const npcAtDestination = CENTER_NPCS.find(
        npc =>
            npc.tileX === newX &&
            npc.tileY === newY
    );

    if (npcAtDestination) {
        return;
    }

    const tile = TILES[centerMap[newY][newX]];

    if (!tile.walkable) {
        return;
    }

    player.tileX = newX;
    player.tileY = newY;

    player.targetPixelX = newX * TILE_SIZE;
    player.targetPixelY = newY * TILE_SIZE;

    player.moving = true;
}

    if (currentMap === "gym") {

        if (
            newX < 0 ||
            newX >= GYM_COLS ||
            newY < 0 ||
            newY >= GYM_ROWS
        ) {
            return;
        }

        const tile = TILES[gymMap[newY][newX]];

        if (!tile.walkable) {
            return;
        }

        if (newX === GYM_LEADER_X && newY === GYM_LEADER_Y) {
            return;
        }

        player.tileX = newX;
        player.tileY = newY;

        player.targetPixelX = newX * TILE_SIZE;
        player.targetPixelY = newY * TILE_SIZE;

        player.moving = true;
    }

    if (currentMap === "postgame") {

        if (
            newX < 0 ||
            newX >= POSTGAME_COLS ||
            newY < 0 ||
            newY >= POSTGAME_ROWS
        ) {
            return;
        }

        const tile = TILES[postgameGrid[newY][newX]];

        if (!tile.walkable) {
            return;
        }

        player.tileX = newX;
        player.tileY = newY;

        player.targetPixelX = newX * TILE_SIZE;
        player.targetPixelY = newY * TILE_SIZE;

        player.moving = true;
    }

    if (currentMap === "champion_arena") {

        if (
            newX < 0 ||
            newX >= ARENA_COLS ||
            newY < 0 ||
            newY >= ARENA_ROWS
        ) {
            return;
        }

        const tile = TILES[arenaMap[newY][newX]];

        if (!tile.walkable) {
            return;
        }

        if (newX === CHAMPION_X && newY === CHAMPION_Y) {
            return;
        }

        player.tileX = newX;
        player.tileY = newY;

        player.targetPixelX = newX * TILE_SIZE;
        player.targetPixelY = newY * TILE_SIZE;

        player.moving = true;
    }
}

function findNPCAt(x, y) {
    return NPCS.find(npc => npc.tileX === x && npc.tileY === y) || null;
}

function getFacingTile() {

    const offsets = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0]
    };

    const [dx, dy] = offsets[player.direction] || [0, 1];

    return {
        x: player.tileX + dx,
        y: player.tileY + dy
    };
}

function checkNPCInteraction() {

    if (player.moving) return false;

    const facing = getFacingTile();

    let npc = null;

    if (currentMap === "world") {
        npc = NPCS.find(
            npc =>
                npc.tileX === facing.x &&
                npc.tileY === facing.y
        );
    }

    if (currentMap === "center") {
        npc = CENTER_NPCS.find(
            npc =>
                npc.tileX === facing.x &&
                npc.tileY === facing.y
        );
    }

    if (!npc) return false;

    startDialogue(npc);

    return true;
}

function startDialogue(npc) {

    dialogueOpen = true;
    currentDialogueNPC = npc;
    currentDialogueLineIndex = 0;

    const dialogueWindow = document.createElement("div");

    dialogueWindow.id = "dialogueWindow";

    dialogueWindow.innerHTML = `
        <div class="dialogue-box">

            <div class="dialogue-header">
                <strong>${npc.name}</strong>
            </div>

            <p id="dialogueText"></p>

            <div class="dialogue-actions">
                <button id="dialogueNextButton">Continuer ▶</button>
            </div>

            <p class="dialogue-hint">
                Appuie sur <strong>E</strong> pour continuer,
                <strong>Échap</strong> pour fermer
            </p>

        </div>
    `;

    document.body.appendChild(dialogueWindow);

    document
        .getElementById("dialogueNextButton")
        .addEventListener("click", advanceDialogue);

    renderDialogueLine();
}

function renderDialogueLine() {

    const textEl = document.getElementById("dialogueText");

    if (!textEl || !currentDialogueNPC) return;

    textEl.textContent =
        currentDialogueNPC.lines[currentDialogueLineIndex];
}

function advanceDialogue() {

    if (!currentDialogueNPC) return;

    currentDialogueLineIndex++;

    if (currentDialogueLineIndex < currentDialogueNPC.lines.length) {
        renderDialogueLine();
        return;
    }

    resolveDialogueOutcome(currentDialogueNPC);
}

function resolveDialogueOutcome(npc) {

    const textEl = document.getElementById("dialogueText");
    const nextButton = document.getElementById("dialogueNextButton");

    if (npc.type === "item") {

        const alreadyGiven = currentPlayer.npcGifts.includes(npc.id);

        if (!alreadyGiven) {

            currentPlayer.inventory.push({
                id: npc.itemId,
                name: npc.itemName
            });

            currentPlayer.npcGifts.push(npc.id);

            saveGame();

            if (textEl) {
                textEl.textContent = `Tu as reçu : ${npc.itemName} !`;
            }
        } else {
            closeDialogue();
            return;
        }

    } else if (npc.type === "battle") {

        if (npc.requiresGymId && !currentPlayer.defeatedTrainers.includes(npc.requiresGymId)) {

            if (textEl) {
                textEl.textContent =
                    "Tu dois d'abord battre le maître de l'arène précédente avant de m'affronter !";
            }

        } else if (currentPlayer.defeatedTrainers.includes(npc.id)) {

            if (textEl) {
                textEl.textContent =
                    npc.defeatedLine || "Tu m'as déjà battu, reviens t'entraîner !";
            }

        } else {

            const activeCreature = currentPlayer.team[currentPlayer.activeCreature];

            if (!activeCreature || activeCreature.hp <= 0) {

                if (textEl) {
                    textEl.textContent =
                        "Ta créature est K.O. ! Soigne-la au Centre Fakemon avant de m'affronter.";
                }

            } else {

                closeDialogue();
                startTrainerBattle(npc);
                return;
            }
        }

    } else if (npc.type === "heal") {

        currentPlayer.team.forEach(creature => {
            creature.hp = creature.maxHp;
            creature.mp = creature.maxMp;
            creature.fainted = false;
        });

        updateTeamDisplay();
        saveGame();

        if (textEl) {
            textEl.textContent =
                "💗 Ton équipe a été entièrement soignée !";
        }
    } else if (npc.type === "shop") {

        closeDialogue();
        openShop();
        return;

    } else {
        closeDialogue();
        return;
    }

    if (nextButton) {
        nextButton.textContent = "Fermer";
        nextButton.removeEventListener("click", advanceDialogue);
        nextButton.addEventListener("click", closeDialogue);
    }
}

function closeDialogue() {

    dialogueOpen = false;
    currentDialogueNPC = null;
    currentDialogueLineIndex = 0;

    const dialogueWindow = document.getElementById("dialogueWindow");

    if (dialogueWindow) {
        dialogueWindow.remove();
    }
}

function checkPCInteraction() {

    if (currentMap !== "center") return;
    if (player.moving) return;

    const pcX = 15;
    const pcY = 7;

    const distance =
        Math.abs(player.tileX - pcX) +
        Math.abs(player.tileY - pcY);

    if (distance === 1) {
        openPC();
    }
}

// Construit un objet "NPC" pour le maître de l'arène en cours, réutilisable
// tel quel par le système de dialogue et de combat de dresseur existant.
function buildGymLeaderNpc(gym) {
    return {
        id: gym.id,
        name: gym.leaderName,

        // Position du PNJ dans l'arène
        tileX: GYM_LEADER_X,
        tileY: GYM_LEADER_Y,

        color: gym.color,
        type: "battle",
        icon: gym.icon,

        lines: gym.lines,
        defeatedLine: gym.defeatedLine,
        requiresGymId: gym.requiresGymId,
        team: gym.team,
        reward: gym.reward,
        badge: gym.badge
    };
}

function checkGymLeaderInteraction() {

    if (currentMap !== "gym") return false;
    if (player.moving) return false;

    const facing = getFacingTile();

    if (facing.x !== GYM_LEADER_X || facing.y !== GYM_LEADER_Y) {
        return false;
    }

    const gym = GYMS.find(g => g.id === currentGymId);

    if (!gym) return false;

    startDialogue(buildGymLeaderNpc(gym));

    return true;
}

function checkBuildingInteraction() {

    if (player.moving) return;


    // Entrée dans le Centre de Bourg Palette
    if (
        currentMap === "world" &&
        player.tileX === 7 &&
        player.tileY === 4
    ) {
        enterCenter("world", { x: 7, y: 4 });
        return;
    }


    // Entrée dans le Centre du Plateau des Légendes
    if (
        currentMap === "postgame" &&
        player.tileX === PG_CENTER_DOOR_X &&
        player.tileY === PG_CENTER_DOOR_Y
    ) {
        enterCenter("postgame", { x: PG_CENTER_DOOR_X, y: PG_CENTER_DOOR_Y });
        return;
    }


    // Sortie du Centre
    if (
        currentMap === "center" &&
        player.tileY === CENTER_ROWS - 1
    ) {
        exitCenter();
        return;
    }


    // Entrée dans une arène
    if (currentMap === "world") {

        const gym = GYMS.find(
            g => player.tileX === g.doorX && player.tileY === g.doorY
        );

        if (gym) {
            enterGym(gym);
            return;
        }
    }


    // Sortie d'une arène
    if (
        currentMap === "gym" &&
        player.tileY === GYM_ROWS - 1
    ) {
        exitGym();
        return;
    }


    // Passage scellé vers le Plateau des Légendes : ne s'ouvre qu'une fois
    // la dernière arène du jeu battue
    if (
        currentMap === "world" &&
        player.tileX === SUMMIT_GATE_X &&
        player.tileY === SUMMIT_GATE_Y
    ) {
        if (currentPlayer.defeatedTrainers.includes(LAST_GYM_ID)) {
            enterPostgame();
        } else {
            alert(
                "Un sceau ancien bloque ce passage... Il ne s'ouvrira qu'après ta victoire face à la dernière Arène."
            );
        }
        return;
    }


    // Sortie du Plateau des Légendes
    if (
        currentMap === "postgame" &&
        player.tileX === POSTGAME_EXIT_X &&
        player.tileY === POSTGAME_ROWS - 1
    ) {
        exitPostgame();
        return;
    }


    // Entrée dans l'arène du Maître Pokémon
    if (
        currentMap === "postgame" &&
        player.tileX === ARENA_DOOR_X &&
        player.tileY === ARENA_DOOR_Y
    ) {
        enterChampionArena();
        return;
    }


    // Sortie de l'arène du Maître Pokémon
    if (
        currentMap === "champion_arena" &&
        player.tileY === ARENA_ROWS - 1
    ) {
        exitChampionArena();
    }
}

function checkWildEncounter() {

    if (encounterOpen) return;

    let tile;

    if (currentMap === "world") {
        tile = TILES[mapGrid[player.tileY][player.tileX]];
    } else if (currentMap === "postgame") {
        tile = TILES[postgameGrid[player.tileY][player.tileX]];
    } else {
        return;
    }

    if (!tile.encounterZone) return;

    if (Math.random() < WILD_ENCOUNTER_CHANCE) {
        startEncounter();
    }
}

function pickRandomWildCreature() {

    const zoneName =
        currentMap === "postgame"
            ? POSTGAME_ZONE_NAME
            : getZoneName(player.tileX, player.tileY);
    const zoneData = ZONE_WILD_DATA[zoneName];

    const pool = zoneData ? zoneData.creatures : WILD_CREATURES;
    const minLevel = zoneData ? zoneData.minLevel : WILD_MIN_LEVEL;
    const maxLevel = zoneData ? zoneData.maxLevel : WILD_MAX_LEVEL;

    const species = pool[Math.floor(Math.random() * pool.length)];

    const level =
        minLevel +
        Math.floor(
            Math.random() * (maxLevel - minLevel + 1)
        );

    return createCreature(species.id, species.name, species.type, level);
}

function startEncounter() {

    encounterOpen = true;
    wildEncounterCreature = pickRandomWildCreature();

    const creature = wildEncounterCreature;

    markPokedexSeen(creature.id);
    saveGame();

    const encounterWindow = document.createElement("div");

    encounterWindow.id = "encounterWindow";

    encounterWindow.innerHTML = `
        <div class="encounter-box">

            <p class="encounter-intro">
                Un ${creature.name} sauvage apparaît !
            </p>

            <img
                class="encounter-sprite"
                src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png"
                alt="${creature.name}"
            >

            <h3>${creature.name} <span>Nv. ${creature.level}</span></h3>

            <div class="encounter-actions">
                <button id="encounterFightButton">⚔️ Combattre</button>
                <button id="encounterFleeButton">🏃 Fuir</button>
            </div>

            <p class="encounter-message" id="encounterMessage"></p>

        </div>
    `;

    document.body.appendChild(encounterWindow);

    document
        .getElementById("encounterFightButton")
        .addEventListener("click", () => {

            const activeCreature =
                currentPlayer.team[currentPlayer.activeCreature];

            if (!activeCreature || activeCreature.hp <= 0) {
                showEncounterMessage(
                    "Ta créature est K.O. ! Soigne-la au Centre Fakemon."
                );
                return;
            }

            closeEncounter();
            startBattle(creature);
        });

    document
        .getElementById("encounterFleeButton")
        .addEventListener("click", closeEncounter);
}

function showEncounterMessage(text) {
    const message = document.getElementById("encounterMessage");
    if (message) {
        message.textContent = text;
    }
}

function closeEncounter() {

    encounterOpen = false;
    wildEncounterCreature = null;

    const encounterWindow = document.getElementById("encounterWindow");

    if (encounterWindow) {
        encounterWindow.remove();
    }
}

// ===================== COMBAT AU TOUR PAR TOUR =====================

let battleLog = [];

function xpForNextLevel(level) {
    return level * 20;
}

function levelUpCreature(creature) {
    creature.level++;
    creature.maxHp += 2;
    creature.hp += 2;
    creature.attack += 1;
    creature.defense += 1;
    creature.speed += 1;
    creature.maxMp += 3;
    creature.mp += 3;

    return tryEvolveCreature(creature);
}

// Fait évoluer la créature si son niveau atteint le seuil requis.
// Change son id (donc son sprite), son nom, et lui donne un bonus de stats.
// Retourne un message d'évolution, ou null si rien ne se passe.
function tryEvolveCreature(creature) {
    const evolution = EVOLUTIONS[creature.id];

    if (!evolution || creature.level < evolution.level) {
        return null;
    }

    const evolvedSpecies = getSpeciesInfo(evolution.id);

    if (!evolvedSpecies) {
        return null;
    }

    const oldName = creature.name;

    creature.id = evolvedSpecies.id;
    creature.name = evolvedSpecies.name;

    creature.maxHp += 8;
    creature.hp += 8;
    creature.attack += 4;
    creature.defense += 4;
    creature.speed += 3;
    creature.maxMp += 12;
    creature.mp += 12;

    markPokedexCaught(creature.id);

    return `${oldName} évolue en ${creature.name} ! ✨`;
}

function gainXP(creature, amount) {

    creature.xp += amount;

    const messages = [];

    while (creature.xp >= xpForNextLevel(creature.level)) {
        creature.xp -= xpForNextLevel(creature.level);

        const nameBeforeLevelUp = creature.name;
        const evolutionMessage = levelUpCreature(creature);

        messages.push(`${nameBeforeLevelUp} monte au niveau ${creature.level} !`);

        if (evolutionMessage) {
            messages.push(evolutionMessage);
        }
    }

    return messages;
}

function computeCaptureChance(wild) {

    const hpFactor = 1 - wild.hp / wild.maxHp;
    const levelFactor = Math.max(0, 1 - wild.level / 20);

    const chance = 0.3 + hpFactor * 0.5 + levelFactor * 0.2;

    return Math.min(0.95, Math.max(0.05, chance));
}

// Renvoie { damage, multiplier } : le multiplicateur est calculé séparément
// pour permettre d'afficher un message ("super efficace", etc.) là où le
// dégât est appliqué, sans dupliquer le calcul de TYPE_CHART.
function computeDamage(attacker, defender, move) {

    const power = move ? move.power : 1;
    const variance = 0.85 + Math.random() * 0.3;
    const multiplier = move && move.type ? getTypeMultiplier(move.type, defender.type) : 1;

    if (multiplier === 0) {
        return { damage: 0, multiplier };
    }

    const raw = (attacker.attack * power - defender.defense * 0.5) * variance * multiplier;

    return { damage: Math.max(1, Math.round(raw)), multiplier };
}

function addBattleLog(text) {
    battleLog.push(text);
}

function applyAttack(attacker, defender, move) {

    const { damage, multiplier } = computeDamage(attacker, defender, move);
    defender.hp = Math.max(0, defender.hp - damage);

    if (move && move.mpCost) {
        attacker.mp = Math.max(0, attacker.mp - move.mpCost);
    }

    const moveName = move ? move.name : "une attaque";

    addBattleLog(`${attacker.name} utilise ${moveName} et inflige ${damage} dégâts à ${defender.name} !`);

    const effectivenessMessage = getEffectivenessMessage(multiplier);

    if (effectivenessMessage) {
        addBattleLog(effectivenessMessage);
    }

    // Lutte blesse aussi celui qui l'utilise (comme dans les jeux officiels)
    if (move && move.isStruggle) {

        const recoil = Math.max(1, Math.round(damage * 0.25));
        attacker.hp = Math.max(0, attacker.hp - recoil);

        addBattleLog(`${attacker.name} est blessé(e) par le contrecoup ! (-${recoil} PV)`);
    }
}

function buildTrainerTeam(npc) {
    return npc.team.map(entry => {
        const species = getSpeciesInfo(entry.speciesId);
        return createCreature(species.id, species.name, species.type, entry.level);
    });
}

function startTrainerBattle(npc) {

    const activeCreature = currentPlayer.team[currentPlayer.activeCreature];

    if (!activeCreature || activeCreature.hp <= 0) {
        alert("Ta créature est K.O. ! Soigne-la au Centre Fakemon avant d'affronter un dresseur.");
        return;
    }

    battleTrainerTeam = buildTrainerTeam(npc);
    battleTrainerIndex = 0;

    startBattle(battleTrainerTeam[0], npc);
}

function startBattle(wild, trainerNpc = null) {

    battleOpen = true;
    battleEnded = false;
    battlePlayerCreature = currentPlayer.team[currentPlayer.activeCreature];
    battleWildCreature = wild;
    battleTrainer = trainerNpc;
    battleLog = [];

    if (battleTrainer) {
        addBattleLog(`${battleTrainer.name} t'envoie ${wild.name} !`);
    } else {
        addBattleLog(`Un ${wild.name} sauvage veut se battre !`);
    }

    const battleTitle = battleTrainer
        ? `⚔️ Combat contre ${battleTrainer.name}`
        : "⚔️ Combat sauvage";

    const battleWindow = document.createElement("div");

    battleWindow.id = "battleWindow";

    battleWindow.innerHTML = `
        <div class="battle-box">

            <h2 class="battle-title">${battleTitle}</h2>

            <div class="battle-combatants">

                <div class="battle-side">
                    <img id="battlePlayerSprite" class="battle-sprite" src="" alt="">
                    <strong id="battlePlayerName"></strong>
                    <span id="battlePlayerLevel"></span>
                    <span id="battlePlayerType"></span>
                    <div class="battle-hp-bar"><div id="battlePlayerHpFill" class="battle-hp-fill"></div></div>
                    <small id="battlePlayerHpText"></small>
                    <div class="battle-mp-bar"><div id="battlePlayerMpFill" class="battle-mp-fill"></div></div>
                    <small id="battlePlayerMpText"></small>
                </div>

                <div class="battle-vs">VS</div>

                <div class="battle-side">
                    <img id="battleWildSprite" class="battle-sprite" src="" alt="">
                    <strong id="battleWildName"></strong>
                    <span id="battleWildLevel"></span>
                    <span id="battleWildType"></span>
                    <div class="battle-hp-bar"><div id="battleWildHpFill" class="battle-hp-fill"></div></div>
                    <small id="battleWildHpText"></small>
                </div>

            </div>

            <div class="battle-log" id="battleLog"></div>

            <div class="battle-actions" id="battleActions"></div>

        </div>
    `;

    document.body.appendChild(battleWindow);

    renderBattleActions();
    renderBattle();
}

function renderBattleActions() {

    const actionsEl = document.getElementById("battleActions");

    if (!actionsEl) return;

    const sphereCount = currentPlayer.inventory.filter(
        item => item.id === "capture_sphere"
    ).length;

    // On ne peut ni capturer ni fuir un combat de dresseur
    const captureButton = battleTrainer
        ? ""
        : `<button id="battleCaptureButton">🔴 Capturer (${sphereCount})</button>`;

    const fleeButton = battleTrainer
        ? ""
        : `<button id="battleFleeButton">🏃 Fuir</button>`;

    actionsEl.innerHTML = `
        <button id="battleAttackButton">⚔️ Attaquer</button>
        ${captureButton}
        <button id="battleHealButton">💊 Soigner</button>
        <button id="battleEtherButton">🔷 Élixir</button>
        ${fleeButton}
    `;

    document
        .getElementById("battleAttackButton")
        .addEventListener("click", openMoveMenu);

    const captureBtn = document.getElementById("battleCaptureButton");
    if (captureBtn) {
        captureBtn.addEventListener("click", playerCapture);
    }

    document
        .getElementById("battleHealButton")
        .addEventListener("click", usePotionInBattle);

    document
        .getElementById("battleEtherButton")
        .addEventListener("click", useEtherInBattle);

    const fleeBtn = document.getElementById("battleFleeButton");
    if (fleeBtn) {
        fleeBtn.addEventListener("click", playerFlee);
    }
}

function openMoveMenu() {

    if (!battleOpen || battleEnded) return;

    const actionsEl = document.getElementById("battleActions");

    if (!actionsEl) return;

    const creature = battlePlayerCreature;
    const moves = creature.attacks;
    const opponentType = battleWildCreature.type;

    // Plus aucune attaque abordable : repli obligatoire sur Lutte
    if (!hasAffordableMove(creature)) {

        actionsEl.innerHTML = `
            <p class="pvp-hint">${creature.name} n'a plus assez de MP pour aucune attaque !</p>
            <button id="battleStruggleButton">🥊 Lutte (contrecoup)</button>
            <button id="battleMoveBackButton">◀ Retour</button>
        `;

        document
            .getElementById("battleStruggleButton")
            .addEventListener("click", () => playerAttack(STRUGGLE_MOVE));

        document
            .getElementById("battleMoveBackButton")
            .addEventListener("click", renderBattleActions);

        return;
    }

    actionsEl.innerHTML =
        moves.map((move, index) => {

            const affordable = canAffordMove(creature, move);

            return `
                <button class="battle-move-button" data-move-index="${index}" ${affordable ? "" : "disabled"}>
                    <span class="move-button-main">⚔️ ${move.name}</span>
                    <span class="move-button-meta">
                        ${renderTypeBadge(move.type)}
                        ${renderMoveMpBadge(move, creature)}
                        ${renderMoveEffectivenessBadge(move.type, opponentType)}
                    </span>
                </button>
            `;
        }).join("") +
        `<button id="battleMoveBackButton">◀ Retour</button>`;

    actionsEl.querySelectorAll(".battle-move-button:not([disabled])").forEach(button => {

        const move = moves[Number(button.dataset.moveIndex)];

        button.addEventListener("click", () => playerAttack(move));
    });

    document
        .getElementById("battleMoveBackButton")
        .addEventListener("click", renderBattleActions);
}

function getPokedexStatusDot(creatureId) {

    if (currentPlayer.pokedex.caught.includes(creatureId)) {
        return `<span class="pokedex-status-dot caught" title="Déjà capturée"></span>`;
    }

    if (currentPlayer.pokedex.seen.includes(creatureId)) {
        return `<span class="pokedex-status-dot seen" title="Déjà vue"></span>`;
    }

    return "";
}

function renderBattle(final = false) {

    const player = battlePlayerCreature;
    const wild = battleWildCreature;

    document.getElementById("battlePlayerSprite").src =
        `fakemon_creatures/${String(player.id).padStart(3, "0")}.png`;
    document.getElementById("battlePlayerName").innerHTML =
    `${player.name} ${getPokedexStatusDot(player.id)}`;
    document.getElementById("battlePlayerLevel").textContent = `Nv. ${player.level}`;
    document.getElementById("battlePlayerType").innerHTML = renderTypeBadge(player.type);

    const playerHpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    document.getElementById("battlePlayerHpFill").style.width = `${playerHpPercent}%`;
    document.getElementById("battlePlayerHpText").textContent = `${player.hp}/${player.maxHp} PV`;

    const playerMpPercent = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100));
    document.getElementById("battlePlayerMpFill").style.width = `${playerMpPercent}%`;
    document.getElementById("battlePlayerMpText").textContent = `${player.mp}/${player.maxMp} MP`;

    document.getElementById("battleWildSprite").src =
        `fakemon_creatures/${String(wild.id).padStart(3, "0")}.png`;
    document.getElementById("battleWildName").innerHTML =
    `${wild.name} ${getPokedexStatusDot(wild.id)}`;
    document.getElementById("battleWildLevel").textContent = `Nv. ${wild.level}`;
    document.getElementById("battleWildType").innerHTML = renderTypeBadge(wild.type);

    const wildHpPercent = Math.max(0, Math.min(100, (wild.hp / wild.maxHp) * 100));
    document.getElementById("battleWildHpFill").style.width = `${wildHpPercent}%`;
    document.getElementById("battleWildHpText").textContent = `${wild.hp}/${wild.maxHp} PV`;

    const logEl = document.getElementById("battleLog");
    logEl.innerHTML = battleLog.map(line => `<p>${line}</p>`).join("");
    logEl.scrollTop = logEl.scrollHeight;

    if (final) {

        const actionsEl = document.getElementById("battleActions");

        actionsEl.innerHTML = `<button id="battleCloseButton">Fermer</button>`;

        document
            .getElementById("battleCloseButton")
            .addEventListener("click", closeBattle);
    }
}

function usePotionInBattle() {

    if (!battlePlayerCreature) return;

    if (battleEnded) return;

    const potionIndex = currentPlayer.inventory.findIndex(
        item => item.id === "potion"
    );

    if (potionIndex === -1) {
        addBattleLog("❌ Tu n'as aucune potion !");
        renderBattle();
        return;
    }

    if (battlePlayerCreature.hp >= battlePlayerCreature.maxHp) {
        addBattleLog(
            `${battlePlayerCreature.name} a déjà tous ses PV !`
        );
        renderBattle();
        return;
    }

    const oldHp = battlePlayerCreature.hp;

    battlePlayerCreature.hp = Math.min(
        battlePlayerCreature.maxHp,
        battlePlayerCreature.hp + 20
    );

    const healed = battlePlayerCreature.hp - oldHp;

    currentPlayer.inventory.splice(potionIndex, 1);

    saveGame();

    addBattleLog(
        `💊 ${battlePlayerCreature.name} récupère ${healed} PV !`
    );

    renderBattle();

    // Le Pokémon sauvage attaque après l'utilisation de la potion
    setTimeout(() => {

        if (battleEnded) return;

        wildAttack();

    }, 700);
}

function useEtherInBattle() {

    if (!battlePlayerCreature) return;

    if (battleEnded) return;

    const etherIndex = currentPlayer.inventory.findIndex(
        item => item.id === "ether"
    );

    if (etherIndex === -1) {
        addBattleLog("❌ Tu n'as aucun élixir !");
        renderBattle();
        return;
    }

    if (battlePlayerCreature.mp >= battlePlayerCreature.maxMp) {
        addBattleLog(
            `${battlePlayerCreature.name} a déjà tous ses MP !`
        );
        renderBattle();
        return;
    }

    const oldMp = battlePlayerCreature.mp;

    battlePlayerCreature.mp = Math.min(
        battlePlayerCreature.maxMp,
        battlePlayerCreature.mp + 20
    );

    const restored = battlePlayerCreature.mp - oldMp;

    currentPlayer.inventory.splice(etherIndex, 1);

    saveGame();

    addBattleLog(
        `🔷 ${battlePlayerCreature.name} récupère ${restored} MP !`
    );

    renderBattle();

    // Le Pokémon sauvage attaque après l'utilisation de l'élixir
    setTimeout(() => {

        if (battleEnded) return;

        wildAttack();

    }, 700);
}

function wildAttack() {

    if (!battleOpen || battleEnded) return;

    const wild = battleWildCreature;
    const player = battlePlayerCreature;

    applyAttack(wild, player, pickAffordableMove(wild));

    if (player.hp <= 0) {
        handlePlayerFaint();
        return;
    }

    // Le sauvage a pu se blesser lui-même avec le contrecoup de Lutte
    if (wild.hp <= 0) {
        finishBattleWin();
        return;
    }

    renderBattle();
}

function playerAttack(move) {

    if (!battleOpen || battleEnded) return;

    const player = battlePlayerCreature;
    const wild = battleWildCreature;
    const wildMove = pickAffordableMove(wild);

    const playerFirst =
        player.speed === wild.speed
            ? Math.random() < 0.5
            : player.speed > wild.speed;

    if (playerFirst) {

        applyAttack(player, wild, move);

        if (wild.hp <= 0) {
            finishBattleWin();
            return;
        }

        // Contrecoup de Lutte : la créature du joueur peut se blesser elle-même
        if (player.hp <= 0) {
            handlePlayerFaint();
            return;
        }

        applyAttack(wild, player, wildMove);

        if (player.hp <= 0) {
            handlePlayerFaint();
            return;
        }

        if (wild.hp <= 0) {
            finishBattleWin();
            return;
        }

    } else {

        applyAttack(wild, player, wildMove);

        if (player.hp <= 0) {
            handlePlayerFaint();
            return;
        }

        if (wild.hp <= 0) {
            finishBattleWin();
            return;
        }

        applyAttack(player, wild, move);

        if (wild.hp <= 0) {
            finishBattleWin();
            return;
        }

        if (player.hp <= 0) {
            handlePlayerFaint();
            return;
        }
    }

    renderBattle();
    renderBattleActions();
}

function playerCapture() {

    if (!battleOpen || battleEnded) return;

    const sphereIndex = currentPlayer.inventory.findIndex(
        item => item.id === "capture_sphere"
    );

    if (sphereIndex === -1) {
        addBattleLog("❌ Tu n'as aucune Sphère de Capture ! Achète-en à la boutique.");
        renderBattle();
        return;
    }

    currentPlayer.inventory.splice(sphereIndex, 1);

    const wild = battleWildCreature;
    const chance = computeCaptureChance(wild);
    const success = Math.random() < chance;

    if (success) {
        addBattleLog(`Tu as capturé ${wild.name} !`);
        finishBattleCapture();
        return;
    }

    addBattleLog(`La capture a échoué... ${wild.name} riposte !`);

    applyAttack(wild, battlePlayerCreature, pickAffordableMove(wild));

    saveGame();

    if (battlePlayerCreature.hp <= 0) {
        handlePlayerFaint();
        return;
    }

    // Contrecoup de Lutte : le sauvage a pu se blesser lui-même
    if (wild.hp <= 0) {
        finishBattleWin();
        return;
    }

    renderBattle();
}

function playerFlee() {

    if (!battleOpen || battleEnded) return;

    addBattleLog("Tu prends la fuite !");

    finishBattleFlee();
}

function finishBattleWin() {

    const winnerName = battlePlayerCreature.name;
    const defeatedCreature = battleWildCreature;
    const xpGain = defeatedCreature.level * 10;
    const moneyGain = defeatedCreature.level * 5;
    const levelUpMessages = gainXP(battlePlayerCreature, xpGain);

    currentPlayer.money += moneyGain;

    addBattleLog(`${defeatedCreature.name} est K.O. !`);
    addBattleLog(`${winnerName} gagne ${xpGain} points d'expérience !`);
    addBattleLog(`Tu gagnes ${moneyGain} 💰 !`);

    levelUpMessages.forEach(addBattleLog);

    updateTeamDisplay();
    updateMoneyDisplay();

    // Le dresseur a encore des créatures : il envoie la suivante, le combat continue
    if (battleTrainer && battleTrainerIndex < battleTrainerTeam.length - 1) {

        battleTrainerIndex++;
        battleWildCreature = battleTrainerTeam[battleTrainerIndex];

        addBattleLog(`${battleTrainer.name} envoie ${battleWildCreature.name} !`);

        saveGame();

        renderBattle();
        renderBattleActions();

        return;
    }

    battleEnded = true;

    if (battleTrainer) {

        const trainerReward = battleTrainer.reward || 0;

        currentPlayer.money += trainerReward;

        if (!currentPlayer.defeatedTrainers.includes(battleTrainer.id)) {
            currentPlayer.defeatedTrainers.push(battleTrainer.id);
        }

        addBattleLog(`Tu as vaincu ${battleTrainer.name} !`);

        if (battleTrainer.badge) {
            addBattleLog(`Tu remportes le ${battleTrainer.badge} ! 🏅`);
        }

        addBattleLog(`Récompense : ${trainerReward} 💰 !`);

        updateMoneyDisplay();
    }

    saveGame();

    renderBattle(true);
}

// Appelée quand la créature active tombe à 0 PV : propose de changer de
// créature s'il en reste une valide dans l'équipe, sinon le combat est perdu.
function handlePlayerFaint() {

    battlePlayerCreature.fainted = true;

    addBattleLog(`${battlePlayerCreature.name} est K.O. !`);

    updateTeamDisplay();
    saveGame();

    const aliveIndexes = currentPlayer.team
        .map((creature, index) => index)
        .filter(index => currentPlayer.team[index].hp > 0);

    if (aliveIndexes.length === 0) {
        finishBattleLose();
        return;
    }

    renderBattle();
    renderSwitchMenu(aliveIndexes);
}

function renderSwitchMenu(aliveIndexes) {

    const actionsEl = document.getElementById("battleActions");

    if (!actionsEl) return;

    actionsEl.innerHTML =
        `<p class="battle-switch-title">Choisis ta prochaine créature :</p>` +
        aliveIndexes.map(index => {
            const creature = currentPlayer.team[index];
            return `
                <button class="battle-switch-button" data-team-index="${index}">
                    ${creature.name} (Nv. ${creature.level}) — ${creature.hp}/${creature.maxHp} PV
                </button>
            `;
        }).join("");

    actionsEl.querySelectorAll(".battle-switch-button").forEach(button => {
        const index = Number(button.dataset.teamIndex);
        button.addEventListener("click", () => switchToCreature(index));
    });
}

function switchToCreature(index) {

    if (!battleOpen || battleEnded) return;

    const creature = currentPlayer.team[index];

    if (!creature || creature.hp <= 0) return;

    currentPlayer.activeCreature = index;
    battlePlayerCreature = creature;

    addBattleLog(`Tu envoies ${creature.name} au combat !`);

    updateTeamDisplay();
    saveGame();

    renderBattle();
    renderBattleActions();
}

function finishBattleLose() {

    battleEnded = true;

    addBattleLog("Toute ton équipe est K.O. !");
    addBattleLog("Rends-toi au Centre Fakemon pour soigner ton équipe.");

    saveGame();

    renderBattle(true);
}

function finishBattleCapture() {

    battleEnded = true;

    const captured = battleWildCreature;
    const moneyGain = captured.level * 5;

    markPokedexCaught(captured.id);

    currentPlayer.money += moneyGain;
    addBattleLog(`Tu gagnes ${moneyGain} 💰 !`);

    if (currentPlayer.team.length < MAX_TEAM_SIZE) {
        currentPlayer.team.push(captured);
        updateTeamDisplay();
    } else {
        currentPlayer.storage.push(captured);
        addBattleLog(`${captured.name} a été envoyé(e) au stockage (équipe pleine).`);
    }

    updateMoneyDisplay();
    saveGame();

    renderBattle(true);
}

function finishBattleFlee() {

    battleEnded = true;

    renderBattle(true);
}

function closeBattle() {

    battleOpen = false;
    battleEnded = false;
    battlePlayerCreature = null;
    battleWildCreature = null;
    battleTrainer = null;
    battleTrainerTeam = [];
    battleTrainerIndex = 0;
    battleLog = [];

    const battleWindow = document.getElementById("battleWindow");

    if (battleWindow) {
        battleWindow.remove();
    }
}

// ==========================================================
// Combat PvP en ligne (US19)
//
// Deux joueurs, chacun sur sa propre machine, s'affrontent en tour par
// tour via une ligne partagée dans la table Supabase "pvp_matches". Les
// deux clients écoutent les changements en temps réel sur cette ligne ;
// dès que les deux actions du tour sont connues, N'IMPORTE LEQUEL des deux
// clients calcule le résultat et l'écrit (l'update est protégé par
// `.eq("turn", row.turn)`, donc si les deux clients tentent la résolution
// en même temps, un seul réussit et l'autre devient un no-op silencieux).
// Cela évite d'avoir besoin d'un vrai serveur de jeu tout en restant sûr
// même si l'un des deux joueurs ferme son onglet en cours de partie.
// ==========================================================

const PVP_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePvpRoomCode() {
    let code = "";

    for (let i = 0; i < 6; i++) {
        code += PVP_CODE_CHARS[Math.floor(Math.random() * PVP_CODE_CHARS.length)];
    }

    return code;
}

// Équipe "envoyée en combat" : une copie indépendante de l'équipe du joueur,
// soignée au maximum (comme un combat officiel), pour ne jamais affecter
// l'équipe réelle utilisée en exploration.
function buildPvpTeamSnapshot() {
    return currentPlayer.team.map(creature => ({
        uid: creature.uid,
        id: creature.id,
        name: creature.name,
        type: creature.type,
        level: creature.level,
        maxHp: creature.maxHp,
        hp: creature.maxHp,
        maxMp: creature.maxMp,
        mp: creature.maxMp,
        attack: creature.attack,
        defense: creature.defense,
        speed: creature.speed,
        fainted: false,
        attacks: creature.attacks
    }));
}

function openPvpMenu() {

    if (pvpOpen) return;

    if (currentPlayer.team.length === 0) {
        alert("Tu as besoin d'au moins une créature dans ton équipe pour affronter un autre joueur !");
        return;
    }

    pvpOpen = true;
    pressedKeys.clear();

    const pvpWindow = document.createElement("div");
    pvpWindow.id = "pvpWindow";
    document.body.appendChild(pvpWindow);

    renderPvpMenuScreen();
}

function renderPvpMenuScreen() {

    const pvpWindow = document.getElementById("pvpWindow");

    if (!pvpWindow) return;

    if (!isSupabaseConfigured()) {
        pvpWindow.innerHTML = `
            <div class="battle-box pvp-box">
                <h2 class="battle-title">⚔️ Combat en ligne (PvP)</h2>
                <p>Le combat en ligne a besoin d'un backend partagé (Supabase) pour synchroniser les deux joueurs.</p>
                <p>Configure <code>SUPABASE_URL</code> et <code>SUPABASE_ANON_KEY</code> dans <code>supabase-config.js</code>, exécute <code>supabase_pvp_schema.sql</code> dans ton projet Supabase, puis recharge la page.</p>
                <button id="pvpCloseButton">Fermer</button>
            </div>
        `;

        document.getElementById("pvpCloseButton").addEventListener("click", closePvpMenu);
        return;
    }

    pvpWindow.innerHTML = `
        <div class="battle-box pvp-box">

            <h2 class="battle-title">⚔️ Combat en ligne (PvP)</h2>

            <p class="pvp-intro">Affronte un autre joueur avec ton équipe (soignée pour l'occasion) !</p>

            <button id="pvpSearchButton">🔍 Rechercher un adversaire</button>

            <div class="pvp-divider">— ou, avec un code —</div>

            <button id="pvpCreateButton">🆕 Créer une partie</button>

            <div class="pvp-join-row">
                <input id="pvpCodeInput" maxlength="6" placeholder="CODE DE PARTIE">
                <button id="pvpJoinButton">Rejoindre</button>
            </div>

            <p id="pvpMenuError" class="pvp-error"></p>

            <button id="pvpCloseButton" class="pvp-secondary">Fermer</button>

        </div>
    `;

    document
        .getElementById("pvpSearchButton")
        .addEventListener("click", searchPvpOpponent);

    document
        .getElementById("pvpCreateButton")
        .addEventListener("click", createPvpRoom);

    document
        .getElementById("pvpJoinButton")
        .addEventListener("click", () => {
            joinPvpRoom(document.getElementById("pvpCodeInput").value);
        });

    document
        .getElementById("pvpCodeInput")
        .addEventListener("keydown", (e) => {
            e.stopPropagation();

            if (e.key === "Enter") {
                joinPvpRoom(document.getElementById("pvpCodeInput").value);
            }
        });

    document
        .getElementById("pvpCloseButton")
        .addEventListener("click", closePvpMenu);
}

function showPvpMenuError(message) {
    const errorEl = document.getElementById("pvpMenuError");

    if (errorEl) errorEl.textContent = message;
}

// Ferme le menu PvP, mais jamais un combat ou une recherche en cours (évite
// de les perdre par une fermeture accidentelle au clavier ou au clic).
function closePvpMenu() {

    if (pvpMatch || pvpSearch) return;

    pvpOpen = false;

    const pvpWindow = document.getElementById("pvpWindow");

    if (pvpWindow) pvpWindow.remove();
}

async function createPvpRoom() {

    const client = getSupabaseClient();

    if (!client) return;

    const createButton = document.getElementById("pvpCreateButton");

    if (createButton) createButton.disabled = true;

    showPvpMenuError("");

    const team = buildPvpTeamSnapshot();

    for (let attempt = 0; attempt < 5; attempt++) {

        const code = generatePvpRoomCode();

        const { data, error } = await client
            .from("pvp_matches")
            .insert({
                code,
                status: "waiting",
                player1_pseudo: currentPlayer.pseudo,
                player1_team: team,
                player1_active: 0,
                player1_pending: "move"
            })
            .select()
            .single();

        if (!error && data) {
            pvpMatch = { code, role: "player1", channel: null, row: data };
            subscribeToPvpMatch(code);
            renderPvpWaitingScreen();
            return;
        }

        // Code déjà pris (contrainte unique sur "code") : on retente avec un autre code
        if (error && error.code !== "23505") {
            console.error(error);
            showPvpMenuError("Impossible de créer la partie. Vérifie ta configuration Supabase.");
            if (createButton) createButton.disabled = false;
            return;
        }
    }

    showPvpMenuError("Impossible de générer un code de partie, réessaie.");

    if (createButton) createButton.disabled = false;
}

async function joinPvpRoom(rawCode) {

    const client = getSupabaseClient();

    if (!client) return;

    const code = rawCode.trim().toUpperCase();

    if (code.length === 0) {
        showPvpMenuError("Entre un code de partie.");
        return;
    }

    const joinButton = document.getElementById("pvpJoinButton");

    if (joinButton) joinButton.disabled = true;

    showPvpMenuError("");

    const { data: existing, error: fetchError } = await client
        .from("pvp_matches")
        .select("*")
        .eq("code", code)
        .maybeSingle();

    if (fetchError || !existing) {
        showPvpMenuError("Partie introuvable. Vérifie le code.");
        if (joinButton) joinButton.disabled = false;
        return;
    }

    if (existing.status !== "waiting") {
        showPvpMenuError("Cette partie a déjà commencé ou est terminée.");
        if (joinButton) joinButton.disabled = false;
        return;
    }

    const team = buildPvpTeamSnapshot();

    const { data: updated, error: updateError } = await client
        .from("pvp_matches")
        .update({
            player2_pseudo: currentPlayer.pseudo,
            player2_team: team,
            player2_active: 0,
            player2_pending: "move",
            status: "active",
            updated_at: new Date().toISOString()
        })
        .eq("code", code)
        .eq("status", "waiting")
        .select()
        .single();

    if (updateError || !updated) {
        showPvpMenuError("Cette partie vient d'être rejointe par quelqu'un d'autre.");
        if (joinButton) joinButton.disabled = false;
        return;
    }

    pvpMatch = { code, role: "player2", channel: null, row: updated };
    subscribeToPvpMatch(code);
    openPvpBattleScreen();
    renderPvpBattle(updated);
}

// ==========================================================
// Recherche d'adversaire (matchmaking)
//
// Table "pvp_queue" : chaque joueur en recherche y a une ligne
// (pseudo + équipe). Dès qu'un joueur arrive et trouve une ligne plus
// ancienne encore "waiting", il la "réclame" (update protégé par
// .eq("status", "waiting"), comme la résolution de tour du combat PvP :
// si deux joueurs tentent de réclamer la même ligne en même temps, un seul
// réussit) puis crée directement la partie, déjà active avec les deux
// équipes. Seul celui qui arrive APRÈS tente de réclamer quelqu'un ;
// celui qui attend déjà reste passif et se contente d'écouter les
// changements sur sa propre ligne. Ça évite que deux joueurs qui arrivent
// en même temps ne se réclament mutuellement (ce qui créerait deux parties
// séparées pour une seule paire de joueurs).
//
// Limite connue : si un joueur ferme son onglet pendant qu'il est dans la
// file, sa ligne reste "waiting" jusqu'à ce qu'elle expire (on ignore les
// lignes de plus de 2 minutes lors de la recherche) — un adversaire peut
// donc, dans de rares cas, tomber sur quelqu'un qui ne répondra jamais
// pendant jusqu'à 2 minutes avant qu'une ligne plus récente n'apparaisse.
// ==========================================================

const PVP_QUEUE_MAX_AGE_MS = 2 * 60 * 1000;

async function searchPvpOpponent() {

    const client = getSupabaseClient();

    if (!client) return;

    const searchButton = document.getElementById("pvpSearchButton");

    if (searchButton) searchButton.disabled = true;

    showPvpMenuError("");

    const team = buildPvpTeamSnapshot();

    const { data: ownRow, error } = await client
        .from("pvp_queue")
        .insert({
            pseudo: currentPlayer.pseudo,
            team,
            status: "waiting"
        })
        .select()
        .single();

    if (error || !ownRow) {
        console.error(error);
        showPvpMenuError("Impossible de rejoindre la recherche d'adversaire.");
        if (searchButton) searchButton.disabled = false;
        return;
    }

    pvpSearch = { rowId: ownRow.id, channel: null };

    renderPvpSearchingScreen();
    subscribeToPvpQueueRow(ownRow.id);

    await attemptMatchFromQueue(client, ownRow);
}

async function attemptMatchFromQueue(client, ownRow) {

    // La recherche a pu être annulée (ou déjà résolue par l'autre joueur)
    // pendant qu'on attendait la réponse de Supabase.
    if (!pvpSearch || pvpSearch.rowId !== ownRow.id) return;

    const cutoff = new Date(Date.now() - PVP_QUEUE_MAX_AGE_MS).toISOString();

    const { data: candidates } = await client
        .from("pvp_queue")
        .select("*")
        .eq("status", "waiting")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: true })
        .limit(5);

    if (!candidates) return;

    for (const opponentRow of candidates) {

        if (opponentRow.id === ownRow.id) continue;
        if (new Date(opponentRow.created_at) >= new Date(ownRow.created_at)) continue;

        const matched = await claimQueueOpponent(client, ownRow, opponentRow);
        if (matched) return;
    }
}

async function claimQueueOpponent(client, ownRow, opponentRow) {

    const code = generatePvpRoomCode();

    const { data: claimed, error: claimError } = await client
        .from("pvp_queue")
        .update({ status: "matched", match_code: code })
        .eq("id", opponentRow.id)
        .eq("status", "waiting")
        .select()
        .single();

    // Un autre joueur a réclamé cette ligne juste avant nous : pas grave,
    // on essaiera le prochain candidat (ou on restera passif s'il n'y en a
    // pas d'autre plus ancien que nous).
    if (claimError || !claimed) return false;

    const { data: matchRow, error: matchError } = await client
        .from("pvp_matches")
        .insert({
            code,
            status: "active",
            player1_pseudo: currentPlayer.pseudo,
            player1_team: buildPvpTeamSnapshot(),
            player1_active: 0,
            player1_pending: "move",
            player2_pseudo: opponentRow.pseudo,
            player2_team: opponentRow.team,
            player2_active: 0,
            player2_pending: "move"
        })
        .select()
        .single();

    await client.from("pvp_queue").delete().eq("id", ownRow.id);

    if (matchError || !matchRow) {
        console.error(matchError);
        cleanupPvpSearch();
        showPvpMenuError("Un adversaire a été trouvé mais la création de la partie a échoué, réessaie.");
        renderPvpMenuScreen();
        return true;
    }

    cleanupPvpSearch();

    pvpMatch = { code, role: "player1", channel: null, row: matchRow };
    subscribeToPvpMatch(code);
    openPvpBattleScreen();
    renderPvpBattle(matchRow);

    return true;
}

function subscribeToPvpQueueRow(rowId) {

    const client = getSupabaseClient();

    if (!client || !pvpSearch) return;

    const channel = client
        .channel(`pvp-queue-${rowId}`)
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "pvp_queue", filter: `id=eq.${rowId}` },
            (payload) => handlePvpQueueRowUpdate(payload.new)
        )
        .subscribe();

    pvpSearch.channel = channel;
}

// Un autre joueur vient de nous réclamer : la partie existe déjà (créée
// avant la mise à jour de notre ligne), on la récupère et on rejoint
// directement le combat en tant que joueur 2.
async function handlePvpQueueRowUpdate(row) {

    if (!pvpSearch || row.id !== pvpSearch.rowId) return;
    if (row.status !== "matched" || !row.match_code) return;

    const code = row.match_code;
    const client = getSupabaseClient();

    cleanupPvpSearch();

    if (!client) return;

    pvpMatch = { code, role: "player2", channel: null, row: null };
    subscribeToPvpMatch(code);

    const { data: matchRow } = await client
        .from("pvp_matches")
        .select("*")
        .eq("code", code)
        .maybeSingle();

    // Si la ligne n'existe pas encore (minuscule fenêtre de course entre la
    // réclamation et la création de la partie), l'abonnement temps réel
    // ci-dessus recevra l'insertion dans l'instant qui suit.
    if (matchRow) {
        handlePvpRowUpdate(matchRow);
    }
}

async function cancelPvpSearch() {

    const client = getSupabaseClient();

    if (client && pvpSearch) {
        await client.from("pvp_queue").delete().eq("id", pvpSearch.rowId);
    }

    cleanupPvpSearch();
    renderPvpMenuScreen();
}

function cleanupPvpSearch() {

    if (pvpSearch && pvpSearch.channel) {
        const client = getSupabaseClient();
        if (client) client.removeChannel(pvpSearch.channel);
    }

    pvpSearch = null;
}

function renderPvpSearchingScreen() {

    const pvpWindow = document.getElementById("pvpWindow");

    if (!pvpWindow || !pvpSearch) return;

    pvpWindow.innerHTML = `
        <div class="battle-box pvp-box">

            <h2 class="battle-title">🔍 Recherche d'un adversaire...</h2>

            <p class="pvp-hint">Le combat démarrera automatiquement dès qu'un autre joueur sera trouvé.</p>

            <button id="pvpCancelSearchButton" class="pvp-secondary">Annuler la recherche</button>

        </div>
    `;

    document
        .getElementById("pvpCancelSearchButton")
        .addEventListener("click", cancelPvpSearch);
}

function subscribeToPvpMatch(code) {

    const client = getSupabaseClient();

    if (!client || !pvpMatch) return;

    const channel = client
        .channel(`pvp-match-${code}`)
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "pvp_matches", filter: `code=eq.${code}` },
            (payload) => {

                if (!pvpMatch) return;

                if (payload.eventType === "DELETE") {
                    handlePvpMatchDeleted();
                    return;
                }

                handlePvpRowUpdate(payload.new);
            }
        )
        .subscribe();

    pvpMatch.channel = channel;
}

function handlePvpMatchDeleted() {

    if (!pvpMatch) return;

    alert("La partie a été annulée par l'autre joueur.");
    closePvpBattle();
}

function handlePvpRowUpdate(row) {

    if (!pvpMatch || row.code !== pvpMatch.code) return;

    pvpMatch.row = row;

    if (row.status === "waiting") {
        renderPvpWaitingScreen();
        return;
    }

    // La partie vient de démarrer (le 2e joueur a rejoint) : on bascule sur
    // l'écran de combat si ce n'est pas déjà fait (pertinent pour le créateur,
    // qui était jusque-là sur l'écran d'attente).
    if (!document.getElementById("pvpBattleBox")) {
        openPvpBattleScreen();
    }

    renderPvpBattle(row);

    if (row.status === "active") {
        attemptResolvePvpTurn(row);
    }
}

function renderPvpWaitingScreen() {

    const pvpWindow = document.getElementById("pvpWindow");

    if (!pvpWindow || !pvpMatch) return;

    pvpWindow.innerHTML = `
        <div class="battle-box pvp-box">

            <h2 class="battle-title">⏳ En attente d'un adversaire...</h2>

            <p>Partage ce code avec ton adversaire :</p>

            <div class="pvp-code-display">${pvpMatch.code}</div>

            <p class="pvp-hint">Le combat démarrera automatiquement dès qu'il/elle aura rejoint la partie.</p>

            <button id="pvpCancelButton" class="pvp-secondary">Annuler la partie</button>

        </div>
    `;

    document
        .getElementById("pvpCancelButton")
        .addEventListener("click", cancelPvpRoom);
}

async function cancelPvpRoom() {

    const client = getSupabaseClient();

    if (client && pvpMatch) {
        await client.from("pvp_matches").delete().eq("code", pvpMatch.code);
    }

    closePvpBattle();
}

function openPvpBattleScreen() {

    const pvpWindow = document.getElementById("pvpWindow");

    if (!pvpWindow) return;

    pvpWindow.innerHTML = `
        <div class="battle-box pvp-box" id="pvpBattleBox">

            <h2 class="battle-title" id="pvpBattleTitle">⚔️ Combat en ligne</h2>

            <div class="battle-combatants">

                <div class="battle-side">
                    <img id="pvpMineSprite" class="battle-sprite" src="" alt="">
                    <strong id="pvpMineName"></strong>
                    <span id="pvpMineLevel"></span>
                    <span id="pvpMineType"></span>
                    <div class="battle-hp-bar"><div id="pvpMineHpFill" class="battle-hp-fill"></div></div>
                    <small id="pvpMineHpText"></small>
                    <div class="battle-mp-bar"><div id="pvpMineMpFill" class="battle-mp-fill"></div></div>
                    <small id="pvpMineMpText"></small>
                </div>

                <div class="battle-vs">VS</div>

                <div class="battle-side">
                    <img id="pvpOppSprite" class="battle-sprite" src="" alt="">
                    <strong id="pvpOppName"></strong>
                    <span id="pvpOppLevel"></span>
                    <span id="pvpOppType"></span>
                    <div class="battle-hp-bar"><div id="pvpOppHpFill" class="battle-hp-fill"></div></div>
                    <small id="pvpOppHpText"></small>
                </div>

            </div>

            <div class="battle-log" id="pvpLog"></div>

            <div class="battle-actions" id="pvpActions"></div>

        </div>
    `;
}

function renderPvpBattle(row) {

    if (!pvpMatch) return;

    const isP1 = pvpMatch.role === "player1";

    const myTeam = isP1 ? row.player1_team : row.player2_team;
    const oppTeam = isP1 ? row.player2_team : row.player1_team;
    const myActive = isP1 ? row.player1_active : row.player2_active;
    const oppActive = isP1 ? row.player2_active : row.player1_active;
    const myPseudo = isP1 ? row.player1_pseudo : row.player2_pseudo;
    const oppPseudo = isP1 ? row.player2_pseudo : row.player1_pseudo;

    const mine = myTeam[myActive];
    const opp = oppTeam[oppActive];

    document.getElementById("pvpBattleTitle").textContent = `⚔️ ${myPseudo} VS ${oppPseudo}`;

    document.getElementById("pvpMineSprite").src =
        `fakemon_creatures/${String(mine.id).padStart(3, "0")}.png`;
    document.getElementById("pvpMineName").textContent = mine.name;
    document.getElementById("pvpMineLevel").textContent = `Nv. ${mine.level}`;
    document.getElementById("pvpMineType").innerHTML = renderTypeBadge(mine.type);

    const mineHpPercent = Math.max(0, Math.min(100, (mine.hp / mine.maxHp) * 100));
    document.getElementById("pvpMineHpFill").style.width = `${mineHpPercent}%`;
    document.getElementById("pvpMineHpText").textContent = `${mine.hp}/${mine.maxHp} PV`;

    const mineMpPercent = Math.max(0, Math.min(100, (mine.mp / mine.maxMp) * 100));
    document.getElementById("pvpMineMpFill").style.width = `${mineMpPercent}%`;
    document.getElementById("pvpMineMpText").textContent = `${mine.mp}/${mine.maxMp} MP`;

    document.getElementById("pvpOppSprite").src =
        `fakemon_creatures/${String(opp.id).padStart(3, "0")}.png`;
    document.getElementById("pvpOppName").textContent = opp.name;
    document.getElementById("pvpOppLevel").textContent = `Nv. ${opp.level}`;
    document.getElementById("pvpOppType").innerHTML = renderTypeBadge(opp.type);

    const oppHpPercent = Math.max(0, Math.min(100, (opp.hp / opp.maxHp) * 100));
    document.getElementById("pvpOppHpFill").style.width = `${oppHpPercent}%`;
    document.getElementById("pvpOppHpText").textContent = `${opp.hp}/${opp.maxHp} PV`;

    const logEl = document.getElementById("pvpLog");
    logEl.innerHTML = (row.log || []).map(line => `<p>${line}</p>`).join("");
    logEl.scrollTop = logEl.scrollHeight;

    renderPvpActions(row, isP1, myPseudo, oppPseudo);
}

function renderPvpActions(row, isP1, myPseudo, oppPseudo) {

    const actionsEl = document.getElementById("pvpActions");

    if (!actionsEl) return;

    if (row.status === "finished") {

        let resultText;

        if (row.winner === "draw") {
            resultText = "🤝 Match nul !";
        } else if ((row.winner === "player1") === isP1) {
            resultText = "🏆 Tu as gagné le combat !";
        } else {
            resultText = "😵 Tu as perdu le combat...";
        }

        actionsEl.innerHTML = `
            <p class="pvp-result">${resultText}</p>
            <button id="pvpFinishCloseButton">Fermer</button>
        `;

        document
            .getElementById("pvpFinishCloseButton")
            .addEventListener("click", closePvpBattle);

        return;
    }

    const myMove = isP1 ? row.player1_move : row.player2_move;
    const myPending = isP1 ? row.player1_pending : row.player2_pending;
    const oppPending = isP1 ? row.player2_pending : row.player1_pending;
    const myTeam = isP1 ? row.player1_team : row.player2_team;
    const myActiveIndex = isP1 ? row.player1_active : row.player2_active;

    if (myMove) {
        actionsEl.innerHTML = `<p class="pvp-waiting">En attente de ${oppPseudo}...</p>`;
        return;
    }

    if (myPending === "switch") {

        const aliveOptions = myTeam
            .map((creature, index) => ({ creature, index }))
            .filter(entry => entry.creature.hp > 0);

        actionsEl.innerHTML =
            `<p class="battle-switch-title">${myTeam[myActiveIndex].name} est K.O. ! Choisis ta prochaine créature :</p>` +
            aliveOptions.map(({ creature, index }) => `
                <button class="battle-switch-button" data-team-index="${index}">
                    ${creature.name} (Nv. ${creature.level}) — ${creature.hp}/${creature.maxHp} PV
                </button>
            `).join("");

        actionsEl.querySelectorAll(".battle-switch-button").forEach(button => {
            const index = Number(button.dataset.teamIndex);
            button.addEventListener("click", () => submitPvpSwitch(index));
        });

        return;
    }

    if (oppPending === "switch") {
        actionsEl.innerHTML = `<p class="pvp-waiting">${oppPseudo} envoie une nouvelle créature...</p>`;
        return;
    }

    const mine = myTeam[myActiveIndex];

    const oppTeam = isP1 ? row.player2_team : row.player1_team;
    const oppActiveIndex = isP1 ? row.player2_active : row.player1_active;
    const opponentType = oppTeam[oppActiveIndex].type;

    const forfeitButtonHtml = `<button id="pvpForfeitButton" class="pvp-secondary">🏳️ Abandonner</button>`;

    // Plus aucune attaque abordable : repli obligatoire sur Lutte
    if (!hasAffordableMove(mine)) {

        actionsEl.innerHTML = `
            <p class="pvp-hint">${mine.name} n'a plus assez de MP pour aucune attaque !</p>
            <button id="pvpStruggleButton">🥊 Lutte (contrecoup)</button>
            ${forfeitButtonHtml}
        `;

        document
            .getElementById("pvpStruggleButton")
            .addEventListener("click", submitPvpStruggle);

        document
            .getElementById("pvpForfeitButton")
            .addEventListener("click", forfeitPvpMatch);

        return;
    }

    actionsEl.innerHTML =
        mine.attacks.map((move, index) => {

            const affordable = canAffordMove(mine, move);

            return `
                <button class="battle-move-button" data-move-index="${index}" ${affordable ? "" : "disabled"}>
                    <span class="move-button-main">⚔️ ${move.name}</span>
                    <span class="move-button-meta">
                        ${renderTypeBadge(move.type)}
                        ${renderMoveMpBadge(move, mine)}
                        ${renderMoveEffectivenessBadge(move.type, opponentType)}
                    </span>
                </button>
            `;
        }).join("") +
        forfeitButtonHtml;

    actionsEl.querySelectorAll(".battle-move-button:not([disabled])").forEach(button => {
        const index = Number(button.dataset.moveIndex);
        button.addEventListener("click", () => submitPvpAttack(index));
    });

    document
        .getElementById("pvpForfeitButton")
        .addEventListener("click", forfeitPvpMatch);
}

async function submitPvpAttack(moveIndex) {

    const client = getSupabaseClient();

    if (!client || !pvpMatch) return;

    const field = pvpMatch.role === "player1" ? "player1_move" : "player2_move";

    const actionsEl = document.getElementById("pvpActions");
    if (actionsEl) actionsEl.innerHTML = `<p class="pvp-waiting">En attente de l'adversaire...</p>`;

    await client
        .from("pvp_matches")
        .update({
            [field]: { type: "attack", moveIndex },
            updated_at: new Date().toISOString()
        })
        .eq("code", pvpMatch.code);
}

async function submitPvpStruggle() {

    const client = getSupabaseClient();

    if (!client || !pvpMatch) return;

    const field = pvpMatch.role === "player1" ? "player1_move" : "player2_move";

    const actionsEl = document.getElementById("pvpActions");
    if (actionsEl) actionsEl.innerHTML = `<p class="pvp-waiting">En attente de l'adversaire...</p>`;

    await client
        .from("pvp_matches")
        .update({
            [field]: { type: "struggle" },
            updated_at: new Date().toISOString()
        })
        .eq("code", pvpMatch.code);
}

async function submitPvpSwitch(index) {

    const client = getSupabaseClient();

    if (!client || !pvpMatch) return;

    const field = pvpMatch.role === "player1" ? "player1_move" : "player2_move";

    const actionsEl = document.getElementById("pvpActions");
    if (actionsEl) actionsEl.innerHTML = `<p class="pvp-waiting">En attente de l'adversaire...</p>`;

    await client
        .from("pvp_matches")
        .update({
            [field]: { type: "switch", index },
            updated_at: new Date().toISOString()
        })
        .eq("code", pvpMatch.code);
}

async function forfeitPvpMatch() {

    const client = getSupabaseClient();

    if (!client || !pvpMatch) return;

    if (!confirm("Abandonner le combat ?")) return;

    const winner = pvpMatch.role === "player1" ? "player2" : "player1";
    const myPseudo = pvpMatch.row[`${pvpMatch.role}_pseudo`];

    await client
        .from("pvp_matches")
        .update({
            status: "finished",
            winner,
            log: [...(pvpMatch.row.log || []), `${myPseudo} a abandonné le combat.`],
            updated_at: new Date().toISOString()
        })
        .eq("code", pvpMatch.code)
        .eq("status", "active");
}

// Calcule, à partir d'une ligne de combat, le prochain état si les deux
// actions attendues ce tour-ci sont connues (sinon renvoie null : on attend
// encore l'autre joueur). Fonction pure : ne lit/écrit rien elle-même.
function computeNextPvpState(row) {

    const p1SwitchNeeded = row.player1_pending === "switch";
    const p2SwitchNeeded = row.player2_pending === "switch";
    const isSwitchRound = p1SwitchNeeded || p2SwitchNeeded;

    const p1Ready = p1SwitchNeeded
        ? !!row.player1_move && row.player1_move.type === "switch"
        : (isSwitchRound || (!!row.player1_move && ["attack", "struggle"].includes(row.player1_move.type)));

    const p2Ready = p2SwitchNeeded
        ? !!row.player2_move && row.player2_move.type === "switch"
        : (isSwitchRound || (!!row.player2_move && ["attack", "struggle"].includes(row.player2_move.type)));

    if (!p1Ready || !p2Ready) return null;

    const team1 = row.player1_team.map(creature => ({ ...creature }));
    const team2 = row.player2_team.map(creature => ({ ...creature }));

    let active1 = row.player1_active;
    let active2 = row.player2_active;

    const log = [];

    if (isSwitchRound) {

        // Un ou deux joueurs viennent d'envoyer une nouvelle créature après
        // un K.O. : aucun dégât n'est échangé ce tour-ci.
        if (p1SwitchNeeded) {
            active1 = row.player1_move.index;
            log.push(`${row.player1_pseudo} envoie ${team1[active1].name} !`);
        }

        if (p2SwitchNeeded) {
            active2 = row.player2_move.index;
            log.push(`${row.player2_pseudo} envoie ${team2[active2].name} !`);
        }

    } else {

        const a1 = team1[active1];
        const a2 = team2[active2];
        const move1 = row.player1_move.type === "struggle" ? STRUGGLE_MOVE : a1.attacks[row.player1_move.moveIndex];
        const move2 = row.player2_move.type === "struggle" ? STRUGGLE_MOVE : a2.attacks[row.player2_move.moveIndex];

        const p1First = a1.speed === a2.speed ? Math.random() < 0.5 : a1.speed > a2.speed;
        const order = p1First ? [1, 2] : [2, 1];

        order.forEach(side => {

            if (side === 1) {

                // a2 peut déjà être K.O. si a1 s'est blessé lui-même avec
                // Lutte lors d'une action précédente de ce même tour
                if (a1.hp <= 0 || a2.hp <= 0) return;

                const { damage, multiplier } = computeDamage(a1, a2, move1);
                a2.hp = Math.max(0, a2.hp - damage);
                a1.mp = Math.max(0, a1.mp - move1.mpCost);

                log.push(`${a1.name} utilise ${move1.name} et inflige ${damage} dégâts à ${a2.name} !`);
                const message1 = getEffectivenessMessage(multiplier);
                if (message1) log.push(message1);
                if (a2.hp <= 0) log.push(`${a2.name} est K.O. !`);

                if (move1.isStruggle) {
                    const recoil1 = Math.max(1, Math.round(damage * 0.25));
                    a1.hp = Math.max(0, a1.hp - recoil1);
                    log.push(`${a1.name} est blessé(e) par le contrecoup ! (-${recoil1} PV)`);
                }

            } else {

                if (a2.hp <= 0 || a1.hp <= 0) return;

                const { damage, multiplier } = computeDamage(a2, a1, move2);
                a1.hp = Math.max(0, a1.hp - damage);
                a2.mp = Math.max(0, a2.mp - move2.mpCost);

                log.push(`${a2.name} utilise ${move2.name} et inflige ${damage} dégâts à ${a1.name} !`);
                const message2 = getEffectivenessMessage(multiplier);
                if (message2) log.push(message2);
                if (a1.hp <= 0) log.push(`${a1.name} est K.O. !`);

                if (move2.isStruggle) {
                    const recoil2 = Math.max(1, Math.round(damage * 0.25));
                    a2.hp = Math.max(0, a2.hp - recoil2);
                    log.push(`${a2.name} est blessé(e) par le contrecoup ! (-${recoil2} PV)`);
                }
            }
        });
    }

    const team1Alive = team1.some(creature => creature.hp > 0);
    const team2Alive = team2.some(creature => creature.hp > 0);

    let status = "active";
    let winner = null;

    if (!team1Alive || !team2Alive) {

        status = "finished";
        winner = !team1Alive && !team2Alive ? "draw" : (!team1Alive ? "player2" : "player1");

        if (winner === "draw") {
            log.push("Match nul : les deux équipes sont K.O. !");
        } else {
            const winnerPseudo = winner === "player1" ? row.player1_pseudo : row.player2_pseudo;
            log.push(`${winnerPseudo} remporte le combat ! 🏆`);
        }
    }

    const player1_pending = team1Alive && team1[active1].hp <= 0 ? "switch" : "move";
    const player2_pending = team2Alive && team2[active2].hp <= 0 ? "switch" : "move";

    return {
        player1_team: team1,
        player2_team: team2,
        player1_active: active1,
        player2_active: active2,
        player1_move: null,
        player2_move: null,
        player1_pending,
        player2_pending,
        status,
        winner,
        turn: row.turn + 1,
        log: [...(row.log || []), ...log].slice(-60),
        updated_at: new Date().toISOString()
    };
}

// Tente de résoudre le tour en cours. Protégé par `.eq("turn", row.turn)` :
// si l'autre client a déjà résolu ce tour entre-temps, cette écriture ne
// touche aucune ligne et ne fait donc rien (pas de double résolution).
function attemptResolvePvpTurn(row) {

    const next = computeNextPvpState(row);

    if (!next) return;

    const client = getSupabaseClient();

    if (!client) return;

    client
        .from("pvp_matches")
        .update(next)
        .eq("code", row.code)
        .eq("turn", row.turn)
        .then(({ error }) => {
            if (error) console.error("Résolution du tour PvP impossible :", error);
        });
}

function closePvpBattle() {

    if (pvpMatch && pvpMatch.channel) {
        const client = getSupabaseClient();
        if (client) client.removeChannel(pvpMatch.channel);
    }

    pvpMatch = null;
    pvpOpen = false;

    const pvpWindow = document.getElementById("pvpWindow");

    if (pvpWindow) pvpWindow.remove();
}

// ==========================================================
// Échange entre joueurs (US18)
//
// Même principe que le combat PvP par code (table Supabase partagée +
// abonnement temps réel), mais sans combat : chaque joueur propose une
// créature de son équipe ou de son stockage, voit l'offre de l'autre, puis
// confirme. Dès que les deux ont confirmé, chaque client applique
// localement le résultat (retire sa créature donnée, ajoute celle reçue) —
// aucun calcul à synchroniser entre les deux joueurs, donc pas besoin d'un
// "résolveur" unique comme pour les tours de combat : chacun ne modifie que
// sa propre équipe.
// ==========================================================

// Retrouve une créature du joueur (équipe ou stockage) par son identifiant
// unique. Renvoie { list, index } (list étant directement currentPlayer.team
// ou currentPlayer.storage, pour pouvoir la modifier en place).
function findCreatureLocation(uid) {

    let index = currentPlayer.team.findIndex(creature => creature.uid === uid);

    if (index !== -1) return { list: currentPlayer.team, index };

    index = currentPlayer.storage.findIndex(creature => creature.uid === uid);

    if (index !== -1) return { list: currentPlayer.storage, index };

    return null;
}

function openTradeMenu() {

    if (tradeOpen) return;

    if (currentPlayer.team.length === 0 && currentPlayer.storage.length === 0) {
        alert("Tu n'as aucune créature à échanger.");
        return;
    }

    tradeOpen = true;
    pressedKeys.clear();

    const tradeWindow = document.createElement("div");
    tradeWindow.id = "tradeWindow";
    document.body.appendChild(tradeWindow);

    renderTradeMenuScreen();
}

function renderTradeMenuScreen() {

    const tradeWindow = document.getElementById("tradeWindow");

    if (!tradeWindow) return;

    if (!isSupabaseConfigured()) {
        tradeWindow.innerHTML = `
            <div class="battle-box pvp-box">
                <h2 class="battle-title">🔁 Échange entre joueurs</h2>
                <p>L'échange en ligne a besoin d'un backend partagé (Supabase) pour synchroniser les deux joueurs.</p>
                <p>Configure <code>SUPABASE_URL</code> et <code>SUPABASE_ANON_KEY</code> dans <code>supabase-config.js</code>, exécute <code>supabase_pvp_schema.sql</code> dans ton projet Supabase, puis recharge la page.</p>
                <button id="tradeCloseButton">Fermer</button>
            </div>
        `;

        document.getElementById("tradeCloseButton").addEventListener("click", closeTradeMenu);
        return;
    }

    tradeWindow.innerHTML = `
        <div class="battle-box pvp-box">

            <h2 class="battle-title">🔁 Échange entre joueurs</h2>

            <p class="pvp-intro">Échange une créature avec un autre joueur pour compléter ton répertoire !</p>

            <button id="tradeCreateButton">🆕 Créer un échange</button>

            <div class="pvp-divider">— ou —</div>

            <div class="pvp-join-row">
                <input id="tradeCodeInput" maxlength="6" placeholder="CODE D'ÉCHANGE">
                <button id="tradeJoinButton">Rejoindre</button>
            </div>

            <p id="tradeMenuError" class="pvp-error"></p>

            <button id="tradeCloseButton" class="pvp-secondary">Fermer</button>

        </div>
    `;

    document
        .getElementById("tradeCreateButton")
        .addEventListener("click", createTradeRoom);

    document
        .getElementById("tradeJoinButton")
        .addEventListener("click", () => {
            joinTradeRoom(document.getElementById("tradeCodeInput").value);
        });

    document
        .getElementById("tradeCodeInput")
        .addEventListener("keydown", (e) => {
            e.stopPropagation();

            if (e.key === "Enter") {
                joinTradeRoom(document.getElementById("tradeCodeInput").value);
            }
        });

    document
        .getElementById("tradeCloseButton")
        .addEventListener("click", closeTradeMenu);
}

function showTradeMenuError(message) {
    const errorEl = document.getElementById("tradeMenuError");

    if (errorEl) errorEl.textContent = message;
}

// Ferme le menu d'échange, mais jamais un échange déjà créé/rejoint (évite
// de le perdre par une fermeture accidentelle au clavier ou au clic).
function closeTradeMenu() {

    if (tradeSession) return;

    tradeOpen = false;

    const tradeWindow = document.getElementById("tradeWindow");

    if (tradeWindow) tradeWindow.remove();
}

async function createTradeRoom() {

    const client = getSupabaseClient();

    if (!client) return;

    const createButton = document.getElementById("tradeCreateButton");

    if (createButton) createButton.disabled = true;

    showTradeMenuError("");

    for (let attempt = 0; attempt < 5; attempt++) {

        const code = generatePvpRoomCode();

        const { data, error } = await client
            .from("trades")
            .insert({
                code,
                status: "waiting",
                player1_pseudo: currentPlayer.pseudo
            })
            .select()
            .single();

        if (!error && data) {
            tradeSession = { code, role: "player1", channel: null, row: data, applied: false };
            subscribeToTrade(code);
            renderTradeWaitingScreen();
            return;
        }

        // Code déjà pris (contrainte unique sur "code") : on retente avec un autre code
        if (error && error.code !== "23505") {
            console.error(error);
            showTradeMenuError("Impossible de créer l'échange. Vérifie ta configuration Supabase.");
            if (createButton) createButton.disabled = false;
            return;
        }
    }

    showTradeMenuError("Impossible de générer un code, réessaie.");

    if (createButton) createButton.disabled = false;
}

async function joinTradeRoom(rawCode) {

    const client = getSupabaseClient();

    if (!client) return;

    const code = rawCode.trim().toUpperCase();

    if (code.length === 0) {
        showTradeMenuError("Entre un code d'échange.");
        return;
    }

    const joinButton = document.getElementById("tradeJoinButton");

    if (joinButton) joinButton.disabled = true;

    showTradeMenuError("");

    const { data: existing, error: fetchError } = await client
        .from("trades")
        .select("*")
        .eq("code", code)
        .maybeSingle();

    if (fetchError || !existing) {
        showTradeMenuError("Échange introuvable. Vérifie le code.");
        if (joinButton) joinButton.disabled = false;
        return;
    }

    if (existing.status !== "waiting") {
        showTradeMenuError("Cet échange a déjà commencé ou est terminé.");
        if (joinButton) joinButton.disabled = false;
        return;
    }

    const { data: updated, error: updateError } = await client
        .from("trades")
        .update({
            player2_pseudo: currentPlayer.pseudo,
            status: "active",
            updated_at: new Date().toISOString()
        })
        .eq("code", code)
        .eq("status", "waiting")
        .select()
        .single();

    if (updateError || !updated) {
        showTradeMenuError("Cet échange vient d'être rejoint par quelqu'un d'autre.");
        if (joinButton) joinButton.disabled = false;
        return;
    }

    tradeSession = { code, role: "player2", channel: null, row: updated, applied: false };
    subscribeToTrade(code);
    openTradeScreen();
    renderTradeScreen(updated);
}

function subscribeToTrade(code) {

    const client = getSupabaseClient();

    if (!client || !tradeSession) return;

    const channel = client
        .channel(`trade-${code}`)
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "trades", filter: `code=eq.${code}` },
            (payload) => {

                if (!tradeSession) return;

                if (payload.eventType === "DELETE") {
                    alert("L'échange a été annulé.");
                    closeTradeWindow();
                    return;
                }

                handleTradeRowUpdate(payload.new);
            }
        )
        .subscribe();

    tradeSession.channel = channel;
}

function renderTradeWaitingScreen() {

    const tradeWindow = document.getElementById("tradeWindow");

    if (!tradeWindow || !tradeSession) return;

    tradeWindow.innerHTML = `
        <div class="battle-box pvp-box">

            <h2 class="battle-title">⏳ En attente d'un partenaire d'échange...</h2>

            <p>Partage ce code avec ton adversaire :</p>

            <div class="pvp-code-display">${tradeSession.code}</div>

            <p class="pvp-hint">L'échange démarrera automatiquement dès qu'il/elle aura rejoint.</p>

            <button id="tradeCancelWaitButton" class="pvp-secondary">Annuler</button>

        </div>
    `;

    document
        .getElementById("tradeCancelWaitButton")
        .addEventListener("click", cancelTrade);
}

function openTradeScreen() {

    const tradeWindow = document.getElementById("tradeWindow");

    if (!tradeWindow) return;

    tradeWindow.innerHTML = `
        <div class="battle-box pvp-box" id="tradeBox">

            <h2 class="battle-title" id="tradeTitle">🔁 Échange</h2>

            <div class="trade-columns">

                <div class="trade-side">
                    <h3>Ta créature</h3>
                    <div id="tradeMineArea"></div>
                </div>

                <div class="trade-side">
                    <h3 id="tradeOppLabel">Créature de l'adversaire</h3>
                    <div id="tradeOppArea"></div>
                </div>

            </div>

            <div class="battle-actions" id="tradeActions"></div>

        </div>
    `;
}

function renderTradeCreatureCard(creature) {

    if (!creature) return "";

    return `
        <div class="trade-creature-card">
            <img src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png" alt="${creature.name}">
            <strong>${creature.name}</strong>
            <span>Nv. ${creature.level}</span>
        </div>
    `;
}

function buildTradePickList() {

    const options = [
        ...currentPlayer.team.map(creature => ({ creature, from: "Équipe" })),
        ...currentPlayer.storage.map(creature => ({ creature, from: "Stockage" }))
    ];

    if (options.length === 0) {
        return `<p class="pvp-hint">Tu n'as aucune créature à échanger.</p>`;
    }

    return `
        <div class="trade-pick-list">
            ${options.map(({ creature, from }) => `
                <button class="trade-pick-button" data-uid="${creature.uid}">
                    ${creature.name} (Nv. ${creature.level}) — ${from}
                </button>
            `).join("")}
        </div>
    `;
}

function renderTradeScreen(row) {

    if (!tradeSession) return;

    const isP1 = tradeSession.role === "player1";

    const myPseudo = isP1 ? row.player1_pseudo : row.player2_pseudo;
    const oppPseudo = isP1 ? row.player2_pseudo : row.player1_pseudo;
    const myCreature = isP1 ? row.player1_creature : row.player2_creature;
    const oppCreature = isP1 ? row.player2_creature : row.player1_creature;
    const myConfirmed = isP1 ? row.player1_confirmed : row.player2_confirmed;
    const oppConfirmed = isP1 ? row.player2_confirmed : row.player1_confirmed;

    document.getElementById("tradeTitle").textContent = `🔁 Échange avec ${oppPseudo}`;
    document.getElementById("tradeOppLabel").textContent = `Créature de ${oppPseudo}`;

    const mineArea = document.getElementById("tradeMineArea");

    if (row.status === "finished") {
        mineArea.innerHTML = renderTradeCreatureCard(myCreature) + `<p class="pvp-hint">Donnée</p>`;
    } else if (myConfirmed) {
        mineArea.innerHTML = renderTradeCreatureCard(myCreature) + `<p class="pvp-hint">Confirmé, en attente de ${oppPseudo}...</p>`;
    } else if (myCreature) {
        mineArea.innerHTML = renderTradeCreatureCard(myCreature) + `<button id="tradeChangeButton" class="pvp-secondary">Changer</button>`;
    } else {
        mineArea.innerHTML = buildTradePickList();
    }

    const oppArea = document.getElementById("tradeOppArea");

    if (row.status === "finished") {
        oppArea.innerHTML = renderTradeCreatureCard(oppCreature) + `<p class="pvp-hint">Reçue 🎉</p>`;
    } else if (oppCreature) {
        oppArea.innerHTML = renderTradeCreatureCard(oppCreature) +
            (oppConfirmed
                ? `<p class="pvp-hint">✅ Confirmé</p>`
                : `<p class="pvp-hint">En attente de confirmation...</p>`);
    } else {
        oppArea.innerHTML = `<p class="pvp-waiting">En attente de sa sélection...</p>`;
    }

    const changeButton = document.getElementById("tradeChangeButton");
    if (changeButton) {
        changeButton.addEventListener("click", () => setTradeOffer(null));
    }

    document.querySelectorAll(".trade-pick-button").forEach(button => {
        const uid = Number(button.dataset.uid);
        button.addEventListener("click", () => setTradeOffer(uid));
    });

    const actionsEl = document.getElementById("tradeActions");

    if (row.status === "finished") {
        actionsEl.innerHTML = `<button id="tradeCloseFinishedButton">Fermer</button>`;

        document
            .getElementById("tradeCloseFinishedButton")
            .addEventListener("click", closeTradeWindow);

        return;
    }

    const canConfirm = myCreature && oppCreature && !myConfirmed;

    actionsEl.innerHTML =
        (canConfirm ? `<button id="tradeConfirmButton">✅ Confirmer l'échange</button>` : "") +
        `<button id="tradeCancelButton" class="pvp-secondary">Annuler l'échange</button>`;

    if (canConfirm) {
        document
            .getElementById("tradeConfirmButton")
            .addEventListener("click", confirmTrade);
    }

    document
        .getElementById("tradeCancelButton")
        .addEventListener("click", cancelTrade);
}

async function setTradeOffer(uid) {

    if (!tradeSession) return;

    const client = getSupabaseClient();

    if (!client) return;

    let snapshot = null;

    if (uid !== null) {
        const location = findCreatureLocation(uid);
        if (!location) return;
        snapshot = { ...location.list[location.index] };
    }

    const field = tradeSession.role === "player1" ? "player1_creature" : "player2_creature";

    await client
        .from("trades")
        .update({ [field]: snapshot, updated_at: new Date().toISOString() })
        .eq("code", tradeSession.code);
}

async function confirmTrade() {

    if (!tradeSession) return;

    const client = getSupabaseClient();

    if (!client) return;

    const field = tradeSession.role === "player1" ? "player1_confirmed" : "player2_confirmed";

    await client
        .from("trades")
        .update({ [field]: true, updated_at: new Date().toISOString() })
        .eq("code", tradeSession.code);
}

async function cancelTrade() {

    if (!tradeSession) return;

    if (!confirm("Annuler cet échange ?")) return;

    const client = getSupabaseClient();

    if (client) {
        await client
            .from("trades")
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("code", tradeSession.code)
            .in("status", ["waiting", "active"]);
    }

    closeTradeWindow();
}

// Retire ma créature donnée (par son ancien identifiant) et ajoute la
// créature reçue (avec un nouvel identifiant local, propre à mon compte).
function applyTradeLocally(myCreatureUid, receivedCreature) {

    const location = findCreatureLocation(myCreatureUid);

    if (location) {
        location.list.splice(location.index, 1);
    }

    const received = { ...receivedCreature, uid: Date.now() + Math.random() };

    if (currentPlayer.team.length < MAX_TEAM_SIZE) {
        currentPlayer.team.push(received);
    } else {
        currentPlayer.storage.push(received);
    }

    markPokedexCaught(received.id);

    if (currentPlayer.activeCreature >= currentPlayer.team.length) {
        currentPlayer.activeCreature = Math.max(0, currentPlayer.team.length - 1);
    }

    updateTeamDisplay();
    saveGame();
}

function handleTradeRowUpdate(row) {

    if (!tradeSession || row.code !== tradeSession.code) return;

    tradeSession.row = row;

    if (row.status === "cancelled") {
        alert("L'échange a été annulé.");
        closeTradeWindow();
        return;
    }

    if (row.status === "waiting") {
        renderTradeWaitingScreen();
        return;
    }

    if (!document.getElementById("tradeBox")) {
        openTradeScreen();
    }

    renderTradeScreen(row);

    const bothConfirmed = row.player1_confirmed && row.player2_confirmed;

    if (bothConfirmed && !tradeSession.applied) {

        tradeSession.applied = true;

        const isP1 = tradeSession.role === "player1";
        const myCreature = isP1 ? row.player1_creature : row.player2_creature;
        const theirCreature = isP1 ? row.player2_creature : row.player1_creature;

        applyTradeLocally(myCreature.uid, theirCreature);
        renderTradeScreen({ ...row, status: "finished" });

        const client = getSupabaseClient();

        if (client) {
            client
                .from("trades")
                .update({ status: "finished", updated_at: new Date().toISOString() })
                .eq("code", row.code)
                .eq("status", "active")
                .then(() => {});
        }
    }
}

function closeTradeWindow() {

    if (tradeSession && tradeSession.channel) {
        const client = getSupabaseClient();
        if (client) client.removeChannel(tradeSession.channel);
    }

    tradeSession = null;
    tradeOpen = false;

    const tradeWindow = document.getElementById("tradeWindow");

    if (tradeWindow) tradeWindow.remove();
}

function stepToward(current, target, speed) {
    if (current < target) return Math.min(current + speed, target);
    if (current > target) return Math.max(current - speed, target);
    return current;
}

function updatePlayer() {

    if (
        encounterOpen ||
        dialogueOpen ||
        battleOpen ||
        pcOpen ||
        pokedexOpen ||
        shopOpen
    ) {
        return;
    }

    // =========================
    // JOUEUR EN DÉPLACEMENT
    // =========================

    if (player.moving) {

        player.pixelX = stepToward(
            player.pixelX,
            player.targetPixelX,
            player.speed
        );

        player.pixelY = stepToward(
            player.pixelY,
            player.targetPixelY,
            player.speed
        );


        // Le déplacement est terminé
        if (
            player.pixelX === player.targetPixelX &&
            player.pixelY === player.targetPixelY
        ) {

            player.moving = false;

            // Vérifier les bâtiments
            checkBuildingInteraction();

            // Sauvegarder la position
            currentPlayer.position = {
                x: player.tileX,
                y: player.tileY
            };

            currentPlayer.currentMap = currentMap;

            saveGame();

            // Vérifier une éventuelle rencontre sauvage
            checkWildEncounter();
        }

        // Ne pas lancer un nouveau déplacement
        // pendant l'animation actuelle
        return;
    }


    // =========================
    // DÉPLACEMENT DU JOUEUR
    // =========================

    if (
        pressedKeys.has("ArrowUp") ||
        pressedKeys.has("z") ||
        pressedKeys.has("w")
    ) {

        tryMove(0, -1, "up");

    } else if (
        pressedKeys.has("ArrowDown") ||
        pressedKeys.has("s")
    ) {

        tryMove(0, 1, "down");

    } else if (
        pressedKeys.has("ArrowLeft") ||
        pressedKeys.has("q") ||
        pressedKeys.has("a")
    ) {

        tryMove(-1, 0, "left");

    } else if (
        pressedKeys.has("ArrowRight") ||
        pressedKeys.has("d")
    ) {

        tryMove(1, 0, "right");
    }
}

function drawCenterPC(x, y) {

    // halo
    drawGlow(
        x + TILE_SIZE / 2,
        y + TILE_SIZE / 2,
        28,
        "#60a5fa",
        0.12
    );

    // ombre
    drawSoftShadow(
        x + TILE_SIZE / 2,
        y + TILE_SIZE + 2,
        14,
        4,
        0.25
    );

    // meuble
    ctx.fillStyle = "#334155";

    ctx.beginPath();

    ctx.roundRect(
        x + 3,
        y + 12,
        26,
        25,
        5
    );

    ctx.fill();

    // écran
    ctx.fillStyle = "#0f172a";

    ctx.beginPath();

    ctx.roundRect(
        x + 2,
        y - 10,
        28,
        23,
        5
    );

    ctx.fill();

    // écran lumineux
    const screenGradient =
        ctx.createLinearGradient(
            x,
            y - 8,
            x,
            y + 10
        );

    screenGradient.addColorStop(
        0,
        "#38bdf8"
    );

    screenGradient.addColorStop(
        1,
        "#2563eb"
    );

    ctx.fillStyle = screenGradient;

    ctx.fillRect(
        x + 6,
        y - 6,
        20,
        15
    );

    // symbole
    ctx.fillStyle = "#ffffff";

    ctx.font = "11px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "✚",
        x + TILE_SIZE / 2,
        y + 5
    );

    // clavier
    ctx.fillStyle = "#cbd5e1";

    ctx.fillRect(
        x + 6,
        y + 17,
        20,
        5
    );

    // pied
    ctx.fillStyle = "#475569";

    ctx.fillRect(
        x + 11,
        y + 36,
        10,
        5
    );

    ctx.textAlign = "left";
}

function drawParticles() {
    ctx.save();

    for (let i = 0; i < 20; i++) {
        const x = (i * 97 + visualTime * 8) % canvas.width;
        const y = (i * 53 + Math.sin(visualTime + i) * 5) % canvas.height;

        ctx.fillStyle = "rgba(255,255,255,0.25)";

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function drawCenterInterior() {

    const W = CENTER_COLS * TILE_SIZE;
    const H = CENTER_ROWS * TILE_SIZE;

    // =========================
    // FOND
    // =========================

    ctx.fillStyle = "#dbeafe";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    // =========================
    // SOL
    // =========================

    for (
        let y = 1;
        y < CENTER_ROWS - 1;
        y++
    ) {

        for (
            let x = 1;
            x < CENTER_COLS - 1;
            x++
        ) {

            const px = x * TILE_SIZE;
            const py = y * TILE_SIZE;

            ctx.fillStyle =
                (x + y) % 2 === 0
                    ? "#f8fafc"
                    : "#e8eef7";

            ctx.fillRect(
                px,
                py,
                TILE_SIZE,
                TILE_SIZE
            );

            // jointure des carreaux
            ctx.strokeStyle = "rgba(148,163,184,0.12)";
            ctx.lineWidth = 1;

            ctx.strokeRect(
                px,
                py,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }

    // =========================
    // MUR SUPÉRIEUR
    // =========================

    const wallGradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            TILE_SIZE
        );

    wallGradient.addColorStop(
        0,
        "#2563eb"
    );

    wallGradient.addColorStop(
        1,
        "#60a5fa"
    );

    ctx.fillStyle = wallGradient;

    ctx.fillRect(
        0,
        0,
        W,
        TILE_SIZE
    );

    // ligne lumineuse
    ctx.fillStyle = "rgba(255,255,255,0.35)";

    ctx.fillRect(
        0,
        TILE_SIZE - 4,
        W,
        4
    );

    // =========================
    // ENSEIGNE
    // =========================

    ctx.save();

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.roundRect(
        W / 2 - 90,
        8,
        180,
        34,
        10
    );

    ctx.fill();

    ctx.strokeStyle = "#bfdbfe";
    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.fillStyle = "#2563eb";

    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "✚ CENTRE FAKEMON",
        W / 2,
        30
    );

    ctx.restore();

    // =========================
    // COMPTOIR
    // =========================

    const counterX = 7 * TILE_SIZE;
    const counterY = 4 * TILE_SIZE;
    const counterW = 6 * TILE_SIZE;
    const counterH = 2 * TILE_SIZE;

    // ombre
    ctx.fillStyle = "rgba(0,0,0,0.15)";

    ctx.fillRect(
        counterX + 4,
        counterY + 5,
        counterW,
        counterH
    );

    // meuble
    const counterGradient =
        ctx.createLinearGradient(
            counterX,
            counterY,
            counterX,
            counterY + counterH
        );

    counterGradient.addColorStop(
        0,
        "#fb7185"
    );

    counterGradient.addColorStop(
        1,
        "#be123c"
    );

    ctx.fillStyle = counterGradient;

    ctx.beginPath();

    ctx.roundRect(
        counterX,
        counterY,
        counterW,
        counterH,
        8
    );

    ctx.fill();

    // surface blanche
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        counterX,
        counterY,
        counterW,
        8
    );

    // croix
    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
        W / 2 - 6,
        counterY + 18,
        12,
        32
    );

    ctx.fillRect(
        W / 2 - 16,
        counterY + 28,
        32,
        12
    );

    // =========================
    // PNJ DU CENTRE (infirmière, vendeur, ...)
    // =========================

    CENTER_NPCS.forEach(npc => {

        drawNPC(
            npc.tileX * TILE_SIZE,
            npc.tileY * TILE_SIZE,
            npc
        );
    });

    // =========================
    // ZONE DE SOIN
    // =========================

    const healX = 10 * TILE_SIZE;
    const healY = 9 * TILE_SIZE;

    // halo animé
    const pulse =
        42 +
        Math.sin(visualTime * 3) * 4;

    drawGlow(
        healX,
        healY,
        pulse,
        "#60a5fa",
        0.12
    );

    // plateforme
    ctx.fillStyle = "#93c5fd";

    ctx.beginPath();

    ctx.arc(
        healX,
        healY,
        44,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    ctx.stroke();

    // centre
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
        healX,
        healY,
        29,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // croix médicale
    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
        healX - 5,
        healY - 19,
        10,
        38
    );

    ctx.fillRect(
        healX - 19,
        healY - 5,
        38,
        10
    );

    // particules
    drawParticles(
        healX,
        healY,
        6
    );

    // =========================
    // PLANTES
    // =========================

    drawCenterPlant(
        3 * TILE_SIZE,
        4 * TILE_SIZE
    );

    drawCenterPlant(
        16 * TILE_SIZE,
        4 * TILE_SIZE
    );

    drawCenterPlant(
        3 * TILE_SIZE,
        10 * TILE_SIZE
    );

    drawCenterPlant(
        16 * TILE_SIZE,
        10 * TILE_SIZE
    );

    // =========================
    // PC
    // =========================

    drawCenterPC(
        15 * TILE_SIZE,
        7 * TILE_SIZE
    );

    // =========================
    // INDICATIONS
    // =========================

    ctx.save();

    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";

    ctx.fillStyle = "#475569";

    ctx.fillText(
        "💗 SOINS",
        healX,
        healY + 62
    );

    ctx.fillText(
        "💻 PC",
        15 * TILE_SIZE + TILE_SIZE / 2,
        7 * TILE_SIZE + 52
    );

    ctx.restore();

    // =========================
    // BORDURES
    // =========================

    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 5;

    ctx.strokeRect(
        2,
        2,
        W - 4,
        H - 4
    );
}

function drawGymInterior() {

    const gym = GYMS.find(g => g.id === currentGymId);
    const accent = gym ? gym.color : "#8b5a2b";

    // Fond
    ctx.fillStyle = "#e9eef5";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Sol en carreaux
    for (let y = 1; y < GYM_ROWS - 1; y++) {

        for (let x = 1; x < GYM_COLS - 1; x++) {

            ctx.fillStyle =
                (x + y) % 2 === 0
                    ? "#f4f7fb"
                    : "#e2e8f0";

            ctx.fillRect(
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }


    // Mur du haut, coloré selon l'arène
    ctx.fillStyle = accent;

    ctx.fillRect(
        0,
        0,
        GYM_COLS * TILE_SIZE,
        TILE_SIZE
    );


    // Podium du maître
    ctx.fillStyle = accent;

    ctx.fillRect(
        7 * TILE_SIZE,
        4 * TILE_SIZE,
        6 * TILE_SIZE,
        TILE_SIZE * 2
    );


    // Podium blanc
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        7 * TILE_SIZE,
        4 * TILE_SIZE,
        6 * TILE_SIZE,
        8
    );


    // Plantes
    drawCenterPlant(
        3 * TILE_SIZE,
        4 * TILE_SIZE
    );

    drawCenterPlant(
        16 * TILE_SIZE,
        4 * TILE_SIZE
    );


    // Emblème de l'arène
    ctx.fillStyle = accent;

    ctx.beginPath();

    ctx.arc(
        10 * TILE_SIZE,
        9 * TILE_SIZE,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
        10 * TILE_SIZE,
        9 * TILE_SIZE,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.font = "24px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        gym ? gym.icon : "🏟️",
        10 * TILE_SIZE,
        9 * TILE_SIZE + 8
    );


    // Maître d'arène
    if (gym) {
        drawNPC(
            GYM_LEADER_X * TILE_SIZE,
            GYM_LEADER_Y * TILE_SIZE,
            buildGymLeaderNpc(gym)
        );
    }


    // Texte
    ctx.fillStyle = "#333";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        gym ? `ARÈNE ${gym.leaderName.toUpperCase()}` : "ARÈNE",
        canvas.width / 2,
        30
    );

    ctx.textAlign = "left";
}

// Dessine un unique spectateur (tête + corps) dans les gradins
function drawArenaSpectator(px, py, seed) {

    const colors = ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#c084fc", "#f472b6"];

    ctx.fillStyle = colors[seed % colors.length];
    ctx.beginPath();
    ctx.arc(px, py + 4, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2d6b3";
    ctx.beginPath();
    ctx.arc(px, py - 6, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Rangée de spectateurs le long d'une ligne horizontale de gradins (laisse
// le couloir d'entrée dégagé au niveau de CHAMPION_X)
function drawArenaCrowdRow(xStartTile, xEndTile, yTile) {

    let seed = 0;

    for (let x = xStartTile; x <= xEndTile; x++) {

        if (x === CHAMPION_X) continue;

        drawArenaSpectator(
            x * TILE_SIZE + TILE_SIZE / 2,
            yTile * TILE_SIZE + TILE_SIZE / 2,
            seed
        );

        seed++;
    }
}

// Colonne de spectateurs le long d'une ligne verticale de gradins
function drawArenaCrowdColumn(yStartTile, yEndTile, xTile) {

    let seed = 0;

    for (let y = yStartTile; y <= yEndTile; y++) {

        drawArenaSpectator(
            xTile * TILE_SIZE + TILE_SIZE / 2,
            y * TILE_SIZE + TILE_SIZE / 2,
            seed
        );

        seed++;
    }
}

// Immense salle de l'arène du Maître Pokémon : même style que les arènes
// classiques (drawGymInterior), mais à l'échelle d'un stade, avec un public
// tout autour du terrain et le Maître Pokémon en plein milieu.
function drawArenaInterior() {

    const W = ARENA_COLS * TILE_SIZE;
    const H = ARENA_ROWS * TILE_SIZE;

    // Fond
    ctx.fillStyle = "#efeaf9";
    ctx.fillRect(0, 0, W, H);

    // Sol en carreaux
    for (let y = 1; y < ARENA_ROWS - 1; y++) {
        for (let x = 1; x < ARENA_COLS - 1; x++) {

            ctx.fillStyle =
                (x + y) % 2 === 0
                    ? "#f4f0fb"
                    : "#e6ddf5";

            ctx.fillRect(
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }

    // Mur du haut
    ctx.fillStyle = CHAMPION.color;
    ctx.fillRect(0, 0, W, TILE_SIZE);

    // Public tout autour du terrain
    drawArenaCrowdRow(1, ARENA_COLS - 2, 1);
    drawArenaCrowdRow(1, ARENA_COLS - 2, ARENA_ROWS - 2);
    drawArenaCrowdColumn(1, ARENA_ROWS - 2, 1);
    drawArenaCrowdColumn(1, ARENA_ROWS - 2, ARENA_COLS - 2);

    // Plantes dans les coins du terrain
    drawCenterPlant(3 * TILE_SIZE, 3 * TILE_SIZE);
    drawCenterPlant((ARENA_COLS - 4) * TILE_SIZE, 3 * TILE_SIZE);
    drawCenterPlant(3 * TILE_SIZE, (ARENA_ROWS - 4) * TILE_SIZE);
    drawCenterPlant((ARENA_COLS - 4) * TILE_SIZE, (ARENA_ROWS - 4) * TILE_SIZE);

    // Estrade centrale du Maître Pokémon
    const platformX = CHAMPION_X * TILE_SIZE;
    const platformY = CHAMPION_Y * TILE_SIZE;
    const platformRadius = 70;

    drawGlow(platformX, platformY, platformRadius + 15, CHAMPION.color, 0.18);

    ctx.fillStyle = CHAMPION.color;
    ctx.beginPath();
    ctx.arc(platformX, platformY, platformRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(platformX, platformY, platformRadius - 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "44px Arial";
    ctx.textAlign = "center";
    ctx.fillText(CHAMPION.icon, platformX, platformY + 16);
    ctx.textAlign = "left";

    // Le Maître Pokémon, en plein milieu de l'arène
    drawNPC(platformX, platformY, buildChampionNpc());

    // Titre
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        `ARÈNE DE ${CHAMPION.leaderName.toUpperCase()}`,
        W / 2,
        30
    );

    ctx.textAlign = "left";
}

function openPC() {
    pcOpen = true;
    pressedKeys.clear();

    const pcWindow = document.createElement("div");

    pcWindow.id = "pcWindow";

    pcWindow.innerHTML = `
        <div class="pc-box pc-team-box">

            <div class="pc-header">
                <h2>🖥️ PC - Gestion de l'équipe</h2>
                <button id="closePCButton">✕</button>
            </div>

            <div class="pc-columns">

                <div class="pc-section">
                    <h3>👥 Mon équipe (${currentPlayer.team.length}/6)</h3>
                    <div id="pcTeamList"></div>
                </div>

                <div class="pc-section">
                    <h3>📦 Stockage (${currentPlayer.storage.length})</h3>
                    <div id="storageList"></div>
                </div>

            </div>

            <p class="pc-hint">
                Clique sur une créature pour l'échanger avec ton équipe.
                <br>
                Appuie sur <strong>E</strong> ou <strong>Échap</strong> pour fermer.
            </p>

        </div>
    `;

    document.body.appendChild(pcWindow);

    document
        .getElementById("closePCButton")
        .addEventListener("click", closePC);

    updatePCDisplay();
}

function updatePCDisplay() {
    updatePCTeamDisplay();
    updateStorageDisplay();
}

function closePC() {

    pcOpen = false;

    const pcWindow = document.getElementById("pcWindow");

    if (pcWindow) {
        pcWindow.remove();
    }
}

function openPokedex() {

    pokedexOpen = true;
    pressedKeys.clear();

    const pokedexWindow = document.createElement("div");

    pokedexWindow.id = "pokedexWindow";

    pokedexWindow.innerHTML = `
        <div class="pc-box">

            <div class="pc-header">
                <h2>📖 Pokédex</h2>
                <button id="closePokedexButton">✕</button>
            </div>

            <p class="pokedex-progress" id="pokedexProgress"></p>

            <div id="pokedexList"></div>

            <p class="pc-hint">
                Appuie sur <strong>E</strong> ou <strong>Échap</strong> pour fermer
            </p>

        </div>
    `;

    document.body.appendChild(pokedexWindow);

    document
        .getElementById("closePokedexButton")
        .addEventListener("click", closePokedex);

    updatePokedexDisplay();
}

function closePokedex() {

    pokedexOpen = false;

    const pokedexWindow = document.getElementById("pokedexWindow");

    if (pokedexWindow) {
        pokedexWindow.remove();
    }
}

function updatePokedexDisplay() {

    const pokedexList = document.getElementById("pokedexList");
    const pokedexProgress = document.getElementById("pokedexProgress");

    if (!pokedexList || !pokedexProgress) return;

    const seenIds = currentPlayer.pokedex.seen;
    const caughtIds = currentPlayer.pokedex.caught;

    pokedexProgress.textContent =
        `${caughtIds.length} capturée(s) / ${seenIds.length} rencontrée(s) sur ${ALL_SPECIES.length} créatures`;

    pokedexList.innerHTML = "";

    if (seenIds.length === 0) {

        pokedexList.innerHTML = `
            <div class="empty-storage">
                📖 Tu n'as encore rencontré aucune créature.
            </div>
        `;

        return;
    }

    seenIds.forEach(id => {

        const species = getSpeciesInfo(id);

        if (!species) return;

        const caught = caughtIds.includes(id);

        const card = document.createElement("div");

        card.className = `pokedex-entry ${caught ? "caught" : "seen-only"}`;

        card.innerHTML = `
            <img
                src="fakemon_creatures/${String(species.id).padStart(3, "0")}.png"
                alt="${species.name}"
            >

            <div class="pokedex-info">
                <strong>${species.name}</strong>
                <span>Type : ${species.type}</span>
                <span class="pokedex-status">
                    ${caught ? "✅ Capturé" : "👁️ Vu seulement"}
                </span>
            </div>
        `;

        pokedexList.appendChild(card);
    });
}

function openShop() {

    shopOpen = true;
    pressedKeys.clear();

    const shopWindow = document.createElement("div");

    shopWindow.id = "shopWindow";

    shopWindow.innerHTML = `
        <div class="pc-box">

            <div class="pc-header">
                <h2>🛒 Boutique</h2>
                <button id="closeShopButton">✕</button>
            </div>

            <p class="shop-money" id="shopMoney"></p>

            <div id="shopList"></div>

            <p class="pc-hint">
                Appuie sur <strong>E</strong> ou <strong>Échap</strong> pour fermer
            </p>

        </div>
    `;

    document.body.appendChild(shopWindow);

    document
        .getElementById("closeShopButton")
        .addEventListener("click", closeShop);

    updateShopDisplay();
}

function closeShop() {

    shopOpen = false;

    const shopWindow = document.getElementById("shopWindow");

    if (shopWindow) {
        shopWindow.remove();
    }
}

// ===================== MENU DE TRICHE (compte "Lucas") =====================
//
// Débloqué uniquement pour le compte dont le pseudo est "Lucas" (voir
// isCheatAccount()). Touche C : donne une quantité d'XP au choix à
// n'importe quelle créature de l'équipe, pour tester rapidement montées de
// niveau et évolutions sans avoir à enchaîner des combats.

function openCheatMenu() {

    if (!isCheatAccount()) return;

    cheatMenuOpen = true;
    pressedKeys.clear();

    const cheatWindow = document.createElement("div");

    cheatWindow.id = "cheatWindow";

    cheatWindow.innerHTML = `
        <div class="pc-box">

            <div class="pc-header">
                <h2>🛠️ Menu de triche</h2>
                <button id="closeCheatButton">✕</button>
            </div>

            <div id="cheatList"></div>

            <p class="pc-hint">
                Appuie sur <strong>C</strong> ou <strong>Échap</strong> pour fermer
            </p>

        </div>
    `;

    document.body.appendChild(cheatWindow);

    document
        .getElementById("closeCheatButton")
        .addEventListener("click", closeCheatMenu);

    updateCheatMenuDisplay();
}

function closeCheatMenu() {

    cheatMenuOpen = false;

    const cheatWindow = document.getElementById("cheatWindow");

    if (cheatWindow) {
        cheatWindow.remove();
    }
}

function updateCheatMenuDisplay() {

    const cheatList = document.getElementById("cheatList");

    if (!cheatList) return;

    cheatList.innerHTML = "";

    if (currentPlayer.team.length === 0) {
        cheatList.innerHTML = `<p class="empty-storage">Aucune créature dans l'équipe.</p>`;
        return;
    }

    currentPlayer.team.forEach((creature, index) => {

        const card = document.createElement("div");

        card.className = "cheat-creature";

        card.innerHTML = `
            <img
                src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png"
                alt="${creature.name}"
            >

            <div class="cheat-creature-info">
                <strong>${creature.name}</strong>
                <span>Nv. ${creature.level} — ${creature.xp}/${xpForNextLevel(creature.level)} XP</span>
            </div>

            <input
                type="number"
                class="cheat-xp-input"
                id="cheatXpInput${index}"
                value="100"
                min="1"
            >

            <button class="cheat-xp-button" id="cheatXpButton${index}">
                Donner XP
            </button>
        `;

        cheatList.appendChild(card);

        document
            .getElementById(`cheatXpButton${index}`)
            .addEventListener("click", () => {
                giveCheatXp(index);
            });
    });
}

function giveCheatXp(index) {

    const creature = currentPlayer.team[index];

    if (!creature) return;

    const input = document.getElementById(`cheatXpInput${index}`);
    const amount = input ? parseInt(input.value, 10) : NaN;

    if (!amount || amount <= 0) return;

    const levelUpMessages = gainXP(creature, amount);

    updateTeamDisplay();
    updateCheatMenuDisplay();
    saveGame();

    if (levelUpMessages.length > 0) {
        alert(levelUpMessages.join("\n"));
    }
}

function buyItem(itemId) {

    const item = getShopItem(itemId);

    if (!item) return;

    if (currentPlayer.money < item.price) {
        alert("Tu n'as pas assez d'argent !");
        return;
    }

    currentPlayer.money -= item.price;

    currentPlayer.inventory.push({
        id: item.id,
        name: item.name
    });

    updateMoneyDisplay();
    saveGame();

    updateShopDisplay();
}

function updateShopDisplay() {

    const shopMoney = document.getElementById("shopMoney");
    const shopList = document.getElementById("shopList");

    if (!shopMoney || !shopList) return;

    shopMoney.textContent = `💰 Argent : ${currentPlayer.money}`;

    shopList.innerHTML = "";

    SHOP_ITEMS.forEach(item => {

        const owned = currentPlayer.inventory.filter(
            invItem => invItem.id === item.id
        ).length;

        const affordable = currentPlayer.money >= item.price;

        const card = document.createElement("div");

        card.className = "shop-item";

        card.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>

            <div class="shop-item-info">
                <strong>${item.name}</strong>
                <span>${item.description}</span>
                <span class="shop-item-owned">Possédé(s) : ${owned}</span>
            </div>

            <button
                class="shop-buy-button"
                data-item-id="${item.id}"
                ${affordable ? "" : "disabled"}
            >
                Acheter (${item.price} 💰)
            </button>
        `;

        shopList.appendChild(card);
    });

    shopList.querySelectorAll(".shop-buy-button").forEach(button => {
        button.addEventListener("click", () => buyItem(button.dataset.itemId));
    });
}

function updateStorageDisplay() {

    const storageList = document.getElementById("storageList");

    if (!storageList) return;

    storageList.innerHTML = "";

    if (currentPlayer.storage.length === 0) {
        storageList.innerHTML = `
            <div class="empty-storage">
                📦 Aucune créature dans le stockage.
            </div>
        `;

        return;
    }

    currentPlayer.storage.forEach((creature, index) => {

        const card = document.createElement("div");

        card.className = "storage-creature";

        const hpPercent = Math.max(
            0,
            Math.min(
                100,
                (creature.hp / creature.maxHp) * 100
            )
        );

        card.innerHTML = `
            <img
                src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png"
                alt="${creature.name}"
            >

            <div class="storage-info">

                <strong>${creature.name}</strong>

                <span>Type : ${creature.type}</span>

                <span>Nv. ${creature.level}</span>

                <div class="storage-hp">
                    <div style="width: ${hpPercent}%"></div>
                </div>

                <small>
                    ${creature.hp}/${creature.maxHp} PV
                </small>

                <button class="pc-exchange-button">
                    ➡️ Ajouter à l'équipe
                </button>

            </div>
        `;

        card
            .querySelector(".pc-exchange-button")
            .addEventListener("click", () => {
                moveStorageToTeam(index);
            });

        storageList.appendChild(card);
    });
}

function updatePCTeamDisplay() {

    const teamList = document.getElementById("pcTeamList");

    if (!teamList) return;

    teamList.innerHTML = "";

    currentPlayer.team.forEach((creature, index) => {

        const card = document.createElement("div");

        card.className = "storage-creature";

        if (index === currentPlayer.activeCreature) {
            card.classList.add("pc-active-creature");
        }

        const hpPercent = Math.max(
            0,
            Math.min(
                100,
                (creature.hp / creature.maxHp) * 100
            )
        );

        card.innerHTML = `
            <img
                src="fakemon_creatures/${String(creature.id).padStart(3, "0")}.png"
                alt="${creature.name}"
            >

            <div class="storage-info">

                <strong>
                    ${creature.name}
                    ${index === currentPlayer.activeCreature ? " ⭐" : ""}
                </strong>

                <span>Type : ${creature.type}</span>

                <span>Nv. ${creature.level}</span>

                <div class="storage-hp">
                    <div style="width: ${hpPercent}%"></div>
                </div>

                <small>
                    ${creature.hp}/${creature.maxHp} PV
                </small>

                <button class="pc-exchange-button">
                    ⬅️ Mettre au stockage
                </button>

            </div>
        `;

        card
            .querySelector(".pc-exchange-button")
            .addEventListener("click", () => {
                moveTeamToStorage(index);
            });

        teamList.appendChild(card);
    });
}

function moveStorageToTeam(storageIndex) {

    const creature = currentPlayer.storage[storageIndex];

    if (!creature) return;

    if (currentPlayer.team.length >= MAX_TEAM_SIZE) {
        alert(
            "Ton équipe est déjà complète ! Retire d'abord une créature de ton équipe."
        );
        return;
    }

    currentPlayer.storage.splice(storageIndex, 1);

    currentPlayer.team.push(creature);

    saveGame();
    updateTeamDisplay();
    updatePCDisplay();
}

function moveTeamToStorage(teamIndex) {

    const creature = currentPlayer.team[teamIndex];

    if (!creature) return;

    if (currentPlayer.team.length <= 1) {
        alert(
            "Tu dois garder au moins une créature dans ton équipe."
        );
        return;
    }

    if (teamIndex === currentPlayer.activeCreature) {
        alert(
            "Cette créature est actuellement ta créature principale. Choisis d'abord une autre créature principale."
        );
        return;
    }

    currentPlayer.team.splice(teamIndex, 1);

    currentPlayer.storage.push(creature);

    // Corriger l'index de la créature principale
    if (teamIndex < currentPlayer.activeCreature) {
        currentPlayer.activeCreature--;
    }

    saveGame();
    updateTeamDisplay();
    updatePCDisplay();
}



// ===================== RENDU =====================

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function drawCenterBuilding(screenX, screenY) {

    const width = TILE_SIZE * 5;
    const height = TILE_SIZE * 4;

    // =========================
    // OMBRE
    // =========================

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(
        screenX + 4,
        screenY + 8,
        width,
        height
    );


    // =========================
    // BÂTIMENT BLANC
    // =========================

    ctx.fillStyle = "#f5f5f5";

    ctx.fillRect(
        screenX,
        screenY + 35,
        width,
        height - 35
    );


    // =========================
    // CONTOUR BLEU
    // =========================

    ctx.strokeStyle = "#b8c9e8";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        screenX + 2,
        screenY + 36,
        width - 4,
        height - 38
    );


    // =========================
    // GRAND TOIT
    // =========================

    ctx.fillStyle = "#4b8ee8";

    ctx.beginPath();

    ctx.moveTo(screenX + 10, screenY + 36);
    ctx.lineTo(screenX + 25, screenY + 5);
    ctx.lineTo(screenX + width - 25, screenY + 5);
    ctx.lineTo(screenX + width - 10, screenY + 36);

    ctx.closePath();
    ctx.fill();


    // Bord du toit
    ctx.strokeStyle = "#dce9ff";
    ctx.lineWidth = 5;

    ctx.stroke();


    // =========================
    // BANDE BLEUE
    // =========================

    ctx.fillStyle = "#3b75c9";

    ctx.fillRect(
        screenX + width / 2 - 42,
        screenY + 28,
        84,
        28
    );


    // =========================
    // SYMBOLE
    // =========================

    ctx.fillStyle = "#ef4444";

    ctx.beginPath();
    ctx.arc(
        screenX + width / 2,
        screenY + 42,
        10,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(
        screenX + width / 2,
        screenY + 42,
        6,
        0,
        Math.PI * 2
    );
    ctx.fill();


    // =========================
    // FENÊTRES
    // =========================

    ctx.fillStyle = "#59b9f2";

    ctx.fillRect(
        screenX + 14,
        screenY + 55,
        28,
        24
    );

    ctx.fillRect(
        screenX + width - 42,
        screenY + 55,
        28,
        24
    );


    // Contour fenêtres
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    ctx.strokeRect(
        screenX + 14,
        screenY + 55,
        28,
        24
    );

    ctx.strokeRect(
        screenX + width - 42,
        screenY + 55,
        28,
        24
    );


    // =========================
    // ENTRÉE
    // =========================

    const doorX = screenX + width / 2 - 22;
    const doorY = screenY + height - 58;

    // Encadrement
    ctx.fillStyle = "#4b8ee8";

    ctx.fillRect(
        doorX - 5,
        doorY - 5,
        54,
        63
    );

    // Porte ouverte
    ctx.fillStyle = "#263b5e";

    ctx.fillRect(
        doorX,
        doorY,
        44,
        58
    );

    // Sol intérieur visible
    ctx.fillStyle = "#d8e6f7";

    ctx.fillRect(
        doorX + 6,
        doorY + 42,
        32,
        16
    );


    // =========================
    // PETITS ARBRES
    // =========================

    drawCenterPlant(
        screenX + 45,
        screenY + height - 18
    );

    drawCenterPlant(
        screenX + width - 45,
        screenY + height - 18
    );
}

function drawTile(x, y, screenX, screenY, grid) {
    const tileKey = (grid || mapGrid)[y][x];
    const tile = TILES[tileKey];

    ctx.fillStyle = tile.color;
    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

    if (tile.deco === "tree") {
        ctx.fillStyle = "#5b3a21";
        ctx.fillRect(screenX + TILE_SIZE / 2 - 3, screenY + TILE_SIZE - 12, 6, 12);
        ctx.fillStyle = "#1f4a1f";
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 - 4, 13, 0, Math.PI * 2);
        ctx.fill();
    } else if (tile.deco === "rock") {
        ctx.fillStyle = "#8a8a8a";
        ctx.beginPath();
        ctx.ellipse(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 + 4, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (tile.deco === "house") {
        ctx.fillStyle = "#c96b3f";
        ctx.fillRect(screenX + 4, screenY + 14, TILE_SIZE - 8, TILE_SIZE - 16);
        ctx.fillStyle = "#7a2e2e";
        ctx.beginPath();
        ctx.moveTo(screenX + 2, screenY + 14);
        ctx.lineTo(screenX + TILE_SIZE / 2, screenY + 2);
        ctx.lineTo(screenX + TILE_SIZE - 2, screenY + 14);
        ctx.closePath();
        ctx.fill();
    } else if (tile.deco === "flower") {
        ctx.fillStyle = "#ff5f8f";
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    } else if (tile.deco === "tallgrass") {

        const wind =
            Math.sin(
                visualTime * 2 +
                x * 0.7 +
                y * 0.4
            ) * 3;

        ctx.strokeStyle = "#1f5c1f";
        ctx.lineWidth = 2;

        const blades = [
            [8, 26],
            [14, 22],
            [20, 27],
            [26, 23]
        ];

        blades.forEach(([bx, by], index) => {

            const localWind =
                wind +
                Math.sin(
                    visualTime * 3 + index
                ) * 1.5;

            ctx.beginPath();

            ctx.moveTo(
                screenX + bx,
                screenY + by
            );

            ctx.quadraticCurveTo(
                screenX + bx + localWind,
                screenY + by - 8,
                screenX + bx + localWind * 1.5,
                screenY + by - 14
            );

            ctx.stroke();
        });
    } else if (tile.deco === "bush") {
        ctx.fillStyle = tile.decoColor || "#1f5c1f";
        const bumps = [
            [TILE_SIZE / 2 - 8, TILE_SIZE / 2 + 2, 8],
            [TILE_SIZE / 2 + 7, TILE_SIZE / 2 + 3, 8],
            [TILE_SIZE / 2, TILE_SIZE / 2 - 5, 9]
        ];
        bumps.forEach(([bx, by, r]) => {
            ctx.beginPath();
            ctx.arc(screenX + bx, screenY + by, r, 0, Math.PI * 2);
            ctx.fill();
        });
    } else if (tile.deco === "thicket") {
        ctx.fillStyle = tile.decoColor || "#1f5c1f";
        const clumps = [
            [TILE_SIZE / 2 - 10, TILE_SIZE / 2 + 4, 9],
            [TILE_SIZE / 2 + 9, TILE_SIZE / 2 + 4, 9],
            [TILE_SIZE / 2, TILE_SIZE / 2 - 2, 10],
            [TILE_SIZE / 2 - 3, TILE_SIZE / 2 + 9, 7],
            [TILE_SIZE / 2 + 5, TILE_SIZE / 2 + 9, 7]
        ];
        clumps.forEach(([bx, by, r]) => {
            ctx.beginPath();
            ctx.arc(screenX + bx, screenY + by, r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 - 2, 10, 0, Math.PI * 2);
        ctx.stroke();
    } else if (tile.deco === "lava") {
        ctx.fillStyle = "#ffcf4d";
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2 - 5, screenY + TILE_SIZE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2 + 7, screenY + TILE_SIZE / 2 - 4, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (tile.deco === "obsidian") {
        ctx.fillStyle = "#111111";
        ctx.beginPath();
        ctx.ellipse(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 + 4, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (tile.deco === "ice") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY + TILE_SIZE / 2);
        ctx.lineTo(screenX + TILE_SIZE - 4, screenY + TILE_SIZE / 2);
        ctx.moveTo(screenX + TILE_SIZE / 2, screenY + 6);
        ctx.lineTo(screenX + TILE_SIZE / 2, screenY + TILE_SIZE - 6);
        ctx.stroke();
    } else if (tile.deco === "pine") {
        ctx.fillStyle = "#5b3a21";
        ctx.fillRect(screenX + TILE_SIZE / 2 - 3, screenY + TILE_SIZE - 12, 6, 12);
        ctx.fillStyle = "#1a4a33";
        ctx.beginPath();
        ctx.moveTo(screenX + TILE_SIZE / 2, screenY + 4);
        ctx.lineTo(screenX + TILE_SIZE / 2 - 12, screenY + TILE_SIZE - 10);
        ctx.lineTo(screenX + TILE_SIZE / 2 + 12, screenY + TILE_SIZE - 10);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + 6, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (tile.deco === "gate") {

        // Piliers du passage scellé
        ctx.fillStyle = "#6b5b95";
        ctx.fillRect(screenX + 3, screenY + 6, 6, TILE_SIZE - 6);
        ctx.fillRect(screenX + TILE_SIZE - 9, screenY + 6, 6, TILE_SIZE - 6);

        // Linteau
        ctx.fillStyle = "#8a6dae";
        ctx.fillRect(screenX + 2, screenY + 2, TILE_SIZE - 4, 6);

        // Éclat mystique au centre
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 + 2, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (tileKey === "WATER") {

        const wave =
            Math.sin(
                visualTime * 2 +
                x * 0.8 +
                y
            ) * 3;

        ctx.strokeStyle =
            "rgba(255,255,255,0.35)";

        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.moveTo(
            screenX + 4,
            screenY + TILE_SIZE / 2 + wave
        );

        ctx.quadraticCurveTo(
            screenX + TILE_SIZE / 2,
            screenY + TILE_SIZE / 2 - wave,
            screenX + TILE_SIZE - 4,
            screenY + TILE_SIZE / 2 + wave
        );

        ctx.stroke();

        // deuxième reflet
        ctx.strokeStyle =
            "rgba(255,255,255,0.18)";

        ctx.beginPath();

        ctx.moveTo(
            screenX + 8,
            screenY + TILE_SIZE / 2 + 8 - wave
        );

        ctx.lineTo(
            screenX + TILE_SIZE - 8,
            screenY + TILE_SIZE / 2 + 8 - wave
        );

        ctx.stroke();
    } else if (tileKey === "GYM_WALL" || tileKey === "GYM_DOOR") {

        const gym = GYMS.find(g =>
            x >= g.doorX - 1 && x <= g.doorX + 1 &&
            y >= g.doorY - 2 && y <= g.doorY
        );

        const accent = gym ? gym.color : "#8b5a2b";

        // Façade colorée selon l'arène
        ctx.fillStyle = accent;
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        if (tileKey === "GYM_DOOR") {

            // Porte
            ctx.fillStyle = "#3b2411";
            ctx.fillRect(
                screenX + 7,
                screenY + 8,
                TILE_SIZE - 14,
                TILE_SIZE - 8
            );

        } else if (gym && x === gym.doorX && y === gym.doorY - 2) {

            // Enseigne au sommet du bâtiment
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(
                screenX + TILE_SIZE / 2,
                screenY + TILE_SIZE / 2,
                11,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                gym.icon,
                screenX + TILE_SIZE / 2,
                screenY + TILE_SIZE / 2 + 5
            );
            ctx.textAlign = "left";

        } else {

            // Ligne de brique légère sur les autres murs
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + TILE_SIZE / 2);
            ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE / 2);
            ctx.stroke();
        }

    } else if (tileKey === "ARENA_WALL" || tileKey === "ARENA_DOOR") {

        if (tileKey === "ARENA_DOOR") {

            // Grande porte de l'arène
            ctx.fillStyle = "#3b2411";
            ctx.fillRect(
                screenX + 7,
                screenY + 8,
                TILE_SIZE - 14,
                TILE_SIZE - 8
            );

        } else if (x === ARENA_DOOR_X && y === ARENA_BUILD_Y) {

            // Emblème du Maître Pokémon, au sommet de l'arène
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(
                screenX + TILE_SIZE / 2,
                screenY + TILE_SIZE / 2,
                12,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                "👑",
                screenX + TILE_SIZE / 2,
                screenY + TILE_SIZE / 2 + 5
            );
            ctx.textAlign = "left";

        } else {

            // Ligne de brique légère sur le reste de la façade
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + TILE_SIZE / 2);
            ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE / 2);
            ctx.stroke();
        }
    }
}

function drawCenterPlant(x, y) {

    // pot
    ctx.fillStyle = "#b86b3c";
    ctx.fillRect(x - 6, y, 12, 10);

    // feuillage
    ctx.fillStyle = "#299447";

    ctx.beginPath();
    ctx.arc(x, y - 7, 10, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer(screenX, screenY) {

    const bob =
        player.moving
            ? Math.sin(visualTime * 18) * 2
            : Math.sin(visualTime * 3) * 0.5;

    const x = screenX;
    const y = screenY + bob;

    // =====================
    // OMBRE
    // =====================

    drawSoftShadow(
        x + TILE_SIZE / 2,
        screenY + TILE_SIZE - 3,
        11,
        4,
        0.3
    );

    // =====================
    // CAPUCHE / CHEVEUX
    // =====================

    ctx.fillStyle = "#172554";

    ctx.beginPath();

    ctx.arc(
        x + TILE_SIZE / 2,
        y + 9,
        9,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    // =====================
    // VISAGE
    // =====================

    ctx.fillStyle = "#f2c48d";

    ctx.beginPath();

    ctx.arc(
        x + TILE_SIZE / 2,
        y + 11,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // =====================
    // YEUX
    // =====================

    ctx.fillStyle = "#111827";

    ctx.fillRect(
        x + 13,
        y + 9,
        2,
        2
    );

    ctx.fillRect(
        x + 17,
        y + 9,
        2,
        2
    );

    // =====================
    // CORPS
    // =====================

    ctx.fillStyle = "#3155d9";

    ctx.beginPath();

    ctx.roundRect(
        x + 8,
        y + 17,
        TILE_SIZE - 16,
        13,
        4
    );

    ctx.fill();

    // =====================
    // BANDE DU VÊTEMENT
    // =====================

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        x + 13,
        y + 18,
        6,
        10
    );

    // =====================
    // JAMBES
    // =====================

    ctx.fillStyle = "#172554";

    ctx.fillRect(
        x + 10,
        y + 29,
        6,
        5
    );

    ctx.fillRect(
        x + 18,
        y + 29,
        6,
        5
    );

    // =====================
    // INDICATEUR DIRECTION
    // =====================

    const cx = x + TILE_SIZE / 2;
    const cy = y + TILE_SIZE / 2;

    ctx.fillStyle = "#facc15";

    ctx.beginPath();

    if (player.direction === "up") {

        ctx.moveTo(cx, cy - 14);
        ctx.lineTo(cx - 4, cy - 8);
        ctx.lineTo(cx + 4, cy - 8);

    } else if (player.direction === "down") {

        ctx.moveTo(cx, cy + 16);
        ctx.lineTo(cx - 4, cy + 10);
        ctx.lineTo(cx + 4, cy + 10);

    } else if (player.direction === "left") {

        ctx.moveTo(cx - 15, cy);
        ctx.lineTo(cx - 9, cy - 4);
        ctx.lineTo(cx - 9, cy + 4);

    } else {

        ctx.moveTo(cx + 15, cy);
        ctx.lineTo(cx + 9, cy - 4);
        ctx.lineTo(cx + 9, cy + 4);
    }

    ctx.closePath();
    ctx.fill();
}

function drawNPC(screenX, screenY, npc) {

    const bob =
        Math.sin(
            visualTime * 2 +
            (npc.tileX || 0) +
            (npc.tileY || 0)
        ) * 0.8;

    const x = screenX;
    const y = screenY + bob;

    // =====================
    // OMBRE
    // =====================

    drawSoftShadow(
        x + TILE_SIZE / 2,
        screenY + TILE_SIZE - 3,
        10,
        4,
        0.28
    );

    // =====================
    // HALO PNJ
    // =====================

    if (npc.type === "heal") {

        drawGlow(
            x + TILE_SIZE / 2,
            y + TILE_SIZE / 2,
            30,
            "#ff8fc7",
            0.18
        );
    }

    // =====================
    // CORPS
    // =====================

    ctx.fillStyle = npc.color;

    ctx.beginPath();

    ctx.roundRect(
        x + 7,
        y + 15,
        TILE_SIZE - 14,
        15,
        4
    );

    ctx.fill();

    // =====================
    // TÊTE
    // =====================

    ctx.fillStyle = "#f2c48d";

    ctx.beginPath();

    ctx.arc(
        x + TILE_SIZE / 2,
        y + 10,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // =====================
    // CHEVEUX
    // =====================

    ctx.fillStyle =
        npc.type === "heal"
            ? "#f8fafc"
            : "#4b2e20";

    ctx.beginPath();

    ctx.arc(
        x + TILE_SIZE / 2,
        y + 7,
        8,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    // =====================
    // YEUX
    // =====================

    ctx.fillStyle = "#111827";

    ctx.fillRect(
        x + 13,
        y + 9,
        2,
        2
    );

    ctx.fillRect(
        x + 17,
        y + 9,
        2,
        2
    );

    // =====================
    // ICÔNE
    // =====================

    ctx.save();

    ctx.font = "16px Arial";
    ctx.textAlign = "center";

    const iconY =
        y - 5 +
        Math.sin(visualTime * 3) * 2;

    ctx.fillText(
        npc.icon,
        x + TILE_SIZE / 2,
        iconY
    );

    ctx.restore();

    // =====================
    // NOM PNJ
    // =====================

    if (npc.type === "heal") {

        ctx.save();

        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";

        ctx.fillStyle = "#ffffff";

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 3;

        ctx.strokeText(
            npc.name,
            x + TILE_SIZE / 2,
            y - 14
        );

        ctx.fillText(
            npc.name,
            x + TILE_SIZE / 2,
            y - 14
        );

        ctx.restore();
    }
}

let lastZone = null;

function updateZoneLabel() {

    if (currentMap === "center") {

        if (lastZone !== "🏥 Centre Fakemon") {
            zoneLabel.textContent = "🏥 Centre Fakemon";
            lastZone = "🏥 Centre Fakemon";
        }

        return;
    }

    if (currentMap === "gym") {

        const gym = GYMS.find(g => g.id === currentGymId);
        const label = gym ? `🏟️ Arène ${gym.leaderName}` : "🏟️ Arène";

        if (lastZone !== label) {
            zoneLabel.textContent = label;
            lastZone = label;
        }

        return;
    }

    if (currentMap === "postgame") {

        if (lastZone !== POSTGAME_ZONE_NAME) {
            zoneLabel.textContent = POSTGAME_ZONE_NAME;
            lastZone = POSTGAME_ZONE_NAME;
        }

        return;
    }

    if (currentMap === "champion_arena") {

        const label = `👑 Arène de ${CHAMPION.leaderName}`;

        if (lastZone !== label) {
            zoneLabel.textContent = label;
            lastZone = label;
        }

        return;
    }


    const zone = getZoneName(
        player.tileX,
        player.tileY
    );

    if (zone !== lastZone) {

        zoneLabel.textContent = zone;

        lastZone = zone;
    }
}

let visualTime = 0;

function updateVisualTime() {
    visualTime += 0.016;
}

function drawSoftShadow(x, y, radiusX, radiusY, alpha = 0.3) {
    ctx.save();

    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;

    ctx.beginPath();
    ctx.ellipse(
        x,
        y,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}

function drawGlow(x, y, radius, color, alpha = 0.2) {
    ctx.save();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function render() {

    updateVisualTime();

    // =========================
    // INTÉRIEUR DU CENTRE
    // =========================

    if (currentMap === "center") {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawCenterInterior();

        drawPlayer(
            player.pixelX,
            player.pixelY
        );

        return;
    }


    // =========================
    // INTÉRIEUR D'UNE ARÈNE
    // =========================

    if (currentMap === "gym") {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawGymInterior();

        drawPlayer(
            player.pixelX,
            player.pixelY
        );

        return;
    }


    // =========================
    // ARÈNE DU MAÎTRE POKÉMON
    // =========================
    //
    // Salle bien plus grande que le canvas : on la dessine comme une pièce
    // classique (mêmes fonctions que les autres intérieurs), mais avec un
    // défilement de caméra centré sur le joueur, exactement comme pour le
    // monde extérieur et le Plateau des Légendes.

    if (currentMap === "champion_arena") {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const arenaCameraX = clamp(
            player.pixelX + TILE_SIZE / 2 - canvas.width / 2,
            0,
            ARENA_COLS * TILE_SIZE - canvas.width
        );

        const arenaCameraY = clamp(
            player.pixelY + TILE_SIZE / 2 - canvas.height / 2,
            0,
            ARENA_ROWS * TILE_SIZE - canvas.height
        );

        ctx.save();
        ctx.translate(-arenaCameraX, -arenaCameraY);

        drawArenaInterior();

        ctx.restore();

        drawPlayer(
            player.pixelX - arenaCameraX,
            player.pixelY - arenaCameraY
        );

        updateZoneLabel();

        return;
    }


    // =========================
    // PLATEAU DES LÉGENDES (POSTGAME)
    // =========================

    if (currentMap === "postgame") {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const gameCameraX = clamp(
            player.pixelX + TILE_SIZE / 2 - canvas.width / 2,
            0,
            POSTGAME_COLS * TILE_SIZE - canvas.width
        );

        const gameCameraY = clamp(
            player.pixelY + TILE_SIZE / 2 - canvas.height / 2,
            0,
            POSTGAME_ROWS * TILE_SIZE - canvas.height
        );

        const pgStartCol = Math.max(0, Math.floor(gameCameraX / TILE_SIZE));
        const pgEndCol = Math.min(
            POSTGAME_COLS - 1,
            Math.ceil((gameCameraX + canvas.width) / TILE_SIZE)
        );

        const pgStartRow = Math.max(0, Math.floor(gameCameraY / TILE_SIZE));
        const pgEndRow = Math.min(
            POSTGAME_ROWS - 1,
            Math.ceil((gameCameraY + canvas.height) / TILE_SIZE)
        );

        for (let y = pgStartRow; y <= pgEndRow; y++) {
            for (let x = pgStartCol; x <= pgEndCol; x++) {
                drawTile(
                    x,
                    y,
                    x * TILE_SIZE - gameCameraX,
                    y * TILE_SIZE - gameCameraY,
                    postgameGrid
                );
            }
        }

        drawPlayer(
            player.pixelX - gameCameraX,
            player.pixelY - gameCameraY
        );

        updateZoneLabel();

        return;
    }


    // =========================
    // MONDE EXTÉRIEUR
    // =========================

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const cameraX = clamp(
        player.pixelX + TILE_SIZE / 2 - canvas.width / 2,
        0,
        MAP_COLS * TILE_SIZE - canvas.width
    );

    const cameraY = clamp(
        player.pixelY + TILE_SIZE / 2 - canvas.height / 2,
        0,
        MAP_ROWS * TILE_SIZE - canvas.height
    );


    const startCol = Math.max(
        0,
        Math.floor(cameraX / TILE_SIZE)
    );

    const endCol = Math.min(
        MAP_COLS - 1,
        Math.ceil(
            (cameraX + canvas.width) / TILE_SIZE
        )
    );


    const startRow = Math.max(
        0,
        Math.floor(cameraY / TILE_SIZE)
    );

    const endRow = Math.min(
        MAP_ROWS - 1,
        Math.ceil(
            (cameraY + canvas.height) / TILE_SIZE
        )
    );


    // Dessiner la carte
    for (let y = startRow; y <= endRow; y++) {

        for (let x = startCol; x <= endCol; x++) {

            drawTile(
                x,
                y,
                x * TILE_SIZE - cameraX,
                y * TILE_SIZE - cameraY
            );
        }
    }


    // Grand Centre Fakemon
    drawCenterBuilding(
        5 * TILE_SIZE - cameraX,
        1 * TILE_SIZE - cameraY
    );


    // PNJ
    NPCS.forEach(npc => {
        drawNPC(
            npc.tileX * TILE_SIZE - cameraX,
            npc.tileY * TILE_SIZE - cameraY,
            npc
        );
    });


    // Joueur
    drawPlayer(
        player.pixelX - cameraX,
        player.pixelY - cameraY
    );


    updateZoneLabel();
}

function gameLoop() {
    updatePlayer();
    render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// Démarrage : si Supabase n'est pas configuré, comportement historique
// (pseudo libre, sauvegarde locale globale). Sinon, le jeu passe par un
// compte pseudo + mot de passe avant de charger/démarrer la partie.
async function initGame() {

    let client;

    try {
        client = getSupabaseClient();
    } catch (error) {
        // Config Supabase invalide (ex. SUPABASE_URL incomplète) : on affiche
        // quand même le formulaire de compte, avec l'erreur, plutôt que de
        // rester bloqué sur l'écran sans aucune explication.
        console.error("Configuration Supabase invalide :", error);
        startButton.classList.add("hidden");
        passwordInput.classList.remove("hidden");
        authButtons.classList.remove("hidden");
        showAuthError("Configuration Supabase invalide (vérifie supabase-config.js) : " + error.message);
        return;
    }

    if (!client) {
        loadGame();
        return;
    }

    startButton.classList.add("hidden");
    passwordInput.classList.remove("hidden");
    authButtons.classList.remove("hidden");

    try {
        const { data } = await client.auth.getSession();

        if (data.session && data.session.user) {
            onAuthSuccess(data.session.user);
        }
    } catch (error) {
        console.error("Impossible de récupérer la session Supabase :", error);
        showAuthError("Impossible de contacter Supabase. Vérifie ta connexion et supabase-config.js.");
    }
}

initGame();