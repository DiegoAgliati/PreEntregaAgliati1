import fs from "fs/promises";

class FileManager {
  constructor(path) {
    this.path = path;
  }

  async read() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw new Error(`Error leyendo el archivo: ${error.message}`);
    }
  }

  async write(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error escribiendo en el archivo: ${error.message}`);
    }
  }
}

export default FileManager;