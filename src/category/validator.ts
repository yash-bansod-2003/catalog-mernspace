import { body } from "express-validator";

const categoryValidator = [
    body("name")
        .exists()
        .withMessage("category name is required field")
        .isString()
        .withMessage("category name must be type string"),
    body("priceConfiguration")
        .exists()
        .withMessage("price configuration is required field"),
    body("priceConfiguration.*.priceType")
        .exists()
        .withMessage("price type in price configuration is required field")
        .custom((value: "base" | "additional") => {
            const validKeys = ["base", "additional"];
            if (!validKeys.includes(value)) {
                throw new Error(
                    `value ${value}, is not a supported as a price type in price configuration , supported types are ${validKeys.toString()}`,
                );
            }
        }),
    body("attributes").exists().withMessage("attributes is required field"),
];

export { categoryValidator };
