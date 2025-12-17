# 시간을소중히 - 프론트엔드 개발 가이드

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [폴더 구조 및 파일 설명](#폴더-구조-및-파일-설명)
5. [주요 기능](#주요-기능)
6. [기술적 플로우](#기술적-플로우)
7. [실행 방법](#실행-방법)
8. [환경 변수 설정](#환경-변수-설정)
9. [특이사항](#특이사항)
10. [개발 가이드](#개발-가이드)

---

## 프로젝트 개요

**시간을소중히**는 사용자의 일정 관리, 목표 설정, 루틴 관리, 그리고 친구와의 일정 공유 기능을 제공하는 캘린더 기반 웹 애플리케이션입니다.

### 핵심 기능
- 📅 **일정 관리**: 날짜별 투두 리스트 및 스케줄 관리
- 🎯 **목표 관리**: 진행도 추적이 가능한 목표 설정 및 관리
- 🔄 **루틴 관리**: 주간 반복 루틴 설정 및 관리
- 👥 **친구 기능**: 친구 검색, 팔로우, 친구 일정 조회
- 👤 **프로필 관리**: 프로필 사진, 닉네임, 자기소개 수정

---

## 기술 스택

### 핵심 프레임워크 및 라이브러리
- **React 19.1.0**: UI 라이브러리
- **TypeScript 5.2.2**: 타입 안정성을 위한 언어
- **Vite 6.0.6**: 빌드 도구 및 개발 서버
- **React Router DOM 6.22.3**: 클라이언트 사이드 라우팅

### 상태 관리
- **Zustand 4.5.2**: 전역 상태 관리 (로컬 스토리지 영속화 포함)
- **@tanstack/react-query 5.90.12**: 서버 상태 관리 및 캐싱

### 스타일링
- **Tailwind CSS 3.4.3**: 유틸리티 기반 CSS 프레임워크
- **PostCSS 8.4.38**: CSS 후처리
- **Autoprefixer 10.4.19**: CSS 벤더 프리픽스 자동 추가

### 날짜/시간 처리
- **date-fns 3.6.0**: 날짜 포맷팅 및 조작
- **moment 2.30.1**: 날짜/시간 라이브러리 (레거시)
- **react-calendar 4.8.0**: 캘린더 UI 컴포넌트

### HTTP 클라이언트
- **Axios 1.13.2**: HTTP 요청 라이브러리
- **Fetch API**: 네이티브 HTTP 요청 (일부 API에서 사용)

### UI 컴포넌트
- **react-modal 3.16.1**: 모달 컴포넌트

### 유틸리티
- **lodash 4.17.21**: 유틸리티 함수 라이브러리

### 개발 도구
- **ESLint 9.0.0**: 코드 린팅
- **Prettier 3.2.5**: 코드 포맷팅
- **TypeScript ESLint**: TypeScript 린팅
- **@vitejs/plugin-react-swc 3.5.0**: SWC 기반 React 플러그인 (빠른 빌드)
- **rollup-plugin-visualizer 5.14.0**: 번들 크기 분석

---

## 프로젝트 구조

```
Frontend/
├── FRONTEND/                    # 메인 프론트엔드 프로젝트
│   ├── src/
│   │   ├── api/                 # API 호출 함수들
│   │   ├── assets/              # 정적 리소스 (이미지, 폰트 등)
│   │   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── hooks/               # 커스텀 훅
│   │   ├── pages/               # 페이지 컴포넌트
│   │   ├── store/               # 상태 관리 (Zustand)
│   │   ├── App.tsx              # 메인 앱 컴포넌트
│   │   ├── main.tsx             # 앱 진입점
│   │   └── index.css            # 전역 스타일
│   ├── public/                  # 정적 파일
│   ├── index.html               # HTML 템플릿
│   ├── package.json             # 의존성 및 스크립트
│   ├── vite.config.ts           # Vite 설정
│   ├── tsconfig.json            # TypeScript 설정
│   ├── tailwind.config.js       # Tailwind CSS 설정
│   └── postcss.config.js        # PostCSS 설정
└── package.json                 # 루트 패키지 (모노레포 구조)
```

---

## 폴더 구조 및 파일 설명

### 📁 `/src/api/` - API 호출 함수

백엔드 API와 통신하는 함수들을 모아둔 디렉토리입니다.

#### `auth.ts`
- **역할**: 인증 관련 API 호출
- **주요 함수**:
  - `login(email, password)`: 로그인 (POST `/members/login`)
  - `signUp({ email, password, confirmPassword, nickname, bio })`: 회원가입 (POST `/members/signup`)
  - `uploadImage({ file, memberId })`: 프로필 이미지 업로드 (POST `/members/{memberId}/upload`)
  - `validateEmailApi(email)`: 이메일 중복 검사 (GET `/members/valid?email={email}`)
- **특이사항**: 로그인은 쿼리 파라미터로 전송, 회원가입은 JSON body로 전송

#### `goal.ts`
- **역할**: 목표(Goal) 관련 API 호출
- **주요 함수**:
  - `fetchGoals(memberId)`: 목표 목록 조회 (GET `/goals/{memberId}`)
  - `addGoal(memberId, title)`: 목표 추가 (POST `/goals/{memberId}`)
  - `updateGoal(id, title, progress)`: 목표 수정 (PUT `/goals/{id}`)
  - `toggleGoalCompletion(id)`: 목표 완료 상태 토글 (PUT `/goals/toggle/{id}`)
  - `deleteGoal(id)`: 목표 삭제 (DELETE `/goals/{id}`)

#### `schedule.ts`
- **역할**: 일정(Schedule/Todo) 관련 API 호출
- **주요 함수**:
  - `fetchSchedules(memberId, date)`: 특정 날짜 일정 조회 (GET `/schedules/{memberId}/{date}`)
  - `addSchedule(memberId, newTodo)`: 일정 추가 (POST `/schedules/{memberId}`)
  - `updateSchedule(todoId, updated)`: 일정 수정 (PUT `/schedules/{todoId}`)
  - `deleteSchedule(todoId)`: 일정 삭제 (DELETE `/schedules/{todoId}`)

#### `friend.ts`
- **역할**: 친구 관련 API 호출
- **주요 함수**:
  - `fetchFriends(query)`: 친구 검색 (GET `/members/search?nickNameOrEmail={query}`)
  - `followFriend(memberId, friendId)`: 친구 팔로우 (POST `/follows/{memberId}/following/{friendId}`)
- **특이사항**: 검색 결과에 프로필 사진이 없으면 기본 이미지 사용

#### `member.ts`
- **역할**: 회원 정보 관련 API 호출
- **주요 함수**:
  - `fetchMemberProfile(memberId)`: 프로필 조회 (GET `/members/{memberId}`)
  - `updateMemberProfile(payload)`: 프로필 업데이트 (POST `/members/{memberId}/profile`)
  - `uploadImage({ file, memberId })`: 프로필 이미지 업로드

---

### 📁 `/src/components/` - 컴포넌트

#### `/Calendar/` - 캘린더 관련 컴포넌트
- **`CalendarPage.tsx`**: 메인 캘린더 페이지
  - 달력 뷰와 주간 그리드 뷰 전환 기능
  - 날짜 선택 시 Zustand store의 `selectedDate` 업데이트
  - 고정 루틴 관리 페이지로 이동하는 버튼 포함
- **`CustomCalendar.tsx`**: 커스텀 달력 컴포넌트
  - `react-calendar` 기반 커스터마이징
  - 날짜 클릭 이벤트 처리
- **`WeekDates.tsx`**: 주간 날짜 표시 컴포넌트

#### `/Calendar_Friend/` - 친구 캘린더 컴포넌트
- **`CalendarPage_Friend.tsx`**: 친구의 캘린더 페이지
  - 친구 ID를 받아 해당 친구의 일정 표시
  - 읽기 전용 뷰

#### `/Grid/` - 그리드 뷰 컴포넌트
- **`WeekGridPage.tsx`**: 주간 타임테이블 그리드
  - 시간대별 일정 표시
  - 드래그 앤 드롭 가능 (추정)
- **`FixGridPage.tsx`**: 고정 루틴 관리 그리드
  - 주간 반복 루틴 설정 및 관리

#### `/ListSidebar/` - 메인 사이드바 컴포넌트
- **`ListSidebar.tsx`**: 메인 사이드바 컨테이너
  - TodayComponent, TodoListComponent, MyGoalComponent, MyProfileComponent를 세로로 배치
- **`TodayComponent.tsx`**: 오늘 날짜 및 요약 정보 표시
- **`TodoListComponent.tsx`**: 선택된 날짜의 투두 리스트
  - `selectedDate`에 따라 해당 날짜의 일정 표시
- **`MyGoalComponent.tsx`**: 목표 목록 및 진행도 표시
- **`MyProfileComponent.tsx`**: 사용자 프로필 정보 표시

#### `/ListSidebar_Friend/` - 친구 사이드바 컴포넌트
- **`ListSidebar_Friend.tsx`**: 친구 프로필 사이드바
- **`MyProfileComponent_Friend.tsx`**: 친구 프로필 정보 표시
- **`TodoListComponent_Friend.tsx`**: 친구의 투두 리스트
- **`MyGoalComponent_Friend.tsx`**: 친구의 목표 목록

#### `/FriendsListSidebar/` - 친구 리스트 사이드바
- **`FriendsListSidebar.tsx`**: 좌측 친구 리스트 사이드바 컨테이너
- **`FriendsListComponent.tsx`**: 팔로잉 목록 표시
- **`FriendComponent.tsx`**: 개별 친구 아이템 컴포넌트
  - 친구 클릭 시 `/friend` 페이지로 이동
- **`LogoComponent.tsx`**: 로고 컴포넌트
- **`NextPageComponent.tsx`**: 다음 페이지 이동 버튼
- **`RestTasksComponent.tsx`**: 남은 작업 표시
- **`ToggleComponent.tsx`**: 사이드바 토글 버튼

#### `/Modal/` - 모달 컴포넌트
- **`Modal.tsx`**: 기본 모달 래퍼 컴포넌트
- **`LoginModal.tsx`**: 로그인 모달
  - 이메일/비밀번호 입력
  - 로그인 성공 시 `/main` 페이지로 이동
- **`SignUpModal.tsx`**: 회원가입 모달 (1단계)
  - 이메일, 비밀번호, 닉네임, 자기소개 입력
- **`SignUpModalStep2.tsx`**: 회원가입 모달 (2단계)
  - 프로필 사진 업로드
- **`FriendSearchModal.tsx`**: 친구 검색 모달
  - 닉네임/이메일로 친구 검색
  - 검색 결과에서 팔로우 가능
- **`SettingsModal.tsx`**: 설정 모달
  - 프로필 수정, 로그아웃 등
- **`EditProfileModal.tsx`**: 프로필 수정 모달
  - 닉네임, 자기소개, 프로필 사진 수정
- **`SettingsModalProfileSection.tsx`**: 설정 모달의 프로필 섹션

#### `/Menu/` - 메뉴 컴포넌트
- **`MenuComponent.tsx`**: 하단 고정 메뉴
  - 친구 검색 모달 열기
  - 설정 모달 열기

#### 공통 컴포넌트
- **`Input.tsx`**: 재사용 가능한 입력 컴포넌트
- **`Toggle.tsx`**: 토글 스위치 컴포넌트
- **`ConfirmButton.tsx`**: 확인 버튼 컴포넌트

---

### 📁 `/src/hooks/` - 커스텀 훅

React Query와 Zustand를 활용한 커스텀 훅들입니다.

#### `/auth/` - 인증 관련 훅
- **`useLogin.ts`**: 로그인 훅
  - `useAuthStore`의 `login` 함수 사용
  - 성공 시 `/main` 페이지로 리다이렉트
- **`useSignUp.ts`**: 회원가입 훅
  - `useAuthStore`의 `signUp` 함수 사용
  - 프로필 이미지 업로드 포함
- **`useUploadImage.ts`**: 이미지 업로드 훅

#### `/goal/` - 목표 관련 훅
- **`useGoalsQuery.ts`**: 목표 목록 조회 (React Query)
- **`useAddGoal.ts`**: 목표 추가 (React Query Mutation)
- **`useUpdateGoal.ts`**: 목표 수정 (React Query Mutation)
- **`useToggleGoalCompletion.ts`**: 목표 완료 토글 (React Query Mutation)
- **`useDeleteGoal.ts`**: 목표 삭제 (React Query Mutation)

#### `/schedule/` - 일정 관련 훅
- **`useSchedulesQuery.ts`**: 특정 날짜 일정 조회 (React Query)
- **`useSchedules.ts`**: 전체 일정 조회 (React Query)
- **`useAddSchedule.ts`**: 일정 추가 (React Query Mutation)
- **`useUpdateSchedule.ts`**: 일정 수정 (React Query Mutation)
- **`useDeleteSchedule.ts`**: 일정 삭제 (React Query Mutation)

#### `/friend/` - 친구 관련 훅
- **`useFriendSearch.ts`**: 친구 검색 훅

#### `/member/` - 회원 관련 훅
- **`useEditProfile.ts`**: 프로필 수정 훅

---

### 📁 `/src/pages/` - 페이지 컴포넌트

#### `StartPage.tsx`
- **역할**: 시작 페이지 (로그인/회원가입)
- **기능**:
  - 이메일 입력 및 유효성 검사
  - "시작하기" 버튼 클릭 시 회원가입 모달 열기
  - "로그인하러가기" 버튼 클릭 시 로그인 모달 열기
- **특이사항**: 배경 이미지 사용 (`StartPB.webp`)

#### `MainPage.tsx`
- **역할**: 메인 페이지 (로그인 후 접근)
- **레이아웃**:
  - 좌측: `FriendsListSidebar` (60px)
  - 중앙 좌측: `ListSidebar` (330px)
  - 중앙 우측: `CalendarPage` 또는 `FixGridPage` (flex-grow)
  - 하단 좌측: `MenuComponent` (고정)
- **상태 관리**:
  - `currentPage` 상태로 "calendar" / "fixGrid" 전환
  - `memberId`가 있을 때 팔로잉 목록 자동 로드

#### `FriendPage.tsx`
- **역할**: 친구 프로필 및 일정 조회 페이지
- **라우팅**: `/friend` 경로, `location.state.friendId`로 친구 ID 전달
- **레이아웃**:
  - 좌측: `FriendsListSidebar` (60px)
  - 중앙 좌측: `ListSidebar_Friend` (330px, 배경색 `#EDE0EC`)
  - 중앙 우측: `CalendarPage_Friend` (flex-grow)
  - 하단 좌측: `MenuComponent` (고정)

---

### 📁 `/src/store/` - 상태 관리

#### `store.ts` (메인 스토어)
- **역할**: Zustand를 사용한 전역 상태 관리
- **특징**: `persist` 미들웨어로 로컬 스토리지에 영속화
- **주요 상태**:
  - `schedules`: 일정 배열
  - `goals`: 목표 배열
  - `routines`: 루틴 배열
  - `followings`: 팔로잉 목록
  - `followers`: 팔로워 목록
  - `selectedDate`: 선택된 날짜 (YYYY-MM-DD)
  - `memberId`: 현재 사용자 ID
  - `memberProfile`: 사용자 프로필 정보
  - `openAddTodo`: 투두 입력창 열림 상태
- **주요 함수**:
  - `fetchSchedules(memberId)`: 전체 일정 조회
  - `fetchSchedulesByDate(memberId, dateString)`: 특정 날짜 일정 조회
  - `addTodo(memberId, newTodo)`: 일정 추가
  - `fetchGoals(memberId)`: 목표 조회
  - `setGoal(title)`: 목표 추가
  - `toggleGoalCompletion(id)`: 목표 완료 토글
  - `deleteGoal(id)`: 목표 삭제
  - `updateProgress(goalId, progress)`: 목표 진행도 업데이트
  - `fetchRoutines(memberId)`: 루틴 조회
  - `addRoutine(memberId, newRoutineData)`: 루틴 추가
  - `updateRoutine(routineId, updatedData)`: 루틴 수정
  - `deleteRoutine(routineId)`: 루틴 삭제
  - `fetchFollowings(memberId)`: 팔로잉 조회
  - `fetchFollowers(memberId)`: 팔로워 조회
  - `fetchMemberProfile(memberId)`: 프로필 조회
  - `updateNickname(memberId, nickname)`: 닉네임 수정
  - `updateIntroduce(memberId, introduce)`: 자기소개 수정
  - `updateProfilePicture(memberId, file)`: 프로필 사진 수정
  - `login(email, password)`: 로그인
  - `signUp()`: 회원가입
  - `uploadImage(file, memberId)`: 이미지 업로드

#### `/auth/useAuthStore.ts`
- **역할**: 인증 관련 상태 관리
- **상태**: `email`, `password`, `memberId`, `nickname`, `bio`, `profilePic`, `memberProfile`
- **함수**: `login`, `signUp`, `uploadImage`, `resetState`

#### `/modals/useModalStore.ts`
- **역할**: 모달 열림/닫힘 상태 관리
- **상태**: `isEditProfileOpen`, `isSignUpOpen`

#### `/friends/useFriendSearchStore.ts`
- **역할**: 친구 검색 관련 상태 관리

#### `/member/useMemberStore.ts`
- **역할**: 회원 정보 관련 상태 관리

#### `scheduleStore.ts`
- **역할**: 일정 관련 타입 정의 및 상태 관리 (추정)

---

### 📁 `/src/assets/` - 정적 리소스

#### 이미지 파일
- **로고**: `LogoImage.svg`
- **아이콘**: `addTimeTodoIcon.svg`, `addTodoIcon.svg`, `CheckedBoxIcon.svg`, `UncheckBoxIcon.svg` 등
- **프로필**: `profile.png` (기본 프로필 이미지)
- **진행도 바**: `ProgressBar_0.svg` ~ `ProgressBar_100.svg`, `ProgressBar_Empty.svg`
- **하트 이미지**: `HeartImage_0.svg` ~ `HeartImage_100.svg`
- **배경**: `StartPB.png`, `StartPB.webp` (시작 페이지 배경)
- **기타**: `camera.png`, `pen.png`, `RestTasksBg.svg` 등

#### 폰트 파일
- **Inter 폰트 패밀리**: `Inter-*.ttf` (Black, Bold, ExtraBold, ExtraLight, Light, Medium, Regular, SemiBold, Thin)

---

### 📁 기타 파일

#### `App.tsx`
- **역할**: 메인 앱 컴포넌트
- **기능**:
  - React Router 설정 (`/`, `/main`, `/friend`)
  - React Query Provider 설정
  - 모달 Lazy Loading (`FriendSearchModal`, `SettingsModal`)
  - 모달 상태 관리 (로컬 state)

#### `main.tsx`
- **역할**: 앱 진입점
- **기능**: React DOM 렌더링

#### `SelectedDateProvider.tsx`
- **역할**: 날짜 선택 컨텍스트 (현재 주석 처리됨, Zustand로 대체)

#### `index.css`
- **역할**: 전역 CSS 스타일

---

## 주요 기능

### 1. 인증 시스템

#### 회원가입 플로우
1. **시작 페이지**에서 이메일 입력
2. "시작하기" 버튼 클릭 → 이메일 유효성 검사 API 호출
3. 유효한 이메일이면 **회원가입 모달 1단계** 열림
4. 이메일, 비밀번호, 닉네임, 자기소개 입력
5. 다음 단계 클릭 → **회원가입 모달 2단계** 열림
6. 프로필 사진 선택 (선택사항)
7. 회원가입 완료 → 프로필 사진 업로드 → `/main` 페이지로 이동

#### 로그인 플로우
1. 시작 페이지에서 "로그인하러가기" 버튼 클릭
2. 로그인 모달에서 이메일/비밀번호 입력
3. 로그인 API 호출
4. 성공 시 `memberId`를 로컬 스토리지에 저장하고 `/main` 페이지로 이동

### 2. 일정 관리 (Schedule/Todo)

#### 일정 조회
- **전체 일정**: `fetchSchedules(memberId)` - 사용자의 모든 일정 조회
- **날짜별 일정**: `fetchSchedulesByDate(memberId, dateString)` - 특정 날짜의 일정만 조회
- 캘린더에서 날짜 클릭 시 해당 날짜의 일정만 표시

#### 일정 추가
- 투두 입력창에서 일정 내용, 날짜, 시간 입력
- `addTodo(memberId, newTodo)` API 호출
- 성공 시 일정 목록 자동 갱신

#### 일정 수정/삭제
- 일정 클릭 시 수정 모달 또는 인라인 편집
- `updateSchedule(todoId, updated)` / `deleteSchedule(todoId)` API 호출

### 3. 목표 관리 (Goal)

#### 목표 조회
- `useGoalsQuery(memberId)` 훅으로 목표 목록 조회
- React Query 캐싱 활용

#### 목표 추가
- 목표 입력창에서 제목 입력
- `useAddGoal` 훅으로 목표 추가
- 기본 진행도 0%, 완료 상태 false

#### 목표 진행도 업데이트
- 진행도 바를 드래그하거나 클릭하여 진행도 조정
- `updateProgress(goalId, progress)` API 호출

#### 목표 완료 토글
- 체크박스 클릭 시 완료 상태 토글
- `toggleGoalCompletion(id)` API 호출

#### 목표 삭제
- 삭제 버튼 클릭 시 목표 제거
- `deleteGoal(id)` API 호출

### 4. 루틴 관리 (Routine)

#### 루틴 조회
- `fetchRoutines(memberId)` API 호출
- 주간 반복 루틴 목록 표시

#### 루틴 추가
- 고정 루틴 관리 페이지에서 루틴 추가
- 제목, 요일, 시작 시간, 종료 시간 입력
- `addRoutine(memberId, newRoutineData)` API 호출

#### 루틴 수정/삭제
- `updateRoutine(routineId, updatedData)` / `deleteRoutine(routineId)` API 호출

### 5. 친구 기능

#### 친구 검색
- 메뉴에서 "친구 검색" 클릭 → `FriendSearchModal` 열림
- 닉네임 또는 이메일로 검색
- `fetchFriends(query)` API 호출
- 검색 결과에서 "팔로우" 버튼 클릭 → `followFriend(memberId, friendId)` API 호출

#### 팔로잉 목록
- 좌측 사이드바에 팔로잉 목록 표시
- `fetchFollowings(memberId)` API 호출
- 친구 클릭 시 `/friend` 페이지로 이동 (친구 ID 전달)

#### 친구 일정 조회
- `/friend` 페이지에서 친구의 일정, 목표, 프로필 조회
- 읽기 전용 뷰 (수정 불가)

### 6. 프로필 관리

#### 프로필 조회
- `fetchMemberProfile(memberId)` API 호출
- 프로필 사진, 닉네임, 자기소개 표시

#### 프로필 수정
- 설정 모달에서 "프로필 수정" 클릭
- `EditProfileModal`에서 닉네임, 자기소개, 프로필 사진 수정
- 각각 별도 API 호출:
  - `updateNickname(memberId, nickname)`
  - `updateIntroduce(memberId, introduce)`
  - `updateProfilePicture(memberId, file)`

---

## 기술적 플로우

### 1. 앱 초기화 플로우

```
main.tsx
  ↓
App.tsx
  ├─ QueryClientProvider (React Query 설정)
  ├─ Router (React Router 설정)
  └─ Routes
      ├─ / → StartPage
      ├─ /main → MainPage
      └─ /friend → FriendPage
```

### 2. 상태 관리 플로우

#### Zustand Store (전역 상태)
- **로컬 스토리지 영속화**: `persist` 미들웨어 사용
- **저장 키**: `"user-store"`
- **자동 복원**: 앱 시작 시 로컬 스토리지에서 상태 복원
- **특이사항**: `selectedDate`가 없으면 오늘 날짜로 초기화

#### React Query (서버 상태)
- **캐싱**: 쿼리 키 기반 자동 캐싱
- **자동 리프레시**: 쿼리 키 변경 시 자동 재조회
- **사용 예시**:
  - `useGoalsQuery(memberId)` → `["goals", memberId]`
  - `useSchedulesQuery(memberId, date)` → `["schedules", memberId, date]`

### 3. 데이터 페칭 플로우

#### 일정 조회 예시
```
CalendarPage (날짜 클릭)
  ↓
setSelectedDate(date) (Zustand)
  ↓
TodoListComponent
  ↓
useSchedulesQuery(memberId, selectedDate) (React Query)
  ↓
fetchSchedules(memberId, date) (API 함수)
  ↓
GET /api/v1/schedules/{memberId}/{date}
  ↓
응답 데이터 → React Query 캐시 저장
  ↓
TodoListComponent 리렌더링
```

#### 목표 추가 예시
```
MyGoalComponent (목표 입력)
  ↓
useAddGoal (React Query Mutation)
  ↓
addGoal(memberId, title) (API 함수)
  ↓
POST /api/v1/goals/{memberId}
  ↓
성공 시 쿼리 무효화 → useGoalsQuery 자동 재조회
```

### 4. 라우팅 플로우

#### 로그인 후 메인 페이지 이동
```
LoginModal (로그인 성공)
  ↓
useAuthStore.login() → memberId 저장
  ↓
navigate('/main') (React Router)
  ↓
MainPage 렌더링
  ↓
useEffect → fetchFollowings(memberId) (팔로잉 목록 로드)
```

#### 친구 페이지 이동
```
FriendComponent (친구 클릭)
  ↓
navigate('/friend', { state: { friendId } })
  ↓
FriendPage 렌더링
  ↓
location.state.friendId 추출
  ↓
친구 데이터 조회 및 표시
```

### 5. 모달 관리 플로우

#### Lazy Loading 모달
```
App.tsx
  ├─ isFriendSearchModalOpen (로컬 state)
  └─ isSettingsModalOpen (로컬 state)
      ↓
조건부 렌더링 + Suspense
      ↓
lazy(() => import('./components/Modal/FriendSearchModal'))
```

#### 모달 열기/닫기
```
MenuComponent (친구 검색 버튼 클릭)
  ↓
openFriendSearchModal() (App.tsx의 함수)
  ↓
isFriendSearchModalOpen = true
  ↓
FriendSearchModal 렌더링 (Lazy Load)
```

### 6. 이미지 업로드 플로우

```
EditProfileModal (프로필 사진 선택)
  ↓
File 객체 생성
  ↓
FormData 생성 및 파일 append
  ↓
POST /api/v1/members/{memberId}/profile
  Content-Type: multipart/form-data
  ↓
서버 응답 (이미지 URL 또는 텍스트)
  ↓
Zustand store 업데이트 (memberProfile.profileUrl)
```

---

## 실행 방법

### 1. 사전 요구사항
- **Node.js**: 18.x 이상 권장
- **Yarn**: 패키지 매니저 (또는 npm)

### 2. 의존성 설치

```bash
cd FRONTEND
yarn install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 4. 개발 서버 실행

```bash
yarn dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 5. 빌드

```bash
yarn build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 6. 프로덕션 미리보기

```bash
yarn preview
```

### 7. 코드 포맷팅

```bash
yarn format
```

### 8. 린팅

```bash
yarn lint
```

---

## 환경 변수 설정

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `VITE_API_URL` | 백엔드 API 기본 URL | `http://localhost:8080/api/v1` |

### 환경 변수 사용법

코드에서 환경 변수 사용:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**주의**: Vite는 `VITE_` 접두사가 붙은 환경 변수만 클라이언트에 노출됩니다.

---

## 특이사항

### 1. 상태 관리 이중 구조

프로젝트에서 **Zustand**와 **React Query**를 동시에 사용합니다:

- **Zustand**: 클라이언트 상태 (UI 상태, 선택된 날짜 등)
- **React Query**: 서버 상태 (API 데이터 캐싱)

일부 기능은 Zustand store에서 직접 API 호출을 하고, 일부는 React Query 훅을 사용합니다. 이는 점진적 마이그레이션 과정으로 보입니다.

### 2. 로컬 스토리지 영속화

Zustand store의 `persist` 미들웨어를 사용하여 상태를 로컬 스토리지에 저장합니다:

- **저장 키**: `"user-store"`
- **저장 데이터**: `memberId`, `selectedDate`, `schedules`, `goals` 등
- **자동 복원**: 앱 재시작 시 자동으로 상태 복원

### 3. 모달 Lazy Loading

`App.tsx`에서 `FriendSearchModal`과 `SettingsModal`을 Lazy Load합니다:

```typescript
const FriendSearchModal = lazy(() => import("./components/Modal/FriendSearchModal"));
```

이를 통해 초기 번들 크기를 줄이고 필요할 때만 로드합니다.

### 4. API 호출 방식 혼재

프로젝트에서 **Axios**와 **Fetch API**를 모두 사용합니다:

- **Axios**: `auth.ts`, `member.ts` 등 일부 API 파일
- **Fetch API**: `store.ts`의 대부분의 API 호출, `goal.ts`, `schedule.ts` 등

이는 점진적 마이그레이션 과정으로 보입니다.

### 5. 날짜 포맷

- **저장 형식**: `YYYY-MM-DD` (예: "2024-01-15")
- **표시 형식**: `date-fns`의 `format` 함수 사용
- **선택된 날짜**: Zustand store의 `selectedDate`에 문자열로 저장

### 6. 프로필 이미지 기본값

프로필 이미지가 없거나 유효하지 않은 경우:
- `@/assets/profile.png`를 기본 이미지로 사용
- `friend.ts`의 `fetchFriends` 함수에서 처리

### 7. 타입 안정성

TypeScript를 사용하지만 일부 설정이 완화되어 있습니다:

```json
// tsconfig.json
"noImplicitAny": false,
"strictNullChecks": false,
```

이는 점진적 타입 안정성 향상을 위한 설정으로 보입니다.

### 8. Vite 프록시 설정

개발 환경에서 API 프록시를 사용합니다:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080/api/v1',
      changeOrigin: true,
    },
  },
}
```

하지만 실제 코드에서는 `import.meta.env.VITE_API_URL`을 직접 사용하므로 프록시는 사용되지 않을 수 있습니다.

### 9. React 19 사용

프로젝트에서 **React 19.1.0**을 사용합니다. 이는 최신 버전으로, 일부 API가 변경되었을 수 있습니다.

### 10. SWC 사용

빌드 도구로 **@vitejs/plugin-react-swc**를 사용합니다:

- **장점**: Babel보다 빠른 컴파일 속도
- **기능**: Fast Refresh 지원

### 11. 번들 분석

`rollup-plugin-visualizer`를 사용하여 번들 크기를 분석할 수 있습니다:

- 빌드 후 `stats.html` 파일 생성
- 번들 크기 시각화

### 12. 친구 페이지 라우팅

친구 페이지로 이동할 때 `location.state`를 사용합니다:

```typescript
navigate('/friend', { state: { friendId } });
```

페이지 새로고침 시 `friendId`가 사라질 수 있으므로 주의가 필요합니다.

### 13. 날짜 선택 컨텍스트 미사용

`SelectedDateProvider.tsx` 파일이 있지만 주석 처리되어 있습니다. 대신 Zustand store의 `selectedDate`를 사용합니다.

### 14. 중복된 상태 관리

일부 상태가 여러 store에 중복으로 존재할 수 있습니다:

- `useAuthStore`와 `store.ts` 모두에 `memberId`, `memberProfile` 등이 존재
- 이는 점진적 마이그레이션 과정으로 보입니다.

---

## 개발 가이드

### 1. 새 기능 추가 시

#### API 함수 추가
1. `/src/api/` 디렉토리에 해당 도메인 파일 확인 또는 생성
2. API 함수 작성 (Axios 또는 Fetch API)
3. 타입 정의 추가

#### React Query 훅 추가
1. `/src/hooks/` 디렉토리에 해당 도메인 폴더 확인 또는 생성
2. `useQuery` 또는 `useMutation` 훅 작성
3. 쿼리 키 명명 규칙 준수: `["도메인", ...의존성]`

#### 컴포넌트 추가
1. `/src/components/` 디렉토리에 적절한 위치에 컴포넌트 생성
2. TypeScript 타입 정의
3. Tailwind CSS로 스타일링

### 2. 상태 관리 선택 가이드

- **클라이언트 상태** (UI 상태, 폼 상태 등) → **Zustand**
- **서버 상태** (API 데이터) → **React Query**
- **로컬 스토리지 필요** → **Zustand persist**

### 3. 스타일링 가이드

- **Tailwind CSS** 사용
- 커스텀 색상은 `tailwind.config.js`에 정의
- 컴포넌트별 CSS 파일은 최소화

### 4. 타입 정의 가이드

- API 응답 타입은 `/src/api/` 파일에 정의
- 컴포넌트 Props 타입은 컴포넌트 파일 내부에 정의
- 공통 타입은 `/src/store/` 또는 별도 `types/` 디렉토리에 정의

### 5. 에러 처리

- API 호출 시 `try-catch` 사용
- 사용자에게는 `alert` 또는 모달로 에러 메시지 표시
- 콘솔에는 상세 에러 로그 출력

### 6. 코드 포맷팅

- Prettier 설정 준수
- 커밋 전 `yarn format` 실행 권장

### 7. 린팅

- ESLint 규칙 준수
- 커밋 전 `yarn lint` 실행 권장

---

## 추가 참고사항

### 백엔드 API 엔드포인트

프로젝트에서 사용하는 주요 API 엔드포인트:

#### 인증
- `POST /members/login` - 로그인
- `POST /members/signup` - 회원가입
- `GET /members/valid?email={email}` - 이메일 중복 검사

#### 회원
- `GET /members/{memberId}` - 프로필 조회
- `POST /members/{memberId}/profile` - 프로필 업데이트
- `POST /members/{memberId}/upload` - 프로필 이미지 업로드
- `POST /members/{memberId}/nickname` - 닉네임 수정
- `POST /members/{memberId}/introduce` - 자기소개 수정
- `GET /members/search?nickNameOrEmail={query}` - 회원 검색

#### 일정
- `GET /schedules/{memberId}` - 전체 일정 조회
- `GET /schedules/{memberId}/{date}` - 날짜별 일정 조회
- `POST /schedules/{memberId}` - 일정 추가
- `PUT /schedules/{todoId}` - 일정 수정
- `DELETE /schedules/{todoId}` - 일정 삭제

#### 목표
- `GET /goals/{memberId}` - 목표 목록 조회
- `POST /goals/{memberId}` - 목표 추가
- `PUT /goals/{id}` - 목표 수정
- `PUT /goals/toggle/{id}` - 목표 완료 토글
- `DELETE /goals/{id}` - 목표 삭제

#### 루틴
- `GET /routines/{memberId}` - 루틴 목록 조회
- `POST /routines/{memberId}` - 루틴 추가
- `PUT /routines/{routineId}` - 루틴 수정
- `DELETE /routines/{routineId}` - 루틴 삭제

#### 팔로우
- `GET /follows/{memberId}/following` - 팔로잉 목록 조회
- `GET /follows/{memberId}/followers` - 팔로워 목록 조회
- `POST /follows/{memberId}/following/{friendId}` - 팔로우

---

## 문제 해결

### 1. 환경 변수가 적용되지 않을 때

- `.env` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 `VITE_`로 시작하는지 확인
- 개발 서버 재시작

### 2. API 호출 실패 시

- 백엔드 서버가 실행 중인지 확인
- `VITE_API_URL` 환경 변수가 올바른지 확인
- 브라우저 개발자 도구의 Network 탭에서 요청 확인
- CORS 에러인지 확인

### 3. 로컬 스토리지 문제

- 브라우저 개발자 도구에서 `Application > Local Storage` 확인
- `"user-store"` 키의 값 확인
- 필요 시 로컬 스토리지 초기화

### 4. 빌드 에러

- `node_modules` 삭제 후 `yarn install` 재실행
- TypeScript 타입 에러 확인
- ESLint 에러 확인

---

## 라이선스

이 프로젝트의 라이선스 정보는 프로젝트 소유자에게 문의하세요.

---

**작성일**: 2024년
**최종 업데이트**: 2024년
