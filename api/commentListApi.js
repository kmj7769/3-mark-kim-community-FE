import { backendUrl } from "/config/config.js";

async function fetchCommentList(postId, userId, lastFetchId, limit) {
  try {
    const requestParam =
      lastFetchId == null
        ? `?limit=${limit}`
        : `?lastFetchId=${lastFetchId}&limit=${limit}`;

    const response = await fetch(
      backendUrl + `/posts/${postId}/comments` + requestParam,
      {
        method: "GET",
        headers: {
          userId: userId,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching comment list", error);
    throw error;
  }
}

export { fetchCommentList };
