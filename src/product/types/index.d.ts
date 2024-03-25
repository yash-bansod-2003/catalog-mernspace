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

// const hello = {
//     name: "Margarita Pizza",
//     description: "This is a tasty pizaa",
//     priceConfiguration: {
//         "Size": {
//             "priceType": "base",
//             "availableOptions": {
//                 "Small": 400,
//                 "Medium": 600,
//                 "Large": 800
//             }
//         },
//         "Crust": {
//             "priceType": "additional",
//             "availableOptions": {
//                 "Thin": 50,
//                 "Thick": 100
//             },

//         }
//     },
//     attributes: [
//         {
//             "name": "Is Hit",
//             "value": true
//         },
//         {
//             "name": "Spiciness",
//             "value": "Hot"
//         }
//     ],
//     tenantId: "1",
//     categoryId: "6601a61ee2a684c432904e72",
//     isPublish: true,
//     image: "file path"
// }
