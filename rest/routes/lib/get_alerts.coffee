helpers = require "rest-helpers"
services = require "rest-services"

alert = ->
  zone = services.Zones.get()

  datetime: helpers.date 21
  zone_type: zone.type
  zone: zone.zone
  location: services.Locations.get().name,
  alert_type: services.AlertTypes.get().name


exports.get_alerts = ( request, response ) ->
  alerts = []

  alerts.push alert() for i in [1..1 + helpers.random(10,50)]

  response.send
    content: alerts