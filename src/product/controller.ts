import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ProductService } from "./service";
import { Product } from "./types";
import { Logger } from "winston";

class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
    ) {
        this.productService = productService;
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

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            categoryId,
            image,
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
            image,
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
        const { id } = req.params;
        const updates = req.body as Product;

        this.logger.debug("Updating product", { productId: id, updates });

        const product = await this.productService.updateProduct(id, updates);

        this.logger.info("Product updated", { product });
        return res.status(200).json(product);
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
