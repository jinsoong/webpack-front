/**
 * toast.js
 *
 * Bootstrap 없이 사용하는 커스텀 Toast 라이브러리
 *
 * 일반 Toast:
 * toast.success("저장되었습니다.");
 * toast.error("저장 실패");
 * toast.warning("주의 메시지");
 * toast.info("안내 메시지");
 *
 * Progress Toast:
 * const toastId = toast.progress("처리 중...");
 * toast.update(toastId, 40, "공급량 분석 중...");
 * toast.complete(toastId, "완료되었습니다.");
 * toast.fail(toastId, "실패했습니다.");
 */

const toastRegistry = new Map();
let toastSequence = 0;

const TYPE_CONFIG = {
  success: {
    icon: "✓",
    color: "#16a34a",
  },
  error: {
    icon: "✕",
    color: "#dc2626",
  },
  warning: {
    icon: "!",
    color: "#f59e0b",
  },
  info: {
    icon: "ℹ",
    color: "#0284c7",
  },
  progress: {
    icon: "",
    color: "#0284c7",
  },
};

/**
 * Toast 컨테이너 생성
 * 화면 우측 상단에 Toast들이 쌓이는 영역을 만든다.
 */
const createContainer = () => {
  let container = document.getElementById("mo-toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "mo-toast-container";
    container.className = "mo-toast-container";
    document.body.appendChild(container);
  }

  return container;
};

/**
 * Toast ID 생성
 * Toast를 개별적으로 제어하기 위한 고유 ID를 만든다.
 */
const createToastId = () => {
  return `toast-${Date.now()}-${toastSequence++}`;
};

/**
 * Toast 제거
 * opacity/transform 애니메이션 후 DOM에서 제거한다.
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
 * Toast 아이콘 HTML 생성
 * 일반 Toast는 아이콘 문자, Progress Toast는 Spinner로 표시한다.
 */
const createIconHtml = (type) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  if (type === "progress") {
    return `
      <div
        class="mo-toast-spinner"
        data-toast-icon
        style="
          width:18px;
          height:18px;
          border:2px solid #dbeafe;
          border-top-color:${config.color};
          border-radius:50%;
          animation:mo-spin .8s linear infinite;
        "
      ></div>
    `;
  }

  return `
    <div
      class="mo-toast-status-icon"
      data-toast-icon
      style="
        width:24px;
        height:24px;
        border-radius:50%;
        border:1px solid ${config.color};
        color:${config.color};
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:13px;
        font-weight:bold;
        flex-shrink:0;
      "
    >
      ${config.icon}
    </div>
  `;
};

/**
 * Toast 상태 아이콘 변경
 * Progress Toast 완료/실패 시 Spinner를 ✓ 또는 ✕ 아이콘으로 변경한다.
 */
const setStatusIcon = (toastEl, type) => {
  const icon = toastEl.querySelector("[data-toast-icon]");
  const config = TYPE_CONFIG[type];

  if (!icon || !config) return;

  icon.className = "mo-toast-status-icon";
  icon.removeAttribute("style");

  icon.textContent = config.icon;

  icon.style.width = "18px";
  icon.style.height = "18px";
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";
  icon.style.borderRadius = "50%";
  icon.style.fontSize = "13px";
  icon.style.fontWeight = "bold";
  icon.style.border = `2px solid ${config.color}`;
  icon.style.color = config.color;
  icon.style.flexShrink = "0";
};

/**
 * Toast 기본 DOM 생성
 * 일반 Toast와 Progress Toast의 공통 껍데기를 만든다.
 */
const createBaseToast = ({
  type = "info",
  message = "",
}) => {
  const toastId = createToastId();
  const container = createContainer();

  const toastEl = document.createElement("div");
  toastEl.dataset.toastId = toastId;

  toastEl.style.width = "360px";
  toastEl.style.background = "#fff";
  toastEl.style.borderRadius = "12px";
  toastEl.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)";
  toastEl.style.border = "1px solid #e5e7eb";
  toastEl.style.opacity = "0";
  toastEl.style.transform = "translateX(40px)";
  toastEl.style.transition = "all .25s ease";
  toastEl.style.overflow = "hidden";

  toastEl.innerHTML = `
    <div
      style="
        display:flex;
        align-items:center;
        gap:12px;
        padding:14px 16px;
      "
    >
      ${createIconHtml(type)}

      <div
        data-toast-message
        style="
          flex:1;
          font-size:14px;
          color:#111827;
          line-height:1.45;
          font-weight:bold;
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
          color:#6b7280;
          font-weight:bold;
        "
      >
        ×
      </button>
    </div>
  `;

  container.appendChild(toastEl);
  toastRegistry.set(toastId, toastEl);

  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(0)";
  });

  toastEl
    .querySelector(".toast-close-btn")
    ?.addEventListener("click", () => {
      removeToast(toastId);
    });

  return {
    toastId,
    toastEl,
  };
};

