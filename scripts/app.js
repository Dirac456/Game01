const API_URL = "https://izh8lhq5el.execute-api.us-east-1.amazonaws.com/dev2/personajes-aleatorios";

let selectedCharacters = {
    player1: null,
    player2: null
};

// Función para obtener 5 personajes aleatorios
async function fetchCharacters(player) {
    try {
        const response = await fetch(API_URL);
        const characters = await response.json();

        // Mostrar personajes en la interfaz
        const container = document.getElementById(`${player}-characters`);
        container.innerHTML = "";

        characters.forEach(character => {
            const card = document.createElement("div");
            card.classList.add("character-card");
            card.innerHTML = `
                <input type="radio" name="${player}-selection" value='${JSON.stringify(character)}'>
                <img src="${character.imagen}" alt="${character.nombre}">
                <div>
                    <p><strong>${character.nombre}</strong></p>
                    <p>Tipo: ${character.tipo}</p>
                    <p>Poder: ${character.poder}</p>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error obteniendo personajes:", error);
    }
}

// Función para seleccionar un personaje
function selectCharacter(player) {
    const selectedOption = document.querySelector(`input[name="${player}-selection"]:checked`);

    if (selectedOption) {
        selectedCharacters[player] = JSON.parse(selectedOption.value);
        document.getElementById(`${player}-message`).textContent = "Personaje elegido ✔";
        
        // Si ambos jugadores han elegido, mostrar batalla
        if (selectedCharacters.player1 && selectedCharacters.player2) {
            showBattle();
        }
    } else {
        alert("Debes seleccionar un personaje.");
    }
}

// Función para mostrar la batalla
function showBattle() {
    const player1Container = document.getElementById("player1-selected");
    const player2Container = document.getElementById("player2-selected");

    player1Container.innerHTML = generateCharacterCard(selectedCharacters.player1);
    player2Container.innerHTML = generateCharacterCard(selectedCharacters.player2);

    // Comparar poderes
    if (selectedCharacters.player1.poder > selectedCharacters.player2.poder) {
        player1Container.classList.add("winner");
        player2Container.classList.add("loser");
    } else if (selectedCharacters.player1.poder < selectedCharacters.player2.poder) {
        player1Container.classList.add("loser");
        player2Container.classList.add("winner");
    }
}

// Función para generar la tarjeta de personaje
function generateCharacterCard(character) {
    return `
        <div class="character-card">
            <img src="${character.imagen}" alt="${character.nombre}">
            <div>
                <h3>${character.nombre}</h3>
                <p>Tipo: ${character.tipo}</p>
                <p>Poder: ${character.poder}</p>
            </div>
        </div>
    `;
}
