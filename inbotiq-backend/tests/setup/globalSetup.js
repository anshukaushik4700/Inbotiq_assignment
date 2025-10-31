import { MongoMemoryServer } from "mongodb-memory-server";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // store Mongo process PID and URI for teardown
  const globalConfig = { mongodPid: mongod.instanceInfo?.pid ?? null, uri };

  // save config one folder up (easier to access in teardown)
  const tmpPath = path.resolve(__dirname, "../globalConfig.json");
  fs.writeFileSync(tmpPath, JSON.stringify(globalConfig), "utf8");

  // make URI available to tests
  process.env.MONGO_URI = uri;

  console.log("✅ In-memory MongoDB started at", uri);
}
