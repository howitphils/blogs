import { req } from "./test-helper";
import { describe, it } from "@jest/globals";

describe("Blogs API", () => {
  it("should return hello world", async () => {
    await req.get("/").expect(200, "Hello, World!");
  });
});
