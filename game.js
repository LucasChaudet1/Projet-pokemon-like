const startScreen = document.getElementById("startScreen");
const creatureScreen = document.getElementById("creatureScreen");
const gameScreen = document.getElementById("gameScreen");

const pseudoInput = document.getElementById("pseudoInput");
const startButton = document.getElementById("startButton");

const playerName = document.getElementById("playerName");
const startingCreature = document.getElementById("startingCreature");
const creatureSelection = document.getElementById("creatureSelection");

// Les 3 créatures starters
const STARTER_CREATURES = [
    { id: 1, name: "Flamant", type: "Feu" },
    { id: 4, name: "Salasaur", type: "Plante" },
    { id: 7, name: "Aquali", type: "Eau" }
];

let currentPlayer = {
    pseudo: "",
    creature: null
};

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

function selectCreature(id, name, type) {
    currentPlayer.creature = { id, name, type };

    // Afficher le pseudo
    playerName.textContent = "👤 " + currentPlayer.pseudo;

    // Afficher la créature
    const creatureDiv = document.createElement("div");
    creatureDiv.style.display = "flex";
    creatureDiv.style.alignItems = "center";
    creatureDiv.style.gap = "10px";
    creatureDiv.innerHTML = `
        <img src="fakemon_creatures/${String(id).padStart(3, '0')}.png" alt="${name}" style="width: 40px; height: 40px; object-fit: contain;">
        <span>${name} (${type})</span>
    `;
    startingCreature.appendChild(creatureDiv);

    // Cacher l'écran de sélection
    creatureScreen.classList.add("hidden");

    // Afficher l'écran du jeu
    gameScreen.classList.remove("hidden");

    // Sauvegarder la partie
    saveGame();
}

function saveGame() {
    localStorage.setItem("playerData", JSON.stringify(currentPlayer));
    console.log("Partie sauvegardée:", currentPlayer);
}

function loadGame() {
    const saved = localStorage.getItem("playerData");
    if (saved) {
        currentPlayer = JSON.parse(saved);
        // Afficher le joueur sauvegardé
        playerName.textContent = "👤 " + currentPlayer.pseudo;
        if (currentPlayer.creature) {
            const { id, name, type } = currentPlayer.creature;
            const creatureDiv = document.createElement("div");
            creatureDiv.style.display = "flex";
            creatureDiv.style.alignItems = "center";
            creatureDiv.style.gap = "10px";
            creatureDiv.innerHTML = `
                <img src="fakemon_creatures/${String(id).padStart(3, '0')}.png" alt="${name}" style="width: 40px; height: 40px; object-fit: contain;">
                <span>${name} (${type})</span>
            `;
            startingCreature.appendChild(creatureDiv);
            startScreen.classList.add("hidden");
            gameScreen.classList.remove("hidden");
        }
    }
}

// Charger la partie sauvegardée au démarrage
loadGame();