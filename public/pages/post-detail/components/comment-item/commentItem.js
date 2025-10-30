function commentItemTemplate(comment) {
  return `
          <li class="comment-item">
            <img
              class="comment-profile"
              src="${
                comment.profileImage === null ||
                comment.profileImage === undefined ||
                comment.profileImage === "null" ||
                comment.profileImage.trim() === ""
                  ? "/assets/images/default_profile_img.jpeg"
                  : comment.profileImage
              }"
              alt="프로필 이미지"
            />
            <div class="comment-body">
              <div class="comment-info">
                <span class="comment-author">${comment.userNickname}</span>
                <span class="comment-date">${comment.modifiedAt}</span>
              </div>
              <div class="comment-content">${comment.content}</div>
              <div class="comment-action-btns">
                <button class="comment-edit-btn">수정</button>
                <button class="comment-delete-btn">삭제</button>
              </div>
            </div>
          </li>
    `;
}

function commentItem(parentId, comment) {
  document.getElementById(parentId).innerHTML += commentItemTemplate(comment);
}

function addCommentItemFront(parentId, comment) {
  const container = document.getElementById(parentId);
  container.insertBefore(commentItemTemplate(comment), container.firstChild);
}

export { commentItem, addCommentItemFront };
