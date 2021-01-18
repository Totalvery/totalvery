1. 작업하고 있는 이 프로젝트 root 폴더 내부에서 다음을 실행시켜줍니다.

```
docker-compose down -v
docker-compose up --build
```

2. 코드를 수정하면서 리얼타임으로 결과물이 바뀜을 확인합니다.
   http://localhost:8000/ping/

---

Docker 위에서 makemigrations 또는 migrate 하는 법

1. 터미널에서 docker ps 커맨드를 입력합니다.

```
docker ps
```

2. 위에서 얻은 결과로부터 CONTAINER ID 값을 알아낸 후 다음과 같이 실행시켜 줍니다.

```
docker exec -it [CONTAINER ID] python manage.py makemigrations
```

```
docker exec -it [CONTAINER ID] python manage.py migrate
```
