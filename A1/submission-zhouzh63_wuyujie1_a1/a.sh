
docker stop a1-301-container
docker rm a1-301-container
docker build -t a1-301 .
docker run -d --name a1-301-container -p 80:80 a1-301:latest
docker start a1-301-container
