helpers = require "rest-helpers"
services = require "rest-services"


exports.get_all_devices = ( request, response ) ->
  content = []
  ( ( zone ) ->
    content.push
      zone: zone.zone
      location: zone.location
      device_type: services.DeviceTypes.get().name
      type: zone.type
      subtype: zone.subtype
      preenroll: helpers.bool .1
      soak: helpers.bool .1
      bypass: helpers.bool .2
      alarms: if helpers.bool() then ( -> iz.name for iz,i in services.InfoZone.list helpers.random(1,5) )() else null
      troubles: if helpers.bool() then ( -> iz.name for iz,i in services.InfoZone.list helpers.random(1,5) )() else null
      bypass_availability: helpers.bool()

  )( zone ) for zone in services.Zones.all()


  response.send
    status: 200
    content: content