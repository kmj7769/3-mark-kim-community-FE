import { backendUrl } from "/config/config.js";

async function addFooter() {
  await fetch("/components/layout/footer/footer.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      document.getElementById("terms-link").href = `${backendUrl}/common/terms`;
      document.getElementById(
        "privacy-link"
      ).href = `${backendUrl}/common/privacy`;
    });
}

export { addFooter };
