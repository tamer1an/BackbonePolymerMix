'use strict';

angular.module('Data')
       .service( "Transport", [ 'Restangular', function( restAngular ){

            return {
                resources: {
                    dump: restAngular.one('dump'),

                    signIn: restAngular.one('login'),
                    signOut: restAngular.one('logout'),

                    getStatus: restAngular.one('status'),

                    away: restAngular.one('arm_away'),
                    awayInstant: restAngular.one('arm_away_instant'),
                    awayLatchkey: restAngular.one('arm_away_latchkey'),
                    home: restAngular.one('arm_home'),
                    homeInstant: restAngular.one('arm_home_instant'),
                    disarm: restAngular.one('disarm'),

                    getAlarms: restAngular.one('alarms'),
                    getAlarmVideoPreviews: restAngular.one('alarm_previews'),
                    getAlarmVideo: restAngular.one('alarm_video'),
                    getAlarmVideoFrames: restAngular.one('alarm_video_frames'),

                    getAlerts: restAngular.one('alerts'),

                    getCameras: restAngular.one('cameras'),
                    makeVideo: restAngular.one('make_video'),
                    isVideoPresent: restAngular.one('is_video_present'),
                    getOnDemandVideo: restAngular.one('on_demand_video'),
                    getOnDemandFrames: restAngular.one('on_demand_video_frames'),

                    updateZones: restAngular.one('zones'),

                    getDevices: restAngular.one('all_devices'),
                    bypass: restAngular.one('set_bypass_zone'),

                    getEvents: restAngular.one('events')
                },

                signIn: function( webName, code ){
                       return this.resources.signIn.post('', {
                           panel_web_name: webName,
                           user_code: code,
                           device_token: ""
                       });
                },

                signOut: function(){

                },

                getAlarms: function(){
                   return this.resources.getAlarms.get();
                },

                getAlarmVideoPreviews: function( eventId ){
                    return this.resources.getAlarmVideoPreviews.get({
                        event_id: parseInt( eventId )
                    });
                },

                getAlarmVideo: function( eventId, cameraId, videoFormat ){
                    return this.resources.getAlarmVideo.get({
                        event_id: parseInt( eventId ),
                        camera_id: parseInt( cameraId ),
                        video_format: videoFormat
                    });
                },

                getAlarmVideoFrames: function( eventId, cameraId ){
                    return this.resources.getAlarmVideoFrames.get({
                        event_id: parseInt( eventId ),
                        camera_id: parseInt( cameraId )
                    });
                },


                updateZones: function(){
                    return this.resources.updateZones.get();
                },

                getAlerts: function(){
                    return this.resources.getAlerts.get();
                },

                away: function(){
                    return this.resources.away.post();
                },
                awayInstant: function(){
                    return this.resources.awayInstant.post();
                },
                awayLatchkey: function(){
                    return this.resources.awayLatchkey.post();
                },
                home: function(){
                    return this.resources.home.post();
                },
                homeInstant: function(){
                    return this.resources.homeInstant.post();
                },
                disarm: function(){
                    return this.resources.disarm.post();
                },

                makeVideo: function( cameraId ){
                    return this.resources.makeVideo.post( '', { camera_id: cameraId.toString() } );
                },
                isVideoPresent: function( cameraId ){
                    return this.resources.isVideoPresent.get( {
                        camera_id: window.parseInt( cameraId )
                    });
                },
                getOnDemandVideo: function( cameraId, videoFormat ){
                    return this.resources.getOnDemandVideo.get({
                        camera_id: window.parseInt( cameraId ),
                        video_format: videoFormat
                    });
                },
                getOnDemandFrames: function( cameraId ){
                    return this.resources.getOnDemandFrames.get({
                        camera_id: window.parseInt( cameraId )
                    });
                },

                getDevices: function(){
                    return this.resources.getDevices.get();
                },

                bypass: function( zone, state ){
                    return this.resources.bypass.post( '', {
                        'zone': window.parseInt( zone ).toString(),
                        'set': (!! state).toString()
                    });
                },

                getAvailableLanguages: function(){
                    return restAngular
                            .withConfig( function( configurer ){
                                configurer.setBaseUrl(document.location.pathname);
                            })
                            .one('languages.json')
                            .get();
                }
            };
       }]);
