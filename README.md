1.개발환경
-------------

* mac OS, node.js, express, mysql을 통해 개발하였습니다.

```
//config/database.js
const db_info = {
    host: 'localhost',
    user: 'sungmin', 
    password: '1234', 
    database: 'lecture'
}
//사용자의 DB 이름과 페스워드 설정
```

```
cd project
npm install
npm start
```
* Postman으로 rest API 테스트하였습니다.

2.파일구조
-------------

```
.
├── API
    ├── controllers
    ├── test
    └── validation
├── README.md
├── app.js
├── bin
├── config
    └── database.js
├── node_modules
├── package-lock.json
├── package.json
├── routes
└── util.js
```
API 폴더를 생성해 컨트롤러와 검증, 테스트코드를 분리해서 구성하였습니다. util.js에는 필요한 함수를 따로 저장했습니다. config에는 batabase 연동코드를 작성했습니다.

#### HTTP 상태 코드
```
    200 : 성공
    204 : 쿼리는 성공했지만 결과 값이 없다.
    400 : 클라이언트 오류
```

3.ERD
-------------
<img width="825" alt="ERD" src="https://user-images.githubusercontent.com/19837507/129328996-45b3212c-2c0d-4a7d-8e41-cca1b41e4469.png">

1. 강사 테이블

```
instructor_table(
    instructor_id varchar(50) NOT NULL,
    instructor_name varchar(20) NOT NULL,
    PRIMARY KEY(instructor_id)
);
```

|컬럼명|타입|컬럼설명|
|------|---|---|
|instructor_id|varchar(50)|강사의 ID를 저장합니다(PRIMARY KEY)|
|instructor_name|varchar(20)|강사의 이름을 저장합니다.|


2. 학생 테이블

```
student_table(
    student_id varchar(20) NOT NULL,
    student_name varchar(20) NOT NULL,
    email varchar(100),
    PRIMARY KEY(student_id)
);
```
|컬럼명|타입|컬럼설명|
|------|---|---|
|student_id|varchar(20)|학생의 ID를 저장합니다(PRIMARY KEY)|
|student_name|varchar(20)|학생의 이름을 저장합니다.|
|email|varchar(100)|학생의 이메일을 저장합니다.|


3. 수강 테이블 

```
apply_table(
    apply_id varchar(20) NOT NULL,
    class_id varchar(20) NOT NULL,
    class_name varchar(20),
    student_id  varchar(20) NOT NULL,
    student_name varchar(20),
    email varchar(100),
    apply_date DATETIME,
    PRIMARY KEY(apply_id)
);
```

|컬럼명|타입|컬럼설명|
|------|---|---|
|apply_id|varchar(20)|수강 ID를 저장합니다(PRIMARY KEY)|
|class_id|varchar(20)|강의의 ID를 저장합니다.(ForeignKey)|
|class_name|varchar(20)|강의의 제목을 저장합니다.|
|student_id|varchar(20)|학생의 ID을 저장합니다.(ForeignKey)|
|student_name|varchar(20)|학생의 이름을 저장합니다.|
|email|varchar(100)|학생의 이메일을 저장합니다.|
|apply_date|DATETIME|강의의 생성 저장합니다.|



4. 강의 테이블

```
class_table(
    class_id varchar(20) NOT NULL,
    class_name varchar(20)  NOT NULL,
    category varchar(20)  NOT NULL,
    price INT(30),
    class_intro varchar(500),
    class_create_date DATETIME  NOT NULL,
    class_update_date DATETIME,
    instructor_id  varchar(50)  NOT NULL,
    class_open tinyint(1)  NOT NULL,
    PRIMARY KEY(class_id)
);
```

|컬럼명|타입|컬럼설명|
|------|---|---|
|class_id|varchar(20)|강의 ID를 저장합니다(PRIMARY KEY)|
|class_name|varchar(20)|강의의 제목을 저장합니다.|
|category|varchar(20)|강의의 카테고리를 저장합니다.|
|price| INT(30)|강의의 가격을 저장합니다.|
|class_intro|varchar(500)|강의의 간단한 소개를 저장합니다.|
|class_create_date|DATETIME|강의의 생성 시간을 저장합니다.|
|class_update_date|DATETIME|강의의 업데이트 시간을 저장합니다.|
|instructor_id|varchar(50)|강사의 ID를 저장합니다.(ForeignKey)|
|class_open|tinyint(1)|강의의 공개여부를 저장합니다.|

4.REST API
-------------
### Request
 * 강의 목록 조회
`GET /lecture-list`

