import express from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";
import { categoryValidator } from "./validator";
const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.post(
    "/",
    categoryValidator,
    categoryController.create.bind(categoryController),
);

export { router as categoryRouter };
