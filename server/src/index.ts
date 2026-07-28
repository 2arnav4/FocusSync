import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { healthRouter } from "./routes/health";
import { notificationsRouter } from "./routes/notifications";
import { resetRouter } from "./routes/reset";
import { stateRouter } from "./routes/state";
import { syncRouter } from "./routes/sync";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/state", stateRouter);
app.use("/api/sync", syncRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/reset", resetRouter);

app.listen(port, () => {
  console.log(`FocusSync API listening on http://localhost:${port}`);
});
