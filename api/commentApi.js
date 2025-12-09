import { backendUrl } from "/config/config.js";

async function fetchAddComment(postId, content) {
  try {
    const response = await fetch(backendUrl + `/posts/${postId}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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

async function fetchPatchComment(postId, commentId, content) {
  try {
    const response = await fetch(
      backendUrl + `/posts/${postId}/comments/${commentId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content }),
      }
    );

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching edit comment", error);
    throw error;
  }
}

async function fetchDeleteComment(postId, commentId) {
  try {
    const response = await fetch(
      backendUrl + `/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching delete comment", error);
    throw error;
  }
}

async function fetchCommentList(postId, lastFetchId, limit) {
  try {
    const requestParam =
      lastFetchId == null
        ? `?limit=${limit}`
        : `?lastFetchId=${lastFetchId}&limit=${limit}`;

    const response = await fetch(
      backendUrl + `/posts/${postId}/comments` + requestParam,
      {
        method: "GET",
        credentials: "include",
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

export {
  fetchCommentList,
  fetchPatchComment,
  fetchDeleteComment,
  fetchAddComment,
};
