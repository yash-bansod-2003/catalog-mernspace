export interface PriceConfiguration {
    [key: string]: {
        priceType: string;
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: string;
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}
