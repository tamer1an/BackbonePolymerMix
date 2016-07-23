helpers = require "rest-helpers"
services = require "rest-services"


exports.get_events = ( request, response ) ->
  content = []
  ( ->
    content.push
      event: helpers.random 100, 200
      description: services.EventDescriptions.get().name
      appointment: services.Appointments.get().name
      datetime: helpers.date 20
      video: helpers.bool .1

  )() for i in [0..helpers.random(10,20)]


  response.send
    status: 200
    content: content