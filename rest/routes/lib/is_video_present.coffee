exports.is_video_present = ( request, response ) ->
  response.send
    content: require('rest-helpers').bool .4