import createHttpError from "http-errors";
import { Category } from "./category";
import { CategoryModel } from "./model";

class CategoryService {
    constructor(private categoryModel: typeof CategoryModel) {
        this.categoryModel = categoryModel;
    }

    async create(data: Category) {
        try {
            const category = await this.categoryModel.create(data);
            return category;
        } catch (err) {
            const error = createHttpError(500, String(err));
            throw error;
        }
    }
}

export { CategoryService };