#### INPUT

```
{   
    instructor_name : "조성민",
    class_name : "앱 구동 방법 강의",
    student_id : "41Sf1OWM7wJciT7-7QvC",
    category : "all",
    date_order_by : "0"
};
//xor(instructor_name,class_name,student_id) 3개값 중 하나만 받아올 수 있습니다.
```

#### OUTPUT

```
{
    "code": 200,
    "queryarr": [
        {
            "class_id": "wlePAcF9TJYnC3sXOJkm",
            "class_name": "웹에 대해서 알아보자!",
            "category": "web",
            "price": 19900,
            "class_intro": "경력자입니다.",
            "class_create_date": "2021-08-07T06:10:02.000Z",
            "class_update_date": "2021-08-11T12:48:03.000Z",
            "instructor_id": "instructor$ad12v1kl",
            "class_open": 1,
            "instructor_name": "조성민",
            "members": 2
        },
        {
            "class_id": "gWaxSGV0c2qYObMJsc8x",
            "class_name": " 웹 구동 프로세스",
            "category": "web",
            "price": 19200,
            "class_intro": "안녕하세요 방",
            "class_create_date": "2021-08-07T06:13:34.000Z",
            "class_update_date": "2021-08-12T06:46:03.000Z",
            "instructor_id": "instructor$ad12v1kl",
            "class_open": 1,
            "instructor_name": "조성민",
            "members": 3
        }
    ]
}
```
#### 강의 목록 조회를 설계하면서 고민한 것들

   instructor_name, class_name, student_id 중에 하나의 값만 받아 올 수 있어야 하고 카테고리 별로 찾을 수 있어아 하며 강의 생성일 기준으로 정렬을 할 수 있어야 했습니다. 결과 값으로는 강의 ID, 강의 카테고리, 강의명, 강사명, 가격, 수강생수, 강의 생성 일자를 넘겨주면됩니다.  
   여기서 저는 수강생 수와 수강자의 정보를 어떻게 처리해야 하는지 고민을하였습니다. DB class_table에 수강자 칼럼을 생성하여 json형식으로 수강자의 정보를 추가하는 방법과, 배열에 정보를 넣는 방법을 처음에 고민했습니다. 그렇게 설계하면 나중에 서비스가 커져 수강자 수가 많아진다면 하나의 컬럼안에 수 많은 값들이 들어가게됩니다. 그렇게 되면 관리가 어렵게 될것이라고 생각했습니다. 그래서 저는 apply_table이라는 테이블을 따로 제작하여 수강신청한 class를 따로 관리하였습니다.  
   class_id를 ForeignKey로 설정하여 apply_table에서 확인할 수 있게 제작하였습니다. 수강자의 정보는 이런식으로 class_id로 찾아올 수 있었지만 수강자 수는 따로 쿼리를 통해 가져왔습니다. class_table에 수강자수를 따로 관리하는 컬럼을 추가하여 수강신청할때 해당강의를 +1하는 방법이 좋다고 생각했지만 만약 동시에 똑같은 DB에 접속하여 수강신청을 한다면 +1이 중복될 수 있을 것 같다는 생각이 들어 조회할 때마다 실시간으로 쿼리를 통해 가져오는 방법을 적용했습니다. date_order_by 값을 0이면 내림차순 1이면 오름차순으로 정렬할 수 있도록 구현했습니다. 강의가 비공개일 경우 목록 조회에 나타나지 않도록 하였습니다.
  

### Request
 * 강의 상세 조회
`GET /lecture-details`

#### INPUT

```
{   
    class_id : "gWaxSGV0c2qYObMJsc8x"
}
```

#### OUTPUT
```
{
    "code": 200,
    "class_find": [
        {
            "class_id": "gWaxSGV0c2qYObMJsc8x",
            "class_name": " 웹 구동 프로세스",
            "category": "web",
            "price": 19200,
            "class_intro": "안녕하세요 방",
            "class_create_date": "2021-08-07T06:13:34.000Z",
            "class_update_date": "2021-08-12T06:46:03.000Z",
            "instructor_id": "instructor$ad12v1kl",
            "class_open": 1,
            "instructor_name": "조성민",
            "members": 3,
            "student": "{ 정선셋 : '2021-08-08' },{ 김재니 : '2021-08-08' },{ 조성민 : '2021-08-08' }"
        }
    ]
}
```

