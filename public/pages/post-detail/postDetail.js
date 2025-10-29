import { fetchPostDetail } from "/api/postDetailApi.js";
import { fetchCommentList } from "/api/commentListApi.js";

import { addHeader } from "/components/layout/header/header.js";
import { addFooter } from "/components/layout/footer/footer.js";
import { commentItem } from "/pages/post-detail/components/comment-item/commentItem.js";

// 게시글 목록 페이지에서 클릭된 게시글의 id를 가져오는 함수
function getPostIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("postId");
}

// 게시글 상세 조회 api를 호출하고 상세 정보를 반환하는 함수
async function getPostDetail(postId) {
  try {
    const result = await fetchPostDetail(
      postId,
      window.sessionStorage.getItem("userId")
    );

    if (result.code !== 200) {
      console.error("Loading post detail failed:", result);
      return;
    }

    return result.data;
  } catch (error) {
    console.error("Loading post detail error:", error);
  }
}

// html에 게시글 상세 정보를 동적으로 삽입
function renderPostDetail(data) {
  document.getElementById("post-author-name").textContent = data.userNickname;
  document.getElementById("post-date").textContent = data.createdAt;
  document.getElementById("post-title").textContent = data.title;
  document.getElementById("post-content").textContent = data.content;

  // 프로필 이미지 (null 처리)
  const profileImg = document.getElementById("post-profile-img");
  profileImg.src = data.profileImage
    ? data.profileImage
    : "/assets/images/default_profile_img.jpeg";

  // 게시글 이미지 (최대 1장, 없으면 숨김)
  const imageContainer = document.getElementById("post-image-container");
  imageContainer.innerHTML = "";
  if (data.images && data.images.length > 0) {
    imageContainer.style.display = "flex";
    const img = document.createElement("img");
    img.className = "post-detail-image";
    img.src = data.images[0];
    img.alt = "게시글 이미지";
    imageContainer.appendChild(img);
  } else {
    imageContainer.style.display = "none";
  }

  // 좋아요, 댓글, 조회수
  document.getElementById("like-count").textContent = data.likeCount;
  document.getElementById("comment-count").textContent = data.commentCount;
  document.getElementById("view-count").textContent = data.viewCount;

  // 수정, 삭제 버튼 표시 여부
  document.getElementById("post-edit-btn").style.display = data.canEdit
    ? "inline-block"
    : "none";
  document.getElementById("post-delete-btn").style.display = data.canDelete
    ? "inline-block"
    : "none";

  // 좋아요 버튼 스타일 (예시, 상태에 따라 class 바꾸기)
  const likeBtn = document.getElementById("like-btn");
  if (data.liked) {
    likeBtn.classList.add("liked");
  } else {
    likeBtn.classList.remove("liked");
  }
}

let lastFetchId = null;
const limit = 5;

const onScroll = (e, postId) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadComment(postId);
  }
};

async function loadComment(postId) {
  try {
    const result = await fetchCommentList(
      postId,
      window.sessionStorage.getItem("userId"),
      lastFetchId,
      limit
    );

    await result.data.comments.forEach((comment) => {
      commentItem("comment-list-container", comment);
    });

    if (result.data.lastFetchId == null) {
      document
        .getElementById("comment-list-container")
        .removeEventListener("scroll", onScroll);
    } else {
      lastFetchId = result.data.lastFetchId;
    }
  } catch (error) {
    console.error("Retrieving comment list failed:", error);
  }
}

addHeader();
addFooter();

const postId = getPostIdFromQuery();

const postDetail = await getPostDetail(postId);

renderPostDetail(postDetail);

loadComment(postId);

document
  .getElementById("comment-list-container")
  .addEventListener("scroll", (e) => onScroll(e, postId));

export { getPostDetail };
