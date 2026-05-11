import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`SkillVerse backend running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