#### 강의 상세 조회 설계 설명 및 고민한 것들
해당 강의의 아이디를 입력하여 강의명, 강의 소개, 강의 카테고리, 가격, 수강생수, 강의 생성 시간 / 최근 수정 시간, 수강생 목록(각 수강생들의 닉네임 / 수강신청일자)를 조회할 수 있어야합니다.  여기서 저는 처음에 class_id를 DB에 있는지 확인 후 있다면 강의 정보를 가져왔습니다. 이때 수강생 목록을 어떻게 가져와야하는지 고민이 들었습니다. 수강자 정보를 apply_table에서 GROUP_CONCAT("{ ", student_name, " : ", date_format(apply_date, "\'%Y-%m-%d\'"), " }") AS student 사용하여 "{ 조성민 : '2021-08-08' }" 이러한 형식으로 만들어 처음 확인했던 강의 정보에 student key값을 만들어 값을 넣어줬습니다. 퀴리를 2번 사용하는데 조금 비효율적이라고 생각이 들었습니다. 한번의 쿼리로 가져올 수 있지 않을까 생각하였지만 그렇게 된다면 너무 하나의 쿼리가 무거워 질 수 있을 것 같았습니다.


### Request
 * 강의 등록
`POST /lecture-enrollment`

#### INPUT

```
{   
    instructor_id : "instructor$ad12v1kl",
    category : "infra",
    price : 212300,
    class_intro : "10년차입니다.",
    class_name : "인프라에 대하여"
}
```

#### OUTPUT

```
{
    "code": 200,
    "message": "enrollment success"
}
```
#### 강의 등록 설계 설명 및 고민한 것들
처음에 instructor_table에서 해당 강사ID가 있는지 확인합니다. 값이 있으면 class_table에서 class_name을 확인하여 중복된 강의명이 있는지 확인합니다. 여기서 아쉬운점은 문자열처리를 정확하게하여 띄어쓰기를 확인하여 (ex) "웹 프로세스" != "웹프로세스") 띄어쓰기에 신경쓰지않고 검증할 수 있었으면 더 좋았을 것이라고 생각합니다. 중복된 강의 명이 없다면 req로 받아온 값으로 강의를 등록합니다. 처음 강의를 생성하면 무조건 비공개로 설정되어 개설되어야합니다. 이것은 class_table에서 class_open 값을 false로 넣어 생성하면 비공개 처리를 할 수 있습니다.

### Request
* 강의 수정
`POST /lecture-edit`

#### INPUT
```
{   
    class_id : "gWaxSGV0c2qYObMJsc8x",
    class_name : "웹 구동 프로세스",
    price : 212300,
    class_intro : "안녕하세요.",
    class_price : 19200
}
```

#### OUTPUT

```
{
    "code": 200,
    "message": "강의 정보를 수정하였습니다."
}
```

#### 강의 수정 설계 설명 및 고민한 것들
강의 ID, 강의명, 강의 소개, 가격를 입력 받아 해당 강의를 수정 할 수 있어야 합니다. 강의 ID를  class_table DB 테이블에서 있는지 확인한 후 있다면 입력한 값들을 수정할 수 있습니다. class_table이 수정되었다면 apply_table의 class_name도 같이 수정해주었습니다. 모든 값을 받아 업데이트를 할 수 있도록 설계했지만 제작 후 생각해보니 필요한 값들을 선택하여 수정할 수 있도록 만들어야 조금 더 유동적으로 사용할 수 있을 것 같았습니다. 아쉬움이 많은 기능 중 하나였습니다.


### Request
* 강의 오픈
`POST /lecture-open`

#### INPUT

```
{   
    class_id : "gWaxSGV0c2qYObMJsc8x"
}
```
#### OUTPUT

```
{
    "code": 200,
    "message": "class open"
}
```

#### 강의 오픈 설계 설명 및 고민한 것들
지정된 강의를 비공개에서 공개로 바꾸는 기능입니다. 입력받은 class_id 값을 class_table에 있는지 확인합니다. 조건으로 class_open이 비공개인 경우도 추가했습니다. 만약 쿼리 결과값이 없다면 없는 강의이거나 이미 오픈한 강의라고 값을 알려줍니다. 만약 있을경우 class_open을 true로 바꾸어줍니다.

### Request
* 강의 삭제
`POST /lecture-delete` 

#### INPUT
```
{   
    class_id : "B4lOUuYFLvpkQiVtrbFd"
}
```
#### OUTPUT

```
{
    "code": 200,
    "message": "class delete"
}
```

