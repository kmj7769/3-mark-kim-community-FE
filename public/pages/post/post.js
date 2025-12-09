import { fetchUploadPost } from "/api/postApi.js";
import { addHeader } from "/components/layout/header/header.js";
import { addFooter } from "/components/layout/footer/footer.js";

// 레이아웃 로드
addHeader();
addFooter();

// 상태 관리: 선택된 파일들을 저장할 배열
let selectedFiles = [];

const fileInput = document.getElementById("file-input");
const previewList = document.getElementById("image-preview-list");
const countSpan = document.getElementById("current-img-count");
const submitBtn = document.getElementById("submit-btn");

// 이미지 미리보기 렌더링 함수
function renderPreviews() {
  previewList.innerHTML = "";
  
  selectedFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "preview-item";
    
    // 이미지 썸네일
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = "preview";
    img.onload = () => URL.revokeObjectURL(img.src); // 메모리 해제
    
    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "preview-delete-btn";
    deleteBtn.innerHTML = "&times;"; // X 문자
    deleteBtn.onclick = () => removeFile(index);

    item.appendChild(img);
    item.appendChild(deleteBtn);
    previewList.appendChild(item);
  });

  updateCount();
}

// 파일 삭제 함수
function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderPreviews();
}

// 카운트 업데이트
function updateCount() {
  countSpan.textContent = selectedFiles.length;
  // 10장이 꽉 차면 추가 버튼 비활성화 처리 등을 할 수도 있음
}

// 파일 선택 이벤트 핸들러
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  
  if (selectedFiles.length + files.length > 10) {
    alert("이미지는 최대 10장까지 업로드할 수 있습니다.");
    return;
  }

  // 중복 파일 체크 로직이 필요하다면 여기에 추가
  selectedFiles = [...selectedFiles, ...files];
  renderPreviews();
  
  // input value 초기화 (같은 파일을 다시 선택해도 이벤트 발생하도록)
  e.target.value = "";
});

// 게시글 등록 핸들러
submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title) {
    alert("제목을 입력해주세요.");
    document.getElementById("post-title").focus();
    return;
  }
  if (!content) {
    alert("내용을 입력해주세요.");
    document.getElementById("post-content").focus();
    return;
  }

  // FormData 생성
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  
  // 이미지 파일들 추가
  selectedFiles.forEach((file) => {
    formData.append("images", file); 
    // 백엔드에서 받는 키값(예: "images" 또는 "files")에 맞춰 수정 필요
  });

  try {
    submitBtn.disabled = true; // 중복 클릭 방지
    submitBtn.textContent = "등록 중...";

    const response = await fetchUploadPost(formData);

    if (response.code === 201 || response.code === 200) {
      alert("게시글이 등록되었습니다.");
      window.location.href = "/pages/post-list/post_list.html"; // 목록 페이지로 이동
    } else {
      console.error("Upload failed:", response);
      alert("게시글 등록에 실패했습니다.");
      submitBtn.disabled = false;
      submitBtn.textContent = "등록하기";
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("오류가 발생했습니다.");
    submitBtn.disabled = false;
    submitBtn.textContent = "등록하기";
  }
});