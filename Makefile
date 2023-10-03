SHELL := /bin/bash

install:
	bun install

build : 
	bun build ./index.ts --compile --outfile bin/duckdbver