build :
	./node_modules/.bin/enb make -n

server :
	./node_modules/.bin/enb server

prod :
	YENV="production" ./node_modules/.bin/enb make

clean :
	./node_modules/.bin/enb make clean

release :
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
