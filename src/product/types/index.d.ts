import { Schema } from "mongoose";

export interface Product {
    name: string;
    description: string;
    image: string;
    priceConfiguration: PriceConfiguration;
    attributes: Array<Attribute>;
    tenantId: string;
    categoryId: Schema.Types.ObjectId;
    isPublish: boolean;
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: string;
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    value: number | string;
}
