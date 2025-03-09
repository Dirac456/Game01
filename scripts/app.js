const API_URL = "https://izh8lhq5el.execute-api.us-east-1.amazonaws.com/dev2/personajes-aleatorios";

let player1Personajes = []; // Almacena la lista de personajes generados para Player 1
let player2Personajes = []; // Almacena la lista de personajes generados para Player 2

let player1Seleccionado = null;
let player2Seleccionado = null;

async function obtenerPersonajes(player) {
    try {
        const response = await fetch(API_URL);
        const personajes = await response.json();

        if (player === "player1") {
            player1Personajes = personajes; // Guardamos la lista de personajes de Player 1
        } else {
            player2Personajes = personajes; // Guardamos la lista de personajes de Player 2
        }

        mostrarOpciones(player, personajes);
    } catch (error) {
        console.error("Error obteniendo personajes:", error);
    }
}

function mostrarOpciones(player, personajes) {
    const container = document.getElementById(`${player}-options`);
    container.innerHTML = "";

    personajes.forEach((personaje, index) => {
        const card = document.createElement("div");
        card.classList.add("character-card");

        card.innerHTML = `
            <input type="radio" name="${player}-selection" value="${index}">
            <img src="${personaje.imagen}" class="character-img-small" alt="${personaje.nombre}">
            <div>
                <p><strong>${personaje.nombre}</strong></p>
                <p>Tipo: ${personaje.tipo}</p>
                <p>Poder: ${personaje.poder}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

function elegirPersonaje(player) {
    const radios = document.getElementsByName(`${player}-selection`);
    let selectedIndex = -1;

    radios.forEach((radio, index) => {
        if (radio.checked) {
            selectedIndex = index;
        }
    });

    if (selectedIndex === -1) {
        alert("Selecciona un personaje primero");
        return;
    }

    if (player === "player1") {
        player1Seleccionado = player1Personajes[selectedIndex]; // Tomamos el personaje desde la lista guardada
        document.getElementById("player1-message").textContent = "Personaje elegido";
    } else {
        player2Seleccionado = player2Personajes[selectedIndex]; // Tomamos el personaje desde la lista guardada
        document.getElementById("player2-message").textContent = "Personaje elegido";
    }

    mostrarZonaBatalla();
}

function mostrarZonaBatalla() {
    if (player1Seleccionado && player2Seleccionado) {
        document.getElementById("player1-battle-img").src = player1Seleccionado.imagen;
        document.getElementById("player2-battle-img").src = player2Seleccionado.imagen;

        document.getElementById("player1-battle-info").innerHTML = `
            <strong>${player1Seleccionado.nombre}</strong><br>
            Tipo: ${player1Seleccionado.tipo}<br>
            Poder: ${player1Seleccionado.poder}
        `;

        document.getElementById("player2-battle-info").innerHTML = `
            <strong>${player2Seleccionado.nombre}</strong><br>
            Tipo: ${player2Seleccionado.tipo}<br>
            Poder: ${player2Seleccionado.poder}
        `;

        compararPoder();
    }
}

function compararPoder() {
    const player1Poder = player1Seleccionado.poder;
    const player2Poder = player2Seleccionado.poder;

    // Obtener los contenedores de batalla
    const player1BattleInfo = document.getElementById("player1-battle-info").parentElement;
    const player2BattleInfo = document.getElementById("player2-battle-info").parentElement;

    // Limpiar etiquetas previas antes de agregar nuevas
    document.querySelectorAll(".status-label").forEach(label => label.remove());

    if (player1Poder > player2Poder) {
        document.getElementById("player1-battle-img").style.border = "8px solid green";
        document.getElementById("player2-battle-img").style.border = "8px solid red";

        // Crear etiquetas y agregarlas
        const winnerLabel = document.createElement("div");
        winnerLabel.className = "status-label winner-label";
        winnerLabel.textContent = "WINNER";
        player1BattleInfo.appendChild(winnerLabel);

        const loserLabel = document.createElement("div");
        loserLabel.className = "status-label loser-label";
        loserLabel.textContent = "LOSER";
        player2BattleInfo.appendChild(loserLabel);

    } else if (player1Poder < player2Poder) {
        document.getElementById("player1-battle-img").style.border = "8px solid red";
        document.getElementById("player2-battle-img").style.border = "8px solid green";

        const winnerLabel = document.createElement("div");
        winnerLabel.className = "status-label winner-label";
        winnerLabel.textContent = "WINNER";
        player2BattleInfo.appendChild(winnerLabel);

        const loserLabel = document.createElement("div");
        loserLabel.className = "status-label loser-label";
        loserLabel.textContent = "LOSER";
        player1BattleInfo.appendChild(loserLabel);
        
    } else {
        document.getElementById("player1-battle-img").style.border = "8px solid yellow";
        document.getElementById("player2-battle-img").style.border = "8px solid yellow";

        const drawLabel1 = document.createElement("div");
        drawLabel1.className = "status-label draw-label";
        drawLabel1.textContent = "DRAW";
        player1BattleInfo.appendChild(drawLabel1);

        const drawLabel2 = document.createElement("div");
        drawLabel2.className = "status-label draw-label";
        drawLabel2.textContent = "DRAW";
        player2BattleInfo.appendChild(drawLabel2);
    }
}
