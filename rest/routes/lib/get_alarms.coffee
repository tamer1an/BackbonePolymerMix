util = require 'util'
helpers = require 'rest-helpers'
services = require 'rest-services'

alarm = ->
  util._extend deviceType(),
    datetime: helpers.date 21
    has_video: helpers.bool .5
    evt_id: helpers.random 100
    alarm_type: services.AlarmTypes.get().name
    location: services.Locations.get().name

deviceType = ->
  if helpers.bool .8
    device_type: 'CONTROL_PANEL'
    zone: null
  else
    device_type: 'ZONE'
    zone: services.Zones.get().zone

exports.get_alarms = ( request, response ) ->
  alarms = []
  alarms.push alarm() for i in [1..helpers.random(10,50)]

  response.send
    content: alarms