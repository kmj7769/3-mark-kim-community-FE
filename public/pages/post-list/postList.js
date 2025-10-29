import { fetchPostList } from "/api/postListApi.js";

import { postItem } from "/components/post-item/postItem.js";
import { addHeader } from "/components/layout/header/header.js";
import { addFooter } from "/components/layout/footer/footer.js";

addHeader();

addFooter();

let lastFetchId = null;
const limit = 15;

const onScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadPost();
  }
};

async function loadPost() {
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
  }
}

loadPost();

document
  .getElementById("post-list-container")
  .addEventListener("scroll", onScroll);
