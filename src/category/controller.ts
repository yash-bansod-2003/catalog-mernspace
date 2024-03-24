import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./service";
import { validationResult } from "express-validator";
import { Category } from "./category";
import { Logger } from "winston";

class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.categoryService = categoryService;
        this.logger = logger;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { name, priceConfiguration, attributes } = req.body as Category;

        this.logger.debug("new request to create a category", {
            name,
            priceConfiguration,
            attributes,
        });

        try {
            this.logger.info("creating new category..!");

            const category = await this.categoryService.create({
                name,
                priceConfiguration,
                attributes,
            });

            this.logger.info("new category has been created");

            return res.status(201).json(category);
        } catch (error) {
            return next(error);
        }
    }
}

export { CategoryController };
