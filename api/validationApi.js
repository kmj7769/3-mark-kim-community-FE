// 이메일 검증 api 호출 함수
function emailValidation(data) {
  return fetchValidation("email", data);
}

// 비밀번호 검증 api 호출 함수
function passwordValidation(data) {
  return fetchValidation("password", data);
}

// 닉네임 검증 api 호출 함수
function nicknameValidation(data) {
  return fetchValidation("nickname", data);
}

// 검증 api 호출 함수
async function fetchValidation(type, value) {
  try {
    const response = await fetch(`http://localhost:8080/validation/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [type]: value }),
    });

    if (!response.ok) {
      // 상태 코드 별 핸들 추가 필요
      // 특히 입력이 없을 경우 400 에러 처리
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error during ${type} validation:`, error);
    throw error;
  }
}

export { emailValidation, passwordValidation, nicknameValidation };
