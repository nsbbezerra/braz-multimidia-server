import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";

const app = express();

interface HTTPError extends Error {
  status?: number;
}

app.use(cors());
app.use(express.json());
app.use(router);
app.use((error: HTTPError, req: Request, res: Response, next: NextFunction) => {
  const message = error.message;
  return res.status(400).json({
    message: `Um erro ocorreu ao processar a operação. ERRO: ${message}`,
    error: { message, status: error.status },
  });
});

app.listen(4003, () => {
  console.log("Server is running...");
  console.log("Load on port: 4003");
});
