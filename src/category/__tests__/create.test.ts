import supertest from "supertest";
import { createServer } from "../../server";
import createJWKSMock from "mock-jwks";
import { CategoryModel } from "../model";
import { connectToDatabase } from "../../configs/db";
import config from "config";
import mongoose from "mongoose";
import { UserRoles } from "../../common/constants";

describe("category create", () => {
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

    describe("post /api/category", () => {
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

        it("should returns status 201", async () => {
            const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

            await supertest(createServer())
                .post("/api/category")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(categoryData)
                .expect(201)
                .then((res) => {
                    expect(res.ok).toBe(true);
                });
        });
        it("should return 422 if category data is invalid", async () => {
            const accessToken = jwks.token({ sub: "1", role: UserRoles.ADMIN });

            await supertest(createServer())
                .post("/api/category")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send({})
                .expect(422);
        });

        it("should return status 403 (Forbidden) if user is not admin", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: UserRoles.CUSTOMER,
            });

            await supertest(createServer())
                .post("/api/category")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send(categoryData)
                .expect(403);

            const categories = await CategoryModel.find();
            expect(categories).toHaveLength(0);
        });

        it("should return status 401 if token does not exist", async () => {
            await supertest(createServer())
                .post("/api/category")
                .send(categoryData)
                .expect(401);
        });
    });
});
