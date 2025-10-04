import Game from "../domain/Game";
import GameRepository from "../repository/GameRepository";

export default class CreateGame {
    constructor(private gameRepository: GameRepository) {}

    async execute(input: Input): Promise<Output> {
        const game = new Game(input.gameId, []);

        game.addPiece("1", 0, 0);
        game.addPiece("2", 0, 1);
        game.addPiece("3", 0, 2);
        game.addPiece("4", 0, 3);
        game.addPiece("5", 0, 4);
        game.addPiece("6", 0, 5);
        game.addPiece("7", 0, 6);
        game.addPiece("8", 0, 7);
        game.addPiece("9", 0, 8);
        game.addPiece("10", 0, 9);
        game.addPiece("11", 0, 10);
        game.addPiece("12", 0, 11);
        game.addPiece("13", 0, 12);

        await this.gameRepository.create(game);

        const respose: Output = {
            gameId: game.id,
        };

        return respose;
    }
}

type Input = {
    gameId: string;
};

type Output = {
    gameId: string;
};
