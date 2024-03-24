import express from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";
import { categoryValidator } from "./validator";
import { logger } from "../configs/logger";
import { CategoryModel } from "./model";
const router = express.Router();

const categoryService = new CategoryService(CategoryModel);
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    categoryValidator,
    categoryController.create.bind(categoryController),
);

export { router as categoryRouter };
