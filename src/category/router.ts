import express from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";
import { categoryValidator } from "./validator";
import { logger } from "../configs/logger";
import { CategoryModel } from "./model";
import { asyncWrapper } from "../common/lib/async-wrapper";

const router = express.Router();

const categoryService = new CategoryService(CategoryModel);
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    categoryValidator,
    asyncWrapper(categoryController.create.bind(categoryController)),
);

export { router as categoryRouter };
