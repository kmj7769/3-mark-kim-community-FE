function commentItem(parentId, comment) {
  document.getElementById(parentId).innerHTML += `
          <li class="comment-item">
            <img
              class="comment-profile"
              src="${comment.profileImage}"
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

export { commentItem };
