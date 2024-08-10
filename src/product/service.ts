import { Product } from "./types";
import { ProductModel } from "./model";

class ProductService {
    constructor(private productModel: typeof ProductModel) {}

    async createProduct(data: Product) {
        return this.productModel.create(data);
    }

    async getAllProducts() {
        return this.productModel.find();
    }

    async getProductById(id: string) {
        return this.productModel.findById(id);
    }

    async updateProduct(id: string, updates: Partial<Product>) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }

        return await this.productModel.findOneAndUpdate(
            { _id: id },
            { $set: updates },
            { new: true },
        );
    }

    async deleteProduct(id: string) {
        return this.productModel.findByIdAndDelete(id);
    }

    async getProductImage(id: string): Promise<string | undefined> {
        const product = await this.productModel.findById(id);
        return product?.image;
    }
}

export { ProductService };
