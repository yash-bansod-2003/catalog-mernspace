import { Schema, Document, model } from "mongoose";
import { Product, PriceConfiguration, Attribute } from "./types";

type ProductDocument = Product & Document;
type PriceConfigurationDocument = PriceConfiguration & Document;
type AttributeDocument = Attribute & Document;

const attributesSchema = new Schema<AttributeDocument>({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: Schema.Types.Mixed,
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
        },
        attributes: {
            type: [attributesSchema],
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
            required: false,
            default: false,
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
