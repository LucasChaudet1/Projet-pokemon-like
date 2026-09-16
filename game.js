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

let currentPlayer = {
    pseudo: "",
    team: [],
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

        teamDisplay.appendChild(creatureDiv);
    });
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
    // Ne pas capter les touches quand l'écran de jeu n'est pas affiché
    // (permet notamment d'utiliser les flèches dans le champ pseudo)
    if (gameScreen.classList.contains("hidden")) return;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
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

        player.tileX = newX;
        player.tileY = newY;

        player.targetPixelX = newX * TILE_SIZE;
        player.targetPixelY = newY * TILE_SIZE;

        player.moving = true;

        return;
    }


    // =========================
    // INTÉRIEUR DU CENTRE
    // =========================

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

function stepToward(current, target, speed) {
    if (current < target) return Math.min(current + speed, target);
    if (current > target) return Math.max(current - speed, target);
    return current;
}

function updatePlayer() {

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