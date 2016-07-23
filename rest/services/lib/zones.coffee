h = require "rest-helpers"
services = require( "rest-services")

class Zones extends require "./core"
  constructor: ->
    ( ( zoneType, zoneId ) =>
        @pool.push
          zone: zoneId
          location: services.Locations.get().name
          type: zoneType.name
          subtype: services.ZoneSubTypes.get().name
          preenroll: h.bool()
          soak: h.bool()
          bypass: h.bool()
          alarms: h.bool()
          troubles: h.bool()
          bypass_availability: h.bool() )( zoneType, i ) for zoneType, i in services.ZoneTypes.all()

exports.Zones = new Zones()