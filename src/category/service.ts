import createHttpError from "http-errors";
import { Category } from "./types";
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

    async getAll() {
        try {
            const categories = await this.categoryModel.find();
            return categories;
        } catch (err) {
            const error = createHttpError(500, String(err));
            throw error;
        }
    }

    async getById(id: string) {
        try {
            const category = await this.categoryModel.findById(id);
            return category;
        } catch (err) {
            const error = createHttpError(500, String(err));
            throw error;
        }
    }

    async update(id: string, updates: Partial<Category>) {
        try {
            const category = await this.categoryModel.findByIdAndUpdate(
                id,
                updates,
                { new: true },
            );
            return category;
        } catch (err) {
            const error = createHttpError(500, String(err));
            throw error;
        }
    }

    async delete(id: string) {
        try {
            await this.categoryModel.findByIdAndDelete(id);
        } catch (err) {
            const error = createHttpError(500, String(err));
            throw error;
        }
    }
}

export { CategoryService };
