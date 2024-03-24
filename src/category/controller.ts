import { Request, Response } from "express";
import { CategoryService } from "./service";

class CategoryController {
    constructor(private categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    create(req: Request, res: Response) {
        return res.status(201).json();
    }
}

export { CategoryController };
