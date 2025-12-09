// 게시글 목록에 컴포넌트 추가
function postItem(parentId, post) {
  const profileImageSrc =
    post.profileImage && post.profileImage !== "null"
      ? post.profileImage
      : "/assets/images/default_profile_img.jpeg";

  document.getElementById(parentId).innerHTML += `
        <div class="card">
            <a href="/pages/post-detail/post_detail.html?postId=${post.postId}" />
            <div class="card-header">
                <div class="card-title">${post.title}</div>
                <div class="card-meta">
                <span>좋아요 ${post.likeCount}</span>
                <span>댓글 ${post.commentCount}</span>
                <span>조회수 ${post.viewCount}</span>
                </div>
                <div class="card-date">${post.createdAt}</div>
            </div>
            <div class="card-author">
                <img class="card-profile" src="${profileImageSrc}" alt="프로필 이미지" />
                <span class="card-author-name">${post.userNickname}</span>
            </div>
        </div>
    `;
}

export { postItem };
