import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "morgan";
import "express-async-errors";
import { router } from "./routes/index";

import dotenv from "dotenv";
dotenv.config();
import { DBConnection } from "./models/index";
DBConnection();

import { fallBack, errorHandler } from "./middlewares/error.middleware";
import { responseHandler } from "./middlewares/response.middleware";

const app = express();

/**Start Using Middlewares */
/**Parse requests of content-type: application/json*/
app.use(express.json({ extended: true, limit: "50mb" } as any));
/**Parse requests of content-type: application/x-www-form-urlencoded*/
app.use(express.urlencoded({ extended: true, limit: "50mb" } as any));
/**Allow cross origin access*/
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
/**Node Request Logger */
app.use(logger("dev"));
/**End Using Middlewares */

app.use((req: Request, res: Response, next: NextFunction) => {
  responseHandler(req as any, res as any, next as any); // Use "as any" to handle the type discrepancy
});

/**Main application router*/
app.use(router);

// For static assets
app.use("/public", express.static(__dirname + "/public"));

//For EJS views
// app.engine("ejs", engines.ejs);
// app.set("views", "./public/views");
// app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Backend</h1>");
});

/**If Route Not Exits Then Show Message */
app.use((req: Request, res: Response, next: NextFunction) => {
  fallBack(req as any, res as any, next as any); // Use "as any" to handle the type discrepancy
});
/**For Catching and Handling Default Errors */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req as any, res as any, next as any); // Use "as any" to handle the type discrepancy
});

export default app;
