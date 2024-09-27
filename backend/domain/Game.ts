import Piece from "./Piece";


export default class Game {
    constructor(
        readonly id: string,
        readonly pieces: Piece[],
    ) {}

    public updatePieceLocation(pieceId: string, x: number, y: number): void {
        const piece = this.pieces.find((piece) => piece.id === pieceId);
        if (!piece) {
            throw new Error(`Piece with id ${pieceId} not found =>` + this.pieces.map((piece) => piece.id));
        }
        piece.setXY(x, y);
    }

    public addPiece(pieceId: string, x: number, y: number): void {
        this.pieces.push(new Piece(pieceId, x, y));
    }
}
