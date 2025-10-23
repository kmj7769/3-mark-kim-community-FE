import { backendUrl } from "/config/config.js";

// 회원가입 api 호출 함수
async function fetchRegister(userData) {
  try {
    const response = await fetch(backendUrl + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.status !== 201) {
      // 상태 코드 별 핸들 추가 필요
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error during registration`, error);
    throw error;
  }
}

async function fetchUserInfo(userId) {
  try {
    const response = await fetch(backendUrl + `/users?userId=${userId}`, {
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error during user info fetch`, error);
  }
}

export { fetchRegister, fetchUserInfo };
