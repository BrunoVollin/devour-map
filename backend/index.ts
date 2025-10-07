import WebSocketServer from "ws";
import UpdatePieceLocation from "./usecase/UpdatePieceLocation";
import FileGameRepository from "./repository/FileGameRepository";
import CreateGame from "./usecase/CreateGame";
import FileGameDTO from "./DTO/FileGameDTO";
import FileLogger from "./log";
import axios from "axios";


const PORT = Number(process.env.PORT) || 3000;
const server = new WebSocketServer.Server({ port: PORT });
const rooms: { [roomName: string]: Set<WebSocket> } = {};
const logger = new FileLogger("logs/system.log");

server.on("connection", (socket: any, req: any) => {
    console.log("A user connected");

    let currentRoom: string | null = null;

    const repository = new FileGameRepository();
    const dto = new FileGameDTO();

    getClientIpAndLocation(req).then((clientIp) => {
        logger.info("client ip = " + JSON.stringify(clientIp));
    });
    

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

                const roomName = message.room.replace(/#/g, "");

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




export async function getClientIpAndLocation(req: any): Promise<{ ip: string; location: string }> {
  const xff = req.headers["x-forwarded-for"];
  const cfIp = req.headers["cf-connecting-ip"];
  const xRealIp = req.headers["x-real-ip"];

  let ip: string | undefined;

  if (xff) {
    if (Array.isArray(xff)) ip = xff[0];
    else ip = xff.split(",")[0].trim();
  } else if (typeof cfIp === "string" && cfIp.length) {
    ip = cfIp;
  } else if (typeof xRealIp === "string" && xRealIp.length) {
    ip = xRealIp;
  } else {
    ip = req.socket?.remoteAddress;
  }

  if (!ip) return { ip: "unknown", location: "unknown" };

  if (ip.startsWith("::ffff:")) ip = ip.substring(7);
  if (ip.includes(":") && ip.split(":").length <= 2) {
    ip = ip.split(":")[0];
  }

  let location = "unknown";
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`);
    const data = res.data;
    location = `${data.city || "?"}, ${data.region || "?"}, ${data.country_name || "?"}`;
  } catch (e: any) {
    logger.error(JSON.stringify(e));
    console.error("Erro ao buscar localização:", e.message || e);
  }

  return { ip, location };
}
