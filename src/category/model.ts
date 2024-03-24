import { Schema, Document, model } from "mongoose";

interface PriceConfiguration {
    [key: string]: {
        priceType: string;
        availableOptions: string[];
    };
}

interface Attribute {
    name: string;
    widgetType: string;
    defaultValue: string;
    availableOptions: string[];
}

interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}

type CategoryDocument = Category & Document;
type PriceConfigurationDocument = PriceConfiguration & Document;
type AttributeDocument = Attribute & Document;

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
        type: Schema.Types.Mixed,
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

export { CategoryModel, Category };
