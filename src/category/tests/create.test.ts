import supertest from "supertest";
import { createServer } from "../../server";

describe("category create", () => {
    describe("post /api/category", () => {
        it("should returns status 201", async () => {
            await supertest(createServer())
                .post("/api/category")
                .expect(201)
                .then((res) => {
                    expect(res.ok).toBe(true);
                });
        });
    });
});
