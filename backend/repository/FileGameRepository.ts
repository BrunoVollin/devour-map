import Game from "../domain/Game";
import Piece from "../domain/Piece";
import GameRepository from "./GameRepository";
import fs from "fs";

export default class FileGameRepository implements GameRepository {
    async save(game: Game): Promise<void> {
        this.createDatabase();
        const data: any[] = await this.openFile();
        const jsonGame = this.convertGameToJson(game);
        const newData: any[] = data.filter(
            (game: Game) => game.id !== jsonGame.id
        );
        newData.push(jsonGame);
        await this.saveFile(newData);
    }

    async findById(id: string): Promise<Game> {
        this.createDatabase();
        const data = await this.openFile();

        const game = data.find((game: any) => game.id === id);

        if (!game) {
            throw new Error("Game not found with id " + id);
        }

        return this.convertJsonToGame(game);
    }

    async create(game: Game): Promise<void> {
        this.createDatabase();

        const data: any[] = await this.openFile();
        const jsonGame = this.convertGameToJson(game);
        const existingGame = data.find((g: Game) => g.id === jsonGame.id);
        if (existingGame) {
            return;
        }
        data.push(jsonGame);
        await this.saveFile(data);
    }

    openFile(): Promise<[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(`./games.json`, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data.toString()));
            });
        });
    }

    saveFile(data: Game[]): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(`./games.json`, JSON.stringify(data), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    convertGameToJson(game: Game): any {
        return {
            id: game.id,
            pieces: game.pieces.map((piece) => {
                return {
                    id: piece.id,
                    x: piece.getX(),
                    y: piece.getY(),
                };
            }),
        };
    }

    convertJsonToGame(jsonGame: any): Game {
        return new Game(
            jsonGame.id,
            jsonGame.pieces.map((piece: any) => {
                return new Piece(piece.id, piece.x, piece.y);
            })
        );
    }

    createDatabase(): void {
        if (!fs.existsSync(`./games.json`)) {
            fs.writeFileSync(`./games.json`, "[]");
        }
    }
}
