# https://www.client9.com/self-documenting-makefiles/
.PHONY: help
help:
	@awk -F ':|##' '/^[^\t].+?:.*?##/ {\
	printf "\033[36m%-32s\033[0m %s\n", $$1, $$NF \
	}' $(MAKEFILE_LIST)

HOST?=0.0.0.0
PORT?=2000

run: ## Run the spelling bee server
	flask --app spelling_bee_server run --host ${HOST} --port ${PORT}

# Create virtualenv with `python3 -m venv venv`
# Activate virtualenv with `source venv/bin/activate`
# Then install requirements `make requirements`
requirements: ## Install requirements via `pip`
	pip install -r requirements.txt

docker: ## Build the local dev docker image
	docker build -t games:local .

docker-run: ## Run the local docker image
	docker run --expose 2000 -p 2000:2000 games:local

docker-release: ## Create a release image from the latest local image
	docker image tag games:local registry.digitalocean.com/haus/games:release

docker-push: ## Push the release image
	docker push registry.digitalocean.com/haus/games:release
