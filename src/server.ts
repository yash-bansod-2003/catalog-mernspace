import express, { type Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./common/middlewares/error-handler";
import { categoryRouter } from "./category/router";
import { productRouter } from "./product/router";

export const createServer = (): Express => {
    const app = express();
    app.disable("x-powered-by")
        .use(express.static("public"))
        .use(morgan("dev"))
        .use(urlencoded({ extended: true }))
        .use(json())
        .use(cookieParser())
        .use(cors({ origin: ["http://localhost:5173"], credentials: true }))
        .get("/status", (_, res) => {
            return res.json({ ok: true });
        })
        .get("/message/:name", (req, res) => {
            return res.json({ message: `hello ${req.params.name}` });
        })
        .use("/api/v1/category", categoryRouter)
        .use("/api/v1/product", productRouter)
        .use(errorHandler);

    return app;
};
