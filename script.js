let socket; // Declare o socket como uma variável global

function initializeWebSocket() {
    socket = new WebSocket("wss://choice-collie-suitably.ngrok-free.app");

    socket.addEventListener("open", function () {
        console.log("Conectado ao servidor WebSocket");
        // Habilite o botão somente quando a conexão estiver aberta
        document.querySelector("button").disabled = false;
        const roomName = getRoomFromUrl();

        if(roomName) {
            document.getElementById("fname").value = roomName;
            joinRoom();
        }
    });

    socket.addEventListener("message", function (event) {
        const data = JSON.parse(event.data);
        if (data.type === "boardState") {
            data.pieces.forEach((piece) => {
                const element = document.getElementById(piece.id);
                if (element) {
                    $(element).css({ left: piece.x, top: piece.y });
                }
            });
        } else if (data.type === "pieceMoved") {
            const { pieceId, x, y } = data;
            const element = document.getElementById(pieceId);
            if (element) {
                $(element).css({ left: x, top: y });
            }
        }
    });

    socket.addEventListener("close", function () {
        console.log("Desconectado do servidor WebSocket");
        CrispyToast.warning("Desconnected from the server");
        const roomNameDisplay = document.getElementById("roomNameDisplay");
        if (roomNameDisplay) {
            roomNameDisplay.textContent = "Offline";
            roomNameDisplay.classList.remove("text-green-500");
            roomNameDisplay.classList.add("text-red-500");
        }
    });
}

function getRoomFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const roomName = params.get("room").replace(/#/g, "") ;
    return roomName;
}


async function joinRoom() {
    if (socket.readyState === WebSocket.CLOSED) {
        initializeWebSocket();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }


    const roomName = getRoomFromUrl();


    if (!roomName || roomName.length < 6) {
        CrispyToast.error("Room name must have at least 6 characters");
        return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "join", room: roomName }));
        console.log(`Joined room: ${roomName}`);

        const previousRoomNameDisplay =
            document.getElementById("roomNameDisplay");
        if (previousRoomNameDisplay) {
            previousRoomNameDisplay.remove();
        }

        const roomNameDisplay = document.createElement("h1");
        roomNameDisplay.id = "roomNameDisplay";
        roomNameDisplay.textContent = `Online in the room ${roomName}`;
        roomNameDisplay.classList.add(
            "text-green-500",
            "text-xl",
            "mb-4",
            "absolute",
            "top-2",
            "left-2",
            "z-10"
        );
        document.body.insertBefore(roomNameDisplay, document.body.firstChild);
        CrispyToast.success(`Online in the room`);
    } else {
        console.log(
            "WebSocket não está aberto. Não é possível entrar na sala."
        );
    }
}

try {
    initializeWebSocket();
} catch (err) {
    console.log(err);
}

function generateGameName() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let result = "";

    for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 3; i++) {
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return result;
}

const handleClickgenerateNewGame = () => {
    // 1. criar nome
    const gameName = generateGameName();

    // 2. atualizar o input com o nome do jogo
    document.getElementById("fname").value = gameName;
    window.history.pushState({}, "", "?room=" + gameName);

    // 3. entrar na sala
    joinRoom();

};

function handleClickJoin() {
    const gameName = document.getElementById("fname").value;
    window.history.pushState({}, "", "?room=" + gameName);
    joinRoom();
}

$(function () {
    $(".ui-widget-content").draggable({
        stop: function (event, ui) {
            if (socket.readyState === WebSocket.CLOSED) {
                initializeWebSocket();
            }
            const pieceId = event.target.id;
            const { left, top } = ui.position;

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: "movePiece",
                        pieceId: pieceId,
                        x: left,
                        y: top,
                    })
                );
            } else {
                console.log(
                    "WebSocket não está aberto. Não é possível enviar a mensagem."
                );
            }
        },
    });
});

window.addEventListener("focus", () => {
    if (socket.readyState === WebSocket.CLOSED) {
        location.reload();
    } 
});

// Desabilita o botão inicialmente
document.querySelector("button").disabled = true;
document.querySelector("#join_button").addEventListener("click", handleClickJoin);
document
    .querySelector("#create_button")
    .addEventListener("click", handleClickgenerateNewGame);

const copyToClipboard = () => {
    var copyText = window.location.href;
    navigator.clipboard.writeText(copyText).then(() => {
        CrispyToast.success("Room link copied to clipboard");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};


function mostrarMensagemDesktop() {
    const overlayExistente = document.getElementById('desktop-overlay');
    if (overlayExistente) overlayExistente.remove();

    if (window.innerWidth <= 1024) { // desktop
        const overlay = document.createElement('div');
        overlay.id = 'desktop-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #221f20;
            z-index: 9999;
            text-align: center;
            font-family: Arial, sans-serif;
        `;

        const img = document.createElement('img');
        img.src = 'images/olho.png';
        img.style.height="50px";

        const msg = document.createElement('div');
        msg.textContent = 'Please open this site on a desktop for a better experience.';
        msg.style.fontSize = '24px';
        msg.style.color = '#F44336';
        msg.style.margin = '30px';
        msg.style.fontFamily = 'serif';

        overlay.appendChild(img);
        overlay.appendChild(msg);
        document.body.appendChild(overlay);
    }
}

window.addEventListener('load', mostrarMensagemDesktop);
window.addEventListener('resize', mostrarMensagemDesktop);


