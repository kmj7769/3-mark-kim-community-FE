import { backendUrl } from "/config/config.js";

// 게시글 상세 조회 및 댓글 목록 api 호출 함수
async function fetchPostDetail(postId, userId) {
  try {
    const response = await fetch(backendUrl + `/posts/${postId}`, {
      method: "GET",
      headers: {
        userId: userId,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${postId}`, error);
    throw error;
  }
}

export { fetchPostDetail };
