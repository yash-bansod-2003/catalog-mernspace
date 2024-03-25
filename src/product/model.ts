import { Schema, Document, model } from "mongoose";
import { Product, PriceConfiguration, Attribute } from "./types";

type ProductDocument = Product & Document;
type PriceConfigurationDocument = PriceConfiguration & Document;
type AttributeDocument = Attribute & Document;

const attributeSubSchema = new Schema<AttributeDocument>({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Schema.Types.Mixed,
        required: true,
    },
});

const priceConfigurationSubSchema = new Schema<PriceConfigurationDocument>(
    {
        priceType: {
            type: String,
            enum: ["base", "additional"],
            required: true,
        },
        availableOptions: {
            type: Map,
            of: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const productSchema = new Schema<ProductDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        priceConfiguration: {
            type: Map,
            of: priceConfigurationSubSchema,
            required: true,
        },
        attributes: {
            type: [attributeSubSchema],
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        isPublish: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
);

const ProductModel = model<ProductDocument>(
    "Product",
    productSchema,
    "products",
);

export { ProductModel };
