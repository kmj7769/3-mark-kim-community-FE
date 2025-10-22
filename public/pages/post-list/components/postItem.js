// 게시글 목록에 컴포넌트 추가
function postItem(post) {
  document.getElementById("post-list-container").innerHTML += `
        <div class="card">
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
                <img class="card-profile" src="${post.profileImage}" alt="프로필 이미지" />
                <span class="card-author-name">${post.userNickname}</span>
            </div>
        </div>
    `;
}

export { postItem };
