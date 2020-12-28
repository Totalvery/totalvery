1. 제가 미리 push 해놓은 도커 이미지를 가져옵니다.

```
docker pull registry.heroku.com/totalvery/web
```

2. 작업하고 있는 이 프로젝트 root 폴더 내부에서 다음을 실행시켜줍니다.

```
docker-compose up --build
```

3. 코드를 수정하면서 리얼타임으로 결과물이 바뀜을 확인합니다.
   http://localhost:8000/ping/
