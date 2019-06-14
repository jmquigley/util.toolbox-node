# util.toolbox-node

> A set of utility functions used for build and testing across node projects.

[![build](https://circleci.com/gh/jmquigley/util.toolbox-node/tree/master.svg?style=shield)](https://circleci.com/gh/jmquigley/util.toolbox-node/tree/master)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.toolbox-node.svg)](https://www.npmjs.com/package/util.toolbox-node)
[![coverage](https://coveralls.io/repos/github/jmquigley/util.toolbox-node/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.toolbox-node?branch=master)


## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as a development application dependency:
```
$ yarn install --dev util.toolbox
```

To build the app and run all tests:
```
$ yarn run all
```

## Usage

The toolbox contains the following functions:

- [call](docs/index.md#call)
- [callSync](docs/index.md#callSync)
- [getDirectories](docs/index.md#getDirectories)
- [isLinux](docs/index.md#isLinux) - returns true if the operating system is Linux, otherwise false.
- [isMac](docs/index.md#isMac) - returns true if the operating system is OSX, otherwise false.
- [isWin](docs/index.md#isWin) - returns true if the operating system is windows, otherwise false.


These functions cannot be used within a web module (unless it's within electron).  These require [Node](https://nodejs.org/en/) to function correctly and that will not be available in a browser.
