import { Schema, Document, model } from "mongoose";
import { Attribute, Category, PriceConfiguration } from "./types";

type CategoryDocument = Category & Document;
type AttributeDocument = Attribute & Document;
type PriceConfigurationDocument = PriceConfiguration & Document;

const priceConfigurationSubSchema = new Schema<PriceConfigurationDocument>(
    {
        priceType: {
            type: String,
            enum: ["base", "additional"],
            required: true,
        },
        availableOptions: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true },
);

const attributeSubSchema = new Schema<AttributeDocument>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        enum: ["switch", "radio"],
        required: true,
    },
    defaultValue: {
        type: String,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const categorySchema = new Schema<CategoryDocument>(
    {
        name: {
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
    },
    { timestamps: true },
);

const CategoryModel = model<CategoryDocument>(
    "Category",
    categorySchema,
    "categories",
);

export { CategoryModel };
