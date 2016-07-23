# The `src` Directory

## Overview

The `src/` directory contains all code used in the application along with all
tests of such code.

```
src/
  |-- app/
     |-- infrastructure/
         |-- configs/
             |-- index.js
             |-- first_common.config.js
             ----  ******************  ----
             |-- last_common.config.js
         |-- directives/
             |-- index.js
             |-- first_common.directive.js
             ----  ******************  ----
             |-- last_common.directive.js
         |-- factories/
             |-- index.js
             |-- first_common.factory.js
             ----  ******************  ----
             |-- last_common.factory.js
         |-- filters/
             |-- index.js
             |-- first_common.filter.js
             ----  ******************  ----
             |-- last_common.filter.js
        |-- index.js
     |-- modules/
         |-- sample-module/
             |-- index.js
             |-- sample-module.controller.js
             |-- sample-module.route.js
             |-- sample-module.spec.js
             |-- sample-module.tpl.jade
             |-- sample-module.scss
  |-- common/
      |-- styles/
          |-- main.scss
      |-- media/
          |-- fonts/
          |-- images/
  |-- tests/
      |-- specs/
          |-- dumb.spec.js
      |-- karma.conf.js
      |-- tests.main.js
  |-- index.jade
```

- `src/app/` - application-specific code, i.e. code not likely to be reused in
  another application. [Read more &raquo;](app/README.md)
- `src/assets/` - static files like fonts and images.
  [Read more &raquo;](assets/README.md)
- `src/common/` - third-party libraries or components likely to be reused in
  another application. [Read more &raquo;](common/README.md)
- `src/less/` - LESS CSS files. [Read more &raquo;](less/README.md)
- `src/index.html` - this is the HTML document of the single-page application.
  See below.

See each directory for a detailed explanation.

## `index.html`

The `index.html` file is the HTML document of the single-page application (SPA)
that should contain all markup that applies to everything in the app, such as
the header and footer. It declares with `ngApp` that this is `msDashboard`,
specifies the main `AppController` controller, and contains the `ngView` directive
into which route templates are placed.

Unlike any other HTML document (e.g. the templates), `index.html` is compiled as
a Grunt template, so variables from `Gruntfile.js` and `package.json` can be
referenced from within it. Changing `name` in `package.json` from
"msDashboard" will rename the resultant CSS and JavaScript placed in `build/`,
so this HTML references them by variable for convenience.
