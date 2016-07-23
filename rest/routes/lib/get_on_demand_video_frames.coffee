exports.get_on_demand_video_frames = ( request, response ) ->
  response.send content: null unless request.query.camera_id

  frames =
    frames: []
    location: require('rest-services').Locations.get().name
    timestamp: require('rest-helpers').date 21

  require('fs').readdirSync( require('path').normalize( __dirname + '/../static/frames/' ) ).forEach (frame) ->
    frames.frames.push '/frames/'+ frame unless frame[0] is '.'

  response.send
    content: frames