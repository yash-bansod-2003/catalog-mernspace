import express from "express";
import { ProductController } from "./controller";
import { ProductService } from "./service";
import { productCreateValidator } from "./validator";
import { logger } from "../configs/logger";
import { ProductModel } from "./model";
import { asyncWrapper } from "../common/lib/async-wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/can-access";
import { UserRoles } from "../common/constants";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/s3-storage";
import createHttpError from "http-errors";

const router = express.Router();

const productService = new ProductService(ProductModel);
const s3Storage = new S3Storage();
const productController = new ProductController(
    productService,
    s3Storage,
    logger,
);

router.post(
    "/",
    authenticate,
    canAccess([UserRoles.ADMIN, UserRoles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, //500kb
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "File size exceed the limit");
            next(error);
        },
    }),
    productCreateValidator,
    asyncWrapper(productController.create.bind(productController)),
);

router.get("/", asyncWrapper(productController.getAll.bind(productController)));

router.get(
    "/:id",
    asyncWrapper(productController.getById.bind(productController)),
);

router.put(
    "/:id",
    authenticate,
    canAccess([UserRoles.ADMIN, UserRoles.MANAGER]),
    productCreateValidator,
    asyncWrapper(productController.update.bind(productController)),
);

router.delete(
    "/:id",
    authenticate,
    canAccess([UserRoles.ADMIN, UserRoles.MANAGER]),
    asyncWrapper(productController.delete.bind(productController)),
);

export { router as productRouter };
