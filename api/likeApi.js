import { backendUrl } from "/config/config.js";

async function fetchCreateLike(postId) {
  try {
    const response = await fetch(backendUrl + `/posts/${postId}/likes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 201) {
      // 상태 코드 별 핸들 추가 필요
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error during like`, error);
    throw error;
  }
}

async function fetchDeleteLike(postId) {
  try {
    const response = await fetch(backendUrl + `/posts/${postId}/likes`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during like cancel", error);
    throw error;
  }
}

export { fetchCreateLike, fetchDeleteLike };
