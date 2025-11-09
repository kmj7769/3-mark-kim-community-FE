const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", express.static(path.join(__dirname, "api")));
app.use("/config", express.static(path.join(__dirname, "config")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  // 서버의 환경 변수 값을 스크립트 텍스트로 만듦
  const envScript = `<script>
    window.env = {
      API_URL: "${process.env.API_URL || "http://localhost:8080"}"
    };
  </script>`;

  // register.html 파일 내용 읽기
  const html = fs.readFileSync(
    path.join(__dirname, "public/pages/login/", "login.html"),
    "utf8"
  );

  // 환경 변수 스크립트와 HTML 파일 내용 합쳐서 응답
  res.send(envScript + html);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
