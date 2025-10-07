// Chave usada no localStorage
const STORAGE_KEY = "streamModeEnabled";

// Estado inicial (recupera do localStorage ou define como false)
let streamModeEnabled = localStorage.getItem(STORAGE_KEY) === "true";

// Atualiza o estado e o localStorage
function setStreamMode(enabled) {
    streamModeEnabled = enabled;
    localStorage.setItem(STORAGE_KEY, enabled);
    updateUI();
}

// Atalhos convenientes
function enableStreamMode() {
    setStreamMode(true);
    console.log("Stream mode habilitado");
}

function disableStreamMode() {
    setStreamMode(false);
    console.log("Stream mode desabilitado");
}

// Alterna o modo
function toggleStreamMode() {
    setStreamMode(!streamModeEnabled);
    console.log("Stream mode agora está", streamModeEnabled ? "habilitado" : "desabilitado");
}

// Atualiza algo na interface (exemplo opcional)
async function updateUI () {
    const statusEl = document.getElementById("stream-status");
    const fname = document.getElementById("fname");
    const roomNameDisplay = document.getElementById("roomNameDisplay");
    const params = new URLSearchParams(window.location.search);
    const roomName = params.get("room");
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    console.log(10)


    const join_button = document.getElementById("join_button");
    const create_button = document.getElementById("create_button");


    join_button.style.display = streamModeEnabled ? 'none' : 'block';
    create_button.style.display = streamModeEnabled ? 'none' : 'block';

    


    if(streamModeEnabled && roomName) { 
        const prefix = "#".repeat(80); // seu ####...
        const newRoomValue = encodeURIComponent(prefix + roomName);
        history.replaceState({}, "", "?room=" + newRoomValue);
        console.log(window.location.href);
    } else if(!streamModeEnabled && roomName) {
        const newRoomValue = encodeURIComponent(roomName.replace(/#/g, ""));
        history.replaceState({}, "", "?room=" + newRoomValue);
        console.log(window.location.href);
    }

    if(roomNameDisplay) {
       roomNameDisplay.style.display = streamModeEnabled ? 'none' : 'block';
        let roomNameDisplay2 = document.getElementById("roomNameDisplay2");
        if(!roomNameDisplay2) {
            roomNameDisplay2 = document.createElement("h1");
            roomNameDisplay2.id = "roomNameDisplay2";
            roomNameDisplay2.textContent = `Online in the room *******`;
            roomNameDisplay2.classList.add(
                "text-green-500",
                "text-xl",
                "mb-4",
                "absolute",
                "top-2",
                "left-2",
                "z-10"
            );
            document.body.insertBefore(roomNameDisplay2, document.body.firstChild);
        }
        roomNameDisplay2.style.display = streamModeEnabled ? 'block' : 'none';
    } else {
        await sleep(100)
        updateUI();
    }

    if (fname) {
        fname.type = streamModeEnabled ? 'password' : "";
    }
    if (statusEl) {
        statusEl.innerHTML = streamModeEnabled
            ? 'Streamer Mode: ON <i class="fas fa-eye-slash text-black cursor-pointer ml-2"></i>'
            : 'Streamer Mode: OFF <i class="fas fa-eye text-black cursor-pointer ml-2"></i>';
    }
}

// Ao carregar a página, restaura o estado
document.addEventListener("DOMContentLoaded", updateUI);
