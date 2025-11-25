const request = require("supertest");
const path = require("path");
const express = require("express");

describe("Express app basic test", () => {
  let app;

  beforeAll(() => {
    app = express();

    const appRoot = path.resolve(__dirname, "..");

    app.use(express.static(path.join(appRoot, "public")));
    app.use("/api", express.static(path.join(appRoot, "api")));
    app.use("/config", express.static(path.join(appRoot, "config")));
    app.use("/assets", express.static(path.join(appRoot, "assets")));

    app.get("/", (req, res) => {
      res.sendFile(path.join(appRoot, "public/pages/login/", "login.html"));
    });
  });

  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
