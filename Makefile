.DEFAULT_GOAL := help

# Install dependencies only when the manifests are newer than node_modules
# (or node_modules is missing). Plain `make build` twice in a row will NOT
# reinstall — Make skips this rule when node_modules is already up to date.
node_modules: package.json package-lock.json
	npm ci
	@touch node_modules

.PHONY: install
install: node_modules ## Install dependencies (only if manifests changed)

.PHONY: dev
dev: node_modules ## Run the Slidev dev server
	npm run dev

.PHONY: build
build: node_modules ## Build the static site into dist/
	npm run build

.PHONY: export
export: node_modules ## Export the slides to PDF
	npm run export

.PHONY: clean
clean: ## Remove node_modules and build artifacts
	rm -rf node_modules dist

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
