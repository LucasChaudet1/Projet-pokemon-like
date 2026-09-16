const startScreen = document.getElementById("startScreen");
const creatureScreen = document.getElementById("creatureScreen");
const gameScreen = document.getElementById("gameScreen");

const pseudoInput = document.getElementById("pseudoInput");
const startButton = document.getElementById("startButton");

const playerName = document.getElementById("playerName");
const teamDisplay = document.getElementById("teamDisplay");
const creatureSelection = document.getElementById("creatureSelection");

const zoneLabel = document.getElementById("zoneLabel");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Les 3 créatures starters
const STARTER_CREATURES = [
    { id: 1, name: "Flamant", type: "Feu" },
    { id: 4, name: "Salasaur", type: "Plante" },
    { id: 7, name: "Aquali", type: "Eau" }
];

// Créatures sauvages pouvant apparaître dans les hautes herbes
const WILD_CREATURES = [
    { id: 10, name: "Rosapin", type: "Plante" },
    { id: 11, name: "Rosélia", type: "Plante" },
    { id: 16, name: "Lunégriff", type: "Normal" },
    { id: 19, name: "Champignon", type: "Plante" },
    { id: 20, name: "Aquapin", type: "Eau" },
    { id: 21, name: "Électrisson", type: "Normal" },
    { id: 24, name: "Serpentis", type: "Normal" },
    { id: 28, name: "Crabraz", type: "Eau" }
];

const WILD_ENCOUNTER_CHANCE = 0.12;
const WILD_MIN_LEVEL = 2;
const WILD_MAX_LEVEL = 6;

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
        type: "item",
        icon: "🎁",
        lines: [
            "Tiens, prends ceci pour ton voyage !"
        ],
        itemId: "potion",
        itemName: "Potion"
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
        ]
    }
];

let currentPlayer = {
    pseudo: "",
    team: [],
    storage: [],
    inventory: [],
    npcGifts: [],
    activeCreature: 0,
    position: null
};

const MAX_TEAM_SIZE = 6;

startButton.addEventListener("click", startGame);

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

    return {
        uid: Date.now() + Math.random(),

        id,
        name,
        type,

        level,
        xp: 0,

        maxHp: base.maxHp,
        hp: base.maxHp,

        attack: base.attack,
        defense: base.defense,
        speed: base.speed,

        fainted: false,

        attacks: []
    };
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

    playerName.textContent = "👤 " + currentPlayer.pseudo;

    updateTeamDisplay();

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
const MAP_COLS = 30;
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

    // Centre Fakemon
    CENTER_WALL: {
        color: "#ffffff",
        walkable: false
    },

    CENTER_DOOR: {
        color: "#ffffff",
        walkable: true
    }
};

