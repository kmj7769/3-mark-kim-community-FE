import { fetchPostList } from "/api/postListApi.js";

import { postItem } from "/pages/post-list/components/postItem.js";

let lastFetchId = null;
const limit = 15;

async function loadPost() {
  try {
    const result = await fetchPostList(lastFetchId, limit);

    result.data.posts.forEach((post) => {
      postItem(post);
      lastFetchId = post.postId;
    });
  } catch (error) {
    console.error("Retrieving post list failed:", error);
  }
}

loadPost();

document
  .getElementById("post-list-container")
  .addEventListener("scroll", (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadPost();
    }
  });
