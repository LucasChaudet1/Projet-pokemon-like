const startScreen = document.getElementById("startScreen");
const creatureScreen = document.getElementById("creatureScreen");
const gameScreen = document.getElementById("gameScreen");

const pseudoInput = document.getElementById("pseudoInput");
const startButton = document.getElementById("startButton");

const playerName = document.getElementById("playerName");
const teamDisplay = document.getElementById("teamDisplay");
const creatureSelection = document.getElementById("creatureSelection");
const pokedexButton = document.getElementById("pokedexButton");
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

// Attaques apprises par une créature selon son type
const MOVE_POOL = {
    Feu: [
        { name: "Griffe", power: 1 },
        { name: "Lance-Flammes", power: 1.35 }
    ],
    Plante: [
        { name: "Charge", power: 1 },
        { name: "Tranch'Herbe", power: 1.35 }
    ],
    Eau: [
        { name: "Charge", power: 1 },
        { name: "Pistolet à O", power: 1.35 }
    ],
    Normal: [
        { name: "Charge", power: 1 },
        { name: "Griffe", power: 1.15 }
    ]
};

function getMovesForType(type) {
    const moves = MOVE_POOL[type] || MOVE_POOL.Normal;
    return moves.map(move => ({ ...move }));
}

function pickRandomMove(creature) {
    if (!creature.attacks || creature.attacks.length === 0) return null;
    return creature.attacks[Math.floor(Math.random() * creature.attacks.length)];
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

    return {
        uid: Date.now() + Math.random(),

        id,
        name,
        type,

        level,
        xp: 0,

        maxHp,
        hp: maxHp,

        attack,
        defense,
        speed,

        fainted: false,

        attacks: getMovesForType(type)
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
                PV : ${creature.hp}/${creature.maxHp}
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

    const actions = menu.querySelector(".creature-menu-actions");

    if (!actions) return;


    // Aucun objet de soin
    if (healingItems.length === 0) {

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

        <button id="usePotionButton">
            🧪 Potion (${healingItems.length})
        </button>

        <button id="backCreatureMenu">
            ◀ Retour
        </button>
    `;


    document
        .getElementById("usePotionButton")
        .addEventListener("click", () => {

            usePotion(index);

        });


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

function saveGame() {
    localStorage.setItem("playerData", JSON.stringify(currentPlayer));
    console.log("Partie sauvegardée:", currentPlayer);
}

function loadGame() {

    const saved = localStorage.getItem("playerData");

    if (!saved) return;

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

    [...currentPlayer.team, ...currentPlayer.storage].forEach(creature => {
        if (!creature.attacks || creature.attacks.length === 0) {
            creature.attacks = getMovesForType(creature.type);
        }
    });


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
        currentPlayer.currentMap === "world"
    ) {
        currentMap = currentPlayer.currentMap;
    } else {
        currentMap = "world";
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

function enterCenter() {
    currentMap = "center";
    currentPlayer.currentMap = "center";

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

    currentMap = "world";

    currentPlayer.currentMap = "world";

    // Position devant le Centre
    setPlayerTile(7, 5);

    zoneLabel.textContent = "🏘️ Bourg Palette";

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

    // Interaction avec un PNJ, un maître d'arène ou le PC
    if (key === "e") {
        if (!checkNPCInteraction() && !checkGymLeaderInteraction()) {
            checkPCInteraction();
        }
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


    // Entrée dans le Centre
    if (
        currentMap === "world" &&
        player.tileX === 7 &&
        player.tileY === 4
    ) {
        enterCenter();
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
    }
}

function checkWildEncounter() {

    if (currentMap !== "world") return;
    if (encounterOpen) return;

    const tile = TILES[mapGrid[player.tileY][player.tileX]];

    if (!tile.encounterZone) return;

    if (Math.random() < WILD_ENCOUNTER_CHANCE) {
        startEncounter();
    }
}

function pickRandomWildCreature() {

    const zoneName = getZoneName(player.tileX, player.tileY);
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

function computeDamage(attacker, defender, move) {
    const power = move ? move.power : 1;
    const variance = 0.85 + Math.random() * 0.3;
    const raw = (attacker.attack * power - defender.defense * 0.5) * variance;
    return Math.max(1, Math.round(raw));
}

function addBattleLog(text) {
    battleLog.push(text);
}

function applyAttack(attacker, defender, move) {
    const damage = computeDamage(attacker, defender, move);
    defender.hp = Math.max(0, defender.hp - damage);

    const moveName = move ? move.name : "une attaque";

    addBattleLog(`${attacker.name} utilise ${moveName} et inflige ${damage} dégâts à ${defender.name} !`);
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
                    <div class="battle-hp-bar"><div id="battlePlayerHpFill" class="battle-hp-fill"></div></div>
                    <small id="battlePlayerHpText"></small>
                </div>

                <div class="battle-vs">VS</div>

                <div class="battle-side">
                    <img id="battleWildSprite" class="battle-sprite" src="" alt="">
                    <strong id="battleWildName"></strong>
                    <span id="battleWildLevel"></span>
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

    const fleeBtn = document.getElementById("battleFleeButton");
    if (fleeBtn) {
        fleeBtn.addEventListener("click", playerFlee);
    }
}

function openMoveMenu() {

    if (!battleOpen || battleEnded) return;

    const actionsEl = document.getElementById("battleActions");

    if (!actionsEl) return;

    const moves = battlePlayerCreature.attacks;

    actionsEl.innerHTML =
        moves.map((move, index) => `
            <button class="battle-move-button" data-move-index="${index}">
                ⚔️ ${move.name}
            </button>
        `).join("") +
        `<button id="battleMoveBackButton">◀ Retour</button>`;

    actionsEl.querySelectorAll(".battle-move-button").forEach(button => {

        const move = moves[Number(button.dataset.moveIndex)];

        button.addEventListener("click", () => playerAttack(move));
    });

    document
        .getElementById("battleMoveBackButton")
        .addEventListener("click", renderBattleActions);
}

function renderBattle(final = false) {

    const player = battlePlayerCreature;
    const wild = battleWildCreature;

    document.getElementById("battlePlayerSprite").src =
        `fakemon_creatures/${String(player.id).padStart(3, "0")}.png`;
    document.getElementById("battlePlayerName").textContent = player.name;
    document.getElementById("battlePlayerLevel").textContent = `Nv. ${player.level}`;

    const playerHpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    document.getElementById("battlePlayerHpFill").style.width = `${playerHpPercent}%`;
    document.getElementById("battlePlayerHpText").textContent = `${player.hp}/${player.maxHp} PV`;

    document.getElementById("battleWildSprite").src =
        `fakemon_creatures/${String(wild.id).padStart(3, "0")}.png`;
    document.getElementById("battleWildName").textContent = wild.name;
    document.getElementById("battleWildLevel").textContent = `Nv. ${wild.level}`;

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

function wildAttack() {

    if (!battleOpen || battleEnded) return;

    const wild = battleWildCreature;
    const player = battlePlayerCreature;

    applyAttack(wild, player, pickRandomMove(wild));

    if (player.hp <= 0) {
        handlePlayerFaint();
        return;
    }

    renderBattle();
}

function playerAttack(move) {

    if (!battleOpen || battleEnded) return;

    const player = battlePlayerCreature;
    const wild = battleWildCreature;
    const wildMove = pickRandomMove(wild);

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

        applyAttack(wild, player, wildMove);

        if (player.hp <= 0) {
            handlePlayerFaint();
            return;
        }

    } else {

        applyAttack(wild, player, wildMove);

        if (player.hp <= 0) {
            handlePlayerFaint();
            return;
        }

        applyAttack(player, wild, move);

        if (wild.hp <= 0) {
            finishBattleWin();
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

    applyAttack(wild, battlePlayerCreature, pickRandomMove(wild));

    saveGame();

    if (battlePlayerCreature.hp <= 0) {
        handlePlayerFaint();
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

function drawCenterInterior() {

    // Fond
    ctx.fillStyle = "#e9eef5";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Sol en carreaux
    for (let y = 1; y < CENTER_ROWS - 1; y++) {

        for (let x = 1; x < CENTER_COLS - 1; x++) {

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


    // Mur du haut
    ctx.fillStyle = "#4b8ee8";

    ctx.fillRect(
        0,
        0,
        CENTER_COLS * TILE_SIZE,
        TILE_SIZE
    );


    // Comptoir
    ctx.fillStyle = "#e85b4f";

    ctx.fillRect(
        7 * TILE_SIZE,
        4 * TILE_SIZE,
        6 * TILE_SIZE,
        TILE_SIZE * 2
    );


    // Comptoir blanc
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        7 * TILE_SIZE,
        4 * TILE_SIZE,
        6 * TILE_SIZE,
        8
    );


    // Infirmière
    const nurse = CENTER_NPCS[0];

    drawNPC(
        nurse.tileX * TILE_SIZE,
        nurse.tileY * TILE_SIZE,
        nurse
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


    // Zone de soin
    ctx.fillStyle = "#9dbcf0";

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


    // Texte
    ctx.fillStyle = "#333";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "CENTRE FAKEMON",
        canvas.width / 2,
        30
    );

    ctx.textAlign = "left";

    // =========================
    // PC DE STOCKAGE
    // =========================

    const pcX = 15 * TILE_SIZE;
    const pcY = 7 * TILE_SIZE;

    // meuble
    ctx.fillStyle = "#374151";
    ctx.fillRect(
        pcX + 2,
        pcY + 10,
        28,
        22
    );

    // écran
    ctx.fillStyle = "#111827";
    ctx.fillRect(
        pcX + 3,
        pcY - 12,
        26,
        22
    );

    // écran bleu
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(
        pcX + 6,
        pcY - 9,
        20,
        16
    );

    // clavier
    ctx.fillStyle = "#d1d5db";
    ctx.fillRect(
        pcX + 6,
        pcY + 13,
        20,
        5
    );

    // pied
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(
        pcX + 11,
        pcY + 32,
        10,
        5
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

function drawTile(x, y, screenX, screenY) {
    const tileKey = mapGrid[y][x];
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
        ctx.strokeStyle = "#1f5c1f";
        ctx.lineWidth = 2;
        const blades = [
            [8, 26], [14, 22], [20, 27], [26, 23]
        ];
        blades.forEach(([bx, by]) => {
            ctx.beginPath();
            ctx.moveTo(screenX + bx, screenY + by);
            ctx.lineTo(screenX + bx, screenY + by - 14);
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
    } else if (tileKey === "WATER") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY + TILE_SIZE / 2);
        ctx.lineTo(screenX + TILE_SIZE - 4, screenY + TILE_SIZE / 2);
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
    // Ombre
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(screenX + TILE_SIZE / 2, screenY + TILE_SIZE - 4, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corps
    ctx.fillStyle = "#3355dd";
    ctx.fillRect(screenX + 8, screenY + 14, TILE_SIZE - 16, 14);

    // Tête
    ctx.fillStyle = "#f2c48d";
    ctx.beginPath();
    ctx.arc(screenX + TILE_SIZE / 2, screenY + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Indicateur de direction
    const cx = screenX + TILE_SIZE / 2;
    const cy = screenY + TILE_SIZE / 2;
    ctx.fillStyle = "#222";
    ctx.beginPath();
    if (player.direction === "up") {
        ctx.moveTo(cx - 4, cy - 8); ctx.lineTo(cx + 4, cy - 8); ctx.lineTo(cx, cy - 14);
    } else if (player.direction === "down") {
        ctx.moveTo(cx - 4, cy + 12); ctx.lineTo(cx + 4, cy + 12); ctx.lineTo(cx, cy + 18);
    } else if (player.direction === "left") {
        ctx.moveTo(cx - 10, cy - 2); ctx.lineTo(cx - 10, cy + 6); ctx.lineTo(cx - 16, cy + 2);
    } else if (player.direction === "right") {
        ctx.moveTo(cx + 10, cy - 2); ctx.lineTo(cx + 10, cy + 6); ctx.lineTo(cx + 16, cy + 2);
    }
    ctx.closePath();
    ctx.fill();
}

function drawNPC(screenX, screenY, npc) {
    // Ombre
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(screenX + TILE_SIZE / 2, screenY + TILE_SIZE - 4, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corps
    ctx.fillStyle = npc.color;
    ctx.fillRect(screenX + 8, screenY + 14, TILE_SIZE - 16, 14);

    // Tête
    ctx.fillStyle = "#f2c48d";
    ctx.beginPath();
    ctx.arc(screenX + TILE_SIZE / 2, screenY + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Icône d'interaction
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(npc.icon, screenX + TILE_SIZE / 2, screenY - 4);
    ctx.textAlign = "left";
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


    const zone = getZoneName(
        player.tileX,
        player.tileY
    );

    if (zone !== lastZone) {

        zoneLabel.textContent = zone;

        lastZone = zone;
    }
}

function render() {

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

// Charger la partie sauvegardée au démarrage
loadGame();