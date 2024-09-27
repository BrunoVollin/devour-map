import UpdatePieceLocation from "../usecase/UpdatePieceLocation";
import GameRepository from "../repository/GameRepository";
import Piece from "../domain/Piece";
import Game from "../domain/Game";
import FileGameRepository from "../repository/FileGameRepository";

test("a", () => {
    const piece = new Piece("1", 1, 1);
    const game = new Game("3", [piece], "manor");
    const repo = new FileGameRepository();

    repo.create(game);
    
    game.updatePieceLocation("1", 0, 200);

    repo.save(game);





});
