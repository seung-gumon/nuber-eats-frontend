# 🍔Nuber-Eats-FrontEnd

## 📖개요
Nomad Coder에서 수강한 Nuber Eats Clone Coding입니다 !<br />
크게 식당, 손님, 배달원으로 구성된 배달음식 서비스 입니다.<br />


[nuber-eats-backend 소스코드](../../../nuber-eats-backend)



## 🔗Front End 링크
https://sharp-dubinsky-7a4b59.netlify.app/

## 💻Stack
- [X] Typescript
- [X] React.js
- [X] GraphQL (Apollo Client)
- [X] Victory Chart
- [X] Tailwind Css
- [X] Google Map
- [X] Netlify

### ⚛️ React 관련 라이브러리
- [X] React Helmet
- [X] React router dom
- [X] React Hook Form

<hr />
<br />

## 💡 주요 기능
각 유저에 맞는 페이지 제공
- 🙍‍♂Client - 음식을 주문하는 유저의 권한
- 👨‍🍳Owner - 식당을 운영하는 가게 주인의 권한
- 🛵Driver - 배달하는 분의 권한

### 미리보기
1. 주문 (subscription)
   ![order](https://user-images.githubusercontent.com/64651532/126050917-6b3179ae-527d-47cd-ac83-769bc6a562b8.gif)
   (권한 : 식당 | 주문자 | 배달)


### 공통
- 로그인/아웃
- 유저 생성
- 유저 수정
- 이메일 인증

### Client
- 음식 카테고리
- 식당 전체 조회
- 식당 상세 조회
- 식당 검색
- 음식 주문 및 상태 확인

### Owner
- 나의 식당 조회
- 나의 식당 상세 조회
- 식당 생성
- 해당 식당의 음식 생성
- 식당이용 정기권 결재
- 판매한 주문 가격들 그래프 표기
- 유저 주문 실시간 조회 및 상태 확인
- 유저 주문 상태 변경 (Cooking, Cooked)

### Driver
- 유저 주문 실시간 조회 및 상태 확인
- 유저 주문 상태 변경 (Picked Up, Deliverd)

<hr />

## 발전 가능한 기능
강의와 개인적으로 추가한 기능 외의 발전 가능한 기능들 목록입니다.<br />


### 공통
- [ ] 이메일 인증 범용 모듈 추가
- [ ] 결재 범용 모듈 추가

### Client
- [ ] 나의 주문 목록
- [ ] 주문자 위치 (경도, 위도)

### Owner
- [ ] 사진 미리보기 (식당, 음식)
- [ ] 나의 식당 수정</del>
- [ ] 나의 식당 삭제</del>
- [ ] 나의 식당 음식 수정</del>
- [ ] 나의 식당 음식 삭제</del>
- [ ] 카테고리 수정</del>
- [ ] 나의 주문 전체 목록
- [ ] 나의 주문 상세 목록

### Driver
- [ ] 내가 받은 주문 조회
- [ ] 받은 주문 취소
