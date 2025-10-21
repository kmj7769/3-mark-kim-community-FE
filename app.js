const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", express.static(path.join(__dirname, "api")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/login/", "login.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
