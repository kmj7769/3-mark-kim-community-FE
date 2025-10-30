import { backendUrl } from "/config/config.js";

async function fetchAddComment(postId, userId, content) {
  try {
    const response = await fetch(backendUrl + `/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: userId,
      },
      body: JSON.stringify({ content: content }),
    });

    if (response.status !== 201) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching add comment", error);
    throw error;
  }
}

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

export { fetchCommentList, fetchAddComment };
