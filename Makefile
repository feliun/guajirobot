SERVICE=guajirobot

install:
	@echo "No installation needed as the service is built inside Docker..."

ensure-dependencies:
	@npm run docker
	@sleep 5

brand:
	@node_modules/make-manifest/bin/make-manifest --extra "build.url: https://travis-ci.org/feliun/guajirobot/builds/"$(TRAVIS_BUILD_ID) --extra "build.number: "$(TRAVIS_BUILD_NUMBER)
	@cat ./manifest.json

qa:
	@npm run qa