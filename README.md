# Webpack Front

Webpack 기반 Front-End 공통 기능 테스트 프로젝트

---

## 프로젝트 소개

업무 시스템에서 자주 사용하는 프론트엔드 공통 기능을 테스트하고 정리하기 위한 프로젝트입니다.

현재는 Spring Boot 백엔드 테스트 서버와 연동하여 다음 기능을 검증합니다.

- Custom Toast
- Progress Toast
- SSE(Server-Sent Events) Progress 연동
- Job 기반 비동기 진행률 표시
- 공통 Fetch 함수
- Webpack 기반 정적 프론트 구성

---

## 기술 스택

- JavaScript
- HTML
- CSS
- Webpack 5
- Webpack Dev Server
- Custom Toast
- Server-Sent Events

---

## 프로젝트 구조

```text
webpack-front

├── public
│   ├── assets
│   │   ├── css
│   │   │   ├── common.css
│   │   │   └── toast_common.css
│   │   └── image
│   │
│   ├── js
│   │   ├── main.js
│   │   ├── fetchFunc.js
│   │   └── toast_common.js
│   │
│   ├── page
│   │
│   └── index.html
│
├── index.js
├── package.json
├── package-lock.json
└── webpack.config.js