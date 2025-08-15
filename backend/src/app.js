import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));

//routes import
import healthCheckRoute from "./routes/healthCheck.route.js";
import userRoute from "./routes/user.route.js";

//routes declaration
app.use("/api/v1", healthCheckRoute);
app.use("/api/v1/user", userRoute);

export default app;
