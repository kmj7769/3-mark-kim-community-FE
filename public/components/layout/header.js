function addHeader() {
  fetch("/components/layout/header.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("afterbegin", html);
    });
}

export { addHeader };
