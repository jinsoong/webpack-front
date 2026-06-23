# Backend Lab

Spring Boot 기반 공통 기능 테스트 프로젝트

---

## 프로젝트 소개

업무 시스템 개발 중 자주 사용하는 공통 기능들을 독립적으로 테스트하기 위한 프로젝트입니다.

실제 업무 프로젝트에 적용하기 전에 기능을 검증하고 재사용 가능한 형태로 정리하는 것을 목적으로 합니다.

현재 구현 및 테스트 대상

- SSE(Server Sent Events)
- Progress Bar
- Job 기반 비동기 처리
- Custom Toast 연동
- Scheduler
- Excel Export
- 공통 API 응답 구조

---

## 기술 스택

### Backend

- Java 17
- Spring Boot
- Gradle
- Lombok
- Swagger(OpenAPI)

### Frontend

- JavaScript
- Webpack
- Custom Toast

---

## 프로젝트 구조

```text
src/main/java

├── common
│   ├── config
│   ├── exception
│   └── response
│
├── progress
│   ├── controller
│   │   └── JobProgressController
│   └── service
│       └── SseProgressService
│
├── scheduler
│
├── excel
│
└── sample
```

---

## SSE Progress 구조

### 1. Job 생성

```http
POST /api/v1/progress/job
```

응답

```json
{
  "jobId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

---

### 2. SSE 연결

```http
GET /api/v1/progress/{jobId}
```

서버에서 SseEmitter 등록

```java
SseEmitter emitter = sseProgressService.register(jobId);
```

---

### 3. 작업 실행

```http
POST /api/v1/progress/test/{jobId}
```

비동기 작업 수행

```java
CompletableFuture.runAsync(...)
```

---

### 4. 진행률 전송

```java
sseProgressService.send(
    jobId,
    step,
    totalSteps,
    message
);
```

예시

```json
{
  "step": 2,
  "totalSteps": 5,
  "percent": 40,
  "message": "누수검토 중..."
}
```

---

### 5. 완료

```java
sseProgressService.complete(
    jobId,
    "모든 작업이 완료되었습니다."
);
```

---

## Progress 처리 흐름

```text
사용자
    │
    ▼
Job 생성
    │
    ▼
SSE 연결
    │
    ▼
비동기 작업 실행
    │
    ▼
Progress 전송
    │
    ▼
Progress 전송
    │
    ▼
Progress 전송
    │
    ▼
Complete
    │
    ▼
Toast 완료 표시
```

---

## Swagger

접속 URL

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI 문서를 통해 API 테스트 가능

---

## 실행 방법

### 프로젝트 실행

```bash
./gradlew bootRun
```

또는

```bash
gradlew bootRun
```

---

### 빌드

```bash
./gradlew build
```

---

## 향후 추가 예정

- SSE 다중 Job 처리
- Scheduler 테스트
- Excel Export
- 파일 업로드
- WebSocket 비교 테스트
- AI 분석 Job Progress 연동

---

## 작성 목적

실제 업무 프로젝트에 적용하기 전 기능을 독립적으로 검증하고,
재사용 가능한 공통 모듈로 발전시키기 위한 테스트 환경