import express from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";
import { categoryValidator } from "./validator";
import { logger } from "../configs/logger";
import { CategoryModel } from "./model";
import { asyncWrapper } from "../common/lib/async-wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/can-access";
import { Roles } from "../common/lib/constants";

const router = express.Router();

const categoryService = new CategoryService(CategoryModel);
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.create.bind(categoryController)),
);

router.get(
    "/",
    asyncWrapper(categoryController.getAll.bind(categoryController)),
);

router.get(
    "/:id",
    asyncWrapper(categoryController.getById.bind(categoryController)),
);

router.put(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.update.bind(categoryController)),
);

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    asyncWrapper(categoryController.delete.bind(categoryController)),
);

export { router as categoryRouter };
