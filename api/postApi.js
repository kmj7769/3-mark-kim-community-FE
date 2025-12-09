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
      credentials: "include",
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

async function fetchPostDetail(postId, userId) {
  try {
    const response = await fetch(backendUrl + `/posts/${postId}`, {
      method: "GET",
      credentials: "include",
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

async function fetchUploadPost(formData) {
  try {
    const response = await fetch(backendUrl + "/posts", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
        images: null /* formData.get("images") */, // 추후 pre-signed url로 수정
      }),
    });

    if (response.status !== 201) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching upload post", error);
    throw error;
  }
}

export { fetchPostList, fetchPostDetail, fetchUploadPost };