#### 강의 삭제 설계 설명 및 고민한 것들
강의 삭제는 3가지의 조건이 있습니다. 지정된 강의를 삭제, 이미 수강생이 있는 경우 삭제x, 삭제된 강의는 다른 API에서 호출해도 조회/등록/수정/삭제가 불가능. 이 3가지입니다.
첫번 째로 강의가 있는지 class_table에서 검증을 합니다. 결과 값이 없다면 등록된 강의가 없음을 알려줍니다. 결과 값이 있을 경우 apply_table에서 수강한 학생이 있는지 확인합니다. 만약 수강자가있으면 삭제할 수 없다는 메세지를 띄워줍니다. 수강자가 없을 경우 해당강의를 삭제해줍니다.


### Request
* 수강생(회원) 가입
`POST /signup`

#### INPUT
```
{   
    name : "김아무개",
    email : "dkanro@naver.com"
}
```
#### OUTPUT
```
{
    "code": 200,
    "message": "create user"
}
```

#### 수강생(회원) 가입 설계 설명 및 고민한 것들
회원 가입에서 Email / 닉네임등 기본적인 수강생 정보를 가지고 등록 할 수 있어야하고, 중복된 이메일은 가입할 수 없도록 제작하였습니다. 
validation 로직에서 name과 email 값을 검증한 뒤 컨트롤러로 값을 넘겨줍니다. 처음에 student_table에서 중복된 이메일을 찾고 없다면 insert를 통해 회원가입을 진행합니다.
 
### Request
 * 강의 수강 신청
`POST /lecture-apply`

#### INPUT
```
{   
    class_id : "wlePAcF9TJYnC3sXOJkm",
    student_id : "dkanro@naver.com"
}
```
#### OUTPUT
```
{
    "code": 200,
    "message": "apply success"
}
```

#### 강의 수강 신청 설계 설명 및 고민한 것들

강의ID, 수강생 ID를 받아 수강 신청할 수 있어야하고, 가입된 수강생만 수강 신청, 삭제된 강의는 수강 신청x, 비공개된 강의는 수강 신청x, 동일한 계정으로 똑같은 강의 수강신청x 5개의 요구사항을 충족해야합니다. 
validation 로직에서 class_id, student_id을 검증하고 컨트롤러로 값을 넘겨줍니다. 제가 생각한 로직은 학생 계정을 검증한 후 해당 강의를 검증하는 것이 였습니다. 그 후에 해당 계정이 해당 강의를 수강신청을 하였는지 검증합니다. 모두 충족 되었다면 해당 강의를 수강신청할 수 있도록 하였습니다. 설계를 하면서 학생 계정을 검증하는 것과 강의 검증을 한번의 쿼리로 할 수 있지않을까?부터 생각하여 아니면 비동기적으로 promise를 통해 한번에 받아와서 처리할 수 있을 것 같았습니다. 하지만 promise로 받아오니 결과값이 아닌 다른 값들이 날라와 이걸 어떻게 처리해야할지 찾아보다가 결국에 해결하지못하여 순차적인 쿼리로 구현했습니다. 어떻게 구현해야할지 더 고민해야할 것 같습니다. 


5.고민했던 것들
-------------
DB 설계부터 해서 질문의 끝은 항상 왜? 라는 생각을 달고 있었습니다. 왜 이렇게 설계한거지? 더 나은 방법이 있나? 어떠한 아키텍처를 사용해야하는지 로직을 어디서부터 어디까지 분리해야하는지 고민을 하였습니다. 처음에는 index.js안에 모든 로직을 다 넣었습니다. 그러다보니 기능을 추가 할 수록 가독성이 너무 떨어졌습니다. 필요한 기능이 어디있지 찾아보면 코드를 항상 쭉 읽어보았어야 합니다. 또한 validation을 하드코딩으로 하다보니 불필요한 코드만 길어지고 다른 예외가 있지 않을까라는 생각이 불안하게 만들었습니다. 이번 기회에 joi를 학습하고 적용해보았습니다. 처음 사용해보았지만 너무 매력적인 API였습니다. 국내에는 자료가 별로 없어 공식문서를 보면서 validation을 구현했습니다. 여러 아키텍처를 찾아보는데 사실 제대로 로직을 나눠 설계한 프로젝트를 찾아보기 힘들었습니다. 제가 생각하면서 필요한 로직들을 분리 하면 좋을 것 같다라고 느껴 저의 방식대로 로직들을 분리하였습니다. 사실 정답이 없고 제가 설계한 방법이 잘못 될 수도 있습니다. 하지만 이러한 방식을 여러가지 사용해보면서 점점 더 견교한 프로젝트를 제작할 수 있다고 생각합니다.
