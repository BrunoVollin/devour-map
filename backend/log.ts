import * as fs from "fs";
import * as path from "path";

export default class FileLogger {
  private filePath: string;

  constructor(filePath: string = "app.log") {
    this.filePath = filePath;

    // Garante que o diretório exista
    const dir = path.dirname(filePath);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private write(message: string, level: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    fs.appendFileSync(this.filePath, logMessage, { encoding: "utf-8" });
  }

  public info(message: string) {
    this.write(message, "INFO");
  }

  public warning(message: string) {
    this.write(message, "WARNING");
  }

  public error(message: string) {
    this.write(message, "ERROR");
  }
}
