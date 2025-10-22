import {
  emailValidation,
  passwordValidation,
  nicknameValidation,
  fetchPasswordCheck,
} from "/api/validationApi.js";

import { setHelperText } from "/components/helperText.js";
import { fetchRegister } from "/api/userApi.js";

// 프로필 이미지 파일 변수
let profileImageFile = null;

// div 요소 클릭 시 파일 선택 창 열기
document
  .getElementById("profile-image-container")
  .addEventListener("click", function () {
    document.getElementById("upload-image").click();
  });

// 이미지 파일 선택 시 미리보기 생성
document
  .getElementById("upload-image")
  .addEventListener("change", function (e) {
    const imagePreviewContainer = document.getElementById(
      "profile-image-container"
    );

    // 이전에 미리보기된 이미지가 있으면 제거
    if (imagePreviewContainer.firstElementChild !== null) {
      imagePreviewContainer.removeChild(
        imagePreviewContainer.firstElementChild
      );
      profileImageFile = null;
    }

    const file = e.target.files[0];

    // 이미지 저장 api 구현 후, 로직 변경 필요
    profileImageFile = URL.createObjectURL(file);
    console.log("Selected profile image file URL:", profileImageFile);

    // 새 이미지 미리보기 생성
    const newImage = document.createElement("img");
    newImage.alt = "Profile Image Preview";
    newImage.src = URL.createObjectURL(file);
    newImage.style.maxWidth = "100px";
    newImage.style.maxHeight = "100px";

    imagePreviewContainer.appendChild(newImage);
  });

let emailValid = false;
let passwordValid = false;
let passwordCheckValid = false;
let nicknameValid = false;

const registerForm = document.getElementById("register-submit-button");

// 유효성 검사 후 폼 제출 버튼 활성화
function checkFormValidity() {
  if (emailValid && passwordValid && passwordCheckValid && nicknameValid) {
    registerForm.disabled = false;
  } else {
    registerForm.disabled = true;
  }
}

// 이메일 검증 관련 이벤트 리스너
document.getElementById("email").addEventListener("change", async function (e) {
  const email = e.target.value.trim();

  if (email === "") {
    setHelperText("email-help", "이메일을 입력해주세요");
    emailValid = false;
    return;
  }

  try {
    const result = await emailValidation(email);

    if (result.status === 400) {
      setHelperText("email-help", "이메일을 입력해주세요");
      emailValid = false;
      checkFormValidity();
      return;
    }

    if (result.data.validity && !result.data.isDuplicated) {
      setHelperText("email-help", "");
      emailValid = true;
      checkFormValidity();
      return;
    } else if (!result.data.validity) {
      setHelperText("email-help", "올바른 이메일 주소 형식을 입력해주세요");
      emailValid = false;
      checkFormValidity();
      return;
    } else {
      setHelperText("email-help", "중복된 이메일 입니다");
      emailValid = false;
      checkFormValidity();
      return;
    }
  } catch (error) {
    console.error("Email validation failed:", error);
  }
});

// 비밀번호 검증 관련 이벤트 리스너
document
  .getElementById("password")
  .addEventListener("change", async function (e) {
    const password = e.target.value.trim();

    if (password === "") {
      setHelperText("password-help", "비밀번호를 입력해주세요");
      passwordValid = false;
      checkFormValidity();
      return;
    }

    try {
      const result = await passwordValidation(password);

      if (result.status === 400) {
        setHelperText("password-help", "비밀번호를 입력해주세요");
        passwordValid = false;
        checkFormValidity();
        return;
      }

      if (result.data.validity) {
        setHelperText("password-help", "");
        passwordValid = true;
        checkFormValidity();
        return;
      } else {
        setHelperText(
          "password-help",
          "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수 문자를 각각 최소 1개 포함해야 합니다"
        );
        passwordValid = false;
        checkFormValidity();
        return;
      }
    } catch (error) {
      console.error("Password validation failed:", error);
    }
  });

// 비밀번호 확인 관련 이벤트 리스너
document
  .getElementById("password-check")
  .addEventListener("change", async function (e) {
    const passwordCheck = e.target.value.trim();

    if (passwordCheck === "") {
      setHelperText("password-check-help", "비밀번호를 한 번 더 입력해주세요");
      passwordCheckValid = false;
      checkFormValidity();
      return;
    }

    const originalPassword = document.getElementById("password").value.trim();
    if (originalPassword === "" || !passwordValid) {
      setHelperText(
        "password-check-help",
        "먼저 유효한 비밀번호를 입력해주세요"
      );
      passwordCheckValid = false;
      checkFormValidity();
      return;
    }

    try {
      const result = await fetchPasswordCheck(originalPassword, passwordCheck);

      if (result.status === 400) {
        setHelperText(
          "password-check-help",
          "비밀번호를 한 번 더 입력해주세요"
        );
        passwordCheckValid = false;
        checkFormValidity();
        return;
      }

      if (result.data.isEqual) {
        setHelperText("password-check-help", "");
        passwordCheckValid = true;
        checkFormValidity();
        return;
      } else {
        setHelperText("password-check-help", "비밀번호가 다릅니다");
        passwordCheckValid = false;
        checkFormValidity();
        return;
      }
    } catch (error) {
      console.error("Password check failed:", error);
    }
  });

// 닉네임 검증 관련 이벤트 리스너
document
  .getElementById("nickname")
  .addEventListener("change", async function (e) {
    const nickname = e.target.value.trim();

    if (nickname === "") {
      setHelperText("nickname-help", "닉네임을 입력해주세요");
      nicknameValid = false;
      checkFormValidity();
      return;
    }

    try {
      const result = await nicknameValidation(nickname);

      if (result.status === 400) {
        setHelperText("nickname-help", "닉네임을 입력해주세요");
        nicknameValid = false;
        checkFormValidity();
        return;
      }

      if (
        !result.data.overLimit &&
        !result.data.isDuplicated &&
        !result.data.hasSpace
      ) {
        setHelperText("nickname-help", "");
        nicknameValid = true;
        checkFormValidity();
        return;
      } else if (result.data.isDuplicated) {
        setHelperText("nickname-help", "중복된 닉네임입니다");
        nicknameValid = false;
        checkFormValidity();
        return;
      } else {
        let helperText = "";

        console.log(result.data.hasSpace, result.data.overLimit);

        if (result.data.hasSpace) {
          helperText = "띄어쓰기를 없애주세요";
        }

        if (result.data.overLimit) {
          if (helperText !== "") {
            helperText += "<br />";
          }
          helperText += "닉네임은 최대 10자까지 작성 가능합니다";
        }

        setHelperText("nickname-help", helperText);
        nicknameValid = false;
        checkFormValidity();
        return;
      }
    } catch (error) {
      console.error("Email validation failed:", error);
    }
  });

document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    // 폼 데이터 수집
    const formData = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      nickname: document.getElementById("nickname").value.trim(),
      profileImage: profileImageFile, // 이미지 파일 URL
    };

    try {
      const result = await fetchRegister(formData);
      if (result.code === 201) {
        console.log("Registration successful:", result.data);
        window.location.href = "/pages/login/login.html";
      } else {
        console.error("Registration failed:", result);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  });
