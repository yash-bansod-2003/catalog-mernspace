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
        .custom((value: string) => {
            const validKeys = ["base", "additional"];
            if (!validKeys.includes(value)) {
                throw new Error(
                    `Value ${value} is not a supported price type in price configuration. Supported types are: ${validKeys.join(", ")}`,
                );
            }
            return value;
        }),
    body("priceConfiguration.*.availableOptions")
        .exists()
        .withMessage(
            "availableOptions in price configuration is required field",
        )
        .isArray()
        .withMessage(
            "availableOptions in price configuration must be an array",
        ),
    body("attributes").exists().withMessage("attributes is required field"),
];

export { categoryValidator };
