import supertest from "supertest";
import { createServer } from "../../server";
import createJWKSMock from "mock-jwks";
import { CategoryModel } from "../model";
import { connectToDatabase } from "../../configs/db";
import config from "config";
import mongoose from "mongoose";
import { Roles } from "../../common/lib/constants";

describe("category delete", () => {
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5001");
        await connectToDatabase(config.get("database.url"));
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        jwks.start();
        await CategoryModel.deleteMany({});
    });

    afterEach(async () => {
        jwks.stop();
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe("delete /api/v1/category", () => {
        const categoryData = {
            name: "Pizza",
            priceConfiguration: {
                size: {
                    priceType: "base",
                    availableOptions: ["small", "large", "medium"],
                },
                crust: {
                    priceType: "additional",
                    availableOptions: ["thin", "thick"],
                },
            },
            attributes: [
                {
                    name: "isHit",
                    widgetType: "switch",
                    defaultValue: "no",
                    availableOptions: ["yes", "no"],
                },
            ],
        };

        it("should returns status 200", async () => {
            const accessToken = jwks.token({ sub: "1", role: Roles.ADMIN });

            const category = await CategoryModel.create(categoryData);

            await supertest(createServer())
                .delete(`/api/v1/category/${category._id}`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .expect(200)
                .then((res) => {
                    expect(res.ok).toBe(true);
                });
        });

        it("should return status 403 (Forbidden) if user is not admin", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            const category = await CategoryModel.create(categoryData);

            await supertest(createServer())
                .delete(`/api/v1/category/${category._id}`)
                .set("Cookie", [`accessToken=${accessToken}`])
                .expect(403);

            const categories = await CategoryModel.find();
            expect(categories).toHaveLength(1);
        });

        it("should return status 401 if token does not exist", async () => {
            const category = await CategoryModel.create(categoryData);

            await supertest(createServer())
                .delete(`/api/v1/category/${category._id}`)
                .expect(401);

            const categories = await CategoryModel.find();
            expect(categories).toHaveLength(1);
        });
    });
});
