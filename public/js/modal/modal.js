const modalRegistry = new Map();
let modalSequence = 0;
import { marked } from "marked";


const createModal = ({
  title = "제목",
  content = "",
  width = "760px",
  closeOnBackdrop = true
}) => {
  const modalId = `mo-modal-${Date.now()}-${modalSequence++}`;

  const backdrop = document.createElement("div");
  backdrop.className = "mo-modal-backdrop";
  backdrop.dataset.modalId = modalId;

  const modal = document.createElement("div");
  modal.className = "mo-modal";
  modal.style.maxWidth = width;

  modal.innerHTML = `
    <div class="mo-modal-header">
      <h2 class="mo-modal-title">${title}</h2>
      <button type="button" class="mo-modal-close" aria-label="닫기">×</button>
    </div>

    <div class="mo-modal-body">
      ${content}
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  modalRegistry.set(modalId, backdrop);

  requestAnimationFrame(() => {
    backdrop.classList.add("show");
    modal.classList.add("show");
  });

  const closeButton = modal.querySelector(".mo-modal-close");
  closeButton?.addEventListener("click", () => {
    close(modalId);
  });

  if (closeOnBackdrop) {
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        close(modalId);
      }
    });
  }

  return modalId;
};

const close = (modalId) => {
  const backdrop = modalRegistry.get(modalId);
  if (!backdrop) return;

  const modal = backdrop.querySelector(".mo-modal");

  backdrop.classList.remove("show");
  modal?.classList.remove("show");

  setTimeout(() => {
    backdrop.remove();
    modalRegistry.delete(modalId);
  }, 220);
};

const open = (options) => {
  return createModal(options);
};

const alert = (message, title = "알림") => {
  return createModal({
    title,
    content: `<p class="mo-modal-text">${message}</p>`,
    width: "520px"
  });
};

const openMarkdown = async ({
  title = "문서",
  url
}) => {
  const modalId = createModal({
    title,
    content: `<div class="mo-modal-loading">문서를 불러오는 중...</div>`,
    width: "900px"
  });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("문서를 불러오지 못했습니다.");
    }

    const markdown = await response.text();

    const backdrop = modalRegistry.get(modalId);
    const body = backdrop?.querySelector(".mo-modal-body");

    if (!body) return modalId;

    const renderRaw = () => {
      body.querySelector("[data-md-content]").innerHTML = `
        <pre class="mo-markdown-viewer">${escapeHtml(markdown)}</pre>
      `;
    };

    const renderView = () => {
      body.querySelector("[data-md-content]").innerHTML = `
        <div class="mo-markdown-rendered">
          ${marked.parse(markdown)}
        </div>
      `;
    };

    body.innerHTML = `
      <div class="mo-md-toolbar">
        <button type="button" class="mo-md-tab active" data-md-mode="view">
          뷰어
        </button>
        <button type="button" class="mo-md-tab" data-md-mode="raw">
          원문
        </button>
      </div>

      <div class="mo-md-content" data-md-content></div>
    `;

    const tabs = body.querySelectorAll("[data-md-mode]");

    tabs.forEach((button) => {
      button.addEventListener("click", () => {
        tabs.forEach((tab) => tab.classList.remove("active"));
        button.classList.add("active");

        const mode = button.dataset.mdMode;

        if (mode === "raw") {
          renderRaw();
        } else {
          renderView();
        }
      });
    });

    renderView();

  } catch (error) {
    const backdrop = modalRegistry.get(modalId);
    const body = backdrop?.querySelector(".mo-modal-body");

    if (body) {
      body.innerHTML = `
        <p class="mo-modal-error">${error.message}</p>
      `;
    }
  }

  return modalId;
};

const escapeHtml = (value) => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const modal = {
  open,
  close,
  alert,
  openMarkdown
};