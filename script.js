let socket; // Declare o socket como uma variável global

function initializeWebSocket() {
    socket = new WebSocket("wss://powerful-separately-hyena.ngrok-free.app");

    socket.addEventListener("open", function () {
        console.log("Conectado ao servidor WebSocket");
        // Habilite o botão somente quando a conexão estiver aberta
        document.querySelector("button").disabled = false;
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

function joinRoom() {
    if (socket.readyState === WebSocket.CLOSED) {
        initializeWebSocket();
    }

    const roomName = document.getElementById("fname").value;

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
        CrispyToast.success(`Online in the room ${roomName}`);
    } else {
        console.log(
            "WebSocket não está aberto. Não é possível entrar na sala."
        );
    }
}

// Inicializa a conexão WebSocket
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

    // 3. entrar na sala
    joinRoom();
};

// Torna os elementos arrastáveis
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

// Desabilita o botão inicialmente
document.querySelector("button").disabled = true;
document.querySelector("#join_button").addEventListener("click", joinRoom);
document
    .querySelector("#create_button")
    .addEventListener("click", handleClickgenerateNewGame);

const copyToClipboard = () => {
    var copyText = document.getElementById("fname");



    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copyText.value).then(() => {
        CrispyToast.success("Copied to clipboard");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};
