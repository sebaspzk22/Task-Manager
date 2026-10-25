import { createApp } from "./app.js";
import { openDatabase } from "./db.js";

const port = Number(process.env.PORT ?? 3001);
const dbFile = process.env.DB_FILE ?? "tasks.db";

const app = createApp(openDatabase(dbFile));
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port} (db: ${dbFile})`);
});
