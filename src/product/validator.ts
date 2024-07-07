import { body } from "express-validator";

const productCreateValidator = [
    body("name")
        .exists()
        .withMessage("Product name is required.")
        .isString()
        .withMessage("Product name must be a string."),
    body("description")
        .exists()
        .withMessage("Description is required.")
        .isString()
        .withMessage("Description must be a string."),
    // body("image").custom((value, { req }) => {
    //     if (!req.file) throw new Error("Product image file is required.");
    //     return true;
    // }),
    body("priceConfiguration")
        .exists()
        .withMessage("Price Configuration is required."),
    body("attributes").exists().withMessage("Price Configuration is required."),
    body("tenantId")
        .exists()
        .withMessage("Tenant ID is required.")
        .isString()
        .withMessage("Tenant ID must be a string."),
    body("categoryId")
        .exists()
        .withMessage("Category ID is required.")
        .isMongoId()
        .withMessage("Category ID must be a valid MongoDB ObjectId."),
    body("isPublish")
        .optional({ nullable: true })
        .isBoolean()
        .withMessage("isPublish must be a boolean."),
];

const productUpdateValidator = [
    body("name")
        .exists()
        .withMessage("Product name is required.")
        .isString()
        .withMessage("Product name must be a string."),
    body("description")
        .exists()
        .withMessage("Description is required.")
        .isString()
        .withMessage("Description must be a string."),
    body("priceConfiguration")
        .exists()
        .withMessage("Price Configuration is required."),
    body("attributes").exists().withMessage("Price Configuration is required."),
    body("tenantId")
        .exists()
        .withMessage("Tenant ID is required.")
        .isString()
        .withMessage("Tenant ID must be a string."),
    body("categoryId")
        .exists()
        .withMessage("Category ID is required.")
        .isMongoId()
        .withMessage("Category ID must be a valid MongoDB ObjectId."),
    body("isPublish")
        .optional({ nullable: true })
        .isBoolean()
        .withMessage("isPublish must be a boolean."),
];

export { productCreateValidator, productUpdateValidator };
