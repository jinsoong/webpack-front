# SSE Progress Front

프론트엔드에서 `EventSource`와 `Progress Toast`를 이용하여 백엔드 작업 진행률을 실시간으로 표시하는 기능이다.

---

## 1. 목적

백엔드에서 오래 걸리는 작업이 실행될 때 사용자가 진행 상태를 알 수 있도록 Progress Toast를 표시한다.

예시 작업:

- 분석 실행
- 저장 후 재계산
- 엑셀 생성
- 파일 처리
- 배치 테스트

---

## 2. 사용 흐름

```text
버튼 클릭
  ↓
Progress Toast 생성
  ↓
백엔드에서 jobId 생성
  ↓
EventSource로 SSE 연결
  ↓
작업 API 호출
  ↓
progress 이벤트 수신
  ↓
toast.update()
  ↓
complete 이벤트 수신
  ↓
toast.complete()