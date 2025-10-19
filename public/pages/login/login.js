import {
  emailValidation,
  passwordValidation,
} from "../../../api/validationApi.js";

import { fetchLogin } from "../../../api/authApi.js";

// 헬퍼 텍스트 추가 함수
function setHelperText(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

// 유효성 검사 상태 변수
let emailValid = false;
let passwordValid = false;

const loginSubmitButton = document.getElementById("login-submit-button");

function checkFormValidity() {
  if (emailValid && passwordValid) {
    loginSubmitButton.disabled = false;
  } else {
    loginSubmitButton.disabled = true;
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
      return;
    }

    if (result.data.validity) {
      setHelperText("email-help", "");
      emailValid = true;
      checkFormValidity();
      return;
    } else {
      setHelperText("email-help", "올바른 이메일 주소 형식을 입력해주세요");
      emailValid = false;
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
      return;
    }

    try {
      const result = await passwordValidation(password);

      if (result.status === 400) {
        setHelperText("password-help", "비밀번호를 입력해주세요");
        passwordValid = false;
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
        return;
      }
    } catch (error) {
      console.error("Password validation failed:", error);
    }
  });

// 로그인 폼 제출 이벤트 리스너
document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const result = await fetchLogin(email, password);
      if (result.code === 200) {
        console.log("Login successful:", result);
        window.location.href = "../post-list/post_list.html";
      } else if (result.code === 401) {
        console.log("Login failed:", result);
        setHelperText("password-help", "이메일 또는 비밀번호를 확인해주세요");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  });

document.getElementById("")