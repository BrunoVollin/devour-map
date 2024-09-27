import fs from "fs";

export default class FileGameDTO {
    async findById(id: string): Promise<any> {
        const data = await this.openFile();

        const game = data.find((game: any) => game.id === id);

        if (!game) {
            throw new Error("Game not found with id " + id);
        }

        return game;
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
}
