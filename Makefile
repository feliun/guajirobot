SERVICE=guajirobot
DOCKER_HOST=quay.io
DOCKER_ACCOUNT=feliun

install:
	@echo "No installation needed as the service is built inside Docker..."

ensure-dependencies:
	@npm run docker

brand:
	@node_modules/make-manifest/bin/make-manifest --extra "build.url: https://travis-ci.org/feliun/guajirobot/builds/"$(TRAVIS_BUILD_ID) --extra "build.number: "$(TRAVIS_BUILD_NUMBER)
	@cat ./manifest.json

qa:
	@docker run --name $(SERVICE) --env SERVICE_ENV=local --rm --entrypoint npm $(SERVICE):$(TRAVIS_BUILD_NUMBER) run qa --

start:
	@docker run -d --name $(SERVICE) --env BOT_TOKEN=$(BOT_TOKEN) $(SERVICE):$(TRAVIS_BUILD_NUMBER)

package:
	@docker build --tag $(SERVICE):$(TRAVIS_BUILD_NUMBER) .
	@docker images

archive: start
	@docker login -u=$(DOCKER_USERNAME) -p=$(DOCKER_PASSWORD) $(DOCKER_HOST)
	docker ps
	@CONTAINER_ID=`docker ps | grep $(SERVICE) | awk '{print $$1}'` && \
	docker commit $$CONTAINER_ID $(DOCKER_HOST)/$(DOCKER_ACCOUNT)/$(SERVICE)
	docker push $(DOCKER_HOST)/$(DOCKER_ACCOUNT)/$(SERVICE)