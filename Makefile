SERVICE=guajirobot

start:
	@docker run -d --name $(SERVICE) --env BOT_TOKEN=$(BOT_TOKEN) --network=local $(SERVICE):$(TRAVIS_BUILD_NUMBER)

package:
	@docker build --tag $(SERVICE):$(TRAVIS_BUILD_NUMBER) .
	@docker images

archive: start
	@docker login -u=$(DOCKER_USERNAME) -p=$(DOCKER_PASSWORD) $(DOCKER_HOST)
	docker ps
	@CONTAINER_ID=`docker ps | grep $(SERVICE) | awk '{print $$1}'` && \
	docker commit $$CONTAINER_ID $(DOCKER_HOST)/$(DOCKER_ACCOUNT)/$(SERVICE)
	docker push $(DOCKER_HOST)/$(DOCKER_ACCOUNT)/$(SERVICE)