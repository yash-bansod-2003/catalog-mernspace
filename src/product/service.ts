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
        return this.productModel.findByIdAndUpdate(id, updates, {
            new: true,
        });
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
