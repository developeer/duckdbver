SHELL := /bin/bash

install:
	bun install

build : 
	bun build ./index.ts --compile --outfile bin/duckdbver

run: 
	./bin/duckdbver -d ./test.duckdb

ver:
	./bin/duckdbver -v