function getBaseTile(x, y) {
    const isTop = y < 12;
    const isLeft = x < 15;
    if (isTop && isLeft) return "GRASS";
    if (isTop && !isLeft) return "GRASS_DARK";
    if (!isTop && isLeft) return "SAND";
    return "DESERT";
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
        for (let x = 16; x < MAP_COLS; x++) {
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
        for (let x = 16; x < MAP_COLS; x++) {
            if ((x * 11 + y * 3) % 9 === 0) {
                grid[y][x] = "ROCK";
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

    // Chemin qui relie les 4 zones
    for (let x = 0; x < MAP_COLS; x++) {
        grid[11][x] = "PATH";
        grid[12][x] = "PATH";
    }
    for (let y = 0; y < MAP_ROWS; y++) {
        grid[y][14] = "PATH";
        grid[y][15] = "PATH";
    }

    placeVillage(grid);
    placeForest(grid);
    placeTallGrass(grid);
    placeLake(grid);
    placeDesert(grid);

    return grid;
}

function getZoneName(x, y) {
    const isTop = y < 12;
    const isLeft = x < 15;
    if (isTop && isLeft) return "🏘️ Village de Départ";
    if (isTop && !isLeft) return "🌲 Forêt Sombre";
    if (!isTop && isLeft) return "🌊 Lac Azur";
    return "🏜️ Route Sablonneuse";
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

let encounterOpen = false;
let wildEncounterCreature = null;

let dialogueOpen = false;
let currentDialogueNPC = null;
let currentDialogueLineIndex = 0;

let battleOpen = false;
let battlePlayerCreature = null;
let battleWildCreature = null;
let battleEnded = false;

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

    // Soigne gratuitement toute l'équipe
    currentPlayer.team.forEach(creature => {
        creature.hp = creature.maxHp;
        creature.fainted = false;
    });

    updateTeamDisplay();

    saveGame();
}

function exitCenter() {

    currentMap = "world";

    currentPlayer.currentMap = "world";

    // Position devant le Centre
    setPlayerTile(7, 5);

    zoneLabel.textContent = "🏘️ Village de Départ";

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

    // Interaction avec un PNJ ou le PC
    if (key === "e") {
        if (!checkNPCInteraction()) {
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

    if (currentMap !== "world") return false;
    if (player.moving) return false;

    const facing = getFacingTile();
    const npc = findNPCAt(facing.x, facing.y);

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

        if (textEl) {
            textEl.textContent =
                "Les combats de dresseurs arriveront dans une prochaine mise à jour !";
        }

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
    const species =
        WILD_CREATURES[
            Math.floor(Math.random() * WILD_CREATURES.length)
        ];

    const level =
        WILD_MIN_LEVEL +
        Math.floor(
            Math.random() * (WILD_MAX_LEVEL - WILD_MIN_LEVEL + 1)
        );

    return createCreature(species.id, species.name, species.type, level);
}

function startEncounter() {

    encounterOpen = true;
    wildEncounterCreature = pickRandomWildCreature();

    const creature = wildEncounterCreature;

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
}

function gainXP(creature, amount) {

    creature.xp += amount;

    const messages = [];

    while (creature.xp >= xpForNextLevel(creature.level)) {
        creature.xp -= xpForNextLevel(creature.level);
        levelUpCreature(creature);
        messages.push(`${creature.name} monte au niveau ${creature.level} !`);
    }

    return messages;
}

function computeCaptureChance(wild) {

    const hpFactor = 1 - wild.hp / wild.maxHp;
    const levelFactor = Math.max(0, 1 - wild.level / 20);

    const chance = 0.3 + hpFactor * 0.5 + levelFactor * 0.2;

    return Math.min(0.95, Math.max(0.05, chance));
}

function computeDamage(attacker, defender) {
    const variance = 0.85 + Math.random() * 0.3;
    const raw = (attacker.attack - defender.defense * 0.5) * variance;
    return Math.max(1, Math.round(raw));
}

function addBattleLog(text) {
    battleLog.push(text);
}

function applyAttack(attacker, defender) {
    const damage = computeDamage(attacker, defender);
    defender.hp = Math.max(0, defender.hp - damage);
    addBattleLog(`${attacker.name} inflige ${damage} dégâts à ${defender.name} !`);
}

function startBattle(wild) {

    battleOpen = true;
    battleEnded = false;
    battlePlayerCreature = currentPlayer.team[currentPlayer.activeCreature];
    battleWildCreature = wild;
    battleLog = [];

    addBattleLog(`Un ${wild.name} sauvage veut se battre !`);

    const battleWindow = document.createElement("div");

    battleWindow.id = "battleWindow";

    battleWindow.innerHTML = `
        <div class="battle-box">

            <h2 class="battle-title">⚔️ Combat sauvage</h2>

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

            <div class="battle-actions" id="battleActions">
                <button id="battleAttackButton">⚔️ Attaquer</button>
                <button id="battleCaptureButton">🔴 Capturer</button>
                <button id="battleHealButton">💊 Soigner</button>
                <button id="battleFleeButton">🏃 Fuir</button>
            </div>

        </div>
    `;

    document.body.appendChild(battleWindow);

    document
        .getElementById("battleAttackButton")
        .addEventListener("click", playerAttack);

    document
        .getElementById("battleCaptureButton")
        .addEventListener("click", playerCapture);

    document
        .getElementById("battleHealButton")
        .addEventListener("click", usePotionInBattle);

    document
        .getElementById("battleFleeButton")
        .addEventListener("click", playerFlee);

    renderBattle();
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

    applyAttack(wild, player);

    if (player.hp <= 0) {
        finishBattleLose();
        return;
    }

    renderBattle();
}

function playerAttack() {

    if (!battleOpen || battleEnded) return;

    const player = battlePlayerCreature;
    const wild = battleWildCreature;

    const playerFirst =
        player.speed === wild.speed
            ? Math.random() < 0.5
            : player.speed > wild.speed;

    if (playerFirst) {

        applyAttack(player, wild);

        if (wild.hp <= 0) {
            finishBattleWin();
            return;
        }

        applyAttack(wild, player);

        if (player.hp <= 0) {
            finishBattleLose();
            return;
        }

    } else {

        applyAttack(wild, player);

        if (player.hp <= 0) {
            finishBattleLose();
            return;
        }

        applyAttack(player, wild);

        if (wild.hp <= 0) {
            finishBattleWin();
            return;
        }
    }

    renderBattle();
}

function playerCapture() {

    if (!battleOpen || battleEnded) return;

    const wild = battleWildCreature;
    const chance = computeCaptureChance(wild);
    const success = Math.random() < chance;

    if (success) {
        addBattleLog(`Tu as capturé ${wild.name} !`);
        finishBattleCapture();
        return;
    }

    addBattleLog(`La capture a échoué... ${wild.name} riposte !`);

    applyAttack(wild, battlePlayerCreature);

    if (battlePlayerCreature.hp <= 0) {
        finishBattleLose();
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

    battleEnded = true;

    const xpGain = battleWildCreature.level * 10;
    const levelUpMessages = gainXP(battlePlayerCreature, xpGain);

    addBattleLog(`${battleWildCreature.name} est K.O. !`);
    addBattleLog(`${battlePlayerCreature.name} gagne ${xpGain} points d'expérience !`);

    levelUpMessages.forEach(addBattleLog);

    updateTeamDisplay();
    saveGame();

    renderBattle(true);
}

function finishBattleLose() {

    battleEnded = true;
    battlePlayerCreature.fainted = true;

    addBattleLog(`${battlePlayerCreature.name} est K.O. !`);
    addBattleLog("Rends-toi au Centre Fakemon pour soigner ton équipe.");

    updateTeamDisplay();
    saveGame();

    renderBattle(true);
}

function finishBattleCapture() {

    battleEnded = true;

    const captured = battleWildCreature;

    if (currentPlayer.team.length < MAX_TEAM_SIZE) {
        currentPlayer.team.push(captured);
        updateTeamDisplay();
    } else {
        currentPlayer.storage.push(captured);
        addBattleLog(`${captured.name} a été envoyé(e) au stockage (équipe pleine).`);
    }

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
        pcOpen
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
    ctx.fillStyle = "#ffb6c1";

    ctx.beginPath();

    ctx.arc(
        10 * TILE_SIZE,
        3 * TILE_SIZE,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();


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

function openPC() {

    pcOpen = true;
    pressedKeys.clear();

    const pcWindow = document.createElement("div");

    pcWindow.id = "pcWindow";

    pcWindow.innerHTML = `
        <div class="pc-box">

            <div class="pc-header">
                <h2>🖥️ PC</h2>
                <button id="closePCButton">✕</button>
            </div>

            <h3>📦 Créatures stockées</h3>

            <div id="storageList"></div>

            <p class="pc-hint">
                Appuie sur <strong>E</strong> ou <strong>Échap</strong> pour fermer
            </p>

        </div>
    `;

    document.body.appendChild(pcWindow);

    document
        .getElementById("closePCButton")
        .addEventListener("click", closePC);

    updateStorageDisplay();
}

function closePC() {

    pcOpen = false;

    const pcWindow = document.getElementById("pcWindow");

    if (pcWindow) {
        pcWindow.remove();
    }
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

            </div>
        `;

        storageList.appendChild(card);
    });
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
    } else if (tileKey === "WATER") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY + TILE_SIZE / 2);
        ctx.lineTo(screenX + TILE_SIZE - 4, screenY + TILE_SIZE / 2);
        ctx.stroke();
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