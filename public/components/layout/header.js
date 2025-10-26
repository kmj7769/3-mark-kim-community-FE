import { fetchUserInfo } from "/api/userApi.js";

async function addHeader() {
  await fetch("/components/layout/header.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("afterbegin", html);
    });

  if (window.sessionStorage.getItem("userId") != null) {
    const profileImageContainer = document.getElementById(
      "header-profile-image-container"
    );

    const newImage = document.createElement("img");
    newImage.alt = "프로필 사진";
    const profileImageSrc = window.localStorage.getItem("profileImage");

    newImage.src =
      profileImageSrc === null ||
      profileImageSrc === undefined ||
      profileImageSrc === "null" ||
      profileImageSrc.trim() === ""
        ? "/assets/images/default_profile_img.jpeg"
        : profileImageSrc;

    console.log(newImage.src);

    profileImageContainer.appendChild(newImage);
  }
}

export { addHeader };
