# Custom Toast

Bootstrap 없이 JavaScript와 CSS만으로 구현한 커스텀 Toast 라이브러리이다.  
일반 알림 Toast와 Progress Bar Toast를 지원한다.

---

## 1. 주요 기능

- 일반 Toast 표시
- 성공/오류/경고/정보 Toast 표시
- Progress Toast 생성
- Progress Bar 진행률 갱신
- 완료/실패 처리
- Progress Bar 색상 변경
- Toast 수동 제거

---

## 2. 기본 사용법

```javascript
import { toast } from "./toast/toast.js";
```

### 일반 Toast

```javascript
toast.success("저장되었습니다.");
toast.error("저장 실패");
toast.warning("주의가 필요합니다.");
toast.info("안내 메시지입니다.");
```

---

## 3. Progress Toast 사용법

```javascript
const toastId = toast.progress("대기중...");

toast.update(toastId, 40, "공급량 분석 중...");

toast.complete(toastId, "완료되었습니다.");
```

실패 처리:

```javascript
toast.fail(toastId, "작업 중 오류가 발생했습니다.");
```

---

## 4. Progress Bar 색상 변경

```javascript
const toastId = toast.progress("작업 진행 중...");

toast.setProgressColor(toastId, "#16a34a");
```

---

## 5. 함수 설명

| 함수 | 설명 |
|---|---|
| `toast.show(message, type, duration)` | 일반 Toast 생성 |
| `toast.success(message)` | 성공 Toast 생성 |
| `toast.error(message)` | 오류 Toast 생성 |
| `toast.warning(message)` | 경고 Toast 생성 |
| `toast.info(message)` | 정보 Toast 생성 |
| `toast.progress(message)` | Progress Toast 생성 후 toastId 반환 |
| `toast.update(toastId, percent, message)` | 진행률과 메시지 갱신 |
| `toast.complete(toastId, message)` | Progress Toast 완료 처리 |
| `toast.fail(toastId, message)` | Progress Toast 실패 처리 |
| `toast.dismiss(toastId)` | Toast 수동 제거 |
| `toast.setProgressColor(toastId, color)` | Progress Bar 색상 변경 |

---

## 6. 동작 흐름

```text
toast.progress()
    ↓
Toast ID 생성
    ↓
Progress Toast HTML 생성
    ↓
toastRegistry에 저장
    ↓
toast.update()로 진행률 갱신
    ↓
toast.complete() 또는 toast.fail()
    ↓
Toast 제거
```

---

## 7. 특징

`toastRegistry` Map을 이용하여 생성된 Toast를 관리한다.  
Progress Toast는 `toastId`를 기준으로 특정 Toast의 메시지와 Progress Bar 상태를 갱신한다.