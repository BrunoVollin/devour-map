import Game from "../domain/Game";
import Piece from "../domain/Piece";
import GameRepository from "./GameRepository";
import sqlite3 from "sqlite3";

export default class SqliteGameRepository implements GameRepository {
  convertToDomain(row: any): Game {
    return new Game(row.id, [], row.map);
  }

  async save(game: Game): Promise<void> {
    const db = new sqlite3.Database("game.db");
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS game (id TEXT PRIMARY KEY, map TEXT)");
      db.run(
        "CREATE TABLE IF NOT EXISTS piece (id INTEGER PRIMARY KEY AUTOINCREMENT, x INTEGER, y INTEGER, game_id TEXT, FOREIGN KEY(game_id) REFERENCES game(id))"
      );
      db.run("BEGIN TRANSACTION");
      db.run("INSERT INTO game (id, map) VALUES (?, ?)", [game.id, game.map]);
      game.pieces.forEach((piece) => {
        db.run(
          "INSERT INTO piece (x, y, game_id) VALUES (?, ?, ?, ?)",
          [piece.id, piece.getX(), piece.getY(), game.id]
        );
      });
      db.run("COMMIT");
    });
    db.close();
  }

  async findById(id: string): Promise<Game> {
    const db = new sqlite3.Database("game.db");
    let game: Game = new Game(id, [], "forest");
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.each(
          "SELECT * FROM game WHERE id = ?",
          [id],
          (err, row: any) => {
            if (err) {
              reject(err);
              return;
            }
            game = new Game(row.id, [], row.map);
          }
        );
        db.each(
          "SELECT * FROM piece WHERE game_id = ?",
          [id],
          (err, row: any) => {
            if (err) {
              reject(err);
              return;
            }
            game.addPiece(row.id, row.x, row.y);
          },
          () => {
            resolve(game);
          }
        );
      });
      db.close();
    });
  }

  async create(game: Game): Promise<void> {
    const db = new sqlite3.Database("game.db");
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS game (id TEXT PRIMARY KEY, map TEXT)");
      db.run(
        "CREATE TABLE IF NOT EXISTS piece (id INTEGER PRIMARY KEY AUTOINCREMENT, x INTEGER, y INTEGER, game_id TEXT, FOREIGN KEY(game_id) REFERENCES game(id))"
      );
      db.run("BEGIN TRANSACTION");
      db.run("INSERT INTO game (id, map) VALUES (?, ?)", [game.id, game.map]);
      game.pieces.forEach((piece) => {
        db.run(
          "INSERT INTO piece (x, y, game_id) VALUES (?, ?, ?, ?)",
          [piece.id, piece.getX(), piece.getY(), game.id]
        );
      });

      db.run("COMMIT");

      db.close();
    });
  }
}
