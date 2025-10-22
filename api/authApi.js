import { backendUrl } from "/config/config.js";

// 로그인 api 호출 함수
async function fetchLogin(email, password) {
  try {
    const response = await fetch(backendUrl + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (!response.ok && response.status !== 401) {
      // 상태 코드 별 핸들 추가 필요
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error during login`, error);
    throw error;
  }
}

export { fetchLogin };
