import fs from "fs";
import path from "path";
import { MongoMemoryServer } from "mongodb-memory-server";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalTeardown() {
  const tmpPath = path.resolve(__dirname, "globalConfig.json");
  if (fs.existsSync(tmpPath)) {
    const { mongodPid } = JSON.parse(fs.readFileSync(tmpPath, "utf8"));
    if (mongodPid) {
      const mongod = await MongoMemoryServer.create();
      await mongod.stop(); 
    }
    fs.unlinkSync(tmpPath);
  }
}
