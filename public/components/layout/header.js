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
    const userInfo = await fetchUserInfo(
      window.sessionStorage.getItem("userId")
    );
    newImage.src =
      userInfo.data.profileImage == null
        ? "/assets/images/default_profile_img.jpeg"
        : userInfo.data.profileImage;

    profileImageContainer.appendChild(newImage);
  }
}

export { addHeader };
