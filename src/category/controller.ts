import { Request, Response } from "express";
import { CategoryService } from "./service";
import { validationResult } from "express-validator";
import { Category } from "./category";
import { Logger } from "winston";
import createHttpError from "http-errors";

class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.categoryService = categoryService;
        this.logger = logger;
    }

    async create(req: Request, res: Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            this.logger.warn("Category creation validation failed", {
                errors: errors.array(),
            });
            return res.status(422).json({ errors: errors.array() });
        }

        const { name, priceConfiguration, attributes } = req.body as Category;

        this.logger.debug("New request to create a category", {
            name,
            priceConfiguration,
            attributes,
        });

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info("New category has been created", { category });

        return res.status(201).json(category);
    }

    async getAll(req: Request, res: Response) {
        this.logger.debug("Fetching all categories");
        const categories = await this.categoryService.getAll();
        this.logger.info("Fetched all categories", {
            count: categories.length,
        });
        return res.status(200).json(categories);
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        this.logger.debug("Fetching category by ID", { categoryId: id });

        const category = await this.categoryService.getById(id);

        if (!category) {
            throw createHttpError(404, "Category not found");
        }

        this.logger.info("Fetched category by ID", { category });
        return res.status(200).json(category);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const updates = req.body as Category;

        this.logger.debug("Updating category", { categoryId: id, updates });

        const category = await this.categoryService.update(id, updates);
        this.logger.info("Category updated", { category });
        return res.status(200).json(category);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        this.logger.debug("Deleting category", { categoryId: id });

        await this.categoryService.delete(id);
        this.logger.info("Category deleted", { categoryId: id });
        return res.status(204).send();
    }
}

export { CategoryController };
