import Game from "../domain/Game";

export default interface GameRepository {
    save(game: Game): Promise<void>;
    findById(id: string): Promise<any>;
    create(game: Game): Promise<void>;
}
