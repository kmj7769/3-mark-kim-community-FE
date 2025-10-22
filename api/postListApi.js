import { backendUrl } from "/config/config.js";

// 게시글 목록 조회 api 호출 함수
async function fetchPostList(lastFetchId, limit) {
  try {
    const uri =
      lastFetchId == null
        ? `/posts?limit=${limit}`
        : `/posts?lastFetchId=${lastFetchId}&limit=${limit}`;

    const response = await fetch(backendUrl + uri, {
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching post list`, error);
    throw error;
  }
}

export { fetchPostList };
