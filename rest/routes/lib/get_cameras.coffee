helpers = require 'rest-helpers'
services = require 'rest-services'

exports.get_cameras = (request, response) ->
  content = []
  ( () ->
    content.push
      zone: services.Zones.get().zone
      location: services.Locations.get().name
      preenroll: helpers.bool .9
      status: services.ProcessStatuses.get().name
      preview_path: `helpers.bool(.5) ? '/previews/preview.jpg' : null`
      timestamp: helpers.date()

  )() for i in [0..helpers.random(10,20)]

  response.send
    content: content