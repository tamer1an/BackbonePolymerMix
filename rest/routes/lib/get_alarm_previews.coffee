helpers = require 'rest-helpers'
services = require 'rest-services'

exports.get_alarm_previews = ( request, response ) ->
  preview = []

  if request.query.event_id
    ( () ->
      preview.push
        camera_id: helpers.random 64
        location: services.Locations.get().name
        preview_path: '/video.flv'
        timestamp: helpers.date 10 )() for i in [1..helpers.random 5]

  response.send
    content: preview