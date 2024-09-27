import WebSocketServer from "ws";
import UpdatePieceLocation from "./usecase/UpdatePieceLocation";
import FileGameRepository from "./repository/FileGameRepository";
import CreateGame from "./usecase/CreateGame";
import FileGameDTO from "./DTO/FileGameDTO";
const PORT = 3030;
const server = new WebSocketServer.Server({ port: PORT });
const rooms: { [roomName: string]: Set<WebSocket> } = {};

server.on("connection", (socket: any) => {
    console.log("A user connected");

    let currentRoom: string | null = null;

    const repository = new FileGameRepository();
    const dto = new FileGameDTO();

    socket.send(
        JSON.stringify({
            type: "welcome",
            message: "Conectado ao servidor WebSocket",
        })
    );

    socket.on("message", async (data: any) => {
        const message: any = JSON.parse(data);
        try {
            const piece = new Piece(message.pieceId, message.x, message.y);
            console.log("piece: ", piece);

            if (message.type !== "join" && !currentRoom) {
                socket.send(
                    JSON.stringify({
                        type: "error",
                        message: "You need to join a room first",
                    })
                );

                return;
            }

            if (message.type === "movePiece") {
                message as MessageMovePiece;

                const updatePieceLocation = new UpdatePieceLocation(repository);

                await updatePieceLocation.execute({
                    gameId: currentRoom || "",
                    pieceId: message.pieceId,
                    x: message.x,
                    y: message.y,
                });

                if (currentRoom && rooms[currentRoom]) {
                    rooms[currentRoom].forEach((client: any) => {
                        if (client.readyState === WebSocketServer.OPEN) {
                            console.log(
                                "mensagem enviada para o cliente na sala:",
                                currentRoom
                            );
                            client.send(
                                JSON.stringify({
                                    type: "pieceMoved",
                                    pieceId: message.pieceId,
                                    x: message.x,
                                    y: message.y,
                                })
                            );
                        }
                    });
                }
            }

            if (message.type === "join") {
                message as MessageJoin;

                const roomName = message.room;

                if (!rooms[roomName]) {
                    rooms[roomName] = new Set();
                }
                rooms[roomName].add(socket);
                currentRoom = roomName;

                console.log(`Client joined room: ${roomName}`);

                socket.send(
                    JSON.stringify({
                        type: "joined",
                        room: roomName,
                    })
                );

                const createGame = new CreateGame(repository);

                await createGame.execute({ gameId: currentRoom || "" });

                const jsonGame = await dto.findById(currentRoom || "");

                rooms[roomName].forEach((client: any) => {
                    client.send(
                        JSON.stringify({ ...jsonGame, type: "boardState" })
                    );
                });
            }
        } catch (error: any) {
            console.error("Error: ", error);
            socket.send(
                JSON.stringify({
                    type: "error",
                    message: error.message,
                })
            );
        }
    });

    socket.on("close", () => {
        console.log("User disconnected");
    });
});
console.log("WebSocket server running on ws://localhost:" + PORT);

class Piece {
    constructor(readonly id: string, readonly x: number, readonly y: number) {}
}

type MessageMovePiece = {
    type: string;
    pieceId: string;
    x: number;
    y: number;
    map: "manor" | "forest";
};

type MessageJoin = {
    type: string;
    room: string;
};