/**
 * 일반 Toast 생성
 * success/error/warning/info에서 공통으로 사용한다.
 */
const show = (
  message,
  type = "info",
  duration = 3000
) => {
  const { toastId } = createBaseToast({
    type,
    message,
  });

  if (duration > 0) {
    setTimeout(() => {
      removeToast(toastId);
    }, duration);
  }

  return toastId;
};

/**
 * Progress Toast 생성
 * 진행률 바를 가진 Toast를 생성하고 toastId를 반환한다.
 */
const progress = (
  message = "처리 중..."
) => {
  const toastId = createToastId();
  const container = createContainer();

  const toastEl = document.createElement("div");
  toastEl.dataset.toastId = toastId;

  toastEl.style.width = "360px";
  toastEl.style.background = "#fff";
  toastEl.style.borderRadius = "12px";
  toastEl.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)";
  toastEl.style.border = "1px solid #e5e7eb";
  toastEl.style.opacity = "0";
  toastEl.style.transform = "translateX(40px)";
  toastEl.style.transition = "all .25s ease";
  toastEl.style.overflow = "hidden";

  toastEl.innerHTML = `
    <div style="padding:14px;">
      <div
        style="
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:10px;
        "
      >
        ${createIconHtml("progress")}

        <div
          data-toast-message
          style="
            flex:1;
            font-size:15px;
            font-weight:bold;
            color:#111827;
            position:relative;
            z-index:2;
          "
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
  toastRegistry.set(toastId, toastEl);

  requestAnimationFrame(() => {
    toastEl.style.opacity = "1";
    toastEl.style.transform = "translateX(0)";
  });

  return toastId;
};

/**
 * Progress Toast 진행률 갱신
 * toastId에 해당하는 Progress Bar와 메시지를 수정한다.
 */
const update = (
  toastId,
  percent,
  message
) => {
  const toastEl = toastRegistry.get(toastId);

  if (!toastEl) return;

  const bar = toastEl.querySelector("[data-toast-progress]");
  const msg = toastEl.querySelector("[data-toast-message]");

  const safePercent = Math.max(0, Math.min(Number(percent) || 0, 100));

  if (bar) {
    bar.style.width = `${safePercent}%`;
  }

  if (msg && message) {
    msg.textContent = message;
  }
};

/**
 * Progress Toast 성공 종료
 * Spinner를 성공 아이콘으로 바꾸고 100% 처리 후 제거한다.
 */
const complete = (
  toastId,
  message = "완료되었습니다."
) => {
  const toastEl = toastRegistry.get(toastId);

  if (!toastEl) return;

  update(toastId, 100, message);
  setStatusIcon(toastEl, "success");

  setTimeout(() => {
    removeToast(toastId);
  }, 1500);
};

/**
 * Progress Toast 실패 종료
 * Spinner를 실패 아이콘으로 바꾸고 Progress Bar를 빨간색으로 변경한다.
 */
const fail = (
  toastId,
  message = "오류가 발생했습니다."
) => {
  const toastEl = toastRegistry.get(toastId);

  if (!toastEl) return;

  const msg = toastEl.querySelector("[data-toast-message]");
  const bar = toastEl.querySelector("[data-toast-progress]");

  if (msg) {
    msg.textContent = message;
  }

  if (bar) {
    bar.style.width = "100%";
    bar.style.setProperty("--progress-color", TYPE_CONFIG.error.color);
  }

  setStatusIcon(toastEl, "error");

  setTimeout(() => {
    removeToast(toastId);
  }, 3000);
};

/**
 * Toast 강제 제거
 */
const dismiss = (toastId) => {
  removeToast(toastId);
};

/**
 * Progress Bar 색상 변경
 */
const setProgressColor = (
  toastId,
  color
) => {
  const toastEl = toastRegistry.get(toastId);

  if (!toastEl) return;

  const bar = toastEl.querySelector("[data-toast-progress]");

  if (!bar) return;

  bar.style.setProperty("--progress-color", color);
};

export const toast = {
  show,

  success: (message, duration) =>
    show(message, "success", duration),

  error: (message, duration) =>
    show(message, "error", duration),

  warning: (message, duration) =>
    show(message, "warning", duration),

  info: (message, duration) =>
    show(message, "info", duration),

  progress,
  update,
  complete,
  fail,
  dismiss,
  setProgressColor,
};