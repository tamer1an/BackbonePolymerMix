services = require 'rest-services'
helpers = require 'rest-helpers'
path = require 'path'

exports.get_alarm_video = ( request, response ) ->
  allowedFormats = [ 'avi', 'flv', 'mp4', 'webm']

  response.send content: null unless request.query.event_id
  response.send content: null unless request.query.camera_id
  response.send content: null unless request.query.video_format
  response.send content: null if allowedFormats.indexOf( request.query.video_format ) is -1

  video =
    path: "/videos/video.#{request.query.video_format}"
    location: services.Locations.get().name
    timestamp: helpers.date 10

  response.send
    content: video