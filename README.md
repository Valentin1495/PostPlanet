<a href="https://postplanet.vercel.app">
  <img alt="home page" src="https://github.com/user-attachments/assets/af0e0f64-a2c1-478a-bc57-4ebc97b4c671" />
  <h1 align="center">PostPlanet</h1>
</a>

<p align="center">
  소셜 미디어 플랫폼
</p>
<br/>

## Features

- 사용자 인증

  - 이메일/소셜 로그인 (Google & GitHub)
  - 쿠키를 통한 세션(JWT) 기반 로그인

- 사용자 프로필 등록

- 게시물, 답글 생성/조회/삭제

- 좋아요/좋아요 취소

- 게시물/사용자 검색

- 좋아요/답글 받을 시 알림

- 사용자의 게시물/사용자가 답글 단 게시물/사용자가 좋아요한 게시물 조회

## Tech Stack

- 코어: React 19, TypeScript, Next.js 16 (App Router)
- 상태 관리: React Query, Zustand
- 스타일링: Tailwind CSS
- UI 컴포넌트: shadcn/ui
- 백엔드: Supabase (Postgres + Row Level Security, Auth, Storage)
- 패키지 매니저: NPM
- CI/CD: Vercel

### Supabase 하나로 통합된 백엔드

이 프로젝트는 DB, 인증, 파일 스토리지를 모두 Supabase 하나로 통합했습니다.

- **DB**: MongoDB 배열 필드(`followingIds`, `likedIds`) 대신 Postgres의 정규화된 조인 테이블(`follows`, `likes`)로 모델링했습니다.
- **인가**: 별도의 ORM 없이 `@supabase/supabase-js` 클라이언트로 직접 쿼리하고, 인가는 애플리케이션 코드가 아닌 Postgres **Row Level Security(RLS)** 정책으로 처리합니다. 정책은 [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)에서 확인할 수 있습니다.
- **인증**: Supabase Auth로 이메일/비밀번호 및 Google/GitHub OAuth를 지원합니다.
- **파일 업로드**: Supabase Storage의 `images` 버킷에 `<user_id>/<filename>` 경로로 저장하고, RLS와 동일한 방식으로 스토리지 정책을 설정했습니다.
