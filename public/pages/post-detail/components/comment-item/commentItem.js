// function commentItemTemplate(comment) {
//   return `
//       <li class="comment-item ${
//         comment.canEdit || comment.canDelete ? "editable-comment" : ""
//       }">
//         <img
//           class="comment-profile"
//           src="${
//             comment.profileImage === null ||
//             comment.profileImage === undefined ||
//             comment.profileImage === "null" ||
//             comment.profileImage.trim() === ""
//               ? "/assets/images/default_profile_img.jpeg"
//               : comment.profileImage
//           }"
//           alt="프로필 이미지"
//         />
//         <div class="comment-body">
//           <div class="comment-info">
//             <span class="comment-author">${comment.userNickname}</span>
//             <span class="comment-date">${comment.modifiedAt}</span>
//           </div>
//           <div class="comment-content">${comment.content}</div>
//         </div>
//         <div class="comment-action-btns">
//           ${
//             comment.canEdit
//               ? '<button class="comment-edit-btn">수정</button>'
//               : ""
//           }
//           ${
//             comment.canDelete
//               ? '<button class="comment-delete-btn">삭제</button>'
//               : ""
//           }
//         </div>
//       </li>
//     `;
// }

// function commentItem(parentId, comment) {
//   document.getElementById(parentId).innerHTML += commentItemTemplate(comment);
// }

// function addCommentItemFront(parentId, comment) {
//   const container = document.getElementById(parentId);
//   container.insertBefore(commentItemTemplate(comment), container.firstChild);
// }

// export { commentItem, addCommentItemFront };

import { fetchPatchComment, fetchDeleteComment } from "/api/commentApi.js"; // API 임포트

// 날짜 포맷팅 등 유틸 함수가 있다면 사용, 없으면 그대로 사용

function createCommentElement(comment, postId) {
  const li = document.createElement("li");
  li.className = `comment-item ${
    comment.canEdit || comment.canDelete ? "editable-comment" : ""
  }`;
  li.dataset.commentId = comment.commentId; // ID 저장

  // 기본 HTML 구조 삽입
  li.innerHTML = `
    <img
      class="comment-profile"
      src="${
        !comment.profileImage || comment.profileImage === "null"
          ? "/assets/images/default_profile_img.jpeg"
          : comment.profileImage
      }"
      alt="프로필"
    />
    <div class="comment-body">
      <div class="comment-info">
        <span class="comment-author">${comment.userNickname}</span>
        <span class="comment-date">${comment.modifiedAt}</span>
      </div>
      <div class="comment-content">${comment.content}</div>
    </div>
    <div class="comment-action-btns">
      ${comment.canEdit ? '<button class="comment-edit-btn">수정</button>' : ""}
      ${
        comment.canDelete
          ? '<button class="comment-delete-btn">삭제</button>'
          : ""
      }
    </div>
  `;

  // --- 이벤트 리스너 등록 ---

  // 1. 수정 버튼 클릭 이벤트
  const editBtn = li.querySelector(".comment-edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      enableEditMode(li, comment, postId);
    });
  }

  // 2. 삭제 버튼 클릭 이벤트 (필요시 구현)
  const deleteBtn = li.querySelector(".comment-delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
        return;
      }

      try {
        // 2) API 호출
        const result = await fetchDeleteComment(postId, comment.commentId);

        // 3) 성공 시 처리 (서버 응답 코드 200 가정)
        if (result.code === 200) {
          // DOM에서 해당 댓글 요소(li) 제거
          li.remove();

          // 댓글 개수 카운트 감소 (UI 업데이트)
          const countEl = document.getElementById("comment-count");
          if (countEl) {
            const currentCount =
              parseInt(countEl.textContent.replace(/[^0-9]/g, ""), 10) || 0;
            countEl.textContent = Math.max(0, currentCount - 1);
          }

          alert("댓글이 삭제되었습니다.");
        } else {
          // 실패 시 에러 메시지
          console.error("Delete failed:", result);
          alert("댓글 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("오류가 발생했습니다.");
      }
    });
  }

  return li;
}

/**
 * 수정 모드로 전환하는 함수
 */
function enableEditMode(li, comment, postId) {
  const contentEl = li.querySelector(".comment-content");
  const actionBtnsEl = li.querySelector(".comment-action-btns");
  const bodyEl = li.querySelector(".comment-body");

  // 기존 뷰 숨기기
  contentEl.classList.add("hidden");
  actionBtnsEl.classList.add("hidden"); // 우측 하단 수정/삭제 버튼 숨김

  // 수정 입력창 UI 생성
  const editBox = document.createElement("div");
  editBox.className = "comment-edit-box";
  editBox.innerHTML = `
    <textarea class="comment-edit-textarea"></textarea>
    <div class="comment-edit-actions">
      <button class="edit-cancel-btn">취소</button>
      <button class="edit-confirm-btn" disabled>수정</button>
    </div>
  `;

  // Textarea 초기값 설정
  const textarea = editBox.querySelector(".comment-edit-textarea");
  textarea.value = comment.content; // 현재 내용 채우기

  // DOM에 추가 (comment-body 내부, content 바로 뒤)
  bodyEl.appendChild(editBox);
  textarea.focus();

  const confirmBtn = editBox.querySelector(".edit-confirm-btn");
  const cancelBtn = editBox.querySelector(".edit-cancel-btn");

  // [이벤트] 입력값 변경 감지 (수정 버튼 활성화/비활성화)
  textarea.addEventListener("input", () => {
    const currentVal = textarea.value.trim();
    const originalVal = comment.content.trim();

    // 내용이 있고, 원래 내용과 다를 때만 버튼 활성화
    if (currentVal.length > 0 && currentVal !== originalVal) {
      confirmBtn.disabled = false;
    } else {
      confirmBtn.disabled = true;
    }
  });

  // [이벤트] 취소 버튼 클릭
  cancelBtn.addEventListener("click", () => {
    editBox.remove(); // 수정창 제거
    contentEl.classList.remove("hidden"); // 원래 텍스트 복구
    actionBtnsEl.classList.remove("hidden"); // 원래 버튼 복구
  });

  // [이벤트] 수정 완료(전송) 버튼 클릭
  confirmBtn.addEventListener("click", async () => {
    const newContent = textarea.value.trim();

    try {
      // API 호출
      const result = await fetchPatchComment(
        postId,
        comment.commentId,
        newContent
      );

      if (result.code === 200) {
        // 성공 시 (서버 응답 코드에 맞게 수정)
        // 1. 데이터 업데이트
        comment.content = newContent;

        // 2. UI 업데이트
        contentEl.textContent = newContent;

        // 3. 수정창 제거 및 뷰 복구
        editBox.remove();
        contentEl.classList.remove("hidden");
        actionBtnsEl.classList.remove("hidden");
      } else {
        alert("댓글 수정에 실패했습니다.");
        console.error(result);
      }
    } catch (error) {
      console.error("Update comment failed:", error);
      alert("오류가 발생했습니다.");
    }
  });
}

// 기존 함수들을 createCommentElement를 사용하도록 수정
function commentItem(parentId, comment, postId) {
  const container = document.getElementById(parentId);
  const element = createCommentElement(comment, postId);
  container.appendChild(element); // innerHTML += 대신 appendChild 사용
}

function addCommentItemFront(parentId, comment, postId) {
  const container = document.getElementById(parentId);
  const element = createCommentElement(comment, postId);
  container.insertBefore(element, container.firstChild); // prepend
}

export { commentItem, addCommentItemFront };
