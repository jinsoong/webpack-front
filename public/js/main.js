import "../assets/css/index.css";

import { toast } from "./toast/toast.js";
import { BASE_URL, getData, postData } from "./common/fetchFunc.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("btn-toast")?.addEventListener("click", async () => {
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
});