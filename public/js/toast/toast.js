/**
 * customToast.js
 *
 * Bootstrap 없이 사용하는 커스텀 Toast 라이브러리
 */

/**
 * 사용 예시

  const toastId = toast.progress("종합분석 실행 중...");
  toast.update(toastId, 40, "공급량 분석 중...");

  toast.complete(toastId, "완료되었습니다.");
  toast.fail(toastId, "실패했습니다.");
  toast.success("저장되었습니다.");
  toast.error("저장 실패");
*/

const toastRegistry = new Map();
let toastSequence = 0;

/**
 * Toast가 없을 경우 컨테이너 생성
 */
const createContainer = () => {
  let container = document.getElementById("mo-toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "mo-toast-container";

    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "99999";

    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    document.body.appendChild(container);
  }

  return container;
};


/**
 * 내부 Toast 제거
 */
const removeToast = (toastId) => {
  const toastEl = toastRegistry.get(toastId);

  if (!toastEl) return;

  toastEl.style.opacity = "0";
  toastEl.style.transform = "translateX(40px)";

  setTimeout(() => {
    toastEl.remove();
    toastRegistry.delete(toastId);
  }, 250);
};

/**
 * Toast 생성
 */
const createToast = ({
  message,
  type = "info",
  duration = 3000
}) => {

  const toastId =
    `toast-${Date.now()}-${toastSequence++}`;

  const container =
    createContainer();

  const toastEl =
    document.createElement("div");

  toastEl.dataset.toastId = toastId;

  toastEl.style.width = "360px";
  toastEl.style.background = "#fff";
  toastEl.style.borderRadius = "12px";
  toastEl.style.boxShadow =
    "0 8px 24px rgba(0,0,0,.12)";
  toastEl.style.border =
    "1px solid #e5e7eb";

  toastEl.style.opacity = "0";
  toastEl.style.transform =
    "translateX(40px)";
  toastEl.style.transition =
    "all .25s ease";

  const icon =
    type === "success"
      ? "✓"
      : type === "error"
      ? "✕"
      : type === "warning"
      ? "!"
      : "ℹ";

  toastEl.innerHTML = `
    <div
      style="
        display:flex;
        align-items:center;
        gap:12px;
        padding:14px 16px;
      "
    >
      <div
        style="
          width:24px;
          height:24px;
          border-radius:50%;
          border:1px solid #0284c7;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:13px;
          font-weight:bold;
        "
      >
        ${icon}
      </div>

      <div
        style="
          flex:1;
          font-size:14px;
        "
      >
        ${message}
      </div>

      <button
        class="toast-close-btn"
        style="
          border:0;
          background:none;
          cursor:pointer;
          font-size:18px;
        "
      >
        ×
      </button>
    </div>
  `;

  container.appendChild(toastEl);

  toastRegistry.set(
    toastId,
    toastEl
  );

  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform =
      "translateX(0)";
  });

  toastEl
    .querySelector(".toast-close-btn")
    ?.addEventListener("click", () => {
      removeToast(toastId);
    });

  if (duration > 0) {
    setTimeout(() => {
      removeToast(toastId);
    }, duration);
  }

  return toastId;
};

/**
 * 일반 Toast
 */
const show = (
  message,
  type = "info",
  duration = 3000
) => {
  return createToast({
    message,
    type,
    duration
  });
};

/**
 * Progress Toast 생성
 */
const progress = (
  message = "처리 중..."
) => {

  const toastId =
    `toast-${Date.now()}-${toastSequence++}`;

  const container =
    createContainer();

  const toastEl =
    document.createElement("div");

  toastEl.dataset.toastId = toastId;

  toastEl.style.width = "360px";
  toastEl.style.background = "#fff";
  toastEl.style.borderRadius = "12px";
  toastEl.style.boxShadow =
    "0 8px 24px rgba(0,0,0,.12)";
  toastEl.style.border =
    "1px solid #e5e7eb";

  toastEl.style.opacity = "0";
  toastEl.style.transform =
    "translateX(40px)";
  toastEl.style.transition =
    "all .25s ease";

  toastEl.innerHTML = `
    <div
      style="
        padding:14px;
      "
    >
      <div
        style="
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:10px;
        "
      >
        <div
          class="mo-toast-spinner"
          style="
            width:18px;
            height:18px;
            border:2px solid #dbeafe;
            border-top-color:#0284c7;
            border-radius:50%;
            animation:mo-spin .8s linear infinite;
          "
        ></div>

        <div
          data-toast-message
          style="flex:1;font-size:15px;font-weight:bold;"
        >
          ${message}
        </div>
      </div>

      <div
        style="
          height:8px;
          background:#e5e7eb;
          border-radius:999px;
          overflow:hidden;
        "
      >
        <div
          class="mo-progress-bar-custom"
          data-toast-progress
          style="
            width:0%;
            height:100%;
            transition:width .4s ease;
          "
        ></div>
      </div>
    </div>
  `;

  container.appendChild(toastEl);

  toastRegistry.set(
    toastId,
    toastEl
  );

  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform =
      "translateX(0)";
  });

  return toastId;
};

/**
 * 진행률 갱신
 */
const update = (
  toastId,
  percent,
  message
) => {

  const toastEl =
    toastRegistry.get(toastId);

  if (!toastEl) return;

  const bar =
    toastEl.querySelector(
      "[data-toast-progress]"
    );

  const msg =
    toastEl.querySelector(
      "[data-toast-message]"
    );

  if (bar) {
    bar.style.width =
      `${percent}%`;
  }

  if (msg && message) {
    msg.textContent =
      message;
  }
};

/**
 * 성공 종료
 */
const complete = (
  toastId,
  message = "완료되었습니다."
) => {

  update(
    toastId,
    100,
    message
  );

  setTimeout(() => {
    removeToast(toastId);
  }, 1500);
};

/**
 * 실패 종료
 */
const fail = (
  toastId,
  message = "오류가 발생했습니다."
) => {

  const toastEl =
    toastRegistry.get(toastId);

  if (!toastEl) {
    show(message, "error");
    return;
  }

  const msg =
    toastEl.querySelector(
      "[data-toast-message]"
    );

  if (msg) {
    msg.textContent =
      message;
  }

  setTimeout(() => {
    removeToast(toastId);
  }, 3000);
};

/**
 * 외부에서 강제 제거
 */
const dismiss = (
  toastId
) => {
  removeToast(toastId);
};

/**
 * progressBar 색상 변경
 */
const setProgressColor = (
  toastId,
  color
) => {

  const toastEl =
    toastRegistry.get(toastId);

  if (!toastEl) return;

  const bar =
    toastEl.querySelector(
      "[data-toast-progress]"
    );

  if (!bar) return;

  bar.style.setProperty(
    "--progress-color",
    color
  );
};


export const toast = {
  show,
  success: (msg, d) =>
    show(msg, "success", d),

  error: (msg, d) =>
    show(msg, "error", d),

  warning: (msg, d) =>
    show(msg, "warning", d),

  info: (msg, d) =>
    show(msg, "info", d),

  progress,
  update,
  complete,
  fail,
  dismiss,
  setProgressColor
};