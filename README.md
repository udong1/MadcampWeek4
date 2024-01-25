# MadDonald

game / active / 3D

<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/cab520c6-c6ca-4825-82b5-b097b7f49170" width="30%"/>

### 햄버거를 빨리 만들어 1등을 쟁취하자!

---

### 1. 개발 팀원

- 정우현 - 카이스트 19학번 전자과
- 정민서 - 숙명여자대학교 22학번 컴퓨터과학과

---

### 2. 개발도구

- **Front-end** : React, TypeScript, Three.js, gsap
- **Back-end** : Node.js
- **Database** : MySQL
- **IDE** : Visual Studio Code

---

### 3. 주요 기능

### 시작

- **Major Features** : 사용자가 마주하는 첫 화면 입니다. 사용자의 닉네임을 입력하고, 게임을 시작할 수 있습니다.
- **기술 설명** : Three.js로 불러온 햄버거 모델이 배경에서 계속 돌아갑니다. 사용자가 닉네임을 입력한 후, 제출(Enter) 하면 닉네임 입력란이 시작 버튼으로 바뀌면서 배경의 햄버거가 펼쳐지는 애니메이션이 작동합니다. 애니메이션은 gsap을 활용했고, 사용자가 시작 버튼에서 마우스를 떼면 다시 햄버거가 합쳐져서 원래 모습으로 되돌아갑니다. 햄버거가 펼쳐졌을 때는 슬로우 모션을 걸어 더 천천히 돌아가게 만들었습니다.

---

### 설명

- **Major feature** : 게임 시작 전 사용자에게 간단한 설명을 제공합니다.
- **기술 설명** : Swiper의 pagination, navigation을 이용해 슬라이드 혹은 버튼 클릭으로 5개의 화면을 자유롭게 이동할 수 있습니다. Swiper에서 제공되는 style 대신 custom style을 적용하여 페이지에 통일성을 주었습니다.

---

### 게임

- **Major Features** : 정해진 시간 안에 랜덤으로 출력 되는 재료들을 최대한 빨리, 정확하게 쌓아 햄버거를 만듭니다.
- **기술 설명** : 게임이 시작되면 30초 카운트 다운이 시작됩니다. 그 동안 햄버거의 재료들이 랜덤한 갯수와 종류로 화면의 상단에 제시됩니다. 사용자는 하단의 재료 버튼들을 제시된 재료 순서대로 클릭해서 햄버거를 쌓습니다. 기초가 되는 밑 빵은 새로 생성될 시에 오른쪽에서 중앙으로 등장하며, 윗 빵을 쌓아 마무리를 하면 중앙에서 왼쪽으로 사라집니다. 해당 애니메이션은 gsap으로 구현했습니다. 또한 햄버거의 재료들이 위에서 떨어져 순차적으로 쌓여야 하기 때문에 각 재료들의 높이를 계산하여 스택으로 쌓아 이전 재료의 높이를 반영하여 재료가 쌓일 높이를 계산했습니다. 떨어지는 효과를 내기 위해 gsap으로 bounce효과, 랜덤한 rotation 효과를 적용했습니다.

---

### 결과

- **Major features** : 게임이 종료된 후 사용자의 점수와 DB에 등록된 상위 10명의 점수, 날짜, 설정한 닉네임을 표시합니다. 사용자의 점수에 따라 4개의 그룹으로 분류하고 각 그룹마다 다른 방식으로 점수를 나타냅니다.
- **기술 설명** : useEffect를 통해서 플레이한 게임 데이터를 서버로 전송하고, 전송된 데이터가 반영된 상위 10명의 결과를 받아옵니다. 게임 점수에 따라서 어느 그룹에 속하는지에 대한 state를 설정합니다. 분류된 그룹마다 서로 다른 gsap 애니메이션, style이 적용됩니다.

---

### 4. 예시

시작 화면

<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/6f7969df-134b-4c91-ac88-100ed3f9566c" width="50%"/>
<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/c55a39b0-ca04-4312-9256-3ccb0da44e8a" width="50%"/>
<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/d722bafe-4909-4c58-a039-40b9cae78530" width="50%"/>



설명 화면

<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/80d2eb55-af5e-4a9d-a6f7-f97deb0559ce" width="50%"/>
<img src="hhttps://github.com/udong1/MadcampWeek4/assets/104704651/c59ee85f-08df-4e5e-aab7-22eb49263b38" width="50%"/>
<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/4b6e7367-ac69-4cec-a63c-d9c23cbcb255" width="50%"/>


게임 화면

<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/f52e6c55-d6cf-4acd-be7e-c6c2157cb3e6" width="50%"/>
<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/6c1442ad-3c10-4499-88f7-66ddbd453f59" width="50%"/>
<img src="https://github.com/udong1/MadcampWeek4/assets/104704651/804fbf45-2988-44aa-aa3b-6f2493c4c443" width="50%"/>



결과 화면
