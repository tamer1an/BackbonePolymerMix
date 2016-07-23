# ClientSide Application
***

Clone git repo: `git clone "git@vm199251.projects.local:CSC/CAP-N-FrontEnd.git"`

After clone run: `git submodule update --init --recursive`

## Quick Start
1) install NodeJs https://nodejs.org/
check `npm` in console. If command not working,  configure system path and refresh OS session

get front-end dependency manager
2) $ `npm install -g bower`

get dependency's
3) $ `bower install`

get unit test tool
4) $ `npm install -g karma`

get coffee tool
5) $ `npm install -g coffee-script`

get build manager
6) $ `npm install -g gulp`

get a deep deletion module for node
7) $ `npm install -g rimraf`

get an AST-based pattern checker for JavaScript
8) $ `npm install -g eslint`

get Webpack Builder:
9) $ `npm install -gwebpack && webpack-dev-server`

WebStorm ESLint setting: `File-Settings... Languages & Frameworks - JavaScript - Code Quality Tools - ESLint - check Enable, select ESLint package - OK`

WebStorm es6 setting: `File-Settings... Languages & Frameworks - JavaScript - JavaScript language version: ECMAScript 6 - OK`

navigate to project dir and install packages from package.json
9) $ `npm install`

run mock server to get mock json data
10) $ `npm run mock-server -- 8080`

run default development webpack progress watch
11) $ `npm run dev`

run nodejs mock-up server
12) $ `node server.js`

13) navigate in browser to `http://localhost:3000/`

Resources used in the project:

Build and Back-end tools:
1) npm
2) gulp
3) bower
4) jade
5) sass
6) es6
7) coffee
8) karma
9) rimraf
10) eslint
11) webpack
