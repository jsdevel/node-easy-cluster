.PHONY: clean instrument integration lint report test

clean:
	@rm -rf coverage lib-cov server.cov.js

instrument:
	@istanbul instrument -o lib-cov/ lib

integration:
	@mocha './integration/*.js'

lint:
	@jshint lib bin && jshint --config ./test/.jshintrc test

report:
	@istanbul report cobertura

test: clean lint
	@istanbul cover _mocha -- './test/lib/**/*.js' './test/bin/**/*.js'
