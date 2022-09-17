docker-image:
	docker build . -t adamukaapan/shinysorter-frontend

docker-push: docker-image
	docker push docker.io/adamukaapan/shinysorter-frontend

.PHONY: docker-image