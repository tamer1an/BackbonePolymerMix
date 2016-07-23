Load files to my virtual mx
	`scp -r mxwebadmin/* root@10.10.30.50:/home/build/mx1200bin/web/webadmin`

Add to nginx.conf before last `}`
	`include /home/build/mx1200bin/web/webadmin/nginx/webadmin.conf;`

## How to build
### System preference
Install packages in linux env (Ubuntu for example):
* nodejs v0.12.0 (nodejs.org)
* npm 2.7.1

### Prep
Checkout project from depot\main\Applications\Web\mx-webadmin\

Install node packages from dependencies `npm install`

Install library `./node_modules/.bin/bower install`

### Make and Shift Project Files
                                   `make release` see GNUmakefile
```
make clean
make prod
mkdir mxwebadmin
cp -R i mxwebadmin
cp -R js mxwebadmin
cp -R json mxwebadmin
cp -R fonts mxwebadmin
cp -R nginx mxwebadmin
mkdir ./mxwebadmin/pages
mkdir ./mxwebadmin/pages/index
cp -R bundles/index/index.html mxwebadmin/pages/index
cp -R bundles/index/_index.css mxwebadmin/pages/index
cp -R bundles/index/_index.js mxwebadmin/pages/index
```
Deploy `mxwebadmin` folder to release
