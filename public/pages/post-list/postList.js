import { fetchPostList } from "/api/postApi.js";

import { postItem } from "/pages/post-list/components/post-item/postItem.js";
import { addHeader } from "/components/layout/header/header.js";
import { addFooter } from "/components/layout/footer/footer.js";

addHeader();

addFooter();

let lastFetchId = null;
const limit = 15;
let isLoading = false;

const onScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadPost();
  }
};

async function loadPost() {
  if (isLoading) return;

  isLoading = true;

  try {
    const result = await fetchPostList(lastFetchId, limit);

    await result.data.posts.forEach((post) => {
      postItem("post-list-container", post);
    });

    if (result.data.lastFetchId == null) {
      document
        .getElementById("post-list-container")
        .removeEventListener("scroll", onScroll);
    } else {
      lastFetchId = result.data.lastFetchId;
    }
  } catch (error) {
    console.error("Retrieving post list failed:", error);
  } finally {
    isLoading = false;
  }
}

loadPost();

document
  .getElementById("post-list-container")
  .addEventListener("scroll", onScroll);
