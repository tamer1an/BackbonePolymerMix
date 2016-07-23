
INSTALL:
===
0. `chmod +x ./install.sh`
0. `./install.sh`

OR

0. `sudo npm install -g coffee`
0. `sudo npm install -g grunt-cli`
0. `grunt -F`
0. `grunt bower-install`
0. `grunt watch`
0. `npm link rest/services`
0. `npm link rest/routes`
0. `npm link rest/helpers`
0. `npm install`
0. `supervisor coffee app.coffee` or `coffee app.coffee`


E2E:
===
0. `npm install -g protractor`
0. `webdriver-manager update`
0. `webdriver-manager start`
0. `protractor test/e2e/conf.js`


Local Server
===
0. Link local packages
    `npm link rest/services`
    `npm link rest/routes`
    `npm link rest/helpers`
0. Install npm modules
    `npm install`
0. Start local server
    `supervisor coffee app.coffee`


WEB-FONT-SETUP
==============
https://github.com/sapegin/grunt-webfont

[OS X]
    brew install ttfautohint fontforge --with-python
    npm install grunt-webfont --save-dev
    You may need to use sudo for brew, depending on your setup.

    fontforge isn’t required for node engine (see below).

    :skull: Notes on experimental WOFF2 support.

[Linux]
    sudo apt-get install fontforge ttfautohint
    npm install grunt-webfont --save-dev
    fontforge isn’t required for node engine (see below).

    :skull: Notes on experimental WOFF2 support.

[Windows]
    npm install grunt-webfont --save-dev
    Then install ttfautohint (optional).

    Only node engine available (see below).