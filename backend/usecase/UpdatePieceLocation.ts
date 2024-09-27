import GameRepository from "../repository/GameRepository";

export default class UpdatePieceLocation {
    constructor(private gameRepository: GameRepository) {}

    async execute(input: Input): Promise<Output> {
        const game = await this.gameRepository.findById(input.gameId);
        game.updatePieceLocation(input.pieceId, input.x, input.y);
        this.gameRepository.save(game);
 
        const respose: Output = {
            gameId: game.id,
            pieceId: input.pieceId,
            x: input.x,
            y: input.y,
        };

        return respose;
    }
}

type Input = {
    gameId: string;
    pieceId: string;
    x: number;
    y: number;
};

type Output = {
    gameId: string;
    pieceId: string;
    x: number;
    y: number;
};
