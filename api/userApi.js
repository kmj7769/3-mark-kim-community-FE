async function fetchRegister(userData) {
  try {
    const response = await fetch("http://localhost:8080/users", {
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

export { fetchRegister };
