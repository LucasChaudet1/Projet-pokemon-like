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

    if (typeof currentPlayer.activeCreature !== "number") {
        currentPlayer.activeCreature = 0;
    }

    if (
        currentPlayer.activeCreature < 0 ||
        currentPlayer.activeCreature >= currentPlayer.team.length
    ) {
        currentPlayer.activeCreature = 0;
    }

    // Sécurité pour les anciennes sauvegardes
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

    // Afficher le pseudo
    playerName.textContent = "👤 " + currentPlayer.pseudo;

    // Afficher l'équipe
    updateTeamDisplay();

    // Afficher directement le jeu
    startScreen.classList.add("hidden");
    creatureScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    // Restaurer la position
    if (currentPlayer.position) {
        setPlayerTile(
            currentPlayer.position.x,
            currentPlayer.position.y
        );
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
    TREE: { color: "#2f6b30", walkable: false, deco: "tree" },
    ROCK: { color: "#e0a458", walkable: false, deco: "rock" },
    HOUSE: { color: "#5fb84c", walkable: false, deco: "house" },
    FLOWER: { color: "#5fb84c", walkable: true, deco: "flower" },
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
    const houses = [[2, 2], [5, 2], [9, 2], [12, 2], [2, 8], [12, 8]];
    houses.forEach(([x, y]) => {
        grid[y][x] = "HOUSE";
    });

    for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 14; x++) {
            if (grid[y][x] === "GRASS" && (x * 3 + y * 5) % 17 === 0) {
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
    if (newX < 0 || newX >= MAP_COLS || newY < 0 || newY >= MAP_ROWS) return;

    const tile = TILES[mapGrid[newY][newX]];
    if (!tile.walkable) return;

    player.tileX = newX;
    player.tileY = newY;
    player.targetPixelX = newX * TILE_SIZE;
    player.targetPixelY = newY * TILE_SIZE;
    player.moving = true;
}

function stepToward(current, target, speed) {
    if (current < target) return Math.min(current + speed, target);
    if (current > target) return Math.max(current - speed, target);
    return current;
}

function updatePlayer() {
    if (player.moving) {
        player.pixelX = stepToward(player.pixelX, player.targetPixelX, player.speed);
        player.pixelY = stepToward(player.pixelY, player.targetPixelY, player.speed);

        if (player.pixelX === player.targetPixelX && player.pixelY === player.targetPixelY) {
            player.moving = false;
            currentPlayer.position = { x: player.tileX, y: player.tileY };
            saveGame();
        }
        return;
    }

    if (pressedKeys.has("ArrowUp") || pressedKeys.has("z") || pressedKeys.has("w")) {
        tryMove(0, -1, "up");
    } else if (pressedKeys.has("ArrowDown") || pressedKeys.has("s")) {
        tryMove(0, 1, "down");
    } else if (pressedKeys.has("ArrowLeft") || pressedKeys.has("q") || pressedKeys.has("a")) {
        tryMove(-1, 0, "left");
    } else if (pressedKeys.has("ArrowRight") || pressedKeys.has("d")) {
        tryMove(1, 0, "right");
    }
}

// ===================== RENDU =====================

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
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
    const zone = getZoneName(player.tileX, player.tileY);
    if (zone !== lastZone) {
        zoneLabel.textContent = zone;
        lastZone = zone;
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cameraX = clamp(player.pixelX + TILE_SIZE / 2 - canvas.width / 2, 0, MAP_COLS * TILE_SIZE - canvas.width);
    const cameraY = clamp(player.pixelY + TILE_SIZE / 2 - canvas.height / 2, 0, MAP_ROWS * TILE_SIZE - canvas.height);

    const startCol = Math.max(0, Math.floor(cameraX / TILE_SIZE));
    const endCol = Math.min(MAP_COLS - 1, Math.ceil((cameraX + canvas.width) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(cameraY / TILE_SIZE));
    const endRow = Math.min(MAP_ROWS - 1, Math.ceil((cameraY + canvas.height) / TILE_SIZE));

    for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
            drawTile(x, y, x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY);
        }
    }

    drawPlayer(player.pixelX - cameraX, player.pixelY - cameraY);

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