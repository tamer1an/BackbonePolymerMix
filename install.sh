#!/bin/sh

npm install -g coffee
npm install -g grunt-cli

npm link rest/services
npm link rest/routes
npm link rest/helpers
npm install

grunt -F
grunt bower-install

grunt

