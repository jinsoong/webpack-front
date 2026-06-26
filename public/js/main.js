import "../assets/css/index.css";

import { toast } from "./toast/toast.js";
import { BASE_URL, getData, postData } from "./common/fetchFunc.js";
import { modal } from "./modal/modal.js";

const mdMap = {
  toast: {
    title: "Custom Toast",
    url: "/docs/toast.md"
  },

  progress: {
    title: "Progress Toast",
    url: "/docs/progress.md"
  },

  excel: {
    title: "Excel",
    url: "/docs/excel.md"
  }
};

document.addEventListener("DOMContentLoaded", async () => {

  document.getElementById("btn-toast")?.addEventListener("click", async () => {
    toast.success("성공 상태를 표출하기 위한 toast입니다.");
    toast.error("경고, 실패 등을 표출하기 위한 toast입니다.");
    toast.info("상태를 표출하기 위한 toast입니다.");
  });

  document.getElementById("btn-sse")?.addEventListener("click", async () => {
    const toastId = toast.progress("대기중...");
    toast.setProgressColor(
      toastId,
      "#16a34a"
    );
    
    const { data } = await postData("progress/job");
    const jobId = data.jobId;

    const eventSource = new EventSource(`${BASE_URL}/progress/${jobId}`);

    eventSource.addEventListener("connect", (e) => {
      console.log("SSE connected", e.data);
    });

    eventSource.addEventListener("progress", (e) => {
      const data = JSON.parse(e.data);

      toast.update(
        toastId,
        data.percent,
        data.message
      );
    });

    eventSource.addEventListener("complete", (e) => {
      eventSource.close();

      let message = "모든 작업이 완료되었습니다.";

      try {
        const data = JSON.parse(e.data);
        message = data.message || message;
      } catch {
        // ignore
      }

      toast.complete(toastId, message);

      setTimeout(() => {
        toast.success(message);
      }, 1600);
    });

    eventSource.addEventListener("error", () => {
      eventSource.close();
      toast.fail(toastId, "작업 중 오류가 발생했습니다.");
    });

    await postData(`progress/test/${jobId}`);
  });

  // md modal open
  document.querySelectorAll(".card-button.md").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.md;
      const info = mdMap[key];
      
      if (!info) return;
      modal.openMarkdown({
        title: info.title,
        url: info.url
      });
    });
  });
});