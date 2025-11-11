# Vmonster 비디오 챗 데모

네이버 클라우드용 Vmonster AI Avatar 비디오 챗 데모 프로젝트입니다.

## 개요

이 프로젝트는 Vmonster의 AI Avatar와 실시간 비디오 채팅 기능을 구현한 Next.js 14 기반 데모 애플리케이션입니다. `vmonster-streaming-js` 패키지를 활용하여 AI 아바타와의 자연스러운 대화 및 음성 인터랙션을 제공합니다.

## 주요 기능

- 실시간 AI Avatar 비디오 스트리밍
- 음성 인식 및 VAD (Voice Activity Detection)
- 텍스트 및 음성 기반 대화
- 타임아웃 로직(클라이언트 사이드)
- 대화 기록 추적

## 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

**⚠️ 중요: API 키 보안**

프로젝트 루트에 `.env` 파일을 생성하고 아래 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_VMONSTER_API_URL=your_api_url
NEXT_PUBLIC_AI_AVATAR_ID=your_avatar_id
VMONSTER_API_KEY=your_api_key
```

**보안 주의사항:**

- `VMONSTER_API_KEY`는 반드시 서버 사이드에서만 사용되어야 합니다
- 이 API 키는 `app/api/streams/route.ts`에서 스트림 생성 요청 시에만 사용됩니다
- 클라이언트에 노출되지 않도록 `NEXT_PUBLIC_` 접두사를 사용하지 마세요
- API 키가 클라이언트 번들에 포함되지 않도록 주의하세요

### 실행

개발 서버 실행:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 데모를 확인하세요.

프로덕션 빌드:

```bash
npm run build
npm start
```

## 프로젝트 구조

```
.
├── app/
│   ├── api/
│   │   └── streams/
│   │       └── route.ts           # 서버 사이드 스트림 생성 API
│   ├── hooks/                     # 커스텀 훅 모음
│   │   ├── useAIAvatar.ts        # vmonster-streaming-js 패키지 직접 사용
│   │   ├── useVideoChat.ts       # UI 조작 및 유저 인터랙션 관리
│   │   ├── useAskUserAudioPermission.ts
│   │   ├── useTimer.ts
│   │   ├── useTypingEffectByCharacter.ts
│   │   ├── useTypingEffectBySentence.ts
│   │   ├── video-chat-types.ts   # TypeScript 타입 정의
│   │   └── constants.ts
│   └── page.tsx                  # 메인 데모 UI
├── public/
├── .env                          # 환경 변수 (생성 필요)
├── next.config.js
├── package.json
└── tsconfig.json
```

## 핵심 컴포넌트 설명

### 1. `page.tsx` - 메인 UI

비디오 챗 데모의 메인 인터페이스를 제공합니다.

- AI Avatar 비디오 렌더링
- 대화 입력 및 제어 버튼
- 실시간 상태 표시
- 대화 기록 표시

### 2. Custom Hooks

#### `useAIAvatar.ts`

- **역할**: `vmonster-streaming-js` 패키지를 직접 사용하는 저수준 훅
- **주요 기능**:
  - Vmonster Room 연결 관리
  - 스트림 생성 및 제어
  - WebRTC 통신 처리
  - 음성/비디오 트랙 관리

#### `useVideoChat.ts`

- **역할**: UI 조작 및 유저 인터랙션을 위한 고수준 훅
- **주요 기능**:
  - 사용자 친화적인 API 제공
  - 메시지 상태 관리
  - 세션 상태 추적
  - 음성 권한 관리
  - 타이핑 효과 적용

### 3. `app/api/streams/route.ts`

서버 사이드 API 엔드포인트로, Vmonster API와 통신합니다.

- **보안**: `VMONSTER_API_KEY`를 서버에서만 사용
- **역할**: 클라이언트 요청을 받아 Vmonster API로 스트림 생성 요청 전달

## API 키 보안 흐름

```
클라이언트
    ↓
Next.js API Route (/api/streams)  ← VMONSTER_API_KEY 사용
    ↓
Vmonster API
```

API key가 노출될 수 있으므로, Vmonster streams API 요청을 클라이언트 사이드에서 하지 않도록 주의해야 합니다.

## 주요 상태 및 기능

### 상태

- `joinRoomStatus`: 방 입장 상태 (idle, joining, joined, leaving, left)
- `communicationStatus`: 통신 상태 (idle, speaking, listening)
- `isUserSpeaking`: 사용자 음성 감지 상태 (VAD)
- `isUserAudioRecording`: 사용자 오디오 녹음 상태
- `remainingTime`: 세션 남은 시간

### 메서드

- `join()`: VmonsterRoom 입장
- `leave()`: VmonsterRoom 퇴장
- `speakAIAvatar(text)`: AI Avatar에게 텍스트에 대한 발화 요청
- `toggleUserAudio()`: 사용자 마이크 on/off

### 주의사항

- **세션 종료 후 새로고침 권장**: `leave()` 호출 후 완전한 클린업을 위해 페이지 새로고침(reload)을 권장합니다. 이는 WebRTC 연결 및 미디어 리소스가 확실하게 정리되도록 보장합니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Avatar**: vmonster-streaming-js v2.4.0
- **UI Components**: @aws-amplify/ui-react
