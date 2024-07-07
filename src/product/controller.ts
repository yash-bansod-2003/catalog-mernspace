import { Response } from "express";
import { Request } from "express-jwt";
import { validationResult } from "express-validator";
import { ProductService } from "./service";
import { Product } from "./types";
import { Logger } from "winston";
import { FileStorage } from "../common/types/storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { BodyDataTypes } from "@aws-sdk/lib-storage";
import createHttpError from "http-errors";

class ProductController {
    constructor(
        private productService: ProductService,
        private storage: FileStorage,
        private logger: Logger,
    ) {
        this.productService = productService;
        this.storage = storage;
        this.logger = logger;
    }

    async create(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            this.logger.warn("Validation failed while creating product", {
                errors: errors.array(),
            });
            return res.status(422).json({ errors: errors.array() });
        }

        const imageFile = req.files!.image as UploadedFile;

        const imageName = uuidv4();

        await this.storage.upload({
            filename: imageName,
            fileData: imageFile.data.buffer as BodyDataTypes,
        });

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            categoryId,
            isPublish,
            tenantId,
        } = req.body as Product;

        const productData = {
            name,
            description,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            priceConfiguration: JSON.parse(
                priceConfiguration as unknown as string,
            ),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            attributes: JSON.parse(attributes as unknown as string),
            tenantId,
            categoryId,
            isPublish,
            image: imageName,
        };

        this.logger.debug("Creating a new product", { productData });

        const product = await this.productService.createProduct(productData);

        this.logger.info("New product created", { product });

        return res.status(201).json(product);
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        this.logger.debug("Fetching product by ID", { productId: id });

        const product = await this.productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        this.logger.info("Fetched product by ID", { product });
        return res.status(200).json(product);
    }

    async update(req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            this.logger.warn("Validation failed while creating product", {
                errors: errors.array(),
            });
            return res.status(422).json({ errors: errors.array() });
        }

        const { id } = req.params;

        const imageFile = req.files?.image as UploadedFile;
        let imageName: string | undefined;
        let oldImage: string | undefined;

        if (imageFile) {
            oldImage = await this.productService.getProductImage(id);

            imageName = uuidv4();

            await this.storage.upload({
                filename: imageName,
                fileData: imageFile.data.buffer as BodyDataTypes,
            });

            if (oldImage) {
                await this.storage.delete(oldImage);
            }
        }
        const productData = req.body as Product;

        this.logger.debug("Updating product", {
            productId: id,
            productData,
        });

        const updatedProduct = await this.productService.updateProduct(id, {
            ...productData,
            image: imageName ?? oldImage,
        });

        if (!updatedProduct) {
            const error = createHttpError(404, "Product not found");
            throw error;
        }

        return res.status(200).json({ id });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        this.logger.debug("Deleting product", { productId: id });

        await this.productService.deleteProduct(id);

        this.logger.info("Product deleted", { productId: id });
        return res.status(204).send();
    }

    async getAll(req: Request, res: Response) {
        this.logger.debug("Fetching all products");

        const products = await this.productService.getAllProducts();

        this.logger.info("Fetched all products", { count: products.length });
        return res.status(200).json(products);
    }
}

export { ProductController };
